package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sort"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var ctx = context.Background()

type Card struct {
	ID       string `json:"id"`
	Type     string `json:"type"`
	Revealed bool   `json:"revealed"`
}

type User struct {
	Username      string `json:"username"`
	Score         int    `json:"score"`
	HasDefuseCard bool   `json:"hasDefuseCard"`
	GameStatus    string `json:"gameStatus"`
	Message       string `json:"message"`
	IsGameOver    bool   `json:"isGameOver"`
	Deck          []Card `json:"deck"`
}

var rdb = redis.NewClient(&redis.Options{
	Addr: os.Getenv("REDIS_URL"), //"localhost:6379",
	DB:   0,
})

func main() {
	router := mux.NewRouter()

	// Define routes
	router.HandleFunc("/user", registerUser).Methods("POST")
	router.HandleFunc("/game/win", gameWin).Methods("POST")
	router.HandleFunc("/game/save", saveGameState).Methods("POST")
	router.HandleFunc("/game/load", loadGameState).Methods("GET")
	router.HandleFunc("/leaderboard", getLeaderboard).Methods("GET")

	// c := cors.New(cors.Options{
	// 	AllowedOrigins:   []string{"http://localhost:5173"},
	// 	AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
	// 	AllowedHeaders:   []string{"Content-Type"},
	// 	AllowCredentials: true,
	// })

	// // Start server
	// port := os.Getenv("PORT")
	// if port == "" {
	// 	port = "8080"
	// }

	// handler := c.Handler(router)
	log.Printf("Server starting on port 8080")
	http.ListenAndServe(":8080", handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "X-Requested-With", "Authorization"}),
	)(router))
	// http.ListenAndServe(":8080", router)
}

// Save game state for a user
func saveGameState(w http.ResponseWriter, r *http.Request) {
	var userGameState User
	json.NewDecoder(r.Body).Decode(&userGameState)

	gameStateJSON, err := json.Marshal(userGameState)
	if err != nil {
		http.Error(w, "Failed to save game state", http.StatusInternalServerError)
		return
	}

	err = rdb.Set(ctx, "game:"+userGameState.Username, gameStateJSON, 0).Err()
	if err != nil {
		http.Error(w, "Failed to save game state", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Score updated successfully"})
}

// Load game state for a user
func loadGameState(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	gameStateJSON, err := rdb.Get(ctx, "game:"+username).Result()
	if err == redis.Nil {
		http.Error(w, "No saved game found for user", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Failed to load game state", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(gameStateJSON))
}

func registerUser(w http.ResponseWriter, r *http.Request) {
	var user User
	json.NewDecoder(r.Body).Decode(&user)
	score, err := rdb.Get(ctx, user.Username).Int()
	//err := rdb.Set(ctx, user.Username, 0, 0).Err()
	if err != nil {
		err2 := rdb.Set(ctx, user.Username, 0, 0).Err()
		if err2 != nil {
			http.Error(w, "Failed to register user", http.StatusInternalServerError)
			return
		}
	} else {
		err2 := rdb.Set(ctx, user.Username, score, 0).Err()
		if err2 != nil {
			http.Error(w, "Failed to register user", http.StatusInternalServerError)
			return
		}
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func gameWin(w http.ResponseWriter, r *http.Request) {
	var user User
	json.NewDecoder(r.Body).Decode(&user)

	// Get the current score and increment it
	score, err := rdb.Get(ctx, user.Username).Int()
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	rdb.Set(ctx, user.Username, score+1, 0)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Score updated successfully"})
}

func getLeaderboard(w http.ResponseWriter, r *http.Request) {
	var leaderboard []User

	// Fetch all keys that match the game state prefix
	keys, err := rdb.Keys(ctx, "game:*").Result()
	if err != nil {
		http.Error(w, "Failed to fetch leaderboard", http.StatusInternalServerError)
		return
	}

	// Loop through each key, decode JSON, and extract username and score
	for _, key := range keys {
		// Fetch the game state JSON string
		gameStateJSON, err := rdb.Get(ctx, key).Result()
		if err != nil {
			// Log error and skip this user if there's an issue
			fmt.Printf("Error fetching game state for key %s: %v\n", key, err)
			continue
		}

		// Decode JSON to extract user information
		var userGameState User
		err = json.Unmarshal([]byte(gameStateJSON), &userGameState)
		if err != nil {
			fmt.Printf("Error decoding game state JSON for key %s: %v\n", key, err)
			continue
		}

		// Append to leaderboard with username and score only
		leaderboard = append(leaderboard, User{
			Username: userGameState.Username,
			Score:    userGameState.Score,
		})
	}

	// Sort leaderboard by score in descending order
	sort.Slice(leaderboard, func(i, j int) bool {
		return leaderboard[i].Score > leaderboard[j].Score
	})

	// Set headers and send response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(leaderboard); err != nil {
		http.Error(w, "Failed to encode leaderboard", http.StatusInternalServerError)
	}
}

import { API_BASE_URL } from "./global";
export const registerUser = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username }),
    });
    console.log(response);
    if (!response.ok) throw new Error("Failed to register user");
    return await response.json();
  } catch (error) {
    console.error("Failed to register user:", error);
    throw error;
  }
};

export const saveGameState = async (gameState) => {
  console.log(gameState);
  await fetch(`${API_BASE_URL}/game/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameState),
  });
};

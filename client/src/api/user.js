export const registerUser = async (username) => {
  try {
    const response = await fetch("/api/user", {
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
  await fetch("/api/game/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gameState),
  });
};

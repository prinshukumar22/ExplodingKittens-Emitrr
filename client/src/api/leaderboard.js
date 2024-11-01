export const fetchLeaderboard = async () => {
  try {
    const response = await fetch("/api/leaderboard");
    console.log(response);
    if (!response.ok) throw new Error("Failed to fetch leaderboard");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    throw error;
  }
};

export const updateLeaderboard = async (gameState) => {
  try {
    const response = await fetch("/api/game/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gameState),
    });

    if (!response.ok) throw new Error("Failed to update leaderboard");
    return await response.json();
  } catch (error) {
    console.error("Failed to update leaderboard:", error);
    throw error;
  }
};

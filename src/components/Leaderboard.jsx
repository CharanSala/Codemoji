import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://codemojibackend2k25.onrender.com/leaderboard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();
        console.log("leaderboard", data);

        // Rely on backend for sorting and HH:MM:SS time formatting
        setLeaderboardData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to assign rank emojis
  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🎖️";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Leaderboard</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && leaderboardData.length === 0 && (
        <p className="text-center">No leaderboard data available.</p>
      )}

      {!loading && !error && leaderboardData.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Rank</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Points</th>
              <th className="border p-2">Latest Submission Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((participant, index) => (
              <tr key={index} className="border">
                <td className="border p-2 text-center">
                  {getRankEmoji(index + 1)} {index + 1}
                </td>
                <td className="border p-2 text-center">{participant.email}</td>
                <td className="border p-2 text-center font-bold text-green-600">
                  {participant.points} 😜
                </td>
                <td className="border p-2 text-center">
                  {participant.latestRound === 3
                    ? participant.round3Time
                    : participant.latestRound === 2
                    ? participant.round2Time
                    : participant.latestRound === 1
                    ? participant.round1Time
                    : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;

import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]); // State to store leaderboard data
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/leaderboard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();
        setLeaderboardData(data); // Store data in state
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    // Fetch immediately & then every 5 seconds
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Runs once on mount

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
              <th className="border p-2">Total Time (seconds)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((participant, index) => (
              <tr key={index} className="border">
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{participant.email}</td>
                <td className="border p-2 text-center">{participant.totalTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;

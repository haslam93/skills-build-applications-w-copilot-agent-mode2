import React, { useState, useEffect, useCallback } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  const fetchLeaderboard = useCallback(async () => {
    try {
      console.log('Fetching leaderboard from:', API_URL);
      setLoading(true);
      
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Leaderboard API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const leaderboardData = data.results || data;
      setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
      
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-4">
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {error}
      </div>
    </div>
  );

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'table-warning';
    if (rank === 2) return 'table-secondary';
    if (rank === 3) return 'table-info';
    return '';
  };

  return (
    <div className="container mt-4 fade-in">
      <div className="page-container">
        <h2 className="mb-4">📊 Leaderboard</h2>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">User</th>
                <th scope="col">Total Points</th>
                <th scope="col">Activities</th>
                <th scope="col">Distance (miles)</th>
                <th scope="col">Calories Burned</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.id} className={getRankClass(index + 1)}>
                  <th scope="row">
                    <span className="fs-5">{getRankBadge(index + 1)}</span>
                  </th>
                  <td><strong>{entry.user_name || entry.user}</strong></td>
                  <td>
                    <span className="badge bg-primary fs-6">{entry.total_points}</span>
                  </td>
                  <td>{entry.total_activities}</td>
                  <td>{entry.total_distance}</td>
                  <td>{entry.total_calories}</td>
                  <td>
                    <button className="btn btn-sm btn-primary">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaderboard.length === 0 && (
          <div className="alert alert-info text-center" role="alert">
            <strong>No leaderboard data found.</strong> Start logging activities to appear on the leaderboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
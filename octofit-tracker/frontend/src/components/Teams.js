import React, { useState, useEffect, useCallback } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  const fetchTeams = useCallback(async () => {
    try {
      console.log('Fetching teams from:', API_URL);
      setLoading(true);
      
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Teams API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const teamsData = data.results || data;
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

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

  return (
    <div className="container mt-4 fade-in">
      <div className="page-container">
        <h2 className="mb-4">🏆 Teams</h2>
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Team Name</th>
                <th scope="col">Description</th>
                <th scope="col">Members</th>
                <th scope="col">Created Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team.id}>
                  <th scope="row">{index + 1}</th>
                  <td><strong>{team.name}</strong></td>
                  <td>{team.description}</td>
                  <td>
                    <span className="badge bg-success">
                      {team.members ? team.members.length : 0} members
                    </span>
                  </td>
                  <td>{new Date(team.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2">View</button>
                    <button className="btn btn-sm btn-info">Join</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {teams.length === 0 && (
          <div className="alert alert-info text-center" role="alert">
            <strong>No teams found.</strong> Create a team to start competing!
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
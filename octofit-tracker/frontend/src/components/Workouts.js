import React, { useState, useEffect, useCallback } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  const fetchWorkouts = useCallback(async () => {
    try {
      console.log('Fetching workouts from:', API_URL);
      setLoading(true);
      
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Workouts API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const workoutsData = data.results || data;
      setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
      
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

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

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'Beginner': 'bg-success',
      'Intermediate': 'bg-warning',
      'Advanced': 'bg-danger',
      'Easy': 'bg-success',
      'Medium': 'bg-warning',
      'Hard': 'bg-danger'
    };
    return badges[difficulty] || 'bg-secondary';
  };

  return (
    <div className="container mt-4 fade-in">
      <div className="page-container">
        <h2 className="mb-4">💪 Workouts</h2>
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Workout Name</th>
                <th scope="col">Type</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Duration (min)</th>
                <th scope="col">Est. Calories</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout, index) => (
                <tr key={workout.id}>
                  <th scope="row">{index + 1}</th>
                  <td><strong>{workout.name}</strong></td>
                  <td>
                    <span className="badge bg-info">{workout.workout_type}</span>
                  </td>
                  <td>
                    <span className={`badge ${getDifficultyBadge(workout.difficulty_level)}`}>
                      {workout.difficulty_level}
                    </span>
                  </td>
                  <td>{workout.estimated_duration}</td>
                  <td>{workout.estimated_calories}</td>
                  <td>
                    <button className="btn btn-sm btn-success me-2">Start</button>
                    <button className="btn btn-sm btn-primary">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {workouts.length === 0 && (
          <div className="alert alert-info text-center" role="alert">
            <strong>No workouts found.</strong> Check back later for new workout suggestions!
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
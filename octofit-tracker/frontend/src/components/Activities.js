import React, { useState, useEffect, useCallback } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  const fetchActivities = useCallback(async () => {
    try {
      console.log('Fetching activities from:', API_URL);
      setLoading(true);
      
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Activities API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const activitiesData = data.results || data;
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

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
        <h2 className="mb-4">🏃 Activities</h2>
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Activity Type</th>
                <th scope="col">Duration (min)</th>
                <th scope="col">Distance (miles)</th>
                <th scope="col">Calories Burned</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={activity.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <span className="badge bg-primary">{activity.activity_type}</span>
                  </td>
                  <td>{activity.duration}</td>
                  <td>{activity.distance}</td>
                  <td>{activity.calories_burned}</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2">View</button>
                    <button className="btn btn-sm btn-info">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {activities.length === 0 && (
          <div className="alert alert-info text-center" role="alert">
            <strong>No activities found.</strong> Start logging your fitness activities!
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;
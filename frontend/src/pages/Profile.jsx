import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <h1>👤 My Profile</h1>

      <div className="profile-grid">
        <Card title="Profile Information">
          <form onSubmit={handleSubmit}>
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-actions">
              {!editing ? (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <>
                  <button type="submit" className="btn btn-primary">
                    💾 Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        username: user.username,
                        email: user.email,
                      });
                    }}
                  >
                    ✖️ Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </Card>

        <Card title="Account Details">
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label">Role</span>
              <span className="detail-value">{user?.role || 'user'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value badge-success">Active</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Login</span>
              <span className="detail-value">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
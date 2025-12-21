import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Your Role', value: user?.role || 'user', icon: '🎭' },
    { title: 'Account Status', value: 'Active', icon: '✅' },
    { title: 'Member Since', value: new Date(user?.createdAt).toLocaleDateString() || '2025', icon: '📅' },
    { title: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today', icon: '🕐' },
  ];

  const quickLinks = [
    { title: '👤 View Profile', description: 'Manage your account settings', to: '/profile' },
    { title: '👥 Manage Users', description: 'View and manage system users', to: '/users' },
    { title: '⚙️ System Status', description: 'Monitor system health and performance', to: '/system' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.username}! 👋</h1>
          <p>Here's what's happening with your Franklin Trinity OS today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="quick-links-section">
        <h2>Quick Links</h2>
        <div className="quick-links-grid">
          {quickLinks.map((link, index) => (
            <Link key={index} to={link.to} className="quick-link-card">
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <span className="link-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      <Card title="📊 System Overview">
        <div className="system-overview">
          <div className="overview-item">
            <h4>Backend Status</h4>
            <span className="status-badge online">🟢 Online</span>
          </div>
          <div className="overview-item">
            <h4>Database</h4>
            <span className="status-badge online">🟢 Connected</span>
          </div>
          <div className="overview-item">
            <h4>API Version</h4>
            <span className="version-badge">v1.0.0</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
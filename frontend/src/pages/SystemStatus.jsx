import React, { useState, useEffect } from 'react';
import { systemAPI } from '../services/api';
import Card from '../components/Card';
import './SystemStatus.css';

const SystemStatus = () => {
  const [status, setStatus] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemData = async () => {
    try {
      const [statusData, infoData] = await Promise.all([
        systemAPI.getStatus(),
        systemAPI.getInfo()
      ]);
      setStatus(statusData);
      setInfo(infoData);
      setError('');
    } catch (error) {
      setError('Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes) => {
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  };

  if (loading) return <div className="loading">Loading system status...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="system-page">
      <div className="system-header">
        <h1>⚙️ System Status</h1>
        <button className="btn-refresh" onClick={fetchSystemData}>
          🔄 Refresh
        </button>
      </div>

      <div className="system-grid">
        <Card title="Server Status">
          <div className="status-indicator">
            <div className={`status-dot ${status?.status === 'ok' ? 'online' : 'offline'}`}></div>
            <span className="status-text">
              {status?.status === 'ok' ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="info-list">
            <div className="info-row">
              <span className="info-label">Environment:</span>
              <span className="info-value">{status?.environment}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Uptime:</span>
              <span className="info-value">{formatUptime(status?.uptime)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">
                {new Date(status?.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </Card>

        <Card title="System Information">
          {info && (
            <div className="info-list">
              <div className="info-row">
                <span className="info-label">Platform:</span>
                <span className="info-value">{info.platform}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Architecture:</span>
                <span className="info-value">{info.arch}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Node Version:</span>
                <span className="info-value">{info.nodeVersion}</span>
              </div>
              <div className="info-row">
                <span className="info-label">CPU Cores:</span>
                <span className="info-value">{info.cpus}</span>
              </div>
            </div>
          )}
        </Card>

        <Card title="Memory Usage">
          {info && (
            <div className="memory-info">
              <div className="memory-stat">
                <h4>Total Memory</h4>
                <p className="memory-value">{formatMemory(info.memory.total)}</p>
              </div>
              <div className="memory-stat">
                <h4>Free Memory</h4>
                <p className="memory-value">{formatMemory(info.memory.free)}</p>
              </div>
              <div className="memory-bar">
                <div 
                  className="memory-bar-fill" 
                  style={{ 
                    width: `${((info.memory.total - info.memory.free) / info.memory.total * 100)}%` 
                  }}
                ></div>
              </div>
              <p className="memory-percentage">
                {((info.memory.total - info.memory.free) / info.memory.total * 100).toFixed(1)}% Used
              </p>
            </div>
          )}
        </Card>

        <Card title="Database">
          <div className="info-list">
            <div className="info-row">
              <span className="info-label">Status:</span>
              <span className="info-value badge success">Connected</span>
            </div>
            <div className="info-row">
              <span className="info-label">Type:</span>
              <span className="info-value">MongoDB</span>
            </div>
            <div className="info-row">
              <span className="info-label">Database:</span>
              <span className="info-value">franklin-trinity-os</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemStatus;
import React, { useState, useEffect } from 'react';
import './Dashboard.css'; 
import Modal from './Modal';
import { db } from '../../../firebase/firebaseConfig'; 
import { collection, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { useSuperContext } from '../../../context/SuperContext';

const Dashboard = () => {
  const { loggedIn } = useSuperContext(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userApps, setUserApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserApps = async () => {
    if (!loggedIn || !loggedIn.uid) return;

    try {
      setLoading(true);
      const appsRef = collection(db, 'apps');
      const q = query(appsRef, where('userId', '==', loggedIn.uid));
      const querySnapshot = await getDocs(q);
      const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserApps(appsData);
    } catch (error) {
      console.error("Error fetching user apps: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApps();
  }, [loggedIn]);

  const handleAddNewApp = () => {
    if (!loggedIn?.uid) {
      alert('User is not logged in.');
      return;
    }
    setIsEditing(false);
    setCurrentApp(null);
    setIsModalOpen(true);
  };

  const handleModify = (appId) => {
    const appToModify = userApps.find(app => app.id === appId);
    setCurrentApp(appToModify);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (appId) => {
    try {
      await deleteDoc(doc(db, 'apps', appId));
      setUserApps(userApps.filter(app => app.id !== appId));
    } catch (error) {
      console.error("Error deleting app: ", error);
    }
  };

  const handleSaveApp = () => {
    fetchUserApps(); // Refresh the apps after saving
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      <div className="user-info">
        <h2>User Information</h2>
        <p><strong>Name:</strong> {loggedIn?.username}</p>
        <p><strong>Email:</strong> {loggedIn?.email}</p>
      </div>

      <div className="user-apps">
        <div className="apps-header">
          <button onClick={handleAddNewApp} className="app-button">Add New App</button>
          <button className="app-button">Manage Apps</button>
        </div>
        <div className="apps-list">
          {loading ? (
            <p>Loading apps...</p>
          ) : userApps.length === 0 ? (
            <p>No apps available.</p>
          ) : userApps.map(app => (
            <div key={app.id} className="app-item">
              <div className="app-details">
                <span className="app-name">{app.name}</span>
                <span className={`app-status ${app.status.toLowerCase()}`}>{app.status}</span>
                <span className={`app-status ${app.country.toLowerCase()}`}>{app.country}</span>
              </div>
              <div className="app-actions">
                <button onClick={() => handleModify(app.id)} className="app-action-button">Modify</button>
                <button onClick={() => handleDelete(app.id)} className="app-action-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveApp} 
          currentApp={currentApp} 
          isEditing={isEditing} 
          userId={loggedIn.uid} 
        />
      )}
    </div>
  );
};

export default Dashboard;

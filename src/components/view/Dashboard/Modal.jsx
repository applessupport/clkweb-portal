import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; 
import './Modal.css';
import { toast } from 'react-toastify';

const Modal = ({ isOpen, onClose, onSave, currentApp, isEditing, userId }) => {
  const [appData, setAppData] = useState({
    name: '',
    status: 'Active',
    primaryLink: '',
    redirectLink: '',
    country: 'US', 
  });

  useEffect(() => {
    if (isEditing && currentApp) {
      const fetchAppData = async () => {
        try {
          const appDoc = await getDoc(doc(db, 'apps', currentApp.id));
          if (appDoc.exists()) {
            setAppData(appDoc.data());
          }
        } catch (error) {
          alert('Error fetching app data: ' + error.message);
        }
      };
      fetchAppData();
    } else {
      setAppData({ name: '', status: 'Active', primaryLink: '', redirectLink: '', country: 'US' });
    }
  }, [isEditing, currentApp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppData({ ...appData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (appData.name.trim() === '') {
      alert('App name is required');
      return;
    }

    try {
      const appsRef = collection(db, 'apps');
      const q = query(appsRef, where('userId', '==', userId), where('name', '==', appData.name));
      const querySnapshot = await getDocs(q);
      const isDuplicate = querySnapshot.docs.some((doc) => {
        return isEditing ? doc.id !== currentApp.id : true;
      });

      if (isDuplicate) {
        alert('App name must be unique. An app with this name already exists.');
        return;
      }

      if (isEditing) {
        const appRef = doc(db, 'apps', currentApp.id);
        await updateDoc(appRef, appData);
        toast.success('App updated successfully!');
      } else {
        await addDoc(appsRef, { ...appData, userId });
        toast.success('App added successfully!');
      }

      onSave(); 
      onClose();
    } catch (error) {
      alert('Error saving app: ' + error.message);
      console.log('Error saving app', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? 'Modify App' : 'Add New App'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>App Name</label>
            <input
              type="text"
              name="name"
              value={appData.name}
              onChange={handleChange}
              placeholder="Enter app name"
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={appData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-group">
            <label>Primary Link</label>
            <input
              type="url"
              name="primaryLink"
              value={appData.primaryLink}
              onChange={handleChange}
              placeholder="Enter primary link URL"
            />
          </div>
          <div className="form-group">
            <label>Redirect Link</label>
            <input
              type="url"
              name="redirectLink"
              value={appData.redirectLink}
              onChange={handleChange}
              placeholder="Enter redirect link URL"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <select
              name="country"
              value={appData.country}
              onChange={handleChange}
            >
              <option value="US">US</option>
              <option value="IN">IN</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="modal-save-button">
              {isEditing ? 'Save Changes' : 'Add App'}
            </button>
            <button type="button" className="modal-cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;

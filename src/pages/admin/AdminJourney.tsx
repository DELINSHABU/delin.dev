import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminLayout from '../../components/admin/AdminLayout';

interface JourneyItem {
  period: string;
  title: string;
  description: string;
}

const AdminJourney: React.FC = () => {
  const { theme } = useTheme();
  const [newJourney, setNewJourney] = useState<JourneyItem>({
    period: '',
    title: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll add the API call to save the journey
    console.log('Saving journey:', newJourney);
  };

  return (
    <AdminLayout>
      <div className={`admin-page ${theme}`}>
        <h1>Manage Journey</h1>
        
        <div className="admin-form-section">
          <h2>Add New Journey Item</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="period">Period</label>
              <input
                type="text"
                id="period"
                value={newJourney.period}
                onChange={(e) => setNewJourney({ ...newJourney, period: e.target.value })}
                placeholder="e.g., 2023 - Present"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newJourney.title}
                onChange={(e) => setNewJourney({ ...newJourney, title: e.target.value })}
                placeholder="e.g., Frontend Developer"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newJourney.description}
                onChange={(e) => setNewJourney({ ...newJourney, description: e.target.value })}
                placeholder="Describe your role and achievements"
                rows={4}
                required
              />
            </div>
            <button type="submit" className="admin-button">Add Journey Item</button>
          </form>
        </div>

        <div className="admin-list-section">
          <h2>Existing Journey Items</h2>
          {/* We'll add the list of existing items here */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminJourney;

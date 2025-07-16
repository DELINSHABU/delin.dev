import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminLayout from '../../components/admin/AdminLayout';

interface Skill {
  name: string;
  level: number;
  category: string;
}

const AdminSkills: React.FC = () => {
  const { theme } = useTheme();
  const [newSkill, setNewSkill] = useState<Skill>({
    name: '',
    level: 0,
    category: ''
  });

  const categories = ['Frontend', 'Backend', 'DevOps', 'Tools', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll add the API call to save the skill
    console.log('Saving skill:', newSkill);
  };

  return (
    <AdminLayout>
      <div className={`admin-page ${theme}`}>
        <h1>Manage Skills</h1>
        
        <div className="admin-form-section">
          <h2>Add New Skill</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Skill Name</label>
              <input
                type="text"
                id="name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g., React"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="level">
                Proficiency Level: {newSkill.level}%
              </label>
              <input
                type="range"
                id="level"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                required
              />
            </div>

            <button type="submit" className="admin-button">Add Skill</button>
          </form>
        </div>

        <div className="admin-list-section">
          <h2>Existing Skills</h2>
          {/* We'll add the list of existing skills here */}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSkills;

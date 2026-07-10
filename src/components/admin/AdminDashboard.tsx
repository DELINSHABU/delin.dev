 import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import AboutEditor from './AboutEditor';
import SkillsEditor from './SkillsEditor';
import JourneyEditor from './JourneyEditor';
import ProjectsEditor from './ProjectsEditor';
import '../../styles/Admin.css';
import Icon from '../Icon';

type ActiveTab = 'about' | 'skills' | 'journey' | 'projects';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');
  const { logout } = useAdmin();

  const tabs = [
    { id: 'about', label: 'About Me', icon: 'fas fa-user' },
    { id: 'skills', label: 'Skills & Expertise', icon: 'fas fa-code' },
    { id: 'journey', label: 'My Journey', icon: 'fas fa-road' },
    { id: 'projects', label: 'Projects', icon: 'fas fa-folder' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutEditor />;
      case 'skills':
        return <SkillsEditor />;
      case 'journey':
        return <JourneyEditor />;
      case 'projects':
        return <ProjectsEditor />;
      default:
        return <AboutEditor />;
    }
  };

  return (
    <div className="admin-dashboard">
      <motion.header 
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Portfolio Admin Panel</h1>
        <motion.button 
          className="logout-btn"
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon name="fas fa-sign-out-alt" /> Logout
        </motion.button>
      </motion.header>

      <div className="admin-content">
        <motion.nav 
          className="admin-nav"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon name={tab.icon} />
              {tab.label}
            </motion.button>
          ))}
        </motion.nav>

        <motion.main 
          className="admin-main"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          key={activeTab}
        >
          {renderContent()}
        </motion.main>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/admin.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`admin-layout ${theme}`}>
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><a href="/admin/journey">Journey</a></li>
            <li><a href="/admin/projects">Projects</a></li>
            <li><a href="/admin/skills">Skills</a></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

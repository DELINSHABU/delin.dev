import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminLogin from '../../components/admin/AdminLogin';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminPage: React.FC = () => {
  const { isAuthenticated } = useAdmin();

  return (
    <div className="admin-page" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: 9999,
      background: '#1a1a1a'
    }}>
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
    </div>
  );
};

export default AdminPage;
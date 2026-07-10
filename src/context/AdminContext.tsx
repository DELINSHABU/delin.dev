import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

// Admin credentials injected at build time (see .env.example). The password is
// stored as a SHA-256 hex digest so plaintext is never committed or shipped.
// The username is optional — if unset, any username passes the check. NOTE:
// this is a client-side gate only and is not a substitute for real server-side
// auth — anyone can bypass it in a static app; it just avoids leaking creds.
const ADMIN_USERNAME = process.env.REACT_APP_ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.REACT_APP_ADMIN_PASSWORD_HASH?.toLowerCase();

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      if (!ADMIN_PASSWORD_HASH) {
        console.warn(
          'Admin login is disabled: set REACT_APP_ADMIN_PASSWORD_HASH (see .env.example).'
        );
        return false;
      }
      // If a username is configured, reject non-matching usernames.
      if (ADMIN_USERNAME && username.toLowerCase() !== ADMIN_USERNAME.toLowerCase()) {
        return false;
      }
      const inputHash = await sha256Hex(password);
      if (inputHash === ADMIN_PASSWORD_HASH) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
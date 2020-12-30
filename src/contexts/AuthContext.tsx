import React, { createContext, useEffect, useState } from 'react';
import { hasTokenValid } from '../services/auth';

interface AuthContextProps {
  isValidToken: boolean,
  isAdmin: boolean,
  checkToken(): Promise<void>,
  loading: boolean,
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  async function checkToken() {
    const response = await hasTokenValid();
    
    setIsValidToken(response?.isTokenValid);
    setIsAdmin(response?.isAdmin);
    setLoading(false);
  }

  return (
    <AuthContext.Provider 
      value={{isValidToken, isAdmin, checkToken, loading}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

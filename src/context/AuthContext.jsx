import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    token: sessionStorage.getItem('token') || null,
    permissions: JSON.parse(sessionStorage.getItem('permissions')) || [],
    isLoading: true,
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    const storedPermissions = sessionStorage.getItem('permissions');

    if (storedUser && storedToken) {
      setAuthState({
        user: JSON.parse(storedUser),
        token: storedToken,
        permissions: storedPermissions ? JSON.parse(storedPermissions) : [],
        isLoading: false,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (userData, token, permissions) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('permissions', JSON.stringify(permissions || []));

    setAuthState({ user: userData, token, permissions: permissions || [], isLoading: false });
    // console.log("Updated Auth State after login:", { userData, token, permissions });
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('permissions');
    setAuthState({ user: null, token: null, permissions: null, isLoading: false });
  };

//   useEffect(() => {
//     console.log("Auth Context Updated:", authState);
//   }, [authState]);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
}

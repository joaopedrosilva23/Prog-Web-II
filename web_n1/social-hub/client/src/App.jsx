import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { sessionAPI } from './api';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import './styles/global.css';

// Função para extrair dados do usuário da resposta da API
const extractUserData = (response) => ({
  id: response.data.user.id,
  name: response.data.user.name,
  email: response.data.user.email,
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await sessionAPI.getMe();
      setUser(response.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '18px',
      }}>
        Loading...
      </div>
    );
  }

  const handleLogin = async (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={user ? (
            <FeedPage user={user} onLogout={() => setUser(null)} />
          ) : (
            <Navigate to="/auth" />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;

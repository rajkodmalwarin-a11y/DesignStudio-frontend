import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { auth } from './firebase/firebase';
import Auth from './components/Auth';
import Home from './pages/Home';
import Share from './pages/Share';
import Customizer from './pages/Customizer';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Toaster 
          position="top-center"
          theme="light"
          richColors
          closeButton
        />
        
        <Routes>
          <Route path="/" element={user ? <Home /> : <Auth />} />
          <Route path="/customizer" element={user ? <Customizer /> : <Auth />} />
          <Route path="/share/:shareId" element={<Share />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import AuthComponent from '@/components/AuthComponent';
import VotingDashboard from '@/components/VotingDashboard';
import { User } from '@/types/user';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('votingUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('votingUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('votingUser');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {!user ? (
        <AuthComponent onLogin={handleLogin} />
      ) : (
        <VotingDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;

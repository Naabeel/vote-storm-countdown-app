
import { useState, useEffect } from 'react';
import AuthComponent from '@/components/AuthComponent';
import CreateIdeas from './CreateIdeas';
import ThankYou from './ThankYou';
import VotingPage from './VotingPage';
import Leaderboard from '@/components/Leaderboard';
import { User, Idea } from '@/types/user';
import { toast } from 'sonner';

type AppState = 'auth' | 'create-ideas' | 'thank-you' | 'voting' | 'leaderboard';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('auth');
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [userSubmittedIdeasCount, setUserSubmittedIdeasCount] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('votingUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setAppState('create-ideas'); // Start with idea creation
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('votingUser', JSON.stringify(userData));
    setAppState('create-ideas');
  };

  const handleIdeasSubmitted = (ideas: Idea[]) => {
    setAllIdeas(prev => [...prev, ...ideas]);
    setUserSubmittedIdeasCount(ideas.length);
    setAppState('thank-you');
    toast.success(`${ideas.length} ideas submitted successfully!`);
  };

  const handleProceedToVoting = () => {
    setAppState('voting');
  };

  const handleVote = (ideaId: string, targetUser: User) => {
    setAllIdeas(prevIdeas => 
      prevIdeas.map(idea => {
        if (idea.id === ideaId) {
          const hasVoted = idea.voters.includes(targetUser.id);
          if (hasVoted) {
            toast.info(`${targetUser.name} has already voted for this idea!`);
            return idea;
          }
          
          toast.success(`Vote cast for ${targetUser.name}!`);
          return {
            ...idea,
            votes: idea.votes + 1,
            voters: [...idea.voters, targetUser.id],
          };
        }
        return idea;
      })
    );
  };

  const handleShowLeaderboard = () => {
    setAppState('leaderboard');
  };

  const handleBackToVoting = () => {
    setAppState('voting');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('auth');
    setAllIdeas([]);
    setUserSubmittedIdeasCount(0);
    localStorage.removeItem('votingUser');
    toast.info('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {appState === 'auth' && (
        <AuthComponent onLogin={handleLogin} />
      )}
      
      {appState === 'create-ideas' && user && (
        <CreateIdeas 
          user={user} 
          onIdeasSubmitted={handleIdeasSubmitted}
        />
      )}
      
      {appState === 'thank-you' && user && (
        <ThankYou 
          user={user}
          submittedIdeasCount={userSubmittedIdeasCount}
          onProceedToVoting={handleProceedToVoting}
        />
      )}
      
      {appState === 'voting' && user && (
        <VotingPage 
          user={user}
          ideas={allIdeas}
          onVote={handleVote}
          onLogout={handleLogout}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}
      
      {appState === 'leaderboard' && user && (
        <Leaderboard 
          ideas={allIdeas}
          user={user}
          onBackToVoting={handleBackToVoting}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Index;


import { useState, useEffect } from 'react';
import AuthComponent from '@/components/AuthComponent';
import CreateIdeas from './CreateIdeas';
import ThankYou from './ThankYou';
import VotingPage from './VotingPage';
import Leaderboard from '@/components/Leaderboard';
import { User, Idea } from '@/types/user';
import { supabase } from '@/lib/supabase';
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
      setAppState('create-ideas');
    }
    
    // Load ideas from Supabase
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select(`
          *,
          users!ideas_author_id_fkey(name)
        `);

      if (ideasError) throw ideasError;

      const { data: votesData, error: votesError } = await supabase
        .from('votes')
        .select('*');

      if (votesError) throw votesError;

      const ideasWithVotes = ideasData?.map(idea => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        author: idea.users?.name || 'Unknown',
        authorId: idea.author_id,
        votes: votesData?.filter(vote => vote.idea_id === idea.id).length || 0,
        voters: votesData?.filter(vote => vote.idea_id === idea.id).map(vote => vote.target_user_id) || [],
        createdAt: new Date(idea.created_at),
      })) || [];

      setAllIdeas(ideasWithVotes);
    } catch (error) {
      console.error('Error loading ideas:', error);
      toast.error('Failed to load ideas');
    }
  };

  const handleLogin = async (userData: User) => {
    try {
      // Save user to Supabase
      const { error } = await supabase
        .from('users')
        .upsert({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          department: userData.department
        });

      if (error) throw error;

      setUser(userData);
      localStorage.setItem('votingUser', JSON.stringify(userData));
      setAppState('create-ideas');
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user data');
    }
  };

  const handleIdeasSubmitted = async (ideas: Idea[]) => {
    try {
      // Save ideas to Supabase
      const ideasToInsert = ideas.map(idea => ({
        title: idea.title,
        description: idea.description,
        author_id: idea.authorId
      }));

      const { error } = await supabase
        .from('ideas')
        .insert(ideasToInsert);

      if (error) throw error;

      setUserSubmittedIdeasCount(ideas.length);
      setAppState('thank-you');
      toast.success(`${ideas.length} ideas submitted successfully!`);
      
      // Reload ideas
      loadIdeas();
    } catch (error) {
      console.error('Error submitting ideas:', error);
      toast.error('Failed to submit ideas');
    }
  };

  const handleProceedToVoting = () => {
    setAppState('voting');
  };

  const handleVote = async (ideaId: string, targetUser: User) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('votes')
        .insert({
          idea_id: ideaId,
          voter_id: user.id,
          voter_name: user.name,
          target_user_id: targetUser.id,
          target_user_name: targetUser.name
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info(`${targetUser.name} has already voted for this idea!`);
          return;
        }
        throw error;
      }

      toast.success(`Vote cast for ${targetUser.name}!`);
      
      // Reload ideas to update vote counts
      loadIdeas();
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error('Failed to cast vote');
    }
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

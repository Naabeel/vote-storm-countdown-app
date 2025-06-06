
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Users, TrendingUp, LogOut } from 'lucide-react';
import { User, Idea, VotingSession } from '@/types/user';
import IdeaCard from '@/components/IdeaCard';
import VotingTimer from '@/components/VotingTimer';
import UserSearch from '@/components/UserSearch';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface VotingPageProps {
  user: User;
  ideas: Idea[];
  onVote: (ideaId: string, targetUser: User) => void;
  onLogout: () => void;
  onShowLeaderboard: () => void;
}

const VotingPage = ({ user, ideas, onVote, onLogout, onShowLeaderboard }: VotingPageProps) => {
  const [session, setSession] = useState<VotingSession>({
    id: 'default',
    isActive: false,
    timeRemaining: 60,
    totalDuration: 60,
    hasEnded: false,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter out user's own ideas
  const votableIdeas = ideas.filter(idea => idea.authorId !== user.id);
  const totalVotes = ideas.reduce((sum, idea) => sum + idea.votes, 0);
  const activeVoters = new Set(ideas.flatMap(idea => idea.voters)).size;

  useEffect(() => {
    // Load voting session from Supabase
    loadVotingSession();

    // Set up real-time subscription for voting session updates
    const sessionSubscription = supabase
      .channel('voting_session_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voting_sessions',
          filter: 'id=eq.default'
        },
        (payload) => {
          console.log('Session update:', payload);
          if (payload.new) {
            setSession({
              id: payload.new.id,
              isActive: payload.new.is_active,
              timeRemaining: payload.new.time_remaining,
              totalDuration: payload.new.total_duration,
              hasEnded: payload.new.has_ended,
            });
          }
        }
      )
      .subscribe();

    return () => {
      sessionSubscription.unsubscribe();
    };
  }, []);

  const loadVotingSession = async () => {
    try {
      const { data, error } = await supabase
        .from('voting_sessions')
        .select('*')
        .eq('id', 'default')
        .single();

      if (error) throw error;

      if (data) {
        setSession({
          id: data.id,
          isActive: data.is_active,
          timeRemaining: data.time_remaining,
          totalDuration: data.total_duration,
          hasEnded: data.has_ended,
        });
      }
    } catch (error) {
      console.error('Error loading voting session:', error);
    }
  };

  const handleVote = (ideaId: string) => {
    if (!session.isActive) {
      toast.error('Voting session is not active!');
      return;
    }

    if (!selectedUser) {
      toast.error('Please select a user to vote on behalf of!');
      return;
    }

    onVote(ideaId, selectedUser);
  };

  const startVoting = async () => {
    try {
      const { error } = await supabase
        .from('voting_sessions')
        .update({
          is_active: true,
          time_remaining: 60,
          has_ended: false
        })
        .eq('id', 'default');

      if (error) throw error;

      toast.success('Voting session started! You have 60 seconds to vote.');
    } catch (error) {
      console.error('Error starting voting session:', error);
      toast.error('Failed to start voting session');
    }
  };

  const onTimerComplete = async () => {
    try {
      const { error } = await supabase
        .from('voting_sessions')
        .update({
          is_active: false,
          has_ended: true,
          time_remaining: 0
        })
        .eq('id', 'default');

      if (error) throw error;

      toast.info('Voting session ended!');
      setTimeout(() => {
        onShowLeaderboard();
      }, 2000);
    } catch (error) {
      console.error('Error ending voting session:', error);
    }
  };

  const onUpdateSession = async (updatedSession: VotingSession) => {
    try {
      const { error } = await supabase
        .from('voting_sessions')
        .update({
          time_remaining: updatedSession.timeRemaining
        })
        .eq('id', 'default');

      if (error) throw error;

      setSession(updatedSession);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Timer className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VoteStream - Voting
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Ideas</p>
                  <p className="text-2xl font-bold text-blue-600">{ideas.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-green-600">{totalVotes}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Votable Ideas</p>
                  <p className="text-2xl font-bold text-purple-600">{votableIdeas.length}</p>
                </div>
                <Timer className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <VotingTimer 
                session={session}
                onTimerComplete={onTimerComplete}
                onUpdateSession={onUpdateSession}
              />
            </CardContent>
          </Card>
        </div>

        {/* User Search */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Cast Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <UserSearch
              currentUser={user}
              onUserSelected={setSelectedUser}
              selectedUser={selectedUser}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={startVoting}
            disabled={session.isActive}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {session.isActive ? 'Voting in Progress...' : 'Start Voting Session'}
          </Button>

          <div className="flex items-center space-x-2">
            <Badge variant={session.isActive ? "default" : "secondary"}>
              {session.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {votableIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onVote={handleVote}
              canVote={session.isActive && selectedUser !== null}
              userHasVoted={false}
            />
          ))}
        </div>

        {votableIdeas.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No ideas available for voting at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VotingPage;

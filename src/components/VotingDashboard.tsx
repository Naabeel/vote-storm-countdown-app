import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Plus, Timer, Users, TrendingUp } from 'lucide-react';
import { User, Idea, VotingSession } from '@/types/user';
import IdeaCard from './IdeaCard';
import VotingTimer from './VotingTimer';
import AddIdeaDialog from './AddIdeaDialog';
import { toast } from 'sonner';

interface VotingDashboardProps {
  user: User;
  onLogout: () => void;
}

const VotingDashboard = ({ user, onLogout }: VotingDashboardProps) => {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: '1',
      title: 'Mobile App for Team Collaboration',
      description: 'A mobile application that helps remote teams collaborate more effectively with real-time messaging and file sharing.',
      author: 'Alex Johnson',
      authorId: 'user-1',
      votes: 12,
      voters: [],
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'AI-Powered Code Review System',
      description: 'An intelligent system that automatically reviews code and provides suggestions for improvements and bug detection.',
      author: 'Sarah Chen',
      authorId: 'user-2',
      votes: 8,
      voters: [],
      createdAt: new Date('2024-01-16'),
    },
    {
      id: '3',
      title: 'Sustainable Food Delivery Platform',
      description: 'A platform that connects users with local sustainable food producers and reduces packaging waste.',
      author: 'Mike Rodriguez',
      authorId: 'user-3',
      votes: 15,
      voters: [],
      createdAt: new Date('2024-01-17'),
    },
  ]);

  const [session, setSession] = useState<VotingSession>({
    id: '1',
    isActive: false,
    timeRemaining: 60,
    totalDuration: 60,
    hasEnded: false,
  });

  const [showAddIdea, setShowAddIdea] = useState(false);

  const totalVotes = ideas.reduce((sum, idea) => sum + idea.votes, 0);
  const activeVoters = new Set(ideas.flatMap(idea => idea.voters)).size;

  const handleVote = (ideaId: string) => {
    if (!session.isActive) {
      toast.error('Voting session is not active!');
      return;
    }

    setIdeas(prevIdeas => 
      prevIdeas.map(idea => {
        if (idea.id === ideaId) {
          const hasVoted = idea.voters.includes(user.id);
          if (hasVoted) {
            toast.info('You have already voted for this idea!');
            return idea;
          }
          
          toast.success('Vote cast successfully!');
          return {
            ...idea,
            votes: idea.votes + 1,
            voters: [...idea.voters, user.id],
          };
        }
        return idea;
      })
    );
  };

  const handleAddIdea = (title: string, description: string) => {
    const newIdea: Idea = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      author: user.name,
      authorId: user.id,
      votes: 0,
      voters: [],
      createdAt: new Date(),
    };
    
    setIdeas(prev => [newIdea, ...prev]);
    toast.success('Idea added successfully!');
  };

  const startVoting = () => {
    setSession(prev => ({ ...prev, isActive: true, timeRemaining: 60 }));
    toast.success('Voting session started! You have 60 seconds to vote.');
  };

  const onTimerComplete = () => {
    setSession(prev => ({ ...prev, isActive: false, hasEnded: true }));
    toast.info('Voting session ended!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Timer className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VoteStream
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
                  <p className="text-sm text-gray-600">Active Voters</p>
                  <p className="text-2xl font-bold text-purple-600">{activeVoters}</p>
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
                onUpdateSession={setSession}
              />
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={startVoting}
            disabled={session.isActive}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {session.isActive ? 'Voting in Progress...' : 'Start Voting Session'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowAddIdea(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Idea</span>
          </Button>

          <div className="flex items-center space-x-2">
            <Badge variant={session.isActive ? "default" : "secondary"}>
              {session.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onVote={handleVote}
              canVote={session.isActive && !idea.voters.includes(user.id)}
              userHasVoted={idea.voters.includes(user.id)}
            />
          ))}
        </div>
      </div>

      <AddIdeaDialog
        open={showAddIdea}
        onClose={() => setShowAddIdea(false)}
        onAddIdea={handleAddIdea}
      />
    </div>
  );
};

export default VotingDashboard;

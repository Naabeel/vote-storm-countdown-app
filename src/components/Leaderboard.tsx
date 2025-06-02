import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, User, Calendar, ArrowLeft } from 'lucide-react';
import { Idea, User as UserType } from '@/types/user';

interface LeaderboardProps {
  ideas: Idea[];
  user: UserType;
  onBackToVoting: () => void;
  onLogout: () => void;
}

const Leaderboard = ({ ideas, user, onBackToVoting, onLogout }: LeaderboardProps) => {
  // Sort ideas by votes in descending order
  const sortedIdeas = [...ideas].sort((a, b) => b.votes - a.votes);
  const topThree = sortedIdeas.slice(0, 3);
  const restOfIdeas = sortedIdeas.slice(3);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-400 to-yellow-600';
      case 1:
        return 'from-gray-300 to-gray-500';
      case 2:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Leaderboard - Final Results
                </h1>
                <p className="text-sm text-gray-600">Voting session completed</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={onBackToVoting}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Voting</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              🏆 Top 3 Most Voted Ideas 🏆
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topThree.map((idea, index) => (
                <Card 
                  key={idea.id} 
                  className={`bg-gradient-to-br ${getRankColor(index)} text-white border-0 shadow-xl transform hover:scale-105 transition-all duration-300`}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                      {getRankIcon(index)}
                    </div>
                    <CardTitle className="text-white text-lg leading-tight">
                      {idea.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {idea.votes} votes
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">
                      {idea.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{idea.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{idea.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Rest of the Ideas */}
        {restOfIdeas.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-700">
              All Other Ideas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restOfIdeas.map((idea, index) => (
                <Card 
                  key={idea.id} 
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(index + 3)}
                        <CardTitle className="text-lg font-semibold leading-tight">
                          {idea.title}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary">
                        {idea.votes} votes
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {idea.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{idea.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{idea.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Session Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{ideas.length}</p>
                <p className="text-sm text-gray-600">Total Ideas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {ideas.reduce((sum, idea) => sum + idea.votes, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Votes Cast</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(ideas.flatMap(idea => idea.voters)).size}
                </p>
                <p className="text-sm text-gray-600">Unique Voters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;

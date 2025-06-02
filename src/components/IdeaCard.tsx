
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, User, Calendar } from 'lucide-react';
import { Idea } from '@/types/user';

interface IdeaCardProps {
  idea: Idea;
  onVote: (ideaId: string) => void;
  canVote: boolean;
  userHasVoted: boolean;
}

const IdeaCard = ({ idea, onVote, canVote, userHasVoted }: IdeaCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold leading-tight pr-2">
            {idea.title}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
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
        
        <Button
          onClick={() => onVote(idea.id)}
          disabled={!canVote}
          variant={userHasVoted ? "secondary" : "default"}
          className={`w-full transition-all duration-200 ${
            userHasVoted
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : canVote
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              : 'opacity-50'
          }`}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          {userHasVoted ? 'Voted' : canVote ? 'Vote' : 'Voting Closed'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;

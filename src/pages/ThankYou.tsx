
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { User } from '@/types/user';

interface ThankYouProps {
  user: User;
  submittedIdeasCount: number;
  onProceedToVoting: () => void;
}

const ThankYou = ({ user, submittedIdeasCount, onProceedToVoting }: ThankYouProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Thank You, {user.name}!
            </h1>
            <p className="text-gray-600">
              Your {submittedIdeasCount} ideas have been successfully submitted.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              Now it's time to vote for other innovative ideas from your colleagues!
            </p>
          </div>
          
          <Button
            onClick={onProceedToVoting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center justify-center space-x-2"
          >
            <span>Proceed to Voting</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;

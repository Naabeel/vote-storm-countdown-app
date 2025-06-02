
import { useEffect } from 'react';
import { Timer, Play, Pause } from 'lucide-react';
import { VotingSession } from '@/types/user';

interface VotingTimerProps {
  session: VotingSession;
  onTimerComplete: () => void;
  onUpdateSession: (session: VotingSession) => void;
}

const VotingTimer = ({ session, onTimerComplete, onUpdateSession }: VotingTimerProps) => {
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (session.isActive && session.timeRemaining > 0) {
      interval = setInterval(() => {
        onUpdateSession({
          ...session,
          timeRemaining: session.timeRemaining - 1,
        });
      }, 1000);
    } else if (session.isActive && session.timeRemaining === 0) {
      onTimerComplete();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [session, onTimerComplete, onUpdateSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((session.totalDuration - session.timeRemaining) / session.totalDuration) * 100;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-2">
        <Timer className="h-5 w-5 text-orange-500 mr-2" />
        <p className="text-sm text-gray-600">Session Timer</p>
      </div>
      
      <div className="relative mb-3">
        <div className={`text-3xl font-bold ${
          session.timeRemaining <= 10 && session.isActive 
            ? 'text-red-500 animate-pulse' 
            : session.isActive 
            ? 'text-orange-500' 
            : 'text-gray-400'
        }`}>
          {formatTime(session.timeRemaining)}
        </div>
        
        {session.isActive && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                session.timeRemaining <= 10 ? 'bg-red-500' : 'bg-orange-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center">
        {session.isActive ? (
          <div className="flex items-center text-green-600">
            <Play className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <Pause className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">INACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingTimer;

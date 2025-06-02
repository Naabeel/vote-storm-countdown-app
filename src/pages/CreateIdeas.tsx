
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { User, Idea } from '@/types/user';
import { toast } from 'sonner';

interface CreateIdeasProps {
  user: User;
  onIdeasSubmitted: (ideas: Idea[]) => void;
}

const CreateIdeas = ({ user, onIdeasSubmitted }: CreateIdeasProps) => {
  const [ideas, setIdeas] = useState([
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
  ]);

  const addIdea = () => {
    setIdeas([...ideas, { title: '', description: '' }]);
  };

  const removeIdea = (index: number) => {
    if (ideas.length > 3) {
      setIdeas(ideas.filter((_, i) => i !== index));
    } else {
      toast.error('You must submit at least 3 ideas!');
    }
  };

  const updateIdea = (index: number, field: 'title' | 'description', value: string) => {
    const updatedIdeas = ideas.map((idea, i) => 
      i === index ? { ...idea, [field]: value } : idea
    );
    setIdeas(updatedIdeas);
  };

  const handleSubmit = () => {
    const validIdeas = ideas.filter(idea => idea.title.trim() && idea.description.trim());
    
    if (validIdeas.length < 3) {
      toast.error('Please complete at least 3 ideas before submitting!');
      return;
    }

    const formattedIdeas: Idea[] = validIdeas.map(idea => ({
      id: Math.random().toString(36).substr(2, 9),
      title: idea.title.trim(),
      description: idea.description.trim(),
      author: user.name,
      authorId: user.id,
      votes: 0,
      voters: [],
      createdAt: new Date(),
    }));

    onIdeasSubmitted(formattedIdeas);
  };

  const filledIdeas = ideas.filter(idea => idea.title.trim() && idea.description.trim()).length;
  const canSubmit = filledIdeas >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Submit Your Ideas
          </h1>
          <p className="text-gray-600">
            Welcome {user.name}! Please submit at least 3 innovative ideas.
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Ideas completed: {filledIdeas} / {ideas.length} (minimum 3 required)
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {ideas.map((idea, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Idea {index + 1}</CardTitle>
                  {ideas.length > 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeIdea(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    placeholder="Enter your idea title"
                    value={idea.title}
                    onChange={(e) => updateIdea(index, 'title', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    placeholder="Describe your idea in detail"
                    value={idea.description}
                    onChange={(e) => updateIdea(index, 'description', e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={addIdea}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Another Idea</span>
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
          >
            <span>Submit Ideas ({filledIdeas})</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateIdeas;

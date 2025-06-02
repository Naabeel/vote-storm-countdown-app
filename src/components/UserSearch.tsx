
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User as UserIcon, Check } from 'lucide-react';
import { User } from '@/types/user';

interface UserSearchProps {
  currentUser: User;
  onUserSelected: (user: User) => void;
  selectedUser: User | null;
}

// Mock user data - in a real app, this would come from your backend
const mockUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com', department: 'Engineering' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', department: 'Design' },
  { id: '3', name: 'Carol Brown', email: 'carol@company.com', department: 'Marketing' },
  { id: '4', name: 'David Wilson', email: 'david@company.com', department: 'Sales' },
  { id: '5', name: 'Emma Davis', email: 'emma@company.com', department: 'HR' },
  { id: '6', name: 'Frank Miller', email: 'frank@company.com', department: 'Engineering' },
  { id: '7', name: 'Grace Lee', email: 'grace@company.com', department: 'Product' },
  { id: '8', name: 'Henry Taylor', email: 'henry@company.com', department: 'Finance' },
];

const UserSearch = ({ currentUser, onUserSelected, selectedUser }: UserSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = mockUsers.filter(user => 
        user.id !== currentUser.id && (
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredUsers(filtered);
      setShowResults(true);
    } else {
      setFilteredUsers([]);
      setShowResults(false);
    }
  }, [searchTerm, currentUser.id]);

  const handleUserSelect = (user: User) => {
    onUserSelected(user);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vote on behalf of:
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for a colleague to vote on behalf of..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {selectedUser && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{selectedUser.name}</p>
                  <p className="text-sm text-green-600">{selectedUser.email}</p>
                  {selectedUser.department && (
                    <p className="text-xs text-green-500">{selectedUser.department}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showResults && filteredUsers.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto">
          <CardContent className="p-2">
            {filteredUsers.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start p-3 h-auto"
                onClick={() => handleUserSelect(user)}
              >
                <UserIcon className="h-4 w-4 mr-3 shrink-0" />
                <div className="text-left">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {user.department && (
                    <p className="text-xs text-gray-400">{user.department}</p>
                  )}
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && filteredUsers.length === 0 && searchTerm.trim() && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <CardContent className="p-4 text-center text-gray-500">
            No users found matching "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSearch;

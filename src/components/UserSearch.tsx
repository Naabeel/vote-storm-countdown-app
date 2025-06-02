
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User as UserIcon, X } from 'lucide-react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserSearchProps {
  currentUser: User;
  onUserSelected: (user: User | null) => void;
  selectedUser: User | null;
}

const UserSearch = ({ currentUser, onUserSelected, selectedUser }: UserSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(user => user.id !== currentUser.id); // Exclude current user

    setFilteredUsers(filtered);
  }, [searchTerm, users, currentUser.id]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');

      if (error) throw error;

      const mappedUsers = data?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department || undefined
      })) || [];

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    onUserSelected(user);
    setSearchTerm('');
  };

  const clearSelection = () => {
    onUserSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold">Select User to Vote For</h3>
        {isLoading && (
          <div className="text-sm text-gray-500">Loading users...</div>
        )}
      </div>

      {selectedUser ? (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">{selectedUser.name}</p>
              <p className="text-sm text-blue-600">{selectedUser.email}</p>
              {selectedUser.department && (
                <Badge variant="secondary" className="mt-1">
                  {selectedUser.department}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {searchTerm && (
            <div className="max-h-60 overflow-y-auto border rounded-lg bg-white">
              {filteredUsers.length > 0 ? (
                <div className="p-2 space-y-1">
                  {filteredUsers.slice(0, 10).map((user) => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className="w-full justify-start p-3 h-auto"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center space-x-3">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                        <div className="text-left">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.department && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {user.department}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                  {filteredUsers.length > 10 && (
                    <p className="text-sm text-gray-500 text-center p-2">
                      Showing first 10 results. Refine your search for more specific results.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No employees found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}

          {!searchTerm && (
            <div className="text-center text-gray-500 p-4">
              Start typing to search for employees...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;

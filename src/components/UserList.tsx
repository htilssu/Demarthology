// User List Component - View layer demonstrating MVC pattern
import React, { useState } from 'react';
import { useUsers } from '../hooks';
import { UserRole, CreateUserRequest } from '../models';
import Button from './Button';

const UserList: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Controller: Use custom hook to manage user state and operations
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    clearError
  } = useUsers({ limit: 5 });

  // Form state for creating new user
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: UserRole.USER
  });

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchUsers(searchQuery);
    } else {
      await fetchUsers();
    }
  };

  // Handle create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(createForm);
      setCreateForm({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: UserRole.USER
      });
      setShowCreateForm(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  // Handle user role toggle
  const handleToggleRole = async (id: string, currentRole: UserRole) => {
    const newRole = currentRole === UserRole.USER ? UserRole.MODERATOR : UserRole.USER;
    await updateUser(id, { role: newRole });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          👥 User Management (MVC Demo)
        </h2>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant="primary"
          size="sm"
        >
          {showCreateForm ? 'Cancel' : '+ Add User'}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by username or email..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="sm">
          🔍 Search
        </Button>
        <Button onClick={() => { setSearchQuery(''); fetchUsers(); }} variant="outline" size="sm">
          Clear
        </Button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateUser} className="bg-gray-50 p-4 rounded-md mb-4">
          <h3 className="text-lg font-medium mb-3">Create New User</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Username"
              value={createForm.username}
              onChange={(e) => setCreateForm(prev => ({ ...prev, username: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={createForm.email}
              onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={createForm.firstName}
              onChange={(e) => setCreateForm(prev => ({ ...prev, firstName: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={createForm.lastName}
              onChange={(e) => setCreateForm(prev => ({ ...prev, lastName: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={createForm.password}
              onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={createForm.role}
              onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.MODERATOR}>Moderator</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <Button type="submit" variant="primary" size="sm">
              Create User
            </Button>
            <Button type="button" onClick={() => setShowCreateForm(false)} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* User List */}
      {!loading && users.length > 0 && (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=random`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === UserRole.ADMIN 
                      ? 'bg-red-100 text-red-800'
                      : user.role === UserRole.MODERATOR
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => handleToggleRole(user.id, user.role)}
                  variant="outline"
                  size="sm"
                >
                  Toggle Role
                </Button>
                <Button
                  onClick={() => handleDeleteUser(user.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
          <Button onClick={() => fetchUsers()} variant="outline" size="sm" className="mt-2">
            Refresh
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination.total > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {users.length} of {pagination.total} users
          {pagination.totalPages > 1 && (
            <span> (Page {pagination.page} of {pagination.totalPages})</span>
          )}
        </div>
      )}

      {/* MVC Architecture Explanation */}
      <div className="mt-6 bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">🏗️ MVC Architecture Demo</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Model:</strong> User.ts - Data structure, validation, business logic</p>
          <p><strong>View:</strong> UserList.tsx (this component) - UI presentation layer</p>
          <p><strong>Controller:</strong> useUsers hook + UserService.ts - State management & API calls</p>
        </div>
      </div>
    </div>
  );
};

export default UserList;
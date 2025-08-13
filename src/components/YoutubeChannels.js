'use client';

import { useState, useEffect } from 'react';
import { Plus, Youtube, Calendar, Trash2, Edit3, AlertTriangle } from 'lucide-react';

const Button = ({ children, onClick, className = '', variant = 'default', size = 'default', disabled = false }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default function YoutubeChannels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);
  const [formData, setFormData] = useState({
    channelName: '',
    creatorName: '',
    genre: '',
    reason: '',
  });
  const [apiLoading, setApiLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_BASE = 'https://collecthubdotnet.onrender.com/api/YouTubeChannels';

  // Get user from localStorage
  const getUser = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('collecthub_user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Fetch YouTube channels
  const fetchChannels = async () => {
    try {
      const user = getUser();
      if (!user) {
        showMessage('error', 'User not found. Please login again.');
        return;
      }

      const response = await fetch(`${API_BASE}?userId=${user.id}`);
      const result = await response.json();

      if (result.success) {
        setChannels(result.data || []);
        showMessage('success', result.message);
      } else {
        showMessage('error', 'Failed to fetch YouTube channels');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // Add YouTube channel
  const addChannel = async () => {
    if (!formData.channelName || !formData.creatorName || !formData.genre) {
      showMessage(
        'error',
        'Please fill in channel name, creator name, and genre',
      );
      return;
    }

    const user = getUser();
    if (!user) {
      showMessage('error', 'User not found. Please login again.');
      return;
    }

    setApiLoading(true);
    try {
      const payload = {
        userId: user.id,
        channelName: formData.channelName,
        creatorName: formData.creatorName,
        genre: formData.genre,
        reason: formData.reason || 'Great content',
      };

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'text/plain',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ channelName: '', creatorName: '', genre: '', reason: '' });
        setShowAddForm(false);
        showMessage('success', result.message);
        fetchChannels();
      } else {
        showMessage('error', 'Failed to add YouTube channel');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    } finally {
      setApiLoading(false);
    }
  };

  // Update YouTube channel
  const updateChannel = async () => {
    if (!formData.channelName || !formData.creatorName || !formData.genre) {
      showMessage(
        'error',
        'Please fill in channel name, creator name, and genre',
      );
      return;
    }

    const user = getUser();
    if (!user) {
      showMessage('error', 'User not found. Please login again.');
      return;
    }

    setApiLoading(true);
    try {
      const payload = {
        channelName: formData.channelName,
        creatorName: formData.creatorName,
        genre: formData.genre,
        reason: formData.reason || 'Great content',
      };

      const response = await fetch(
        `${API_BASE}/${editingChannel.id}?userId=${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            accept: 'text/plain',
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (result.success) {
        setFormData({ channelName: '', creatorName: '', genre: '', reason: '' });
        setEditingChannel(null);
        showMessage('success', result.message);
        fetchChannels();
      } else {
        showMessage('error', 'Failed to update YouTube channel');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    } finally {
      setApiLoading(false);
    }
  };

  // Delete YouTube channel
  const deleteChannel = async (id) => {
    setApiLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          accept: 'text/plain',
        },
      });

      const result = await response.json();

      if (result.success) {
        setShowDeleteDialog(null);
        showMessage('success', result.message);
        fetchChannels();
      } else {
        showMessage('error', 'Failed to delete YouTube channel');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    } finally {
      setApiLoading(false);
    }
  };

  const startEdit = (channel) => {
    setEditingChannel(channel);
    setFormData({
      channelName: channel.channelName,
      creatorName: channel.creatorName,
      genre: channel.genre,
      reason: channel.reason,
    });
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setFormData({ channelName: '', creatorName: '', genre: '', reason: '' });
    setShowAddForm(false);
    setEditingChannel(null);
  };

  const formatGenre = (genre) => {
    return genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6">
      {/* Message Toast */}
      {message.text && (
        <div
          className={`fixed right-4 top-4 z-50 transform rounded-lg px-6 py-3 shadow-lg transition-all duration-300 ${
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          } animate-in slide-in-from-top-2`}
        >
          {message.text}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm">
          <div className="transform rounded-lg bg-white p-6 shadow-xl border transition-all duration-200 animate-in zoom-in-95">
            <div className="mb-4 flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete &quot;
              {showDeleteDialog.channelName}&quot; by{' '}
              {showDeleteDialog.creatorName}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteDialog(null)}
                variant="outline"
                disabled={apiLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteChannel(showDeleteDialog.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={apiLoading}
              >
                {apiLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Youtube className="h-8 w-8 text-red-600" />
          <h2 className="text-3xl font-bold text-gray-800">YouTube Channels</h2>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 text-white transition-all duration-200 hover:scale-105 hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Channel
        </Button>
      </div>

      {showAddForm && (
        <div className="rounded-lg border-l-4 border-red-600 bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold">
            {editingChannel ? 'Edit YouTube Channel' : 'Add New YouTube Channel'}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Channel Name *"
              value={formData.channelName}
              onChange={(e) =>
                setFormData({ ...formData, channelName: e.target.value })
              }
              className="transition-all duration-200 rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Creator Name *"
              value={formData.creatorName}
              onChange={(e) =>
                setFormData({ ...formData, creatorName: e.target.value })
              }
              className="transition-all duration-200 rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
            />
            <select
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
              className="transition-all duration-200 rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Genre *</option>
              <option value="Coding">Coding</option>
              <option value="Technology">Technology</option>
              <option value="Gaming">Gaming</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Music">Music</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Business">Business</option>
              <option value="Comedy">Comedy</option>
            </select>
            <textarea
              placeholder="Reason for liking this channel"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="transition-all duration-200 md:col-span-2 rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
              rows="3"
            />
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              onClick={editingChannel ? updateChannel : addChannel}
              className="transition-all duration-200 bg-green-600 hover:bg-green-700 text-white"
              disabled={apiLoading}
            >
              {apiLoading
                ? editingChannel
                  ? 'Updating...'
                  : 'Adding...'
                : editingChannel
                  ? 'Update Channel'
                  : 'Add Channel'}
            </Button>
            <Button
              onClick={cancelForm}
              variant="outline"
              disabled={apiLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="transform rounded-lg border-l-4 border-red-400 bg-white p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="line-clamp-2 text-lg font-semibold text-gray-800">
                  {channel.channelName}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  by {channel.creatorName}
                </p>
              </div>
              <div className="flex flex-shrink-0 space-x-1">
                <Button
                  onClick={() => startEdit(channel)}
                  size="sm"
                  variant="ghost"
                  className="text-blue-500 transition-colors duration-200 hover:bg-blue-50"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setShowDeleteDialog(channel)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 transition-colors duration-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Genre:</strong> {formatGenre(channel.genre)}
              </p>
              {channel.reason && (
                <p>
                  <strong>Why I like it:</strong> {channel.reason}
                </p>
              )}
              <div className="pt-2 text-xs text-gray-500 flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                Added: {new Date(channel.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {channels.length === 0 && (
        <div className="py-12 text-center">
          <Youtube className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="text-xl font-medium text-gray-500">
            No YouTube channels in your collection
          </h3>
          <p className="mt-2 text-gray-400">Add your first channel to get started!</p>
        </div>
      )}
    </div>
  );
}
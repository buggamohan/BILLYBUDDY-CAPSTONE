import React, { useState } from 'react';
import { Story, User } from '../types';
import { MessageSquare, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface CommunityProps {
  stories: Story[];
  onAddStory: (story: Story) => void;
  onAddComment: (storyId: string, comment: Comment) => void;
}

const Community: React.FC<CommunityProps> = ({ stories, onAddStory, onAddComment }) => {
  const { user } = useAuth();
  const [newStory, setNewStory] = useState({ title: '', content: '' });
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const story: Story = {
      id: uuidv4(),
      userId: user.id,
      username: user.username,
      title: newStory.title,
      content: newStory.content,
      createdAt: new Date(),
      comments: []
    };

    onAddStory(story);
    setNewStory({ title: '', content: '' });
    setShowNewStoryForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Community Stories</h2>
        {user && (
          <button
            onClick={() => setShowNewStoryForm(!showNewStoryForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Share Your Story
          </button>
        )}
      </div>

      {showNewStoryForm && (
        <form onSubmit={handleSubmitStory} className="bg-white rounded-lg shadow-xl p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Your Story
              </label>
              <textarea
                id="content"
                value={newStory.content}
                onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Share Story
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
            <p className="text-gray-600 mb-4">{story.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By {story.username}</span>
              <span>{new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <button className="flex items-center gap-1 text-gray-600 hover:text-red-500">
                <Heart size={16} />
                <span>Support</span>
              </button>
              <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500">
                <MessageSquare size={16} />
                <span>{story.comments.length} Comments</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
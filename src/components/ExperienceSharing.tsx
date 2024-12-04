import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Experience {
  id: string;
  userId: string;
  username: string;
  title: string;
  content: string;
  timestamp: Date;
  isAnonymous: boolean;
  likes: number;
  comments: Comment[];
  tags: string[];
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isAnonymous: boolean;
}

const ExperienceSharing: React.FC = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState({
    title: '',
    content: '',
    isAnonymous: false,
    tags: [] as string[]
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = [
    'Social Media', 'School', 'Workplace', 'Gaming',
    'Recovery', 'Support', 'Advice', 'Success Story'
  ];

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const experience: Experience = {
      id: Date.now().toString(),
      userId: user.id,
      username: newExperience.isAnonymous ? 'Anonymous' : user.username,
      title: newExperience.title,
      content: newExperience.content,
      timestamp: new Date(),
      isAnonymous: newExperience.isAnonymous,
      likes: 0,
      comments: [],
      tags: selectedTags
    };

    setExperiences([experience, ...experiences]);
    setNewExperience({ title: '', content: '', isAnonymous: false, tags: [] });
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-indigo-600" size={32} />
          <h2 className="text-2xl font-bold">Share Your Experience</h2>
        </div>

        <form onSubmit={handleExperienceSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newExperience.title}
              onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Give your story a title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Story
            </label>
            <textarea
              value={newExperience.content}
              onChange={(e) => setNewExperience({ ...newExperience, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={6}
              placeholder="Share your experience and how you overcame it..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={newExperience.isAnonymous}
              onChange={(e) => setNewExperience({ ...newExperience, isAnonymous: e.target.checked })}
              className="rounded text-indigo-600"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Share anonymously
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Share Experience
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {experiences.map((experience) => (
          <div key={experience.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                <p className="text-sm text-gray-500">
                  Shared by {experience.username} • {new Date(experience.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                  <Heart size={20} />
                  <span>{experience.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-indigo-500">
                  <MessageSquare size={20} />
                  <span>{experience.comments.length}</span>
                </button>
                <button className="text-gray-500 hover:text-indigo-500">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{experience.content}</p>

            <div className="flex flex-wrap gap-2">
              {experience.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSharing;
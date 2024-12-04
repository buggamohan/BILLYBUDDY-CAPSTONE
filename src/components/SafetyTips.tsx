import React from 'react';
import { Shield, AlertTriangle, Heart, BookOpen } from 'lucide-react';
import { SafetyTip } from '../types';

const SafetyTips: React.FC = () => {
  const tips: SafetyTip[] = [
    {
      id: '1',
      title: 'Secure Your Social Media',
      content: 'Keep your profiles private and only accept friend requests from people you know. Regularly review your privacy settings.',
      category: 'prevention',
      tags: ['social-media', 'privacy']
    },
    {
      id: '2',
      title: 'Document Everything',
      content: 'Take screenshots of harmful messages, posts, or images. Note dates, times, and any other relevant details.',
      category: 'response',
      tags: ['evidence', 'documentation']
    },
    {
      id: '3',
      title: 'Know Your Rights',
      content: 'Familiarize yourself with cyberbullying laws and your rights. Every citizen has the right to report cyber harassment.',
      category: 'awareness',
      tags: ['legal', 'rights']
    }
  ];

  const categories = {
    prevention: { icon: Shield, color: 'text-blue-500' },
    response: { icon: AlertTriangle, color: 'text-red-500' },
    awareness: { icon: BookOpen, color: 'text-green-500' },
    support: { icon: Heart, color: 'text-purple-500' }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Safety Tips & Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => {
          const CategoryIcon = categories[tip.category].icon;
          return (
            <div key={tip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon className={`${categories[tip.category].color}`} />
                <h3 className="font-semibold">{tip.title}</h3>
              </div>
              <p className="text-gray-600 mb-3">{tip.content}</p>
              <div className="flex flex-wrap gap-2">
                {tip.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyTips;
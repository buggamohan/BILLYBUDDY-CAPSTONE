import React from 'react';
import { Shield, Lock, AlertTriangle, BookOpen, Heart, Users } from 'lucide-react';

const DefenseTactics: React.FC = () => {
  const tactics = [
    {
      icon: Shield,
      title: "Secure Your Online Presence",
      tips: [
        "Use strong, unique passwords for all accounts",
        "Enable two-factor authentication when available",
        "Regularly review privacy settings on social media",
        "Be cautious about sharing personal information"
      ]
    },
    {
      icon: Lock,
      title: "Digital Safety Measures",
      tips: [
        "Keep screenshots of harmful messages as evidence",
        "Block and report abusive accounts",
        "Use privacy-focused messaging apps",
        "Regularly update your devices and apps"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Recognize Warning Signs",
      tips: [
        "Persistent unwanted contact",
        "Threatening or intimidating messages",
        "Sharing private information without consent",
        "Creating fake profiles to harass"
      ]
    },
    {
      icon: Heart,
      title: "Self-Care Strategies",
      tips: [
        "Take regular breaks from social media",
        "Talk to trusted friends or family members",
        "Focus on positive online interactions",
        "Seek professional help if needed"
      ]
    },
    {
      icon: Users,
      title: "Build Support Networks",
      tips: [
        "Connect with anti-bullying communities",
        "Share experiences with trusted peers",
        "Join moderated support groups",
        "Participate in awareness campaigns"
      ]
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      tips: [
        "Learn about cyberbullying laws",
        "Understand reporting procedures",
        "Stay informed about online safety",
        "Share knowledge with others"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Defense Tactics Against Cyberbullying</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tactics.map((tactic, index) => (
            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <tactic.icon className="text-indigo-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">{tactic.title}</h3>
              </div>
              <ul className="space-y-3">
                {tactic.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-indigo-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-indigo-800 mb-4">Emergency Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Cyberbullying Hotline</h4>
              <p className="text-indigo-600">1-800-XXX-XXXX</p>
              <p className="text-sm text-gray-600 mt-1">24/7 Support Available</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Mental Health Support</h4>
              <p className="text-indigo-600">1-800-XXX-YYYY</p>
              <p className="text-sm text-gray-600 mt-1">Professional Counseling</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2">Cybercrime Report</h4>
              <p className="text-indigo-600">1-800-XXX-ZZZZ</p>
              <p className="text-sm text-gray-600 mt-1">Law Enforcement Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseTactics;
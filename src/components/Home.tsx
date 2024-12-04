import React, { useState } from 'react';
import { Shield, MessageCircle, Users, Map, AlertTriangle, HelpCircle } from 'lucide-react';
import ChatBot from './ChatBot';
import MapView from './Map';
import SafetyTips from './SafetyTips';
import Statistics from './Statistics';
import { Report } from '../types';
import { useData } from '../context/DataContext';

const Home: React.FC = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  const { reports, addReport } = useData();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4 rounded-2xl shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Stand Against Cyberbullying</h1>
          <p className="text-xl mb-8">
            Your voice matters. Report cyberbullying incidents safely and anonymously.
            Together, we can create a safer digital space for everyone.
          </p>
          <button
            onClick={() => setShowChatBot(true)}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
          >
            <MessageCircle size={20} />
            Report an Incident
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-indigo-600" size={24} />
            <h3 className="text-xl font-semibold">Anonymous Reporting</h3>
          </div>
          <p className="text-gray-600">
            Report incidents without revealing your identity. Your privacy and security are our top priorities.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Map className="text-indigo-600" size={24} />
            <h3 className="text-xl font-semibold">Incident Tracking</h3>
          </div>
          <p className="text-gray-600">
            Monitor cyberbullying hotspots and help authorities take action in critical areas.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-indigo-600" size={24} />
            <h3 className="text-xl font-semibold">Support Community</h3>
          </div>
          <p className="text-gray-600">
            Connect with others who have faced similar experiences and learn from their stories.
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Incident Map</h2>
        <p className="text-gray-600 mb-4">
          View reported incidents across the country. Areas with multiple reports are highlighted.
        </p>
        <MapView reports={reports || []} />
      </div>

      {/* Statistics Section */}
      <Statistics reports={reports || []} />

      {/* Safety Tips Section */}
      <SafetyTips />

      {/* ChatBot Modal */}
      {showChatBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Report an Incident</h2>
              <button
                onClick={() => setShowChatBot(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <ChatBot onReportSubmit={(report) => {
                addReport(report);
                setShowChatBot(false);
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Help Button */}
      <button
        onClick={() => setShowChatBot(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Get Help"
      >
        <HelpCircle size={24} />
      </button>
    </div>
  );
};

export default Home;
import React from 'react';
import { Shield, MessageCircle, Users } from 'lucide-react';

interface StatisticsCardsProps {
  total: number;
  identified: number;
  anonymous: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ total, identified, anonymous }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-indigo-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-600 font-semibold">Total Reports</p>
            <h3 className="text-3xl font-bold text-indigo-700">{total}</h3>
          </div>
          <Shield className="text-indigo-500" size={32} />
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 font-semibold">Identified Reports</p>
            <h3 className="text-3xl font-bold text-green-700">{identified}</h3>
          </div>
          <Users className="text-green-500" size={32} />
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 font-semibold">Anonymous Reports</p>
            <h3 className="text-3xl font-bold text-purple-700">{anonymous}</h3>
          </div>
          <MessageCircle className="text-purple-500" size={32} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;
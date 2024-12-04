import React from 'react';
import { useData } from '../../context/DataContext';
import QAViewer from './viewers/QAViewer';

const AdminQA: React.FC = () => {
  const { questions, addAnswer } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Q&A Management</h1>
        <QAViewer questions={questions} onAnswer={addAnswer} />
      </div>
    </div>
  );
};

export default AdminQA;
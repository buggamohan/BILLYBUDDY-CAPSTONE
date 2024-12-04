import React from 'react';
import { useData } from '../../context/DataContext';
import ExperiencesViewer from './viewers/ExperiencesViewer';

const AdminExperiences: React.FC = () => {
  const { experiences, updateExperienceStatus } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Experiences Management</h1>
        <ExperiencesViewer 
          experiences={experiences} 
          onUpdateStatus={updateExperienceStatus} 
        />
      </div>
    </div>
  );
};

export default AdminExperiences;
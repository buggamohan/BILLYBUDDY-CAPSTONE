import React, { useState } from 'react';
import { MessageSquare, Flag, CheckCircle, XCircle } from 'lucide-react';
import { Experience } from '../../../types';

interface ExperiencesViewerProps {
  experiences: Experience[];
}

const ExperiencesViewer: React.FC<ExperiencesViewerProps> = ({ experiences }) => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const handleApprove = (experienceId: string) => {
    // Handle experience approval through context
  };

  const handleReject = (experienceId: string) => {
    // Handle experience rejection through context
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-5 border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold">Shared Experiences</h2>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              onClick={() => setSelectedExperience(experience)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedExperience?.id === experience.id ? 'bg-indigo-50' : ''
              }`}
            >
              <h3 className="font-medium mb-1">{experience.title}</h3>
              <p className="text-sm text-gray-600">
                by {experience.isAnonymous ? 'Anonymous' : experience.username}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(experience.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-7 border rounded-lg">
        {selectedExperience ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{selectedExperience.title}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(selectedExperience.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedExperience.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{selectedExperience.content}</p>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {selectedExperience.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select an experience to review
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperiencesViewer;
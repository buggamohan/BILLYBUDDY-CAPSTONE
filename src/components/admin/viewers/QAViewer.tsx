import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Question } from '../../../types';

interface QAViewerProps {
  questions: Question[];
}

const QAViewer: React.FC<QAViewerProps> = ({ questions }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [response, setResponse] = useState('');

  const handleSubmitResponse = (questionId: string) => {
    if (!response.trim()) return;
    // Handle response submission through context
    setResponse('');
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-5 border rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold">Questions</h2>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          {questions.map((question) => (
            <div
              key={question.id}
              onClick={() => setSelectedQuestion(question)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedQuestion?.id === question.id ? 'bg-indigo-50' : ''
              }`}
            >
              <h3 className="font-medium mb-1">{question.title}</h3>
              <p className="text-sm text-gray-600">
                by {question.isAnonymous ? 'Anonymous' : question.username}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(question.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-7 border rounded-lg">
        {selectedQuestion ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-2">{selectedQuestion.title}</h2>
              <p className="text-gray-600">{selectedQuestion.content}</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {selectedQuestion.answers.map((answer) => (
                  <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-2">
                      {answer.isAnonymous ? 'Anonymous' : answer.username} • {
                        new Date(answer.timestamp).toLocaleDateString()
                      }
                    </p>
                    <p className="text-gray-700">{answer.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleSubmitResponse(selectedQuestion.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a question to view and respond
          </div>
        )}
      </div>
    </div>
  );
};

export default QAViewer;
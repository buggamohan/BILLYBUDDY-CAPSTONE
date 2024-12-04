import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Question, Answer } from '../types';
import { qaService } from '../services/qaService';

const QASection: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', isAnonymous: false });
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState({ content: '', isAnonymous: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await qaService.getAllQuestions();
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const question = await qaService.addQuestion({
        userId: user.id,
        username: newQuestion.isAnonymous ? 'Anonymous' : user.username,
        title: newQuestion.title,
        content: newQuestion.content,
        isAnonymous: newQuestion.isAnonymous
      });

      setQuestions([question, ...questions]);
      setNewQuestion({ title: '', content: '', isAnonymous: false });
    } catch (err) {
      setError('Failed to submit question');
    }
  };

  const handleAnswerSubmit = async (questionId: string) => {
    if (!user || !selectedQuestion) return;

    try {
      const answer = await qaService.addAnswer(questionId, {
        userId: user.id,
        username: newAnswer.isAnonymous ? 'Anonymous' : user.username,
        content: newAnswer.content,
        isAnonymous: newAnswer.isAnonymous
      });

      const updatedQuestions = questions.map(q =>
        q.id === questionId
          ? { ...q, answers: [...q.answers, answer] }
          : q
      );

      setQuestions(updatedQuestions);
      setNewAnswer({ content: '', isAnonymous: false });
    } catch (err) {
      setError('Failed to submit answer');
    }
  };

  const handleLikeAnswer = async (questionId: string, answerId: string) => {
    if (!user) return;

    try {
      await qaService.likeAnswer(questionId, answerId);
      const updatedQuestions = questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map(a =>
                a.id === answerId
                  ? { ...a, likes: a.likes + 1 }
                  : a
              )
            }
          : q
      );
      setQuestions(updatedQuestions);
    } catch (err) {
      setError('Failed to like answer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Q&A Community</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {user && (
          <form onSubmit={handleQuestionSubmit} className="mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="What would you like to ask?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Provide more context about your question..."
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newQuestion.isAnonymous}
                  onChange={(e) => setNewQuestion({ ...newQuestion, isAnonymous: e.target.checked })}
                  className="rounded text-indigo-600"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600">
                  Post anonymously
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ask Question
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{question.title}</h3>
                  <p className="text-sm text-gray-500">
                    Asked by {question.username} • {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedQuestion(selectedQuestion?.id === question.id ? null : question)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {question.answers.length} answers
                </button>
              </div>
              <p className="text-gray-700 mb-4">{question.content}</p>
              
              {selectedQuestion?.id === question.id && (
                <div className="mt-4 space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Answers</h4>
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-500">
                            {answer.username} • {new Date(answer.timestamp).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleLikeAnswer(question.id, answer.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-indigo-600"
                              disabled={!user}
                            >
                              <ThumbsUp size={16} />
                              <span>{answer.likes}</span>
                            </button>
                            <button className="text-gray-500 hover:text-indigo-600">
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700">{answer.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  {user && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Add an Answer</h4>
                      <div className="space-y-4">
                        <textarea
                          value={newAnswer.content}
                          onChange={(e) => setNewAnswer({ ...newAnswer, content: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                          placeholder="Share your experience or advice..."
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`anonymous-answer-${question.id}`}
                              checked={newAnswer.isAnonymous}
                              onChange={(e) => setNewAnswer({ ...newAnswer, isAnonymous: e.target.checked })}
                              className="rounded text-indigo-600"
                            />
                            <label htmlFor={`anonymous-answer-${question.id}`} className="text-sm text-gray-600">
                              Answer anonymously
                            </label>
                          </div>
                          <button
                            onClick={() => handleAnswerSubmit(question.id)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Submit Answer
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QASection;
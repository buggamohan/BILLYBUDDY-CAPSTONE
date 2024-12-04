import React, { useState, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { ChatMessage as ChatMessageType, Report } from '../types';
import { v4 as uuidv4 } from 'uuid';
import LocationPicker from './LocationPicker';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const { addReport } = useData();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState({
    name: '',
    age: 0,
    location: null,
    bullyingType: '',
    perpetratorInfo: {
      platform: '',
      username: '',
      profileUrl: '',
      realName: '',
      approximateAge: '',
      additionalDetails: ''
    },
    evidenceLinks: [] as string[],
    isAnonymous: false,
    severity: 'medium' as const
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(
        "Hi! I'm here to help you report cyberbullying incidents safely and anonymously. Would you like to remain anonymous?",
        ["Yes, keep me anonymous", "No, I'll provide my name"]
      );
    }
  }, []);

  const addBotMessage = (text: string, options?: string[]) => {
    setMessages(prev => [...prev, {
      id: uuidv4(),
      text,
      sender: 'bot',
      type: options ? 'options' : undefined,
      options
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: uuidv4(),
      text,
      sender: 'user'
    }]);
  };

  const handleLocationSelect = (location: any) => {
    setReportData(prev => ({ ...prev, location }));
    setShowLocationPicker(false);
    addUserMessage(`Selected location: ${location.city}, ${location.state}`);
    addBotMessage(
      "What type of cyberbullying are you experiencing?",
      [
        "Harassment",
        "Cyberstalking",
        "Impersonation",
        "Hate Speech",
        "Threats",
        "Other"
      ]
    );
    setCurrentStep(3);
  };

  const handleSubmitReport = async (reportData: any) => {
    try {
      setError(null);
      if (!user && !reportData.isAnonymous) {
        throw new Error('You must be logged in to submit a non-anonymous report');
      }

      const report: Omit<Report, 'id' | 'status' | 'timestamp'> = {
        ...reportData,
        userId: user?.id || 'anonymous',
        severity: reportData.evidenceLinks.length > 0 ? 'high' : 'medium'
      };

      await addReport(report);
      addBotMessage(
        "Thank you for your report. It has been submitted and will be reviewed by our team. Would you like to learn about some safety measures you can take?",
        ["Yes, show me safety tips", "No, thank you"]
      );
      setCurrentStep(-1);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit report');
      addBotMessage("I'm sorry, there was an error submitting your report. Please try again or contact support.");
    }
  };

  const handleNextStep = async (userInput: string) => {
    addUserMessage(userInput);

    switch (currentStep) {
      case 0:
        setReportData(prev => ({ ...prev, isAnonymous: userInput.toLowerCase().includes('yes') }));
        if (userInput.toLowerCase().includes('yes')) {
          addBotMessage("I understand. Your identity will be kept anonymous. What's your age?");
        } else {
          addBotMessage("Thank you for your trust. What's your name?");
        }
        setCurrentStep(1);
        break;

      case 1:
        if (reportData.isAnonymous) {
          const age = parseInt(userInput);
          if (isNaN(age) || age < 1) {
            addBotMessage("Please provide a valid age.");
            return;
          }
          setReportData(prev => ({ ...prev, age }));
          addBotMessage("Please select your location on the map:");
          setShowLocationPicker(true);
        } else {
          setReportData(prev => ({ ...prev, name: userInput }));
          addBotMessage("Thank you. What's your age?");
          setCurrentStep(2);
        }
        break;

      case 2:
        const age = parseInt(userInput);
        if (isNaN(age) || age < 1) {
          addBotMessage("Please provide a valid age.");
          return;
        }
        setReportData(prev => ({ ...prev, age }));
        addBotMessage("Please select your location on the map:");
        setShowLocationPicker(true);
        break;

      case 3:
        setReportData(prev => ({ ...prev, bullyingType: userInput }));
        addBotMessage("On which platform did this occur? (e.g., Instagram, Facebook, WhatsApp)");
        setCurrentStep(4);
        break;

      case 4:
        setReportData(prev => ({
          ...prev,
          perpetratorInfo: { ...prev.perpetratorInfo, platform: userInput }
        }));
        addBotMessage("Do you know the username or profile of the person? If yes, please share it (it's okay if you don't)");
        setCurrentStep(5);
        break;

      case 5:
        setReportData(prev => ({
          ...prev,
          perpetratorInfo: { ...prev.perpetratorInfo, username: userInput }
        }));
        addBotMessage("Do you have any evidence like screenshots or links? Please share them (separate multiple links with commas):");
        setCurrentStep(6);
        break;

      case 6:
        const evidenceLinks = userInput.split(',').map(link => link.trim()).filter(Boolean);
        await handleSubmitReport({
          ...reportData,
          evidenceLinks
        });
        break;

      case -1:
        if (userInput.toLowerCase().includes('yes')) {
          addBotMessage(`Here are some important safety tips:
            1. Block and report the harasser on the platform
            2. Save evidence of harassment (screenshots, messages)
            3. Talk to someone you trust about what's happening
            4. Consider adjusting your privacy settings
            5. Take breaks from social media if needed
            
            Remember, you're not alone in this. Would you like to see more resources?`);
        } else {
          addBotMessage("Thank you for reporting. Stay safe!");
          setTimeout(onClose, 3000);
        }
        break;
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-lg border">
      <div className="bg-indigo-600 text-white p-4 flex items-center gap-2">
        <Shield size={24} />
        <h2 className="font-semibold">Report Cyberbullying Incident</h2>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onOptionSelect={handleNextStep}
          />
        ))}
        {showLocationPicker && (
          <div className="w-full">
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleNextStep}
        disabled={showLocationPicker}
      />
    </div>
  );
};

export default ChatBot;
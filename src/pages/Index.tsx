
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ThinkingAnimation from '../components/ThinkingAnimation';

interface ChatHistoryItem {
  id: string;
  type: 'user' | 'agent' | 'job_spec';
  message: string;
  timestamp: Date;
}

interface ProcessingStep {
  id: string;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isProcessing, processingSteps]);

  const mapMessageToStep = (message: string): string => {
    if (message.includes('transcribe')) return '✅ Transcribing audio...';
    if (message.includes('generate_job_spec')) return '🧠 Generating job spec...';
    if (message.includes('tavily_search')) return '🔍 Searching for supporting data...';
    return message;
  };

  const simulateAgentProcess = async (userMessage: string) => {
    setIsProcessing(true);
    setProcessingSteps([]);

    // Simulate real-time agent steps
    const steps = [
      { text: '🧠 Analyzing your request...', delay: 1000 },
      { text: '🔍 Searching for industry standards...', delay: 2000 },
      { text: '✍️ Crafting job specification...', delay: 3000 },
    ];

    for (const [index, step] of steps.entries()) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProcessingSteps(prev => [
        ...prev,
        { id: `step-${index}`, text: step.text, completed: false }
      ]);
    }

    // Simulate final job spec generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockJobSpec = `# ${userMessage.includes('developer') || userMessage.includes('engineer') ? 'Senior Software Engineer' : 'Job Title'}

## About the Role
We are seeking a talented professional to join our dynamic team. This role offers an excellent opportunity to work on cutting-edge projects and make a significant impact.

## Key Responsibilities
- Lead and execute strategic initiatives
- Collaborate with cross-functional teams
- Drive innovation and continuous improvement
- Mentor junior team members

## Requirements
- Bachelor's degree in relevant field
- 3+ years of professional experience
- Strong problem-solving skills
- Excellent communication abilities

## What We Offer
- Competitive salary and benefits
- Flexible working arrangements
- Professional development opportunities
- Collaborative team environment

## Apply Now
Ready to take the next step in your career? We'd love to hear from you!`;

    setIsProcessing(false);
    setProcessingSteps([]);

    const newJobSpec: ChatHistoryItem = {
      id: `job-spec-${Date.now()}`,
      type: 'job_spec',
      message: mockJobSpec,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, newJobSpec]);
  };

  const handleSendMessage = async (message: string, audioBlob?: Blob) => {
    const newMessage: ChatHistoryItem = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: audioBlob ? 'Voice message (transcribed): ' + message : message,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, newMessage]);

    // Simulate processing
    await simulateAgentProcess(message);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            Outscout AI Job Spec Generator
          </h1>
          <p className="text-gray-600 mt-1">
            Describe any role and get a complete job specification in seconds
          </p>
        </div>
      </header>

      {/* Chat History */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 pb-32"
      >
        <div className="max-w-4xl mx-auto">
          {chatHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Let's create your job specification
              </h2>
              <p className="text-gray-600">
                Simply describe the role or provide a job title to get started
              </p>
            </div>
          )}

          {chatHistory.map((item) => (
            <ChatMessage
              key={item.id}
              message={item.message}
              isUser={item.type === 'user'}
              isJobSpec={item.type === 'job_spec'}
            />
          ))}

          {isProcessing && <ThinkingAnimation steps={processingSteps} />}
        </div>
      </div>

      {/* Input Bar */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isProcessing}
      />
    </div>
  );
};

export default Index;

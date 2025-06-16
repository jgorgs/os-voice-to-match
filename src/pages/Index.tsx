import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ThinkingAnimation from '../components/ThinkingAnimation';
import { supabase } from "@/integrations/supabase/client";
import { uploadAudioFile } from '../utils/audioUpload';

interface ChatHistoryItem {
  id: string;
  type: 'user' | 'agent' | 'job_spec';
  message: string;
  timestamp: Date;
  file?: File;
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
  const simulateAgentProcess = async (userMessage: string, hasFile: boolean = false) => {
    setIsProcessing(true);
    setProcessingSteps([]);

    // Simulate real-time agent steps
    const steps = hasFile ? [{
      text: '📄 Processing uploaded file...',
      delay: 1000
    }, {
      text: '🧠 Analyzing content...',
      delay: 2000
    }, {
      text: '🔍 Searching for industry standards...',
      delay: 3000
    }, {
      text: '✍️ Crafting job specification...',
      delay: 4000
    }] : [{
      text: '🧠 Analyzing your request...',
      delay: 1000
    }, {
      text: '🔍 Searching for industry standards...',
      delay: 2000
    }, {
      text: '✍️ Crafting job specification...',
      delay: 3000
    }];
    for (const [index, step] of steps.entries()) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProcessingSteps(prev => [...prev, {
        id: `step-${index}`,
        text: step.text,
        completed: false
      }]);
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
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, newJobSpec]);
  };
  const handleSendMessage = async (message: string, audioBlob?: Blob, file?: File) => {
    let displayMessage = message;
    let audioFilePath: string | null = null;

    console.log('handleSendMessage called with:', { message, hasAudio: !!audioBlob, hasFile: !!file });

    // Handle audio upload if present (either recorded or uploaded audio file)
    if (audioBlob) {
      console.log('Processing audio blob, size:', audioBlob.size, 'type:', audioBlob.type);
      
      // Check if this is an uploaded audio file vs recorded audio
      const originalFileName = file?.name;
      displayMessage = originalFileName ? 
        `Audio file uploaded: ${originalFileName}` : 
        'Voice message recorded';
      
      audioFilePath = await uploadAudioFile(audioBlob, originalFileName);
      console.log('Audio upload result:', audioFilePath);
      
      if (!audioFilePath) {
        console.error('Failed to upload audio file');
        // Continue anyway, but without audio file reference
      }
    } else if (file) {
      displayMessage = `File uploaded: ${file.name}`;
    }

    const newMessage: ChatHistoryItem = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: displayMessage,
      timestamp: new Date(),
      file
    };

    setChatHistory(prev => [...prev, newMessage]);

    try {
      console.log('Saving to database:', { 
        user_input_text: displayMessage, 
        audio_file_path: audioFilePath 
      });

      // Save to Supabase
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_input_text: displayMessage,
          audio_file_path: audioFilePath
        })
        .select();

      if (error) {
        console.error('Error saving to database:', error);
      } else {
        console.log('Successfully saved to database:', data);
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }

    // Simulate processing
    await simulateAgentProcess(message, !!file || !!audioBlob);
  };
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-center">
          <h1 className="text-xl font-semibold text-foreground">
            Voice to Match by OutScout
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl mx-auto flex flex-col h-full">
          
          {/* Chat History Container */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto py-8 space-y-4 min-h-0">
            {chatHistory.length === 0 ? <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/lovable-uploads/11f6ac57-a7ba-40f1-b2de-24c3dfdeada5.png" 
                    alt="OutScout Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">Tell us the role and we'll turn it into a spec and search plan.</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">Just describe the role in your own words. We'll turn it into a polished job spec and suggest the best companies to target talent from. Speak naturally, we'll handle the rest.</p>
                </div>
              </div> : <>
                {chatHistory.map(item => <ChatMessage key={item.id} message={item.message} isUser={item.type === 'user'} isJobSpec={item.type === 'job_spec'} />)}
                {isProcessing && <ThinkingAnimation steps={processingSteps} />}
              </>}
          </div>

          {/* Input Section - Centered */}
          <div className="py-6">
            <ChatInput onSendMessage={handleSendMessage} disabled={isProcessing} />
          </div>
        </div>
      </div>
    </div>;
};

export default Index;

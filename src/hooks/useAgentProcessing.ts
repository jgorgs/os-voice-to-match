
import { useState } from 'react';

interface ProcessingStep {
  id: string;
  text: string;
  completed: boolean;
}

interface ChatHistoryItem {
  id: string;
  type: 'user' | 'agent' | 'job_spec';
  message: string;
  timestamp: Date;
  file?: File;
}

export const useAgentProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);

  const simulateAgentProcess = async (
    userMessage: string, 
    hasFile: boolean = false,
    onComplete: (jobSpec: ChatHistoryItem) => void
  ) => {
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

    onComplete(newJobSpec);
  };

  return {
    isProcessing,
    processingSteps,
    simulateAgentProcess
  };
};

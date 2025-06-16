
import React from 'react';
import { Check } from 'lucide-react';
import TypewriterEffect from './TypewriterEffect';

interface ProcessingStep {
  id: string;
  text: string;
  completed: boolean;
}

interface ProcessingStepsProps {
  steps: ProcessingStep[];
}

const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ steps }) => {
  const currentStep = steps.find(step => !step.completed);
  const completedSteps = steps.filter(step => step.completed);

  return (
    <div className="space-y-6">
      {/* Completed steps */}
      {completedSteps.map((step) => (
        <div key={step.id} className="flex items-center space-x-4 opacity-70">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
          <span className="text-foreground">{step.text}</span>
        </div>
      ))}
      
      {/* Current step with typewriter effect */}
      {currentStep && (
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <TypewriterEffect text={currentStep.text} />
        </div>
      )}
      
      {/* Pending steps */}
      {steps.filter(step => !step.completed && step.id !== currentStep?.id).map((step) => (
        <div key={step.id} className="flex items-center space-x-4 opacity-30">
          <div className="w-6 h-6 rounded-full border-2 border-muted" />
          <span className="text-muted-foreground">{step.text}</span>
        </div>
      ))}
    </div>
  );
};

export default ProcessingSteps;

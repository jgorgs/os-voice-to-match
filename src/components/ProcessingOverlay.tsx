
import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import ProcessingSteps from './ProcessingSteps';

interface ProcessingStep {
  id: string;
  text: string;
  completed: boolean;
}

interface ProcessingOverlayProps {
  steps: ProcessingStep[];
  isVisible: boolean;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ steps, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <AnimatedBackground />
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Creating your job spec and search plan
          </h2>
          <p className="text-muted-foreground">
            Our AI is working its magic to transform your input into a professional job specification
          </p>
        </div>
        
        <ProcessingSteps steps={steps} />
      </div>
    </div>
  );
};

export default ProcessingOverlay;

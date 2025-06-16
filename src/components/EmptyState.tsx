
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <img 
          src="/lovable-uploads/11f6ac57-a7ba-40f1-b2de-24c3dfdeada5.png" 
          alt="OutScout Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Explain the role and we'll build the plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Skip the intake doc. Just explain what you need, like you would in a kickoff call. We'll turn your voice note into a polished job spec and search plan.</p>
      </div>
    </div>
  );
};

export default EmptyState;

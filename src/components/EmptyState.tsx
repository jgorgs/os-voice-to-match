
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
      <div className="w-16 h-16 rounded-full overflow-hidden">
        <img 
          src="/lovable-uploads/16770f82-a00a-4b7b-bcbd-e71d02850860.png" 
          alt="OutScout Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Tell us the role and we'll turn it into a spec and search plan.</h2>
        <p className="text-muted-foreground max-w-md mx-auto">Just describe the role in your own words. We'll turn it into a polished job spec and suggest the best companies to target talent from. Speak naturally, we'll handle the rest.</p>
      </div>
    </div>
  );
};

export default EmptyState;

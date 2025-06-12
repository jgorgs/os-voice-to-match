
import React from 'react';

interface Step {
  id: string;
  text: string;
  completed: boolean;
}

interface ThinkingAnimationProps {
  steps: Step[];
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ steps }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-2xl bg-gray-100 rounded-2xl p-4">
        <div className="flex items-center mb-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="ml-3 text-sm text-gray-600 font-medium">Processing...</span>
        </div>
        
        {steps.length > 0 && (
          <div className="space-y-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-2">
                <span className="text-sm">{step.text}</span>
                {step.completed && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingAnimation;

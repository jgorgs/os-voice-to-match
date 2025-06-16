
import React, { useState } from 'react';
import JobSpecPanel from './JobSpecPanel';
import SearchPlanPanel from './SearchPlanPanel';
import ResultsActions from './ResultsActions';

interface SplitViewLayoutProps {
  jobSpec: string;
  searchPlan: SearchPlan;
  isVisible: boolean;
  onEdit: () => void;
  onCopy: () => void;
  onJobSpecUpdate: (newJobSpec: string) => void;
}

interface SearchPlan {
  targetCompanies: string[];
  relevantTitles: string[];
  filters: {
    experience: string;
    location: string;
    salary: string;
    skills: string[];
  };
}

const SplitViewLayout: React.FC<SplitViewLayoutProps> = ({
  jobSpec,
  searchPlan,
  isVisible,
  onEdit,
  onCopy,
  onJobSpecUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentJobSpec, setCurrentJobSpec] = useState(jobSpec);

  if (!isVisible) return null;

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (newJobSpec: string) => {
    setCurrentJobSpec(newJobSpec);
    onJobSpecUpdate(newJobSpec);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCopy = () => {
    const fullContent = `${currentJobSpec}\n\n--- SEARCH PLAN ---\n\nTarget Companies: ${searchPlan.targetCompanies.join(', ')}\n\nRelevant Titles: ${searchPlan.relevantTitles.join(', ')}\n\nFilters:\n- Experience: ${searchPlan.filters.experience}\n- Location: ${searchPlan.filters.location}\n- Salary: ${searchPlan.filters.salary}\n- Skills: ${searchPlan.filters.skills.join(', ')}`;
    
    navigator.clipboard.writeText(fullContent);
    onCopy();
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Voice to Match by OutScout
          </h1>
          <ResultsActions 
            isEditing={isEditing}
            onEdit={handleStartEdit}
            onCopy={handleCopy}
            onSave={() => {}} // This will be handled by JobSpecPanel
            onCancel={handleCancelEdit}
          />
        </div>
      </header>

      {/* Split View Content */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <JobSpecPanel 
          jobSpec={currentJobSpec} 
          isEditing={isEditing}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
        <SearchPlanPanel searchPlan={searchPlan} />
      </div>
    </div>
  );
};

export default SplitViewLayout;

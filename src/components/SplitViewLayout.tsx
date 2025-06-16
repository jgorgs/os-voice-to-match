
import React from 'react';
import JobSpecPanel from './JobSpecPanel';
import SearchPlanPanel from './SearchPlanPanel';
import ResultsActions from './ResultsActions';

interface SplitViewLayoutProps {
  jobSpec: string;
  searchPlan: SearchPlan;
  isVisible: boolean;
  onEdit: () => void;
  onCopy: () => void;
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
  onCopy
}) => {
  if (!isVisible) return null;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">
            Voice to Match by OutScout
          </h1>
          <ResultsActions onEdit={onEdit} onCopy={onCopy} />
        </div>
      </header>

      {/* Split View Content */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <JobSpecPanel jobSpec={jobSpec} />
        <SearchPlanPanel searchPlan={searchPlan} />
      </div>
    </div>
  );
};

export default SplitViewLayout;

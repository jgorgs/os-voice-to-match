
import React from 'react';
import { Search, Building, User, Filter } from 'lucide-react';

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

interface SearchPlanPanelProps {
  searchPlan: SearchPlan;
}

const SearchPlanPanel: React.FC<SearchPlanPanelProps> = ({ searchPlan }) => {
  return (
    <div className="flex-1">
      <div className="p-8 h-full overflow-y-auto">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Search size={20} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Search Plan</h2>
        </div>
        
        <div className="space-y-8">
          {/* Target Companies */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building size={16} className="text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">Target Companies</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {searchPlan.targetCompanies.map((company, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <span className="text-sm text-foreground">{company}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Titles */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <User size={16} className="text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">Relevant Titles</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchPlan.relevantTitles.map((title, index) => (
                <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {title}
                </span>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Filter size={16} className="text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">Search Filters</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-foreground">Experience:</span>
                <span className="ml-2 text-sm text-muted-foreground">{searchPlan.filters.experience}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Location:</span>
                <span className="ml-2 text-sm text-muted-foreground">{searchPlan.filters.location}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Salary Range:</span>
                <span className="ml-2 text-sm text-muted-foreground">{searchPlan.filters.salary}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Key Skills:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {searchPlan.filters.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-foreground rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPlanPanel;

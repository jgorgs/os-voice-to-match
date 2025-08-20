import React, { useState, useEffect } from 'react';
import { Database, Globe, Users, FileText, CheckCircle } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  skillsMatch: number;
  experienceMatch: number;
  location: string;
  summary: string;
  source: 'outscout' | 'pdl';
}

interface ParallelSearchViewProps {
  onComplete: () => void;
  searchPlan: any;
}

const ParallelSearchView: React.FC<ParallelSearchViewProps> = ({ onComplete, searchPlan }) => {
  const [outscoutProgress, setOutscoutProgress] = useState(0);
  const [pdlProgress, setPdlProgress] = useState(0);
  const [outscoutCandidates, setOutscoutCandidates] = useState<Candidate[]>([]);
  const [pdlCandidates, setPdlCandidates] = useState<Candidate[]>([]);
  const [showResults, setShowResults] = useState(false);

  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior Software Engineer',
      company: 'Google',
      skillsMatch: 92,
      experienceMatch: 88,
      location: 'San Francisco, CA',
      summary: 'Full-stack engineer with 6 years experience in React, Node.js, and cloud architecture.',
      source: 'outscout'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'Staff Engineer',
      company: 'Netflix',
      skillsMatch: 89,
      experienceMatch: 95,
      location: 'Remote',
      summary: 'Technical leader specializing in distributed systems and microservices architecture.',
      source: 'pdl'
    },
    {
      id: '3',
      name: 'Emily Watson',
      title: 'Principal Engineer',
      company: 'Stripe',
      skillsMatch: 87,
      experienceMatch: 92,
      location: 'New York, NY',
      summary: 'Infrastructure engineer with expertise in payment systems and scalable backend services.',
      source: 'outscout'
    },
    {
      id: '4',
      name: 'David Kim',
      title: 'Senior Developer',
      company: 'Uber',
      skillsMatch: 85,
      experienceMatch: 86,
      location: 'Seattle, WA',
      summary: 'Mobile and web developer with strong background in React Native and TypeScript.',
      source: 'pdl'
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      title: 'Tech Lead',
      company: 'Airbnb',
      skillsMatch: 83,
      experienceMatch: 89,
      location: 'San Francisco, CA',
      summary: 'Frontend specialist with team leadership experience and design system expertise.',
      source: 'outscout'
    }
  ];

  useEffect(() => {
    // OutScout search simulation
    const outscoutInterval = setInterval(() => {
      setOutscoutProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 100);
        if (newProgress >= 100) {
          clearInterval(outscoutInterval);
          setOutscoutCandidates(mockCandidates.filter(c => c.source === 'outscout'));
        }
        return newProgress;
      });
    }, 300);

    // PDL search simulation (slightly slower)
    const pdlInterval = setInterval(() => {
      setPdlProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 12, 100);
        if (newProgress >= 100) {
          clearInterval(pdlInterval);
          setPdlCandidates(mockCandidates.filter(c => c.source === 'pdl'));
        }
        return newProgress;
      });
    }, 400);

    return () => {
      clearInterval(outscoutInterval);
      clearInterval(pdlInterval);
    };
  }, []);

  useEffect(() => {
    if (outscoutProgress >= 100 && pdlProgress >= 100) {
      setTimeout(() => {
        setShowResults(true);
      }, 1000);
    }
  }, [outscoutProgress, pdlProgress]);

  const allCandidates = [...outscoutCandidates, ...pdlCandidates]
    .sort((a, b) => (b.skillsMatch + b.experienceMatch) - (a.skillsMatch + a.experienceMatch));

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-100';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-100';
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              Search Results - {allCandidates.length} Candidates Found
            </h1>
            <Button onClick={onComplete} className="flex items-center gap-2">
              <CheckCircle size={16} />
              Complete Search
            </Button>
          </div>
        </header>

        <div className="container max-w-6xl mx-auto py-8">
          <div className="grid gap-4">
            {allCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {candidate.source === 'outscout' ? 'OutScout DB' : 'People Data Labs'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">
                      {candidate.title} at {candidate.company}
                    </p>
                    <p className="text-muted-foreground text-sm">{candidate.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getScoreColor(candidate.skillsMatch)}`}>
                      Skills: {candidate.skillsMatch}%
                    </Badge>
                    <Badge className={`text-xs ${getScoreColor(candidate.experienceMatch)}`}>
                      Experience: {candidate.experienceMatch}%
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{candidate.summary}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText size={14} className="mr-1" />
                      View CV
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Overall Match: {Math.round((candidate.skillsMatch + candidate.experienceMatch) / 2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Searching for Candidates
          </h2>
          <p className="text-muted-foreground">
            Running parallel searches across our networks to find the best matches
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* OutScout Search */}
          <div className="bg-card rounded-lg border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Database size={24} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">OutScout Database</h3>
                <p className="text-sm text-muted-foreground">Internal curated network</p>
              </div>
            </div>

            <Progress value={outscoutProgress} className="mb-4" />
            
            <div className="space-y-2 text-sm">
              <div className={`flex items-center gap-2 ${outscoutProgress > 20 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {outscoutProgress > 20 && <CheckCircle size={14} className="text-green-500" />}
                <span>Scanning verified profiles...</span>
              </div>
              <div className={`flex items-center gap-2 ${outscoutProgress > 60 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {outscoutProgress > 60 && <CheckCircle size={14} className="text-green-500" />}
                <span>Matching skills and experience...</span>
              </div>
              <div className={`flex items-center gap-2 ${outscoutProgress >= 100 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {outscoutProgress >= 100 && <CheckCircle size={14} className="text-green-500" />}
                <span>Found {outscoutCandidates.length} candidates</span>
              </div>
            </div>
          </div>

          {/* People Data Labs Search */}
          <div className="bg-card rounded-lg border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Globe size={24} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">People Data Labs</h3>
                <p className="text-sm text-muted-foreground">Global professional database</p>
              </div>
            </div>

            <Progress value={pdlProgress} className="mb-4" />
            
            <div className="space-y-2 text-sm">
              <div className={`flex items-center gap-2 ${pdlProgress > 25 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {pdlProgress > 25 && <CheckCircle size={14} className="text-green-500" />}
                <span>Searching global network...</span>
              </div>
              <div className={`flex items-center gap-2 ${pdlProgress > 65 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {pdlProgress > 65 && <CheckCircle size={14} className="text-green-500" />}
                <span>Filtering by criteria...</span>
              </div>
              <div className={`flex items-center gap-2 ${pdlProgress >= 100 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {pdlProgress >= 100 && <CheckCircle size={14} className="text-green-500" />}
                <span>Found {pdlCandidates.length} candidates</span>
              </div>
            </div>
          </div>
        </div>

        {(outscoutProgress >= 100 && pdlProgress >= 100) && (
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <CheckCircle size={20} />
              <span className="font-medium">Search Complete!</span>
            </div>
            <p className="text-muted-foreground">Preparing results...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParallelSearchView;
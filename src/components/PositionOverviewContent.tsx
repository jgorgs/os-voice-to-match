import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThumbsUp, Check, X, Ban, ChevronRight, ChevronDown, Settings, RefreshCw } from 'lucide-react';
import { useJobSpecification } from '@/hooks/useJobSpecification';
import { useCandidateMatches } from '@/hooks/useCandidateMatches';
import { useCandidateFeedback } from '@/hooks/useCandidateFeedback';
import { JobSpecification, CandidateMatch, CandidateStatus } from '@/types/workflow';
import { useToast } from '@/hooks/use-toast';

interface PositionOverviewContentProps {
  positionId: string;
}

const PositionOverviewContent: React.FC<PositionOverviewContentProps> = ({ positionId }) => {
  const { toast } = useToast();
  
  const [jobSpec, setJobSpec] = useState<JobSpecification | null>(null);
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [isParametersOpen, setIsParametersOpen] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  
  const { loadJobSpec } = useJobSpecification();
  const { loadCandidateMatches } = useCandidateMatches();
  const { submitFeedback } = useCandidateFeedback();

  useEffect(() => {
    if (positionId) {
      loadData(positionId);
    }
  }, [positionId]);

  const loadData = async (id: string) => {
    try {
      const [jobSpecData, candidatesData] = await Promise.all([
        loadJobSpec(id),
        loadCandidateMatches(id)
      ]);
      
      if (jobSpecData) setJobSpec(jobSpecData);
      if (candidatesData) setCandidates(candidatesData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load position data",
        variant: "destructive"
      });
    }
  };

  const getStatusProgress = (status: string) => {
    const statusMap = { draft: 25, confirmed: 50, searching: 75, completed: 100 };
    return statusMap[status as keyof typeof statusMap] || 0;
  };

  const getStatusSteps = (status: string) => {
    const steps = ['Draft', 'Ready', 'Candidates Found', 'Active'];
    const currentIndex = Math.floor(getStatusProgress(status) / 25) - 1;
    return steps.map((step, index) => ({
      label: step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const handleDecision = async (candidateId: string, decision: CandidateStatus, notes?: string) => {
    try {
      await submitFeedback(candidateId, jobSpec!.id, decision, notes);
      
      // Update local state
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? { ...c, status: decision } : c
      ));

      toast({
        title: "Feedback recorded",
        description: `Marked candidate as ${decision}`,
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to record feedback",
        variant: "destructive"
      });
    }
  };

  const toggleNotes = (candidateId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const getCandidatesByStatus = () => {
    const approved = candidates.filter(c => ['approved', 'interviewed'].includes(c.status));
    const rejected = candidates.filter(c => ['rejected'].includes(c.status));
    const pending = candidates.filter(c => c.status === 'pending');
    
    return { approved, rejected, pending };
  };

  const { approved, rejected, pending } = getCandidatesByStatus();
  const avgScore = candidates.length > 0 
    ? Math.round(candidates.reduce((acc, c) => acc + c.overall_score, 0) / candidates.length)
    : 0;

  if (!jobSpec) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {jobSpec.title} – {jobSpec.company_name}
              </h1>
              <p className="text-muted-foreground mt-1">
                Last Updated: {new Date(jobSpec.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              {getStatusSteps(jobSpec.status).map((step, index) => (
                <div key={step.label} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step.completed 
                      ? 'bg-primary text-primary-foreground' 
                      : step.current 
                        ? 'bg-primary/20 text-primary border-2 border-primary'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <ChevronRight className="w-4 h-4 mx-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <Progress value={getStatusProgress(jobSpec.status)} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-foreground">{candidates.length}</div>
                  <div className="text-sm text-muted-foreground">Candidates Found</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-foreground">{approved.length}</div>
                  <div className="text-sm text-muted-foreground">In Process</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-foreground">{avgScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Match Score</div>
                </CardContent>
              </Card>
            </div>

            {/* Candidate List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Candidates</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refine Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Approved Candidates */}
                  {approved.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-muted-foreground">APPROVED ({approved.length})</h3>
                      {approved.map(candidate => (
                        <CandidateRow 
                          key={candidate.id}
                          candidate={candidate}
                          onDecision={handleDecision}
                          expandedNotes={expandedNotes}
                          onToggleNotes={toggleNotes}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pending Candidates */}
                  {pending.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-muted-foreground">PENDING REVIEW ({pending.length})</h3>
                      {pending.map(candidate => (
                        <CandidateRow 
                          key={candidate.id}
                          candidate={candidate}
                          onDecision={handleDecision}
                          expandedNotes={expandedNotes}
                          onToggleNotes={toggleNotes}
                        />
                      ))}
                    </div>
                  )}

                  {/* Rejected Candidates */}
                  {rejected.length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between text-muted-foreground">
                          <span>REJECTED ({rejected.length})</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3 mt-3 opacity-60">
                        {rejected.map(candidate => (
                          <CandidateRow 
                            key={candidate.id}
                            candidate={candidate}
                            onDecision={handleDecision}
                            expandedNotes={expandedNotes}
                            onToggleNotes={toggleNotes}
                            disabled
                          />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Collapsible Parameters */}
          <div className="w-80">
            <Collapsible open={isParametersOpen} onOpenChange={setIsParametersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Search Parameters
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isParametersOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <Card className="mt-4">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Role Requirements</h4>
                      <p className="text-sm text-muted-foreground">{jobSpec.short_description}</p>
                    </div>
                    
                    {jobSpec.primary_skills && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Primary Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {jobSpec.primary_skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {jobSpec.experience_years_min && jobSpec.experience_years_max && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Experience</h4>
                        <p className="text-sm text-muted-foreground">
                          {jobSpec.experience_years_min}-{jobSpec.experience_years_max} years
                        </p>
                      </div>
                    )}
                    
                    {jobSpec.preferred_location && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Location</h4>
                        <p className="text-sm text-muted-foreground">{jobSpec.preferred_location}</p>
                      </div>
                    )}
                    
                    <Button variant="outline" size="sm" className="w-full">
                      Edit Parameters
                    </Button>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CandidateRowProps {
  candidate: CandidateMatch;
  onDecision: (candidateId: string, decision: CandidateStatus, notes?: string) => void;
  expandedNotes: Set<string>;
  onToggleNotes: (candidateId: string) => void;
  disabled?: boolean;
}

const CandidateRow: React.FC<CandidateRowProps> = ({
  candidate,
  onDecision,
  expandedNotes,
  onToggleNotes,
  disabled = false
}) => {
  const [notes, setNotes] = useState('');
  const isNotesExpanded = expandedNotes.has(candidate.id);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  // Extract candidate details from score_breakdown JSON
  const candidateData = candidate.score_breakdown as any;
  const candidateName = candidateData?.candidate_name || `Candidate #${candidate.candidate_id}`;
  const currentTitle = candidateData?.current_title || 'Software Engineer';
  const currentCompany = candidateData?.current_company || 'TechCorp';
  const skillsMatch = candidateData?.skills_match || [];

  return (
    <div className={`border rounded-lg p-4 ${disabled ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-foreground">{candidateName}</h4>
            <Badge className={`text-xs ${getScoreColor(candidate.overall_score)}`}>
              {Math.round(candidate.overall_score)}% Match
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">{currentTitle} at {currentCompany}</p>
          
          <div className="flex gap-2 mb-3">
            {skillsMatch.slice(0, 2).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs">
              {candidate.experience_score}% Exp Match
            </Badge>
          </div>
        </div>

        {!disabled && candidate.status === 'pending' && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDecision(candidate.id, 'approved')}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => onDecision(candidate.id, 'approved')}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm" 
              onClick={() => onDecision(candidate.id, 'rejected')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDecision(candidate.id, 'rejected')}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <Ban className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleNotes(candidate.id)}
          className="text-xs text-muted-foreground"
        >
          {isNotesExpanded ? 'Hide' : 'Add'} Notes
        </Button>
        
        {isNotesExpanded && (
          <div className="mt-2 space-y-2">
            <Textarea
              placeholder="Add feedback notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  onDecision(candidate.id, 'approved', notes);
                  setNotes('');
                  onToggleNotes(candidate.id);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  onDecision(candidate.id, 'rejected', notes);
                  setNotes('');
                  onToggleNotes(candidate.id);
                }}
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionOverviewContent;
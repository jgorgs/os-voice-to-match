import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Search, 
  Users,
  DollarSign,
  AlertTriangle,
  FileText,
  Mic
} from 'lucide-react';
import { EnhancedChatInput } from './EnhancedChatInput';
import { JobSpecConfirmation } from './JobSpecConfirmation';
import { useJobSpecification } from '@/hooks/useJobSpecification';
import { JobSpecification } from '@/types/workflow';
import { useToast } from '@/hooks/use-toast';

type WorkflowStep = 'input' | 'parsing' | 'confirmation' | 'searching' | 'results';

interface WorkflowManagerProps {
  onComplete?: (jobSpec: JobSpecification, results: any[]) => void;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('input');
  const [parsingProgress, setParsingProgress] = useState(0);
  const [searchProgress, setSearchProgress] = useState(0);
  const [mockResults, setMockResults] = useState<any[]>([]);
  
  const { 
    jobSpec, 
    isLoading, 
    createJobSpec, 
    updateJobSpec, 
    confirmJobSpec, 
    parseInputToJobSpec 
  } = useJobSpecification();
  
  const { toast } = useToast();


  const handleInput = useCallback(async (data: {
    text?: string;
    audioPath?: string;
    filePath?: string;
    hasFile?: boolean;
  }) => {
    setCurrentStep('parsing');
    setParsingProgress(0);

    // Create initial job spec
    const newJobSpec = await createJobSpec(
      'New Position', // Will be updated during parsing
      'Company Name', // Will be updated during parsing
      data.text,
      data.audioPath,
      data.filePath
    );

    if (!newJobSpec) {
      setCurrentStep('input');
      return;
    }

    // Simulate parsing progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setParsingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Mock AI parsing - in reality this would call an AI service
        setTimeout(async () => {
          if (data.text) {
            await parseInputToJobSpec(newJobSpec.id, data.text);
          }
          
          // Update with mock parsed data
          await updateJobSpec(newJobSpec.id, {
            title: data.text?.includes('engineer') ? 'Senior Software Engineer' : 
                   data.text?.includes('manager') ? 'Product Manager' : 'New Position',
            company_name: 'OutScout',
            short_description: data.text?.slice(0, 200) || 'Position parsed from input',
            primary_skills: ['JavaScript', 'React', 'TypeScript'],
            secondary_skills: ['Node.js', 'Python', 'AWS'],
            experience_years_min: 3,
            experience_years_max: 7,
            preferred_location: 'Remote',
            working_mode: 'Hybrid',
            salary_base_low: 80000,
            salary_base_high: 120000,
          });

          setCurrentStep('confirmation');
          toast({
            title: "Input parsed successfully",
            description: "Review the job specification below",
          });
        }, 1000);
      }
    }, 300);
  }, [createJobSpec, parseInputToJobSpec, updateJobSpec, toast]);

  const handleEdit = useCallback(async (updates: Partial<JobSpecification>) => {
    if (!jobSpec) return;
    await updateJobSpec(jobSpec.id, updates);
  }, [jobSpec, updateJobSpec]);

  const handleConfirm = useCallback(async (confirmation_notes?: string) => {
    if (!jobSpec) return;
    
    const confirmed = await confirmJobSpec(jobSpec.id, confirmation_notes);
    if (confirmed) {
      setCurrentStep('searching');
      setSearchProgress(0);
      
      // Simulate search process
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setSearchProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Generate mock candidate results
          const mockCandidates = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Candidate ${i + 1}`,
            title: 'Software Engineer',
            company: `Company ${String.fromCharCode(65 + (i % 26))}`,
            overall_score: Math.floor(Math.random() * 40) + 60, // 60-99
            skills_score: Math.floor(Math.random() * 30) + 70,
            experience_score: Math.floor(Math.random() * 30) + 70,
            location_score: Math.floor(Math.random() * 30) + 70,
            company_score: Math.floor(Math.random() * 30) + 70,
          }));

          setMockResults(mockCandidates);
          setCurrentStep('results');
          
          toast({
            title: "Search completed",
            description: `Found ${mockCandidates.length} candidates`,
          });
        }
      }, 200);
    }
  }, [jobSpec, confirmJobSpec, toast]);

  const handleBack = useCallback(() => {
    if (currentStep === 'confirmation') {
      setCurrentStep('input');
    } else if (currentStep === 'results') {
      setCurrentStep('confirmation');
    }
  }, [currentStep]);

  const getStepIndicator = () => {
    const steps = [
      { key: 'input', label: 'Input', icon: FileText },
      { key: 'parsing', label: 'Parsing', icon: Clock },
      { key: 'confirmation', label: 'Review', icon: CheckCircle },
      { key: 'searching', label: 'Search', icon: Search },
      { key: 'results', label: 'Results', icon: Users },
    ];

    const currentIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isActive ? 'border-primary bg-primary text-primary-foreground' :
                isCompleted ? 'border-green-500 bg-green-500 text-white' :
                'border-muted-foreground bg-background text-muted-foreground'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-muted-foreground/20'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  if (currentStep === 'input') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {getStepIndicator()}
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Let's Kick Off Your Search</h1>
          <p className="text-lg text-muted-foreground">
            Describe the position, upload a job description, or record your requirements
          </p>
        </div>

        <Card className="p-6">
          <EnhancedChatInput
            onSubmit={handleInput}
            disabled={isLoading}
          />
        </Card>

      </div>
    );
  }

  if (currentStep === 'parsing') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {getStepIndicator()}
        
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary animate-spin" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold">Processing Your Input</h2>
              <p className="text-muted-foreground mt-2">
                Our AI is analyzing and structuring your job requirements...
              </p>
            </div>
            
            <div className="space-y-2">
              <Progress value={parsingProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{parsingProgress}% complete</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === 'confirmation' && jobSpec) {
    return (
      <div className="space-y-8">
        {getStepIndicator()}
        
        <JobSpecConfirmation
          jobSpec={jobSpec}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          onBack={handleBack}
        />
      </div>
    );
  }

  if (currentStep === 'searching') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {getStepIndicator()}
        
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-primary animate-pulse" />
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold">Searching for Candidates</h2>
              <p className="text-muted-foreground mt-2">
                Searching our database and external sources for the best candidates...
              </p>
            </div>
            
            <div className="space-y-2">
              <Progress value={searchProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{searchProgress}% complete</p>
            </div>
            
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="space-y-8">
        {getStepIndicator()}
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Candidate Results</h2>
            <p className="text-muted-foreground">
              Found {mockResults.length} candidates matching your requirements
            </p>
          </div>
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Review
          </Button>
        </div>

        <div className="grid gap-4">
          {mockResults.map(candidate => (
            <Card key={candidate.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {candidate.title} at {candidate.company}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-3 text-sm">
                    <div>Skills: {candidate.skills_score}%</div>
                    <div>Experience: {candidate.experience_score}%</div>
                    <div>Location: {candidate.location_score}%</div>
                    <div>Company: {candidate.company_score}%</div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {candidate.overall_score}%
                  </div>
                  <Badge variant="outline">
                    Found via search
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
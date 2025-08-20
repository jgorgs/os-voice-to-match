import { useState } from 'react';

interface ProcessingStep {
  id: string;
  text: string;
  completed: boolean;
}

interface ChatHistoryItem {
  id: string;
  type: 'user' | 'agent' | 'job_spec';
  message: string;
  timestamp: Date;
  file?: File;
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

interface ProcessingResult {
  jobSpec: string;
  searchPlan: SearchPlan;
}

export const useAgentProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [showSplitView, setShowSplitView] = useState(false);
  const [showSearchPlan, setShowSearchPlan] = useState(false);
  const [showParallelSearch, setShowParallelSearch] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [searchPlanData, setSearchPlanData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const simulateAgentProcess = async (
    userMessage: string, 
    hasFile: boolean = false,
    onComplete: (jobSpec: ChatHistoryItem) => void
  ) => {
    setIsProcessing(true);
    setShowSplitView(false);
    setProcessingSteps([]);

    // Enhanced processing steps with your specific copy
    const steps = [
      { text: 'Translating your input...', delay: 1000 },
      { text: 'Identifying key responsibilities...', delay: 1500 },
      { text: 'Matching with peer companies...', delay: 1500 },
      { text: 'Cleaning up your job description...', delay: 1500 },
      { text: 'Finalizing search plan...', delay: 1000 }
    ];

    // Process each step with typewriter effect
    for (const [index, step] of steps.entries()) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      // Mark previous step as completed and add current step
      setProcessingSteps(prev => {
        const updated = [...prev];
        if (index > 0) {
          updated[index - 1] = { ...updated[index - 1], completed: true };
        }
        return [...updated, {
          id: `step-${index}`,
          text: step.text,
          completed: false
        }];
      });
    }

    // Complete final step
    setProcessingSteps(prev => 
      prev.map((step, index) => 
        index === steps.length - 1 ? { ...step, completed: true } : step
      )
    );

    // Generate enhanced job spec and search plan
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockJobSpec = generateJobSpec(userMessage);
    const mockSearchPlan = generateSearchPlan(userMessage);
    const enhancedSearchPlan = generateEnhancedSearchPlan(userMessage);

    setSearchPlanData(enhancedSearchPlan);
    setProcessingResult({ jobSpec: mockJobSpec, searchPlan: mockSearchPlan });
    setIsProcessing(false);
    setShowSearchPlan(true);

    // Still call the original callback for compatibility
    const newJobSpec: ChatHistoryItem = {
      id: `job-spec-${Date.now()}`,
      type: 'job_spec',
      message: mockJobSpec,
      timestamp: new Date()
    };

    onComplete(newJobSpec);
  };

  const updateJobSpec = (newJobSpec: string) => {
    if (processingResult) {
      setProcessingResult({
        ...processingResult,
        jobSpec: newJobSpec
      });
    }
  };

  const generateJobSpec = (userInput: string): string => {
    const isEngineer = userInput.toLowerCase().includes('engineer') || userInput.toLowerCase().includes('developer');
    const isDesigner = userInput.toLowerCase().includes('designer');
    const isMarketing = userInput.toLowerCase().includes('marketing');
    
    if (isEngineer) {
      return `# Senior Software Engineer

## About the Role
We are seeking a talented Senior Software Engineer to join our growing engineering team. This role offers an exciting opportunity to work on cutting-edge projects, architect scalable solutions, and mentor junior developers.

## Key Responsibilities
- Design and develop high-quality, scalable software solutions
- Collaborate with cross-functional teams including product, design, and QA
- Lead technical discussions and code reviews
- Mentor junior engineers and contribute to team growth
- Drive technical innovation and best practices

## Requirements
- Bachelor's degree in Computer Science or related field
- 5+ years of professional software development experience
- Strong proficiency in modern programming languages (Python, JavaScript, Go, etc.)
- Experience with cloud platforms (AWS, GCP, Azure)
- Excellent problem-solving and communication skills

## What We Offer
- Competitive salary and equity package
- Flexible remote work options
- Professional development budget
- Comprehensive health benefits
- Collaborative and innovative team environment

## Apply Now
Ready to take your engineering career to the next level? We'd love to hear from you!`;
    } else if (isDesigner) {
      return `# Senior Product Designer

## About the Role
We are looking for a Senior Product Designer to lead design initiatives and create exceptional user experiences. You'll work closely with product and engineering teams to bring innovative solutions to life.

## Key Responsibilities
- Lead end-to-end design process from research to implementation
- Create wireframes, prototypes, and high-fidelity designs
- Collaborate with product managers and engineers
- Conduct user research and usability testing
- Maintain and evolve our design system

## Requirements
- Bachelor's degree in Design, HCI, or related field
- 4+ years of product design experience
- Proficiency in Figma, Sketch, and prototyping tools
- Strong portfolio demonstrating UX/UI skills
- Experience with design systems and user research

## What We Offer
- Competitive compensation package
- Creative freedom and autonomy
- Professional growth opportunities
- Modern design tools and resources
- Collaborative team environment

## Apply Now
Join us in creating beautiful, user-centered experiences!`;
    } else {
      return `# ${userInput.includes('marketing') ? 'Marketing Manager' : 'Professional Role'}

## About the Role
We are seeking a dedicated professional to join our dynamic team. This role offers an excellent opportunity to make a significant impact while working on exciting projects.

## Key Responsibilities
- Lead strategic initiatives and drive results
- Collaborate with cross-functional teams
- Develop and execute comprehensive plans
- Analyze performance metrics and optimize processes
- Mentor team members and foster growth

## Requirements
- Bachelor's degree in relevant field
- 3+ years of professional experience
- Strong analytical and communication skills
- Proven track record of success
- Ability to work in fast-paced environment

## What We Offer
- Competitive salary and benefits
- Flexible working arrangements
- Professional development opportunities
- Collaborative team environment
- Growth potential

## Apply Now
Ready to take the next step in your career? We'd love to hear from you!`;
    }
  };

  const generateSearchPlan = (userInput: string): SearchPlan => {
    const isEngineer = userInput.toLowerCase().includes('engineer') || userInput.toLowerCase().includes('developer');
    const isDesigner = userInput.toLowerCase().includes('designer');
    
    if (isEngineer) {
      return {
        targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Uber', 'Airbnb', 'Stripe'],
        relevantTitles: ['Senior Software Engineer', 'Staff Engineer', 'Principal Engineer', 'Tech Lead', 'Senior Developer', 'Software Architect'],
        filters: {
          experience: '5+ years',
          location: 'Remote, San Francisco, New York, Seattle',
          salary: '$150,000 - $250,000',
          skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'System Design']
        }
      };
    } else if (isDesigner) {
      return {
        targetCompanies: ['Apple', 'Google', 'Meta', 'Airbnb', 'Uber', 'Netflix', 'Spotify', 'Adobe', 'Figma', 'Linear'],
        relevantTitles: ['Senior Product Designer', 'Principal Designer', 'Design Lead', 'UX Designer', 'Product Design Manager'],
        filters: {
          experience: '4+ years',
          location: 'Remote, San Francisco, New York, Los Angeles',
          salary: '$120,000 - $200,000',
          skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems', 'UI/UX', 'Adobe Creative Suite']
        }
      };
    } else {
      return {
        targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Tesla', 'Salesforce', 'LinkedIn', 'Twitter', 'Zoom'],
        relevantTitles: ['Senior Manager', 'Director', 'Team Lead', 'Principal', 'Senior Specialist', 'Head of'],
        filters: {
          experience: '3+ years',
          location: 'Remote, Major US Cities',
          salary: '$100,000 - $180,000',
          skills: ['Leadership', 'Strategy', 'Analytics', 'Communication', 'Project Management', 'Cross-functional Collaboration']
        }
      };
    }
  };

  const confirmSearchPlan = (updatedPlan: any) => {
    setSearchPlanData(updatedPlan);
    setShowSearchPlan(false);
    setShowParallelSearch(true);
  };

  const startParallelSearch = () => {
    setShowSearchPlan(false);
    setShowParallelSearch(true);
  };

  const generateEnhancedSearchPlan = (userInput: string) => {
    const basicPlan = generateSearchPlan(userInput);
    return {
      jobSummary: `Looking for a ${userInput.toLowerCase().includes('senior') ? 'senior' : ''} professional with expertise in the specified areas. This role offers growth opportunities and competitive compensation.`,
      ...basicPlan,
      weights: {
        skills: 70,
        experience: 25,
        location: 5
      }
    };
  };

  const resetProcessing = () => {
    setIsProcessing(false);
    setShowSplitView(false);
    setShowSearchPlan(false);
    setShowParallelSearch(false);
    setProcessingSteps([]);
    setProcessingResult(null);
    setSearchPlanData(null);
    setSearchResults([]);
  };

  return {
    isProcessing,
    processingSteps,
    showSplitView,
    showSearchPlan,
    showParallelSearch,
    processingResult,
    searchPlanData,
    searchResults,
    simulateAgentProcess,
    resetProcessing,
    updateJobSpec,
    confirmSearchPlan,
    startParallelSearch
  };
};

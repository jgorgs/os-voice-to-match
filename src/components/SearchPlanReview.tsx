import React, { useState } from 'react';
import { Check, ArrowLeft, Edit3, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';

interface SearchPlan {
  jobSummary: string;
  targetCompanies: string[];
  relevantTitles: string[];
  filters: {
    experience: string;
    location: string;
    salary: string;
    skills: string[];
  };
  weights: {
    skills: number;
    experience: number;
    location: number;
  };
}

interface SearchPlanReviewProps {
  searchPlan: SearchPlan;
  onConfirm: (updatedPlan: SearchPlan) => void;
  onBack: () => void;
}

const SearchPlanReview: React.FC<SearchPlanReviewProps> = ({
  searchPlan,
  onConfirm,
  onBack
}) => {
  const [editedPlan, setEditedPlan] = useState<SearchPlan>(searchPlan);
  const [isEditing, setIsEditing] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleWeightChange = (type: keyof SearchPlan['weights'], value: number[]) => {
    setEditedPlan(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [type]: value[0]
      }
    }));
  };

  const addCompany = () => {
    if (newCompany.trim()) {
      setEditedPlan(prev => ({
        ...prev,
        targetCompanies: [...prev.targetCompanies, newCompany.trim()]
      }));
      setNewCompany('');
    }
  };

  const removeCompany = (index: number) => {
    setEditedPlan(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setEditedPlan(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          skills: [...prev.filters.skills, newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setEditedPlan(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        skills: prev.filters.skills.filter((_, i) => i !== index)
      }
    }));
  };

  const handleConfirm = () => {
    onConfirm(editedPlan);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">
              Review Search Plan
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit3 size={16} />
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            <Button onClick={handleConfirm} className="flex items-center gap-2">
              <Check size={16} />
              Confirm & Search
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-8 space-y-8">
        {/* Job Summary */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Job Summary</h2>
          {isEditing ? (
            <Textarea
              value={editedPlan.jobSummary}
              onChange={(e) => setEditedPlan(prev => ({ ...prev, jobSummary: e.target.value }))}
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-muted-foreground">{editedPlan.jobSummary}</p>
          )}
        </div>

        {/* Target Companies */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Target Companies</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {editedPlan.targetCompanies.map((company, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {company}
                {isEditing && (
                  <X
                    size={12}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => removeCompany(index)}
                  />
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add company..."
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCompany()}
              />
              <Button onClick={addCompany} size="sm">
                <Plus size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Search Criteria */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Search Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Experience</label>
              {isEditing ? (
                <Input
                  value={editedPlan.filters.experience}
                  onChange={(e) => setEditedPlan(prev => ({
                    ...prev,
                    filters: { ...prev.filters, experience: e.target.value }
                  }))}
                />
              ) : (
                <p className="text-muted-foreground">{editedPlan.filters.experience}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
              {isEditing ? (
                <Input
                  value={editedPlan.filters.location}
                  onChange={(e) => setEditedPlan(prev => ({
                    ...prev,
                    filters: { ...prev.filters, location: e.target.value }
                  }))}
                />
              ) : (
                <p className="text-muted-foreground">{editedPlan.filters.location}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">Salary Range</label>
              {isEditing ? (
                <Input
                  value={editedPlan.filters.salary}
                  onChange={(e) => setEditedPlan(prev => ({
                    ...prev,
                    filters: { ...prev.filters, salary: e.target.value }
                  }))}
                />
              ) : (
                <p className="text-muted-foreground">{editedPlan.filters.salary}</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {editedPlan.filters.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="flex items-center gap-1"
              >
                {skill}
                {isEditing && (
                  <X
                    size={12}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => removeSkill(index)}
                  />
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} size="sm">
                <Plus size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Matching Weights */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Matching Weights</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">Skills Match</label>
                <span className="text-sm text-muted-foreground">{editedPlan.weights.skills}%</span>
              </div>
              <Slider
                value={[editedPlan.weights.skills]}
                onValueChange={(value) => handleWeightChange('skills', value)}
                max={100}
                step={5}
                disabled={!isEditing}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">Experience Match</label>
                <span className="text-sm text-muted-foreground">{editedPlan.weights.experience}%</span>
              </div>
              <Slider
                value={[editedPlan.weights.experience]}
                onValueChange={(value) => handleWeightChange('experience', value)}
                max={100}
                step={5}
                disabled={!isEditing}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">Location Preference</label>
                <span className="text-sm text-muted-foreground">{editedPlan.weights.location}%</span>
              </div>
              <Slider
                value={[editedPlan.weights.location]}
                onValueChange={(value) => handleWeightChange('location', value)}
                max={100}
                step={5}
                disabled={!isEditing}
              />
            </div>
          </div>
          {isEditing && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                These weights determine how candidates are scored and ranked in your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPlanReview;
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { MapPin, DollarSign, Calendar, Briefcase, Target, Plus, X } from 'lucide-react';

interface SearchPlan {
  jobSummary: string;
  targetCompanies: string[];
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

interface SearchPlanChatProps {
  searchPlan: SearchPlan;
  onConfirm: (plan: SearchPlan) => void;
  onRefine: (refinement: string) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

const SearchPlanChat: React.FC<SearchPlanChatProps> = ({
  searchPlan,
  onConfirm,
  onRefine,
  isEditing,
  onToggleEdit
}) => {
  const [editedPlan, setEditedPlan] = useState<SearchPlan>(searchPlan);
  const [newCompany, setNewCompany] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [refinementText, setRefinementText] = useState('');

  const handleWeightChange = (type: keyof SearchPlan['weights'], value: number[]) => {
    setEditedPlan(prev => ({
      ...prev,
      weights: { ...prev.weights, [type]: value[0] }
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

  const handleSave = () => {
    onConfirm(editedPlan);
    onToggleEdit();
  };

  const handleRefinement = () => {
    if (refinementText.trim()) {
      onRefine(refinementText);
      setRefinementText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Job Summary */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center">
          <Target className="w-4 h-4 mr-2" />
          Job Summary
        </h3>
        {isEditing ? (
          <Textarea
            value={editedPlan.jobSummary}
            onChange={(e) => setEditedPlan(prev => ({ ...prev, jobSummary: e.target.value }))}
            className="text-sm"
            rows={3}
          />
        ) : (
          <p className="text-sm text-muted-foreground">{editedPlan.jobSummary}</p>
        )}
      </Card>

      {/* Target Companies */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3 flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          Target Companies
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {editedPlan.targetCompanies.map((company, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {company}
              {isEditing && (
                <X
                  size={12}
                  className="ml-1 cursor-pointer hover:text-destructive"
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
              onKeyPress={(e) => e.key === 'Enter' && addCompany()}
              className="text-sm"
            />
            <Button size="sm" onClick={addCompany}>
              <Plus size={14} />
            </Button>
          </div>
        )}
      </Card>

      {/* Search Filters */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-4">Search Criteria</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              Experience
            </label>
            {isEditing ? (
              <Input
                value={editedPlan.filters.experience}
                onChange={(e) => setEditedPlan(prev => ({
                  ...prev,
                  filters: { ...prev.filters, experience: e.target.value }
                }))}
                className="text-sm mt-1"
              />
            ) : (
              <p className="text-sm mt-1">{editedPlan.filters.experience}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Location
            </label>
            {isEditing ? (
              <Input
                value={editedPlan.filters.location}
                onChange={(e) => setEditedPlan(prev => ({
                  ...prev,
                  filters: { ...prev.filters, location: e.target.value }  
                }))}
                className="text-sm mt-1"
              />
            ) : (
              <p className="text-sm mt-1">{editedPlan.filters.location}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-muted-foreground flex items-center">
            <DollarSign className="w-3 h-3 mr-1" />
            Salary Range
          </label>
          {isEditing ? (
            <Input
              value={editedPlan.filters.salary}
              onChange={(e) => setEditedPlan(prev => ({
                ...prev,
                filters: { ...prev.filters, salary: e.target.value }
              }))}
              className="text-sm mt-1"
            />
          ) : (
            <p className="text-sm mt-1">{editedPlan.filters.salary}</p>
          )}
        </div>
      </Card>

      {/* Required Skills */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">Required Skills</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {editedPlan.filters.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
              {isEditing && (
                <X
                  size={12}
                  className="ml-1 cursor-pointer hover:text-destructive"
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
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              className="text-sm"
            />
            <Button size="sm" onClick={addSkill}>
              <Plus size={14} />
            </Button>
          </div>
        )}
      </Card>

      {/* Matching Weights */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-4">Matching Weights</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span>Skills Match</span>
              <span>{editedPlan.weights.skills}%</span>
            </div>
            <Slider
              value={[editedPlan.weights.skills]}
              onValueChange={(value) => handleWeightChange('skills', value)}
              max={100}
              step={5}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span>Experience Match</span>
              <span>{editedPlan.weights.experience}%</span>
            </div>
            <Slider
              value={[editedPlan.weights.experience]}
              onValueChange={(value) => handleWeightChange('experience', value)}
              max={100}
              step={5}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span>Location Match</span>
              <span>{editedPlan.weights.location}%</span>
            </div>
            <Slider
              value={[editedPlan.weights.location]}
              onValueChange={(value) => handleWeightChange('location', value)}
              max={100}
              step={5}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="space-y-4">
        {isEditing ? (
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onToggleEdit}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onToggleEdit}>
              Edit Plan
            </Button>
            <Button onClick={() => onConfirm(editedPlan)}>
              Start Search
            </Button>
          </div>
        )}

        {/* Conversational Refinement */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Or refine with natural language:</p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., 'Focus more on startups' or 'Add remote work filter'"
              value={refinementText}
              onChange={(e) => setRefinementText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRefinement()}
              className="text-sm"
            />
            <Button 
              size="sm" 
              onClick={handleRefinement}
              disabled={!refinementText.trim()}
            >
              Refine
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPlanChat;
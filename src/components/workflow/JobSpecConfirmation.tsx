import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Edit3, 
  DollarSign, 
  MapPin, 
  Users, 
  Briefcase,
  AlertCircle,
  Clock
} from 'lucide-react';
import { JobSpecification, SEARCH_LAYER_COSTS, SearchLayer } from '@/types/workflow';

interface JobSpecConfirmationProps {
  jobSpec: JobSpecification;
  onEdit: (updates: Partial<JobSpecification>) => void;
  onConfirm: (confirmation_notes?: string) => void;
  onBack: () => void;
  estimatedCost: number;
  selectedLayers: SearchLayer[];
}

export const JobSpecConfirmation: React.FC<JobSpecConfirmationProps> = ({
  jobSpec,
  onEdit,
  onConfirm,
  onBack,
  estimatedCost,
  selectedLayers,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpec, setEditedSpec] = useState(jobSpec);
  const [confirmationNotes, setConfirmationNotes] = useState('');

  const handleSave = () => {
    onEdit(editedSpec);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSpec(jobSpec);
    setIsEditing(false);
  };

  const handleConfirm = () => {
    onConfirm(confirmationNotes || undefined);
  };

  const formatSalary = (low?: number, high?: number) => {
    if (!low && !high) return 'Not specified';
    if (low && high) return `$${low.toLocaleString()} - $${high.toLocaleString()}`;
    return `$${(low || high)?.toLocaleString()}`;
  };

  const getCostBreakdown = () => {
    return selectedLayers.map(layer => ({
      layer,
      cost: SEARCH_LAYER_COSTS[layer],
      name: layer.charAt(0).toUpperCase() + layer.slice(1).replace('_', ' ')
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Review Job Specification</h2>
          <p className="text-muted-foreground">
            Confirm the parsed requirements before starting the search
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Job Specification */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Position Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label>Position Title</Label>
                    <Input
                      value={editedSpec.title}
                      onChange={(e) => setEditedSpec({ ...editedSpec, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={editedSpec.company_name}
                      onChange={(e) => setEditedSpec({ ...editedSpec, company_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Short Description</Label>
                    <Textarea
                      value={editedSpec.short_description || ''}
                      onChange={(e) => setEditedSpec({ ...editedSpec, short_description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg">{jobSpec.title}</h3>
                    <p className="text-muted-foreground">{jobSpec.company_name}</p>
                  </div>
                  {jobSpec.short_description && (
                    <p className="text-sm">{jobSpec.short_description}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements & Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label>Key Requirements</Label>
                    <Textarea
                      value={editedSpec.key_requirements || ''}
                      onChange={(e) => setEditedSpec({ ...editedSpec, key_requirements: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Responsibilities</Label>
                    <Textarea
                      value={editedSpec.responsibilities || ''}
                      onChange={(e) => setEditedSpec({ ...editedSpec, responsibilities: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  {jobSpec.key_requirements && (
                    <div>
                      <h4 className="font-medium mb-2">Key Requirements</h4>
                      <p className="text-sm text-muted-foreground">{jobSpec.key_requirements}</p>
                    </div>
                  )}
                  {jobSpec.responsibilities && (
                    <div>
                      <h4 className="font-medium mb-2">Responsibilities</h4>
                      <p className="text-sm text-muted-foreground">{jobSpec.responsibilities}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Primary Skills (comma-separated)</Label>
                    <Input
                      value={editedSpec.primary_skills?.join(', ') || ''}
                      onChange={(e) => setEditedSpec({ 
                        ...editedSpec, 
                        primary_skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="React, TypeScript, Node.js"
                    />
                  </div>
                  <div>
                    <Label>Secondary Skills (comma-separated)</Label>
                    <Input
                      value={editedSpec.secondary_skills?.join(', ') || ''}
                      onChange={(e) => setEditedSpec({ 
                        ...editedSpec, 
                        secondary_skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      placeholder="Python, AWS, Docker"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobSpec.primary_skills && jobSpec.primary_skills.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Primary Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {jobSpec.primary_skills.map((skill, index) => (
                          <Badge key={index} variant="default">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {jobSpec.secondary_skills && jobSpec.secondary_skills.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Secondary Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {jobSpec.secondary_skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Search Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getCostBreakdown().map(({ layer, cost, name }) => (
                  <div key={layer} className="flex justify-between items-center text-sm">
                    <span>{name}</span>
                    <span className={cost === 0 ? 'text-green-600' : 'text-foreground'}>
                      {cost === 0 ? 'Free' : `$${(cost / 100).toFixed(2)}`}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-medium">
                  <span>Total Estimated</span>
                  <span>${(estimatedCost / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location & Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isEditing ? (
                <>
                  <div>
                    <Label>Preferred Location</Label>
                    <Input
                      value={editedSpec.preferred_location || ''}
                      onChange={(e) => setEditedSpec({ ...editedSpec, preferred_location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Working Mode</Label>
                    <Input
                      value={editedSpec.working_mode || ''}
                      onChange={(e) => setEditedSpec({ ...editedSpec, working_mode: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {jobSpec.preferred_location || 'Not specified'}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    {jobSpec.working_mode || 'Not specified'}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Compensation */}
          {(jobSpec.salary_base_low || jobSpec.salary_base_high || isEditing) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Base Low</Label>
                      <Input
                        type="number"
                        value={editedSpec.salary_base_low || ''}
                        onChange={(e) => setEditedSpec({ 
                          ...editedSpec, 
                          salary_base_low: e.target.value ? Number(e.target.value) : undefined 
                        })}
                      />
                    </div>
                    <div>
                      <Label>Base High</Label>
                      <Input
                        type="number"
                        value={editedSpec.salary_base_high || ''}
                        onChange={(e) => setEditedSpec({ 
                          ...editedSpec, 
                          salary_base_high: e.target.value ? Number(e.target.value) : undefined 
                        })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <div>Base: {formatSalary(jobSpec.salary_base_low, jobSpec.salary_base_high)}</div>
                    {(jobSpec.ote_low || jobSpec.ote_high) && (
                      <div>OTE: {formatSalary(jobSpec.ote_low, jobSpec.ote_high)}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Min Years</Label>
                    <Input
                      type="number"
                      value={editedSpec.experience_years_min || ''}
                      onChange={(e) => setEditedSpec({ 
                        ...editedSpec, 
                        experience_years_min: e.target.value ? Number(e.target.value) : undefined 
                      })}
                    />
                  </div>
                  <div>
                    <Label>Max Years</Label>
                    <Input
                      type="number"
                      value={editedSpec.experience_years_max || ''}
                      onChange={(e) => setEditedSpec({ 
                        ...editedSpec, 
                        experience_years_max: e.target.value ? Number(e.target.value) : undefined 
                      })}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm">
                  {jobSpec.experience_years_min || jobSpec.experience_years_max ? (
                    `${jobSpec.experience_years_min || 0} - ${jobSpec.experience_years_max || '+'} years`
                  ) : (
                    'Not specified'
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Notes */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmation Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={confirmationNotes}
              onChange={(e) => setConfirmationNotes(e.target.value)}
              placeholder="Add any additional notes or specific requirements for this search..."
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            This will start the candidate search process
          </div>
          <Button onClick={handleConfirm} size="lg" className="px-8">
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirm & Start Search
          </Button>
        </div>
      )}
    </div>
  );
};
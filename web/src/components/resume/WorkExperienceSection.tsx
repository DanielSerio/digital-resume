import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, X, GripVertical, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ErrorBoundary } from '@/components/common';

import { 
  useWorkExperiencesData, 
  useCreateWorkExperience, 
  useUpdateWorkExperience, 
  useDeleteWorkExperience 
} from '@/hooks';
import { workExperienceSchema, type WorkExperienceFormData } from '@/lib/validation';
import { cn } from '@/lib/utils';
import type { WorkExperience } from '@/types';

// Sub-component for work experience line entry
const LineEntryForm: React.FC<{
  index: number;
  onRemove: () => void;
  register: any;
  errors: any;
}> = ({ index, onRemove, register, errors }) => {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-shrink-0 pt-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <Textarea
          {...register(`lines.${index}.text`)}
          placeholder="Describe an accomplishment or responsibility..."
          className={cn(
            "min-h-[60px] resize-y",
            errors?.lines?.[index]?.text && "border-red-500"
          )}
        />
        {errors?.lines?.[index]?.text && (
          <p className="text-xs text-red-600 mt-1">
            {errors.lines[index].text.message}
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRemove}
        className="flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Sub-component for a single work experience entry form
const WorkExperienceEntryForm: React.FC<{
  workExperience?: WorkExperience;
  onSave: (data: WorkExperienceFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
}> = ({ workExperience, onSave, onCancel, onDelete, isSubmitting }) => {
  const form = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: workExperience?.company || '',
      position: workExperience?.position || '',
      location: workExperience?.location || '',
      startDate: workExperience?.startDate ? new Date(workExperience.startDate) : null,
      endDate: workExperience?.endDate ? new Date(workExperience.endDate) : null,
      isCurrentPosition: workExperience?.isCurrentPosition || false,
      lines: workExperience?.lines?.map(line => ({ text: line.content })) || [{ text: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  });

  const { formState: { errors } } = form;

  const handleAddLine = () => {
    append({ text: '' });
  };

  return (
    <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 p-4 border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            {...form.register('company')}
            className={cn(errors.company && "border-red-500")}
          />
          {errors.company && (
            <p className="text-xs text-red-600 mt-1">{errors.company.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            {...form.register('position')}
            className={cn(errors.position && "border-red-500")}
          />
          {errors.position && (
            <p className="text-xs text-red-600 mt-1">{errors.position.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...form.register('location')}
            placeholder="City, State"
            className={cn(errors.location && "border-red-500")}
          />
          {errors.location && (
            <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...form.register('isCurrentPosition')}
            />
            <span className="text-sm">Current Position</span>
          </label>
        </div>

        <div>
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch('startDate') && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch('startDate') ? format(form.watch('startDate')!, "PPP") : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch('startDate') || undefined}
                onSelect={(date) => form.setValue('startDate', date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {!form.watch('isCurrentPosition') && (
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch('endDate') && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('endDate') ? format(form.watch('endDate')!, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch('endDate') || undefined}
                  onSelect={(date) => form.setValue('endDate', date || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <Label>Accomplishments & Responsibilities</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddLine}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Line
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <LineEntryForm
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
              register={form.register}
              errors={errors}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <div>
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </form>
  );
};

// Sub-component for displaying work experiences
const WorkExperienceDisplay: React.FC<{
  workExperiences: WorkExperience[];
  onEditWorkExperience: (workExperience: WorkExperience) => void;
}> = ({ workExperiences, onEditWorkExperience }) => {
  if (workExperiences.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No work experience entries added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {workExperiences.map((experience) => (
        <div key={experience.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h4 className="font-semibold">{experience.jobTitle}</h4>
              <p className="text-muted-foreground">{experience.companyName}</p>
              {(experience.location || experience.companyCity) && (
                <p className="text-sm text-muted-foreground">
                  {experience.location || `${experience.companyCity}${experience.companyState ? `, ${experience.companyState}` : ''}`}
                </p>
              )}
              <div className="text-sm text-muted-foreground">
                {(experience.startDate || experience.dateStarted) && (
                  <p>
                    {format(new Date(experience.startDate || experience.dateStarted), "MMM yyyy")} - {" "}
                    {experience.isCurrentPosition || !experience.dateEnded
                      ? "Present" 
                      : (experience.endDate || experience.dateEnded)
                        ? format(new Date(experience.endDate || experience.dateEnded), "MMM yyyy")
                        : "Present"
                    }
                  </p>
                )}
              </div>
              {experience.workExperienceLines && experience.workExperienceLines.length > 0 && (
                <div className="mt-3">
                  <ul className="text-sm space-y-1">
                    {experience.workExperienceLines.map((line) => (
                      <li key={line.id} className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1.5">•</span>
                        <span>{line.lineText}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditWorkExperience(experience)}
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const WorkExperienceSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  
  // Data fetching
  const { data: workExperiences = [], isLoading, error } = useWorkExperiencesData();
  const createExperienceMutation = useCreateWorkExperience();
  const updateExperienceMutation = useUpdateWorkExperience();
  const deleteExperienceMutation = useDeleteWorkExperience();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditingExperience(null);
  };

  const handleAddExperience = () => {
    setIsAdding(true);
  };

  const handleEditExperience = (experience: WorkExperience) => {
    setEditingExperience(experience);
  };

  const handleSaveNew = async (data: WorkExperienceFormData) => {
    try {
      await createExperienceMutation.mutateAsync(data);
      toast.success('Work experience added successfully');
      setIsAdding(false);
    } catch (error) {
      toast.error('Failed to add work experience');
      console.error('Add work experience error:', error);
    }
  };

  const handleSaveEdit = async (data: WorkExperienceFormData) => {
    if (!editingExperience) return;
    try {
      await updateExperienceMutation.mutateAsync({ id: editingExperience.id, data });
      toast.success('Work experience updated successfully');
      setEditingExperience(null);
    } catch (error) {
      toast.error('Failed to update work experience');
      console.error('Update work experience error:', error);
    }
  };

  const handleDelete = async (experienceId: number) => {
    try {
      await deleteExperienceMutation.mutateAsync(experienceId);
      toast.success('Work experience deleted successfully');
      setEditingExperience(null);
    } catch (error) {
      toast.error('Failed to delete work experience');
      console.error('Delete work experience error:', error);
    }
  };

  const isSubmitting = createExperienceMutation.isPending || updateExperienceMutation.isPending || deleteExperienceMutation.isPending;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load work experience</p>
          <Button variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card 
        className={cn(
          "p-6 transition-colors",
          isEditing && "border-orange-500 border-2"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Work Experience</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <WorkExperienceDisplay 
              workExperiences={workExperiences}
              onEditWorkExperience={handleEditExperience}
            />

            {editingExperience && (
              <WorkExperienceEntryForm
                workExperience={editingExperience}
                onSave={handleSaveEdit}
                onCancel={() => setEditingExperience(null)}
                onDelete={() => handleDelete(editingExperience.id)}
                isSubmitting={isSubmitting}
              />
            )}

            {isAdding && (
              <WorkExperienceEntryForm
                onSave={handleSaveNew}
                onCancel={() => setIsAdding(false)}
                isSubmitting={isSubmitting}
              />
            )}

            {!isAdding && !editingExperience && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddExperience}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Work Experience
              </Button>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleCancel}>Done</Button>
            </div>
          </div>
        ) : (
          <WorkExperienceDisplay 
            workExperiences={workExperiences}
            onEditWorkExperience={handleEditExperience}
          />
        )}
      </Card>
    </ErrorBoundary>
  );
};
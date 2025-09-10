import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ErrorBoundary } from '@/components/common';

import { 
  useTechnicalSkillsData, 
  useCreateTechnicalSkill, 
  useDeleteTechnicalSkill,
  useSkillTaxonomy 
} from '@/hooks';
import { technicalSkillSchema, type TechnicalSkillFormData } from '@/lib/validation';
import { cn } from '@/lib/utils';
import type { TechnicalSkill } from '@/types';

// Sub-component for adding new skills
const AddSkillForm: React.FC<{
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ onSuccess, onCancel }) => {
  const { categories, subcategories } = useSkillTaxonomy();
  const createSkillMutation = useCreateTechnicalSkill();

  const form = useForm<TechnicalSkillFormData>({
    resolver: zodResolver(technicalSkillSchema),
    defaultValues: {
      name: '',
      categoryId: 0,
      subcategoryId: 0,
    },
  });

  const handleSubmit = async (data: TechnicalSkillFormData) => {
    try {
      await createSkillMutation.mutateAsync(data);
      toast.success('Skill added successfully');
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to add skill');
      console.error('Add skill error:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 p-4 border rounded-lg bg-muted/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="skillName">Skill Name *</Label>
          <Input
            id="skillName"
            {...form.register('name')}
            placeholder="e.g., React"
            className={cn(form.formState.errors.name && "border-red-500")}
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-600 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={form.watch('categoryId')?.toString() || ''}
            onValueChange={(value) => form.setValue('categoryId', parseInt(value), { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              {categories.categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value.toString()}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.categoryId && (
            <p className="text-xs text-red-600 mt-1">{form.formState.errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subcategory">Subcategory *</Label>
          <Select
            value={form.watch('subcategoryId')?.toString() || ''}
            onValueChange={(value) => form.setValue('subcategoryId', parseInt(value), { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory..." />
            </SelectTrigger>
            <SelectContent>
              {subcategories.subcategoryOptions.map((subcat) => (
                <SelectItem key={subcat.value} value={subcat.value.toString()}>
                  {subcat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.subcategoryId && (
            <p className="text-xs text-red-600 mt-1">{form.formState.errors.subcategoryId.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={createSkillMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={createSkillMutation.isPending || !form.formState.isValid}
        >
          {createSkillMutation.isPending ? 'Adding...' : 'Add Skill'}
        </Button>
      </div>
    </form>
  );
};

// Sub-component for displaying skills by category
const SkillsByCategory: React.FC<{
  skills: TechnicalSkill[];
  getCategoryName: (id: number) => string;
  isEditing: boolean;
  onDeleteSkill: (id: number) => Promise<void>;
}> = ({ skills, getCategoryName, isEditing, onDeleteSkill }) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const categoryName = getCategoryName(skill.categoryId);
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(skill);
    return acc;
  }, {} as Record<string, TechnicalSkill[]>);

  if (Object.keys(skillsByCategory).length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No technical skills added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(skillsByCategory).map(([categoryName, categorySkills]) => (
        <div key={categoryName}>
          <h4 className="font-medium text-foreground mb-3">{categoryName}:</h4>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="text-sm">
                {skill.name}
                {isEditing && (
                  <button
                    onClick={() => onDeleteSkill(skill.id)}
                    className="ml-2 hover:text-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkillsSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  
  // Data fetching
  const { data: skills = [], isLoading, error } = useTechnicalSkillsData();
  const { getCategoryName } = useSkillTaxonomy();
  const deleteSkillMutation = useDeleteTechnicalSkill();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAddingSkill(false);
  };

  const handleAddSkillSuccess = () => {
    setIsAddingSkill(false);
  };

  const handleDeleteSkill = async (skillId: number) => {
    try {
      await deleteSkillMutation.mutateAsync(skillId);
      toast.success('Skill removed successfully');
    } catch (error) {
      toast.error('Failed to remove skill');
      console.error('Delete skill error:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded w-20"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
              <div className="h-6 bg-muted rounded w-24"></div>
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
          <p>Failed to load technical skills</p>
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
          <h2 className="text-lg font-semibold">Technical Skills</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        <SkillsByCategory
          skills={skills}
          getCategoryName={getCategoryName}
          isEditing={isEditing}
          onDeleteSkill={handleDeleteSkill}
        />

        {isEditing && (
          <div className="mt-6 space-y-4">
            {isAddingSkill ? (
              <AddSkillForm
                onSuccess={handleAddSkillSuccess}
                onCancel={() => setIsAddingSkill(false)}
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingSkill(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Card>
    </ErrorBoundary>
  );
};
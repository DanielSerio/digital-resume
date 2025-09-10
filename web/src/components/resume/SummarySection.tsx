import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/common';

import { useProfessionalSummaryData, useUpdateProfessionalSummary } from '@/hooks';
import { professionalSummarySchema, type ProfessionalSummaryFormData } from '@/lib/validation';
import { cn } from '@/lib/utils';

export const SummarySection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Data fetching
  const { data: summary, isLoading, error } = useProfessionalSummaryData();
  const updateSummaryMutation = useUpdateProfessionalSummary();

  // Form setup
  const form = useForm<ProfessionalSummaryFormData>({
    resolver: zodResolver(professionalSummarySchema),
    defaultValues: {
      summaryText: '',
    },
  });

  const { formState: { isDirty, isSubmitting } } = form;

  // Update form when data loads
  React.useEffect(() => {
    if (summary && !isEditing) {
      form.reset({
        summaryText: summary.summaryText,
      });
    }
  }, [summary, isEditing, form]);

  const handleEdit = () => {
    if (summary) {
      form.reset({
        summaryText: summary.summaryText,
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleSave = async (data: ProfessionalSummaryFormData) => {
    try {
      await updateSummaryMutation.mutateAsync(data);
      toast.success('Professional summary updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update professional summary');
      console.error('Summary update error:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load professional summary</p>
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
          isEditing && isDirty && "border-orange-500 border-2"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Professional Summary</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <div>
              <Label htmlFor="summaryText">Summary *</Label>
              <Textarea
                id="summaryText"
                {...form.register('summaryText')}
                placeholder="Write a compelling professional summary that highlights your experience, skills, and career goals..."
                className={cn(
                  "min-h-[120px] resize-y",
                  form.formState.errors.summaryText && "border-red-500"
                )}
              />
              {form.formState.errors.summaryText && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.summaryText.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Character count: {form.watch('summaryText')?.length || 0}/2000
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {summary?.summaryText ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {summary.summaryText}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No professional summary available</p>
                <Button variant="outline" size="sm" onClick={handleEdit} className="mt-2">
                  Add Professional Summary
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </ErrorBoundary>
  );
};
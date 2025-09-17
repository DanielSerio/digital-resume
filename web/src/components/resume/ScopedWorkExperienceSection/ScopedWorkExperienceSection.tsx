import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common";
import { ScopedWorkExperienceHeader } from "./ScopedWorkExperienceHeader";
import { ScopedWorkExperienceToggle } from "./ScopedWorkExperienceToggle";

import {
  useWorkExperiencesData,
  useScopedResumeData,
  useAddScopedWorkExperience,
  useRemoveScopedWorkExperience,
} from "@/hooks";
import { useItemEdit } from "@/hooks/edit/useItemEdit";
import type { WorkExperience } from "@/types";

interface ScopedWorkExperienceSectionProps {
  scopedResumeId: number;
}

export const ScopedWorkExperienceSection: React.FC<ScopedWorkExperienceSectionProps> = ({
  scopedResumeId,
}) => {
  // Data fetching
  const { data: workExperiences = [], isLoading, error } = useWorkExperiencesData();
  const { data: scopedResume, isLoading: scopedLoading } = useScopedResumeData(scopedResumeId);

  // Edit state management
  const { editingItemId: editingExperienceId, startEditItem, canEdit } = useItemEdit<WorkExperience>('workExperience', workExperiences);

  // Scoped work experience mutations
  const addScopedWorkExperienceMutation = useAddScopedWorkExperience();
  const removeScopedWorkExperienceMutation = useRemoveScopedWorkExperience();

  // Determine which work experiences are included in this scoped resume
  const scopedWorkExperienceIds = new Set(
    scopedResume?.scopedWorkExperiences?.map(swe => swe.workExperienceId) || []
  );

  const handleToggleWorkExperienceInclusion = async (workExperience: WorkExperience, included: boolean) => {
    try {
      if (included) {
        await addScopedWorkExperienceMutation.mutateAsync({
          scopedResumeId,
          workExperienceId: workExperience.id,
        });
        toast.success(`Added "${workExperience.jobTitle} at ${workExperience.companyName}" to scoped resume`);
      } else {
        await removeScopedWorkExperienceMutation.mutateAsync({
          scopedResumeId,
          workExperienceId: workExperience.id,
        });
        toast.success(`Removed "${workExperience.jobTitle} at ${workExperience.companyName}" from scoped resume`);
      }
    } catch (error) {
      toast.error("Failed to update work experience inclusion");
      console.error("Toggle work experience inclusion error:", error);
    }
  };

  const handleEditExperience = (experience: WorkExperience) => {
    startEditItem(experience);
  };

  if (isLoading || scopedLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load work experiences</p>
          <Button variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card data-testid="ScopedWorkExperienceCard" className="p-6 max-w-4xl mx-auto">
        <ScopedWorkExperienceHeader
          includedCount={scopedWorkExperienceIds.size}
          totalCount={workExperiences.length}
        />

        <div className="space-y-4">
          {workExperiences.map((experience) => {
            const isIncluded = scopedWorkExperienceIds.has(experience.id);
            const isEditing = editingExperienceId === experience.id;

            return (
              <ScopedWorkExperienceToggle
                key={experience.id}
                experience={experience}
                isIncluded={isIncluded}
                isEditing={isEditing}
                canEdit={canEdit ?? false}
                onToggle={handleToggleWorkExperienceInclusion}
                onEdit={handleEditExperience}
              />
            );
          })}
        </div>
      </Card>
    </ErrorBoundary>
  );
};
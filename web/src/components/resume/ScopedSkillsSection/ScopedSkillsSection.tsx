import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common";
import { ScopedSkillsHeader } from "./ScopedSkillsHeader";
import { ScopedSkillCategory } from "./ScopedSkillCategory";

import {
  useTechnicalSkillsData,
  useSkillTaxonomy,
  useScopedResumeData,
  useAddScopedSkill,
  useRemoveScopedSkill,
} from "@/hooks";
import type { TechnicalSkill } from "@/types";

interface ScopedSkillsSectionProps {
  scopedResumeId: number;
}

export const ScopedSkillsSection: React.FC<ScopedSkillsSectionProps> = ({
  scopedResumeId,
}) => {
  // Data fetching
  const { data: skills = [], isLoading, error } = useTechnicalSkillsData();
  const { data: scopedResume, isLoading: scopedLoading } = useScopedResumeData(scopedResumeId);
  const { getCategoryName } = useSkillTaxonomy();

  // Scoped skill mutations
  const addScopedSkillMutation = useAddScopedSkill();
  const removeScopedSkillMutation = useRemoveScopedSkill();

  // Determine which skills are included in this scoped resume
  const scopedSkillIds = new Set(
    scopedResume?.scopedSkills?.map(ss => ss.technicalSkillId) || []
  );

  const handleToggleSkillInclusion = async (skill: TechnicalSkill, included: boolean) => {
    try {
      if (included) {
        await addScopedSkillMutation.mutateAsync({
          scopedResumeId,
          technicalSkillId: skill.id,
        });
        toast.success(`Added "${skill.name}" to scoped resume`);
      } else {
        await removeScopedSkillMutation.mutateAsync({
          scopedResumeId,
          technicalSkillId: skill.id,
        });
        toast.success(`Removed "${skill.name}" from scoped resume`);
      }
    } catch (error) {
      toast.error("Failed to update skill inclusion");
      console.error("Toggle skill inclusion error:", error);
    }
  };

  const handleBulkToggle = async (skillsInCategory: TechnicalSkill[], include: boolean) => {
    try {
      for (const skill of skillsInCategory) {
        await handleToggleSkillInclusion(skill, include);
      }
    } catch (error) {
      toast.error("Failed to update skills");
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const categoryName = getCategoryName(skill.categoryId);
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(skill);
    return acc;
  }, {} as Record<string, TechnicalSkill[]>);

  if (isLoading || scopedLoading) {
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
      <Card data-testid="ScopedSkillsCard" className="p-6 max-w-4xl mx-auto">
        <ScopedSkillsHeader
          includedCount={scopedSkillIds.size}
          totalCount={skills.length}
        />

        <div className="space-y-4">
          {Object.entries(skillsByCategory).map(([categoryName, categorySkills]) => (
            <ScopedSkillCategory
              key={categoryName}
              categoryName={categoryName}
              skills={categorySkills}
              includedSkillIds={scopedSkillIds}
              onToggleSkill={handleToggleSkillInclusion}
              onBulkToggle={handleBulkToggle}
            />
          ))}
        </div>
      </Card>
    </ErrorBoundary>
  );
};
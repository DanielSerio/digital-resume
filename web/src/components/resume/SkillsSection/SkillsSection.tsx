import React, { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common";
import { SkillsDisplay } from "./SkillsDisplay";
import { AddSkillForm } from "./AddSkillForm";

import {
  useTechnicalSkillsData,
  useDeleteTechnicalSkill,
  useSkillTaxonomy,
} from "@/hooks";
import { cn } from "@/lib/utils";

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
      toast.success("Skill removed successfully");
    } catch (error) {
      toast.error("Failed to remove skill");
      console.error("Delete skill error:", error);
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
        data-testid="SkillsCard"
        className={cn(
          "p-6 transition-colors",
          isEditing && isAddingSkill && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Technical Skills</h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              data-testid="edit-button"
            >
              Edit
            </Button>
          )}
        </div>

        <SkillsDisplay
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
              <Button type="button" variant="outline" onClick={handleCancel}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Card>
    </ErrorBoundary>
  );
};

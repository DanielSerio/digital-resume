import React from "react";
import { toast } from "sonner";
import { Plus, Minus, Edit3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ErrorBoundary } from "@/components/common";
import { WorkExperienceDisplay } from "../WorkExperienceSection/WorkExperienceDisplay";
import { WorkExperienceEntryForm } from "../WorkExperienceSection/WorkExperienceEntryForm";

import {
  useWorkExperiencesData,
  useCreateWorkExperience,
  useUpdateWorkExperience,
  useDeleteWorkExperience,
  useScopedResumeData,
} from "@/hooks";
import { type CompleteWorkExperienceFormData } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { WorkExperience, WorkExperienceLineInput, WorkExperienceLine } from "@/types";
import { useItemEdit } from "@/hooks/edit/useItemEdit";

interface ScopedWorkExperienceSectionProps {
  scopedResumeId: number;
}

export const ScopedWorkExperienceSection: React.FC<ScopedWorkExperienceSectionProps> = ({
  scopedResumeId,
}) => {
  // Data fetching
  const queryData = useWorkExperiencesData();
  const { data: workExperiences = [], isLoading, error } = queryData;
  const { data: scopedResume, isLoading: scopedLoading } = useScopedResumeData(scopedResumeId);

  // Use the same edit hook as main UI
  const {
    isAdding,
    editingItemId: editingExperienceId,
    editingItem: editingExperience,
    canEdit,
    isEditingAnything,
    startAdd,
    startEditItem,
    cancelEdit,
    completeAdd,
    completeEditItem,
    deleteItem,
  } = useItemEdit("workExperience", workExperiences);

  const createExperienceMutation = useCreateWorkExperience();
  const updateExperienceMutation = useUpdateWorkExperience();
  const deleteExperienceMutation = useDeleteWorkExperience();

  // TODO: Add scoped work experience mutations
  // const addScopedWorkExperienceMutation = useAddScopedWorkExperience();
  // const removeScopedWorkExperienceMutation = useRemoveScopedWorkExperience();
  // const updateScopedWorkExperienceLineMutation = useUpdateScopedWorkExperienceLine();

  // Determine which work experiences are included in this scoped resume
  const scopedWorkExperienceIds = new Set(
    scopedResume?.scopedWorkExperiences?.map(swe => swe.workExperienceId) || []
  );

  // Get customized lines for this scoped resume
  const scopedLines = new Map(
    scopedResume?.scopedWorkExperienceLines?.map(swel => [
      swel.workExperienceLineId,
      swel.lineText
    ]) || []
  );

  const [editingLineId, setEditingLineId] = React.useState<number | null>(null);
  const [lineEditText, setLineEditText] = React.useState("");

  const handleAddExperience = () => {
    startAdd();
  };

  const handleEditExperience = (experience: WorkExperience) => {
    startEditItem(experience);
  };

  const handleSaveNew = async (data: CompleteWorkExperienceFormData) => {
    try {
      const { lines, ...workExperience } = data;
      await createExperienceMutation.mutateAsync({
        workExperience: {
          companyName: workExperience.companyName,
          companyCity: workExperience.companyCity || "",
          companyState: workExperience.companyState || "",
          jobTitle: workExperience.jobTitle,
          dateStarted: workExperience.startDate,
          dateEnded: workExperience.endDate ?? null,
        },
        lines: lines.map(
          (line): WorkExperienceLineInput => ({
            ...line,
            lineText: line.lineText,
            sortOrder: line.sortOrder,
          })
        ),
      });
      toast.success("Work experience added successfully");
      completeAdd();
    } catch (error) {
      toast.error("Failed to add work experience");
      console.error("Add work experience error:", error);
    }
  };

  const handleSaveEdit = async (data: CompleteWorkExperienceFormData) => {
    if (!editingExperience) return;
    try {
      const { lines, ...workExperience } = data;

      await updateExperienceMutation.mutateAsync({
        id: editingExperience.id,
        workExperience: {
          companyName: workExperience.companyName,
          companyCity: workExperience.companyCity || "",
          companyState: workExperience.companyState || "",
          jobTitle: workExperience.jobTitle,
          dateStarted: workExperience.startDate,
          dateEnded: workExperience.endDate ?? null,
        },
        lines: lines.map(
          (line): WorkExperienceLineInput => ({
            ...line,
            lineText: line.lineText,
            sortOrder: line.sortOrder,
          })
        ),
      });
      toast.success("Work experience updated successfully");
      completeEditItem();
    } catch (error) {
      toast.error("Failed to update work experience");
      console.error("Update work experience error:", error);
    }
  };

  const handleCancel = () => {
    cancelEdit();
  };

  const handleDelete = async (experience: WorkExperience) => {
    if (window.confirm(`Are you sure you want to delete the work experience at ${experience.companyName}?`)) {
      try {
        await deleteExperienceMutation.mutateAsync(experience.id);
        toast.success("Work experience deleted successfully");
        deleteItem();
      } catch (error) {
        toast.error("Failed to delete work experience");
        console.error("Delete work experience error:", error);
      }
    }
  };

  const handleToggleWorkExperienceInclusion = async (experience: WorkExperience, included: boolean) => {
    try {
      if (included) {
        // TODO: Add to scoped resume
        // await addScopedWorkExperienceMutation.mutateAsync({
        //   scopedResumeId,
        //   workExperienceId: experience.id,
        // });
        console.log("Adding work experience to scoped resume:", { scopedResumeId, workExperienceId: experience.id });
        toast.success(`Added "${experience.jobTitle} at ${experience.companyName}" to scoped resume`);
      } else {
        // TODO: Remove from scoped resume
        // await removeScopedWorkExperienceMutation.mutateAsync(scopedResumeId, experience.id);
        console.log("Removing work experience from scoped resume:", { scopedResumeId, workExperienceId: experience.id });
        toast.success(`Removed "${experience.jobTitle} at ${experience.companyName}" from scoped resume`);
      }
    } catch (error) {
      toast.error("Failed to update work experience inclusion");
      console.error("Toggle work experience inclusion error:", error);
    }
  };

  const handleEditLine = (line: WorkExperienceLine) => {
    setEditingLineId(line.id);
    setLineEditText(scopedLines.get(line.id) || line.lineText);
  };

  const handleSaveLineEdit = async () => {
    if (!editingLineId) return;

    try {
      // TODO: Save scoped work experience line
      // await updateScopedWorkExperienceLineMutation.mutateAsync({
      //   scopedResumeId,
      //   workExperienceLineId: editingLineId,
      //   lineText: lineEditText,
      // });
      console.log("Saving scoped work experience line:", {
        scopedResumeId,
        workExperienceLineId: editingLineId,
        lineText: lineEditText,
      });
      toast.success("Line customized for this scoped resume");
      setEditingLineId(null);
      setLineEditText("");
    } catch (error) {
      toast.error("Failed to save line customization");
    }
  };

  const handleCancelLineEdit = () => {
    setEditingLineId(null);
    setLineEditText("");
  };

  const handleResetLine = async (lineId: number) => {
    try {
      // TODO: Remove scoped customization
      // await removeScopedWorkExperienceLineMutation.mutateAsync(scopedResumeId, lineId);
      console.log("Resetting line to original:", { scopedResumeId, lineId });
      toast.success("Reset to original line content");
    } catch (error) {
      toast.error("Failed to reset line");
    }
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
          <p>Failed to load work experience</p>
          <Button variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const includedExperiencesCount = workExperiences.filter(exp =>
    scopedWorkExperienceIds.has(exp.id)
  ).length;

  return (
    <ErrorBoundary>
      <Card
        data-testid="ScopedWorkExperienceCard"
        className={cn(
          "p-6 transition-colors",
          isAdding && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Work Experience</h2>
            <Badge variant="outline" className="text-xs">
              {includedExperiencesCount} of {workExperiences.length} included
            </Badge>
          </div>
        </div>

        {/* Work experience selection and editing */}
        <div className="space-y-6">
          {workExperiences.map((experience) => {
            const isIncluded = scopedWorkExperienceIds.has(experience.id);
            const isEditing = editingExperienceId === experience.id;

            return (
              <div
                key={experience.id}
                className={cn(
                  "p-4 rounded border transition-colors",
                  isIncluded ? "bg-green-50 border-green-200" : "bg-muted border-border",
                  isEditing && "border-orange-500 border-2"
                )}
              >
                {/* Experience inclusion toggle */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={isIncluded}
                      onCheckedChange={(checked) =>
                        handleToggleWorkExperienceInclusion(experience, checked as boolean)
                      }
                      id={`experience-${experience.id}`}
                    />
                    <Label
                      htmlFor={`experience-${experience.id}`}
                      className={cn(
                        "cursor-pointer font-medium",
                        !isIncluded && "text-muted-foreground"
                      )}
                    >
                      {experience.jobTitle} at {experience.companyName}
                    </Label>
                  </div>

                  {isIncluded && !isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditExperience(experience)}
                      disabled={!canEdit}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>

                {/* Show experience details and lines for included experiences */}
                {isIncluded && (
                  <div className="ml-6 space-y-2">
                    {isEditing ? (
                      <WorkExperienceEntryForm
                        initialData={experience}
                        onSave={handleSaveEdit}
                        onCancel={handleCancel}
                        onDelete={() => handleDelete(experience)}
                        isEditing={true}
                      />
                    ) : (
                      <div>
                        {/* Experience details */}
                        <div className="text-sm text-muted-foreground mb-2">
                          {experience.companyCity}, {experience.companyState} • {" "}
                          {experience.dateStarted.toLocaleDateString()} - {" "}
                          {experience.dateEnded ? experience.dateEnded.toLocaleDateString() : "Present"}
                        </div>

                        {/* Customizable lines */}
                        <div className="space-y-2">
                          {experience.lines?.map((line) => {
                            const hasCustomization = scopedLines.has(line.id);
                            const displayText = scopedLines.get(line.id) || line.lineText;
                            const isEditingThisLine = editingLineId === line.id;

                            return (
                              <div key={line.id} className="flex items-start gap-2 group">
                                <span className="text-muted-foreground">•</span>
                                <div className="flex-1">
                                  {isEditingThisLine ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={lineEditText}
                                        onChange={(e) => setLineEditText(e.target.value)}
                                        className="min-h-[60px]"
                                        placeholder="Enter customized line content..."
                                      />
                                      <div className="flex gap-2">
                                        <Button size="sm" onClick={handleSaveLineEdit}>
                                          Save
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handleCancelLineEdit}>
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <div className="flex items-start justify-between group-hover:visible">
                                        <p className="text-sm flex-1">{displayText}</p>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEditLine(line)}
                                            className="h-6 px-2"
                                          >
                                            <Edit3 className="h-3 w-3" />
                                          </Button>
                                          {hasCustomization && (
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => handleResetLine(line.id)}
                                              className="h-6 px-2 text-muted-foreground"
                                            >
                                              Reset
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      {hasCustomization && (
                                        <Badge variant="secondary" className="text-xs">
                                          Customized
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add new experience form - same as main UI */}
          {isAdding ? (
            <WorkExperienceEntryForm
              onSave={handleSaveNew}
              onCancel={handleCancel}
              isEditing={false}
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddExperience}
              className="flex items-center gap-2"
              disabled={!canEdit}
            >
              <Plus className="h-4 w-4" />
              Add Work Experience
            </Button>
          )}
        </div>
      </Card>
    </ErrorBoundary>
  );
};
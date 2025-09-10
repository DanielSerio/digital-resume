import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ErrorBoundary } from "@/components/common";

import {
  useEducationData,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from "@/hooks";
import { educationSchema, type EducationFormData } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { Education } from "@/types";

// Sub-component for a single education entry form
const EducationEntryForm: React.FC<{
  education?: Education;
  onSave: (data: EducationFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
}> = ({ education, onSave, onCancel, onDelete, isSubmitting }) => {
  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      schoolName: education?.schoolName || "",
      location: education?.location || "",
      degree: education?.degree || "",
      fieldOfStudy: education?.fieldOfStudy || "",
      startDate: education?.startDate ? new Date(education.startDate) : null,
      endDate: education?.endDate ? new Date(education.endDate) : null,
      gpa: education?.gpa || "",
      honors: education?.honors || "",
      relevantCoursework: education?.relevantCoursework || "",
    },
  });

  const {
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={form.handleSubmit(onSave)}
      className="space-y-4 p-4 border rounded-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="schoolName">School Name *</Label>
          <Input
            id="schoolName"
            {...form.register("schoolName")}
            className={cn(errors.schoolName && "border-red-500")}
          />
          {errors.schoolName && (
            <p className="text-xs text-red-600 mt-1">
              {errors.schoolName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...form.register("location")}
            placeholder="City, State"
            className={cn(errors.location && "border-red-500")}
          />
          {errors.location && (
            <p className="text-xs text-red-600 mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            {...form.register("degree")}
            placeholder="e.g., Bachelor of Science"
            className={cn(errors.degree && "border-red-500")}
          />
          {errors.degree && (
            <p className="text-xs text-red-600 mt-1">{errors.degree.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="fieldOfStudy">Field of Study</Label>
          <Input
            id="fieldOfStudy"
            {...form.register("fieldOfStudy")}
            placeholder="e.g., Computer Science"
            className={cn(errors.fieldOfStudy && "border-red-500")}
          />
          {errors.fieldOfStudy && (
            <p className="text-xs text-red-600 mt-1">
              {errors.fieldOfStudy.message}
            </p>
          )}
        </div>

        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("startDate") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("startDate")
                  ? format(form.watch("startDate")!, "PPP")
                  : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("startDate") || undefined}
                onSelect={(date) => form.setValue("startDate", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("endDate") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("endDate")
                  ? format(form.watch("endDate")!, "PPP")
                  : "Pick end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("endDate") || undefined}
                onSelect={(date) => form.setValue("endDate", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="gpa">GPA</Label>
          <Input
            id="gpa"
            {...form.register("gpa")}
            placeholder="e.g., 3.8"
            className={cn(errors.gpa && "border-red-500")}
          />
          {errors.gpa && (
            <p className="text-xs text-red-600 mt-1">{errors.gpa.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="honors">Honors</Label>
          <Input
            id="honors"
            {...form.register("honors")}
            placeholder="e.g., Magna Cum Laude"
            className={cn(errors.honors && "border-red-500")}
          />
          {errors.honors && (
            <p className="text-xs text-red-600 mt-1">{errors.honors.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="relevantCoursework">Relevant Coursework</Label>
          <Textarea
            id="relevantCoursework"
            {...form.register("relevantCoursework")}
            placeholder="List relevant courses..."
            className={cn(errors.relevantCoursework && "border-red-500")}
          />
          {errors.relevantCoursework && (
            <p className="text-xs text-red-600 mt-1">
              {errors.relevantCoursework.message}
            </p>
          )}
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
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};

// Sub-component for displaying education entries
const EducationDisplay: React.FC<{
  educations: Education[];
  onEditEducation: (education: Education) => void;
}> = ({ educations, onEditEducation }) => {
  if (educations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No education entries added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educations.map((education) => (
        <div key={education.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-semibold">{education.schoolName}</h4>
              {education.location && (
                <p className="text-sm text-muted-foreground">
                  {education.location}
                </p>
              )}
              <div className="text-sm">
                {education.degree && education.fieldOfStudy ? (
                  <p>
                    {education.degree} in {education.fieldOfStudy}
                  </p>
                ) : education.degree ? (
                  <p>{education.degree}</p>
                ) : education.fieldOfStudy ? (
                  <p>{education.fieldOfStudy}</p>
                ) : null}
              </div>
              <div className="text-sm text-muted-foreground">
                {education.startDate && education.endDate ? (
                  <p>
                    {format(new Date(education.startDate), "MMM yyyy")} -{" "}
                    {format(new Date(education.endDate), "MMM yyyy")}
                  </p>
                ) : education.startDate ? (
                  <p>
                    {format(new Date(education.startDate), "MMM yyyy")} -
                    Present
                  </p>
                ) : null}
              </div>
              {education.gpa && <p className="text-sm">GPA: {education.gpa}</p>}
              {education.honors && (
                <p className="text-sm italic">{education.honors}</p>
              )}
              {education.relevantCoursework && (
                <p className="text-sm mt-2">{education.relevantCoursework}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditEducation(education)}
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const EducationSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  // Data fetching
  const { data: educations = [], isLoading, error } = useEducationData();
  const createEducationMutation = useCreateEducation();
  const updateEducationMutation = useUpdateEducation();
  const deleteEducationMutation = useDeleteEducation();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAdding(false);
    setEditingEducation(null);
  };

  const handleAddEducation = () => {
    setIsAdding(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
  };

  const handleSaveNew = async (data: EducationFormData) => {
    try {
      await createEducationMutation.mutateAsync(data);
      toast.success("Education entry added successfully");
      setIsAdding(false);
    } catch (error) {
      toast.error("Failed to add education entry");
      console.error("Add education error:", error);
    }
  };

  const handleSaveEdit = async (data: EducationFormData) => {
    if (!editingEducation) return;
    try {
      await updateEducationMutation.mutateAsync({
        id: editingEducation.id,
        data,
      });
      toast.success("Education entry updated successfully");
      setEditingEducation(null);
    } catch (error) {
      toast.error("Failed to update education entry");
      console.error("Update education error:", error);
    }
  };

  const handleDelete = async (educationId: number) => {
    try {
      await deleteEducationMutation.mutateAsync(educationId);
      toast.success("Education entry deleted successfully");
      setEditingEducation(null);
    } catch (error) {
      toast.error("Failed to delete education entry");
      console.error("Delete education error:", error);
    }
  };

  const isSubmitting =
    createEducationMutation.isPending ||
    updateEducationMutation.isPending ||
    deleteEducationMutation.isPending;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load education information</p>
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
          isEditing && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Education</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-6">
            <EducationDisplay
              educations={educations}
              onEditEducation={handleEditEducation}
            />

            {editingEducation && (
              <EducationEntryForm
                education={editingEducation}
                onSave={handleSaveEdit}
                onCancel={() => setEditingEducation(null)}
                onDelete={() => handleDelete(editingEducation.id)}
                isSubmitting={isSubmitting}
              />
            )}

            {isAdding && (
              <EducationEntryForm
                onSave={handleSaveNew}
                onCancel={() => setIsAdding(false)}
                isSubmitting={isSubmitting}
              />
            )}

            {!isAdding && !editingEducation && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddEducation}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleCancel}>Done</Button>
            </div>
          </div>
        ) : (
          <EducationDisplay
            educations={educations}
            onEditEducation={handleEditEducation}
          />
        )}
      </Card>
    </ErrorBoundary>
  );
};

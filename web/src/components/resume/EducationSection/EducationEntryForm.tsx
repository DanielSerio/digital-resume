import React from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { educationSchema, type EducationFormData } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { Education } from "@/types";

interface EducationEntryFormProps {
  education?: Education;
  onSave: (data: EducationFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
}

export const EducationEntryForm: React.FC<EducationEntryFormProps> = ({
  education,
  onSave,
  onCancel,
  onDelete,
  isSubmitting,
}) => {
  const form = useForm<EducationFormData>({
    resolver: standardSchemaResolver(educationSchema),
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
                autoFocus
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
                autoFocus
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
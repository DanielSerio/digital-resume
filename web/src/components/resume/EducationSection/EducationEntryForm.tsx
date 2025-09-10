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
      schoolCity: education?.schoolCity || "",
      schoolState: education?.schoolState || "",
      degreeType: education?.degreeType || "",
      degreeTitle: education?.degreeTitle || "",
      dateStarted: education?.dateStarted ? new Date(education.dateStarted) : undefined,
      dateFinished: education?.dateFinished ? new Date(education.dateFinished) : null,
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
          <Label htmlFor="schoolCity">School City *</Label>
          <Input
            id="schoolCity"
            {...form.register("schoolCity")}
            placeholder="e.g., Boston"
            className={cn(errors.schoolCity && "border-red-500")}
          />
          {errors.schoolCity && (
            <p className="text-xs text-red-600 mt-1">
              {errors.schoolCity.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="schoolState">School State *</Label>
          <Input
            id="schoolState"
            {...form.register("schoolState")}
            placeholder="e.g., MA"
            className={cn(errors.schoolState && "border-red-500")}
          />
          {errors.schoolState && (
            <p className="text-xs text-red-600 mt-1">{errors.schoolState.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="degreeType">Degree Type *</Label>
          <Input
            id="degreeType"
            {...form.register("degreeType")}
            placeholder="e.g., BFA, MBA, BS"
            className={cn(errors.degreeType && "border-red-500")}
          />
          {errors.degreeType && (
            <p className="text-xs text-red-600 mt-1">
              {errors.degreeType.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="degreeTitle">Degree Title *</Label>
          <Input
            id="degreeTitle"
            {...form.register("degreeTitle")}
            placeholder="e.g., Computer Science"
            className={cn(errors.degreeTitle && "border-red-500")}
          />
          {errors.degreeTitle && (
            <p className="text-xs text-red-600 mt-1">
              {errors.degreeTitle.message}
            </p>
          )}
        </div>

        <div>
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("dateStarted") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("dateStarted")
                  ? format(form.watch("dateStarted")!, "PPP")
                  : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("dateStarted") || undefined}
                onSelect={(date) => form.setValue("dateStarted", date)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateStarted && (
            <p className="text-xs text-red-600 mt-1">
              {errors.dateStarted.message}
            </p>
          )}
        </div>

        <div>
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("dateFinished") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("dateFinished")
                  ? format(form.watch("dateFinished")!, "PPP")
                  : "Pick end date (optional)"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("dateFinished") || undefined}
                onSelect={(date) => form.setValue("dateFinished", date || null)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
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
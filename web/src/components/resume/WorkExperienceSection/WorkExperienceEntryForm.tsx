import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  completeWorkExperienceSchema,
  type CompleteWorkExperienceFormData,
} from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { WorkExperience } from "@/types";
import { LineEntryForm } from "./LineEntryForm";

interface WorkExperienceEntryFormProps {
  workExperience?: WorkExperience;
  onSave: (data: CompleteWorkExperienceFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
}

export const WorkExperienceEntryForm: React.FC<WorkExperienceEntryFormProps> = ({
  workExperience,
  onSave,
  onCancel,
  onDelete,
  isSubmitting,
}) => {
  const form = useForm<CompleteWorkExperienceFormData>({
    resolver: standardSchemaResolver(completeWorkExperienceSchema),
    defaultValues: {
      companyName: workExperience?.companyName || "",
      jobTitle: workExperience?.jobTitle || "",
      location: workExperience?.location || "",
      startDate: workExperience?.startDate
        ? new Date(workExperience.startDate)
        : null,
      endDate: workExperience?.endDate
        ? new Date(workExperience.endDate)
        : null,
      description: workExperience?.description || "",
      lines: workExperience?.workExperienceLines?.map((line) => ({
        lineText: line.lineText,
        sortOrder: line.sortOrder || 0,
      })) || [{ lineText: "", sortOrder: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const {
    formState: { errors },
  } = form;

  const handleAddLine = () => {
    append({ lineText: "", sortOrder: fields.length });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSave)}
      className="space-y-4 p-4 border rounded-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company *</Label>
          <Input
            id="companyName"
            {...form.register("companyName")}
            className={cn(errors.companyName && "border-red-500")}
          />
          {errors.companyName && (
            <p className="text-xs text-red-600 mt-1">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="jobTitle">Position *</Label>
          <Input
            id="jobTitle"
            {...form.register("jobTitle")}
            className={cn(errors.jobTitle && "border-red-500")}
          />
          {errors.jobTitle && (
            <p className="text-xs text-red-600 mt-1">
              {errors.jobTitle.message}
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
          <Label>Start Date *</Label>
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

        {true && (
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
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};
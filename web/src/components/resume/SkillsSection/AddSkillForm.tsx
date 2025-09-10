import React from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateTechnicalSkill,
  useSkillTaxonomy,
} from "@/hooks";
import {
  technicalSkillSchema,
  type TechnicalSkillFormData,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

interface AddSkillFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddSkillForm: React.FC<AddSkillFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { categories, subcategories } = useSkillTaxonomy();
  const createSkillMutation = useCreateTechnicalSkill();

  const form = useForm<TechnicalSkillFormData>({
    resolver: standardSchemaResolver(technicalSkillSchema),
    defaultValues: {
      name: "",
      categoryId: 0,
      subcategoryId: 0,
    },
  });

  const handleSubmit = async (data: TechnicalSkillFormData) => {
    try {
      await createSkillMutation.mutateAsync(data);
      toast.success("Skill added successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Failed to add skill");
      console.error("Add skill error:", error);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-3 p-4 border rounded-lg bg-muted/50"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="skillName">Skill Name *</Label>
          <Input
            id="skillName"
            {...form.register("name")}
            placeholder="e.g., React"
            className={cn(form.formState.errors.name && "border-red-500")}
          />
          {form.formState.errors.name && (
            <p className="text-xs text-red-600 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={form.watch("categoryId")?.toString() || ""}
            onValueChange={(value) =>
              form.setValue("categoryId", parseInt(value), {
                shouldValidate: true,
              })
            }
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
            <p className="text-xs text-red-600 mt-1">
              {form.formState.errors.categoryId.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="subcategory">Subcategory *</Label>
          <Select
            value={form.watch("subcategoryId")?.toString() || ""}
            onValueChange={(value) =>
              form.setValue("subcategoryId", parseInt(value), {
                shouldValidate: true,
              })
            }
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
            <p className="text-xs text-red-600 mt-1">
              {form.formState.errors.subcategoryId.message}
            </p>
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
          {createSkillMutation.isPending ? "Adding..." : "Add Skill"}
        </Button>
      </div>
    </form>
  );
};
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types";
import type { UseFormReturn } from "react-hook-form";
import type { ContactFormData } from "@/lib/validation";

interface ContactHeaderProps {
  isEditing: boolean;
  contact: Contact | undefined;
  form: UseFormReturn<ContactFormData>;
}

export function ContactHeader({
  isEditing,
  contact,
  form,
}: ContactHeaderProps) {
  if (isEditing) {
    return (
      <>
        <div className="flex flex-col gap-y-1 mt-2 min-w-[220px]">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...form.register("name")}
            className={cn(form.formState.errors.name && "border-red-500")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1 mt-2 min-w-[220px]">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...form.register("title")}
            className={cn(form.formState.errors.title && "border-red-500")}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl">{contact?.name}</h1>
      <h2 className="text-sm">{contact?.title}</h2>
    </>
  );
}

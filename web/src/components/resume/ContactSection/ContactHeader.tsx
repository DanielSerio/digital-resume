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
      <div role="group" aria-label="Personal information">
        <div className="flex flex-col gap-y-1 mt-2 min-w-[220px]">
          <Label htmlFor="name" id="name-label">Name *</Label>
          <Input
            id="name"
            {...form.register("name")}
            className={cn(form.formState.errors.name && "border-red-500")}
            role="textbox"
            aria-required="true"
            aria-invalid={!!form.formState.errors.name}
            aria-describedby={form.formState.errors.name ? "name-error" : undefined}
            aria-labelledby="name-label"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600 mt-1" id="name-error" role="alert">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1 mt-2 min-w-[220px]">
          <Label htmlFor="title" id="title-label">Title</Label>
          <Input
            id="title"
            {...form.register("title")}
            className={cn(form.formState.errors.title && "border-red-500")}
            role="textbox"
            aria-invalid={!!form.formState.errors.title}
            aria-describedby={form.formState.errors.title ? "title-error" : undefined}
            aria-labelledby="title-label"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-600 mt-1" id="title-error" role="alert">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl">{contact?.name}</h1>
      <h2 className="text-sm">{contact?.title}</h2>
    </>
  );
}

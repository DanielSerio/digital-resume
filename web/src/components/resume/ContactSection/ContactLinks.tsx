import { Input } from "@/components/ui/input";
import { ContactLinkControl } from "./ContactLinkControl";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types";
import type { UseFormReturn } from "react-hook-form";
import type { ContactFormData } from "@/lib/validation";

interface ContactLinksProps {
  isEditing: boolean;
  contact: Contact | undefined;
  form: UseFormReturn<ContactFormData>;
}

export function ContactLinks({ isEditing, contact, form }: ContactLinksProps) {
  return (
    <div className="flex flex-col min-w-[320px]" role="group" aria-label="Contact information">
      <ContactLinkControl
        isEditing={isEditing}
        label="Email"
        type="email"
        value={contact?.email || ""}
        fieldId="email"
      >
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          className={cn(form.formState.errors.email && "border-red-500")}
          role="textbox"
          aria-invalid={!!form.formState.errors.email}
          aria-describedby={form.formState.errors.email ? "email-error" : undefined}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600 mt-1" id="email-error" role="alert">
            {form.formState.errors.email.message}
          </p>
        )}
      </ContactLinkControl>

      <ContactLinkControl
        isEditing={isEditing}
        label="Phone"
        type="phone"
        value={contact?.phone || ""}
        fieldId="phone"
      >
        <Input
          id="phone"
          {...form.register("phone")}
          className={cn(form.formState.errors.phone && "border-red-500")}
          role="textbox"
          aria-invalid={!!form.formState.errors.phone}
          aria-describedby={form.formState.errors.phone ? "phone-error" : undefined}
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-600 mt-1" id="phone-error" role="alert">
            {form.formState.errors.phone.message}
          </p>
        )}
      </ContactLinkControl>

      <ContactLinkControl
        isEditing={isEditing}
        label="GitHub"
        value={contact?.github || ""}
        fieldId="github"
      >
        <Input
          id="github"
          {...form.register("github")}
          placeholder="https://github.com/username"
          className={cn(form.formState.errors.github && "border-red-500")}
          role="textbox"
          aria-invalid={!!form.formState.errors.github}
          aria-describedby={form.formState.errors.github ? "github-error" : undefined}
        />
        {form.formState.errors.github && (
          <p className="text-sm text-red-600 mt-1" id="github-error" role="alert">
            {form.formState.errors.github.message}
          </p>
        )}
      </ContactLinkControl>

      <ContactLinkControl
        isEditing={isEditing}
        label="Website"
        value={contact?.website || ""}
        fieldId="website"
      >
        <Input
          id="website"
          {...form.register("website")}
          placeholder="https://yoursite.com"
          className={cn(form.formState.errors.website && "border-red-500")}
          role="textbox"
          aria-invalid={!!form.formState.errors.website}
          aria-describedby={form.formState.errors.website ? "website-error" : undefined}
        />
        {form.formState.errors.website && (
          <p className="text-sm text-red-600 mt-1" id="website-error" role="alert">
            {form.formState.errors.website.message}
          </p>
        )}
      </ContactLinkControl>

      <ContactLinkControl
        isEditing={isEditing}
        label="LinkedIn"
        value={contact?.linkedin || ""}
        fieldId="linkedin"
      >
        <Input
          id="linkedin"
          {...form.register("linkedin")}
          placeholder="https://linkedin.com/in/username"
          className={cn(form.formState.errors.linkedin && "border-red-500")}
          role="textbox"
          aria-invalid={!!form.formState.errors.linkedin}
          aria-describedby={form.formState.errors.linkedin ? "linkedin-error" : undefined}
        />
        {form.formState.errors.linkedin && (
          <p className="text-sm text-red-600 mt-1" id="linkedin-error" role="alert">
            {form.formState.errors.linkedin.message}
          </p>
        )}
      </ContactLinkControl>
    </div>
  );
}

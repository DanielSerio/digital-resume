import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common";
import { ContactHeader } from "./ContactHeader";
import { ContactLinks } from "./ContactLinks";
import { ContactFormActions } from "./ContactFormActions";

import { useContactData, useUpdateContact } from "@/hooks";
import { contactSchema, type ContactFormData } from "@/lib/validation";
import { cn } from "@/lib/utils";

export const ContactSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Data fetching
  const { data: contact, isLoading, error } = useContactData();
  const updateContactMutation = useUpdateContact();

  // Form setup
  const form = useForm<ContactFormData>({
    resolver: standardSchemaResolver(contactSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "",
      github: "",
      website: "",
      linkedin: "",
    },
  });

  const {
    formState: { isDirty, isSubmitting },
  } = form;

  // Update form when data loads
  React.useEffect(() => {
    if (contact && !isEditing) {
      form.reset({
        name: contact.name,
        title: contact.title || "",
        email: contact.email || "",
        phone: contact.phone || "",
        github: contact.github || "",
        website: contact.website || "",
        linkedin: contact.linkedin || "",
      });
    }
  }, [contact, isEditing, form]);

  const handleEdit = () => {
    if (contact) {
      form.reset({
        name: contact.name,
        title: contact.title || "",
        email: contact.email || "",
        phone: contact.phone || "",
        github: contact.github || "",
        website: contact.website || "",
        linkedin: contact.linkedin || "",
      });
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleSave = async (data: ContactFormData) => {
    try {
      await updateContactMutation.mutateAsync(data);
      toast.success("Contact information updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update contact information");
      console.error("Contact update error:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load contact information</p>
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
        data-testid="ContactCard"
        className={cn(
          "p-6 transition-colors",
          isEditing && isDirty && "border-orange-500 border-2",
          "max-w-4xl mx-auto"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEdit}
              aria-label="Edit contact information"
              role="button"
            >
              Edit
            </Button>
          )}
        </div>

        <form 
          onSubmit={form.handleSubmit(handleSave)} 
          className="space-y-4" 
          role="form"
          aria-label="Contact information form"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-y-2">
              <ContactHeader
                isEditing={isEditing}
                contact={contact}
                form={form}
              />
            </div>

            <ContactLinks isEditing={isEditing} contact={contact} form={form} />
          </div>

          <ContactFormActions
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            onCancel={handleCancel}
          />
        </form>

        {!contact && !isEditing && (
          <div className="text-center text-muted-foreground py-8">
            <p>No contact information available</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="mt-2"
              aria-label="Add contact information"
              role="button"
            >
              Add Contact Information
            </Button>
          </div>
        )}
      </Card>
    </ErrorBoundary>
  );
};

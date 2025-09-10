import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/common';

import { useContactData, useUpdateContact } from '@/hooks';
import { contactSchema, type ContactFormData } from '@/lib/validation';
import { cn } from '@/lib/utils';

export const ContactSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Data fetching
  const { data: contact, isLoading, error } = useContactData();
  const updateContactMutation = useUpdateContact();

  // Form setup
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      title: '',
      email: '',
      phone: '',
      github: '',
      website: '',
      linkedin: '',
    },
  });

  const { formState: { isDirty, isSubmitting } } = form;

  // Update form when data loads
  React.useEffect(() => {
    if (contact && !isEditing) {
      form.reset({
        name: contact.name,
        title: contact.title || '',
        email: contact.email || '',
        phone: contact.phone || '',
        github: contact.github || '',
        website: contact.website || '',
        linkedin: contact.linkedin || '',
      });
    }
  }, [contact, isEditing, form]);

  const handleEdit = () => {
    if (contact) {
      form.reset({
        name: contact.name,
        title: contact.title || '',
        email: contact.email || '',
        phone: contact.phone || '',
        github: contact.github || '',
        website: contact.website || '',
        linkedin: contact.linkedin || '',
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
      toast.success('Contact information updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update contact information');
      console.error('Contact update error:', error);
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
        className={cn(
          "p-6 transition-colors",
          isEditing && isDirty && "border-orange-500 border-2"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  className={cn(form.formState.errors.name && "border-red-500")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  className={cn(form.formState.errors.title && "border-red-500")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  className={cn(form.formState.errors.email && "border-red-500")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  className={cn(form.formState.errors.phone && "border-red-500")}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  {...form.register('github')}
                  placeholder="https://github.com/username"
                  className={cn(form.formState.errors.github && "border-red-500")}
                />
                {form.formState.errors.github && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.github.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  {...form.register('website')}
                  placeholder="https://yoursite.com"
                  className={cn(form.formState.errors.website && "border-red-500")}
                />
                {form.formState.errors.website && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.website.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  {...form.register('linkedin')}
                  placeholder="https://linkedin.com/in/username"
                  className={cn(form.formState.errors.linkedin && "border-red-500")}
                />
                {form.formState.errors.linkedin && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.linkedin.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {contact ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    {contact.title && (
                      <p className="text-muted-foreground">{contact.title}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  {contact.email && (
                    <div className="text-sm">
                      <span className="font-medium">Email:</span> {contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="text-sm">
                      <span className="font-medium">Phone:</span> {contact.phone}
                    </div>
                  )}
                  {contact.github && (
                    <div className="text-sm">
                      <span className="font-medium">GitHub:</span> {contact.github}
                    </div>
                  )}
                  {contact.website && (
                    <div className="text-sm">
                      <span className="font-medium">Website:</span> {contact.website}
                    </div>
                  )}
                  {contact.linkedin && (
                    <div className="text-sm">
                      <span className="font-medium">LinkedIn:</span> {contact.linkedin}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No contact information available</p>
                <Button variant="outline" size="sm" onClick={handleEdit} className="mt-2">
                  Add Contact Information
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </ErrorBoundary>
  );
};
import { prisma } from '../lib/prisma';
import { AppError, ApiResponse, createSuccessResponse } from '../lib/errors';
import { ContactSchema, UpdateContactSchema, ContactInput, UpdateContactInput } from '../lib/validation';
import { Contact } from '@prisma/client';

export class ContactService {
  
  async getContact(): Promise<ApiResponse<Contact | null>> {
    try {
      const contact = await prisma.contact.findFirst();
      return createSuccessResponse(contact, contact ? 'Contact retrieved successfully' : 'No contact found');
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw new AppError('Failed to fetch contact', 500);
    }
  }

  async createContact(data: ContactInput): Promise<ApiResponse<Contact>> {
    try {
      // Validate input
      const validatedData = ContactSchema.parse(data);
      
      // Check if contact already exists (single-user app)
      const existingContact = await prisma.contact.findFirst();
      if (existingContact) {
        throw new AppError('Contact already exists. Use update instead.', 409);
      }

      const contact = await prisma.contact.create({
        data: validatedData,
      });

      return createSuccessResponse(contact, 'Contact created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error creating contact:', error);
      throw new AppError('Failed to create contact', 500);
    }
  }

  async updateContact(data: UpdateContactInput): Promise<ApiResponse<Contact>> {
    try {
      // Validate input
      const validatedData = UpdateContactSchema.parse(data);
      
      // Get existing contact
      const existingContact = await prisma.contact.findFirst();
      if (!existingContact) {
        throw new AppError('Contact not found', 404);
      }

      const updatedContact = await prisma.contact.update({
        where: { id: existingContact.id },
        data: validatedData,
      });

      return createSuccessResponse(updatedContact, 'Contact updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating contact:', error);
      throw new AppError('Failed to update contact', 500);
    }
  }

  async deleteContact(): Promise<ApiResponse<null>> {
    try {
      const existingContact = await prisma.contact.findFirst();
      if (!existingContact) {
        throw new AppError('Contact not found', 404);
      }

      await prisma.contact.delete({
        where: { id: existingContact.id },
      });

      return createSuccessResponse(null, 'Contact deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting contact:', error);
      throw new AppError('Failed to delete contact', 500);
    }
  }
}
import { ContactService } from '../services/ContactService';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';

// Mock Prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    contact: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('ContactService', () => {
  let contactService: ContactService;

  beforeEach(() => {
    contactService = new ContactService();
    jest.clearAllMocks();
  });

  describe('getContact', () => {
    it('should return contact when it exists', async () => {
      const mockContact = {
        id: 1,
        name: 'John Doe',
        title: 'Software Engineer',
        email: 'john@example.com',
        phone: '123-456-7890',
        github: 'https://github.com/johndoe',
        website: 'https://johndoe.dev',
        linkedin: 'https://linkedin.com/in/johndoe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.contact.findFirst.mockResolvedValue(mockContact);

      const result = await contactService.getContact();

      expect(result.data).toEqual(mockContact);
      expect(result.message).toBe('Contact retrieved successfully');
      expect(mockedPrisma.contact.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should return null when no contact exists', async () => {
      mockedPrisma.contact.findFirst.mockResolvedValue(null);

      const result = await contactService.getContact();

      expect(result.data).toBeNull();
      expect(result.message).toBe('No contact found');
    });
  });

  describe('createContact', () => {
    const validContactData = {
      name: 'John Doe',
      title: 'Software Engineer',
      email: 'john@example.com',
      phone: '123-456-7890',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
    };

    it('should create contact when none exists', async () => {
      const mockCreatedContact = {
        id: 1,
        ...validContactData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedPrisma.contact.findFirst.mockResolvedValue(null);
      mockedPrisma.contact.create.mockResolvedValue(mockCreatedContact);

      const result = await contactService.createContact(validContactData);

      expect(result.data).toEqual(mockCreatedContact);
      expect(result.message).toBe('Contact created successfully');
      expect(mockedPrisma.contact.create).toHaveBeenCalledWith({
        data: validContactData,
      });
    });

    it('should throw error when contact already exists', async () => {
      const existingContact = { id: 1, name: 'Existing User' };
      mockedPrisma.contact.findFirst.mockResolvedValue(existingContact as any);

      await expect(contactService.createContact(validContactData))
        .rejects
        .toThrow(new AppError('Contact already exists. Use update instead.', 409));
    });

    it('should throw error for invalid email', async () => {
      const invalidData = { ...validContactData, email: 'invalid-email' };
      
      await expect(contactService.createContact(invalidData))
        .rejects
        .toThrow();
    });
  });

  describe('updateContact', () => {
    it('should update existing contact', async () => {
      const existingContact = { id: 1, name: 'John Doe' };
      const updateData = { name: 'Jane Doe', email: 'jane@example.com' };
      const updatedContact = { ...existingContact, ...updateData };

      mockedPrisma.contact.findFirst.mockResolvedValue(existingContact as any);
      mockedPrisma.contact.update.mockResolvedValue(updatedContact as any);

      const result = await contactService.updateContact(updateData);

      expect(result.data).toEqual(updatedContact);
      expect(result.message).toBe('Contact updated successfully');
      expect(mockedPrisma.contact.update).toHaveBeenCalledWith({
        where: { id: existingContact.id },
        data: updateData,
      });
    });

    it('should throw error when contact does not exist', async () => {
      mockedPrisma.contact.findFirst.mockResolvedValue(null);

      await expect(contactService.updateContact({ name: 'Jane Doe' }))
        .rejects
        .toThrow(new AppError('Contact not found', 404));
    });
  });

  describe('deleteContact', () => {
    it('should delete existing contact', async () => {
      const existingContact = { id: 1, name: 'John Doe' };
      mockedPrisma.contact.findFirst.mockResolvedValue(existingContact as any);
      mockedPrisma.contact.delete.mockResolvedValue(existingContact as any);

      const result = await contactService.deleteContact();

      expect(result.data).toBeNull();
      expect(result.message).toBe('Contact deleted successfully');
      expect(mockedPrisma.contact.delete).toHaveBeenCalledWith({
        where: { id: existingContact.id },
      });
    });

    it('should throw error when contact does not exist', async () => {
      mockedPrisma.contact.findFirst.mockResolvedValue(null);

      await expect(contactService.deleteContact())
        .rejects
        .toThrow(new AppError('Contact not found', 404));
    });
  });
});
import { createContact, deleteContact, getAllContacts, updateContact } from '../services/contacts.js';
import { getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  try {
      const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error('Error getting contacts:', error.message);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
   throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
  } catch (error) {
    next(error);
  }

};

export const createContactController = async (req, res) => {
  try {
    const contacts = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: contacts,
    });
  } catch (error) {
    console.error('Error creating contact', error.message);
  }


};

export const updateContactController = async (req, res, next) => {
  try {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);

  if (!contact) {
   throw createHttpError(404, "Contact not found");
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contact,
  });
  } catch (error) {
    next(error);
  }

};


export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
   throw createHttpError(404, "Contact not found");
  }

res.status(204).send();
  } catch (error) {
    next(error);
  }

};

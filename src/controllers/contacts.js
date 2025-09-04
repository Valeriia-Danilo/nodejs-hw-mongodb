import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContact,
} from '../services/contacts.js';
import { getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId: req.user._id
  });

  const message =
    contacts.totalItems === 0
      ? `Successfully found ${contacts.totalItems} contacts!`
      : 'Successfully found contacts!';

  res.status(200).json({
    status: 200,
    message: message,
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById({contactId, userId: req.user._id});

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {

  let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file);
  }

  const updateData = {
    ...req.body,
    photo: photoUrl || 'no photo',
  };

  const contacts = await createContact({ ...updateData, userId: req.user._id});

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contacts,
  });
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file);
  }

  const contact = await updateContact({
  contactId,
  payload: {
    ...req.body,
    photo: photoUrl,
  },
  userId: req.user._id,
});

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact({ contactId, userId: req.user._id });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

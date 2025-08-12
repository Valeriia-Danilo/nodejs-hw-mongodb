import { ContactsCollection } from "../db/models/contacts.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const contacts = await ContactsCollection.create(payload);
    return contacts;
};

export const updateContact = async (contactId, payload) => {
    const contacts = await ContactsCollection.findByIdAndUpdate({_id: contactId}, payload, {new: true});
    return contacts;
};

export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findByIdAndDelete(contactId);
    return contact;
};

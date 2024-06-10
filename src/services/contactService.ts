import Contact from '../models/contact';
import { Sequelize, Op } from 'sequelize';


export const identifyContact = async (email?: string, phoneNumber?: string) => {

  const contacts = await Contact.findAll({
    where: {
      [Op.or]: [
        { email },
        { phoneNumber }
      ]
    }
  });

  let primaryContact: any = null;
  let allEmails = new Set();
  let allPhoneNumbers = new Set();
  let secondaryContactIds = new Set();

  if (contacts.length === 0) {
    primaryContact = await Contact.create({ email, phoneNumber });
  } else {
    primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary') || contacts[0];
    let newSecondaryContact = await Contact.create({
      email, phoneNumber,
      linkedId: primaryContact.id,
      linkPrecedence: 'secondary'
    });

    for (const contact of contacts) {
      if (contact.email) allEmails.add(contact.email);
      if (contact.phoneNumber) allPhoneNumbers.add(contact.phoneNumber);
      if (contact.id !== primaryContact.id) {
        secondaryContactIds.add(contact.id);
      }
    }
    secondaryContactIds.add(newSecondaryContact.id);


    if (newSecondaryContact.email) allEmails.add(newSecondaryContact.email);
    if (newSecondaryContact.phoneNumber) allPhoneNumbers.add(newSecondaryContact.phoneNumber);

  }

  if (primaryContact.email) allEmails.add(primaryContact.email);
  if (primaryContact.phoneNumber) allPhoneNumbers.add(primaryContact.phoneNumber);






  const response = {
    contact: {
      primaryContatctId: primaryContact.id,
      emails: Array.from(allEmails),
      phoneNumbers: Array.from(allPhoneNumbers),
      secondaryContactIds: Array.from(secondaryContactIds)
    }
  };

  return (response);

};


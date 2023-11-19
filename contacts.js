const fs = require('node:fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');
class Contacts {
  constructor(path) {
    this.path = path;
  }
  async read() {
    const data = await fs.readFile(this.path);
    return JSON.parse(data.toString());
  }

  async listContacts() {
    const contacts = await this.read();
    console.table(contacts);
    return true;
  }

  async getContactById(id) {
    const contacts = await this.read();
    const contact = contacts.find(itm => itm.id === id);
    return contact || null;
  }
  async removeContact(id) {
    const contacts = await this.read();
    const idx = contacts.findIndex(itm => itm.id === id);
    if (idx === -1) {
      console.log(`User with id ${id} not found`);
      return null;
    }
    const removedContact = contacts.splice(idx, 1)[0];
    const dataString = JSON.stringify(contacts, null, 2);
    await fs.writeFile(this.path, dataString);
    return removedContact;
  }
  async addContact(data, id) {
    const contacts = await this.read();
    const newContact = {
      id: nanoid(),
      ...data,
    };
    contacts.push(newContact);
    const dataString = JSON.stringify(contacts, null, 2);
    await fs.writeFile(this.path, dataString);
    return newContact;
  }
}
const contacts = new Contacts(contactsPath);
module.exports = contacts;

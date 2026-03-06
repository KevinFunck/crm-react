import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { CustomerType } from "../../types/Customer";

interface Props {
  customers: CustomerType[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}

export default function CustomerDetail({ customers, setCustomers }: Props) {

  // ---------------------------
  // Get company ID from URL
  // ---------------------------
  const { id } = useParams<{ id: string }>();

  // ---------------------------
  // Find selected customer
  // ---------------------------
  const customer = customers.find(c => c.id === id);

  // ---------------------------
  // Notes for company
  // ---------------------------
  const [newNote, setNewNote] = useState("");

  // ---------------------------
  // Contact creation modal
  // ---------------------------
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "" });

  // ---------------------------
  // Contact edit modal
  // ---------------------------
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  // ---------------------------
  // Contact notes
  // ---------------------------
  const [newContactNote, setNewContactNote] = useState("");

  if (!customer) return <div>Company not found</div>;

  // ---------------------------
  // Add company note
  // ---------------------------
  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedCustomers = customers.map(c =>
      c.id === customer.id
        ? {
            ...c,
            notes: [
              ...c.notes,
              { id: Date.now().toString(), text: newNote, createdAt: new Date().toLocaleString() },
            ],
          }
        : c
    );

    setCustomers(updatedCustomers);
    setNewNote("");
  };

  // ---------------------------
  // Add contact person
  // ---------------------------
  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) return;

    const updatedCustomers = customers.map(c =>
      c.id === customer.id
        ? {
            ...c,
            contacts: [
              ...c.contacts,
              {
                id: Date.now().toString(),
                ...newContact,
                notes: []
              },
            ],
          }
        : c
    );

    setCustomers(updatedCustomers);
    setNewContact({ name: "", email: "", phone: "" });
    setIsContactModalOpen(false);
  };

  // ---------------------------
  // Open edit modal
  // ---------------------------
  const openEditContactModal = (contact: any) => {
    setSelectedContact(contact);
    setIsEditContactModalOpen(true);
  };

  // ---------------------------
  // Update contact information
  // ---------------------------
  const handleUpdateContact = () => {
    const updatedCustomers = customers.map(c =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.map(contact =>
              contact.id === selectedContact.id ? selectedContact : contact
            ),
          }
        : c
    );

    setCustomers(updatedCustomers);
    setIsEditContactModalOpen(false);
  };

  // ---------------------------
  // Delete contact
  // ---------------------------
  const handleDeleteContact = () => {
    const updatedCustomers = customers.map(c =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.filter(contact => contact.id !== selectedContact.id),
          }
        : c
    );

    setCustomers(updatedCustomers);
    setIsEditContactModalOpen(false);
  };

  // ---------------------------
  // Add note to a contact person
  // ---------------------------
  const handleAddContactNote = () => {
    if (!newContactNote.trim()) return;

    const updatedCustomers = customers.map(c =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.map(contact =>
              contact.id === selectedContact.id
                ? {
                    ...contact,
                    notes: [
                      ...(contact.notes || []),
                      {
                        id: Date.now().toString(),
                        text: newContactNote,
                        createdAt: new Date().toLocaleString(),
                      },
                    ],
                  }
                : contact
            ),
          }
        : c
    );

    setCustomers(updatedCustomers);
    setNewContactNote("");
  };

  return (
    <div className="space-y-6">

      {/* Company Header */}
      <div className="bg-gray-800 text-white rounded-lg px-6 py-4 shadow">
        <h1 className="text-2xl font-semibold">{customer.companyName}</h1>
      </div>

      {/* Company Info */}
      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <p><strong>Email:</strong> {customer.companyEmail}</p>
        <p><strong>Phone:</strong> {customer.companyPhone}</p>
      </div>

      {/* Contact Persons */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Contact Persons</h2>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
          >
            Add Contact
          </button>
        </div>

        {customer.contacts.map(contact => (
          <div
            key={contact.id}
            onClick={() => openEditContactModal(contact)}
            className="border-b pb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <p className="font-medium">{contact.name}</p>
            <p className="text-sm text-gray-600">{contact.email}</p>
            <p className="text-sm text-gray-600">{contact.phone}</p>
          </div>
        ))}
      </div>

      {/* Company Notes */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Company Notes</h2>

        {customer.notes.map(note => (
          <div key={note.id} className="border-b pb-2">
            <p>{note.text}</p>
            <p className="text-xs text-gray-500">{note.createdAt}</p>
          </div>
        ))}

        <textarea
          placeholder="Write a note..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          onClick={handleAddNote}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Note
        </button>
      </div>

      {/* Add Contact Modal */}
      <Dialog open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black/50" />

        <Dialog.Panel className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-md w-full text-white">
          <Dialog.Title className="text-xl font-bold mb-4">
            Add Contact Person
          </Dialog.Title>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newContact.name}
              onChange={e => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />

            <input
              type="email"
              placeholder="Email"
              value={newContact.email}
              onChange={e => setNewContact({ ...newContact, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />

            <input
              type="text"
              placeholder="Phone"
              value={newContact.phone}
              onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>

            <button onClick={handleAddContact} className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
              Add
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={isEditContactModalOpen} onClose={() => setIsEditContactModalOpen(false)} className="fixed inset-0 flex items-center justify-center z-50">

        <div className="fixed inset-0 bg-black/50" />

        <Dialog.Panel className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-2xl w-full text-white">

          <Dialog.Title className="text-xl font-bold mb-4">
            Contact Details
          </Dialog.Title>

          {selectedContact && (
            <>
              {/* Contact Information */}
              <div className="space-y-4 mb-6">

                <input
                  type="text"
                  value={selectedContact.name}
                  onChange={e => setSelectedContact({ ...selectedContact, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
                />

                <input
                  type="email"
                  value={selectedContact.email}
                  onChange={e => setSelectedContact({ ...selectedContact, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
                />

                <input
                  type="text"
                  value={selectedContact.phone}
                  onChange={e => setSelectedContact({ ...selectedContact, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
                />

              </div>

              {/* Contact Notes Section */}
              <div className="space-y-3">

                <h3 className="text-lg font-semibold">Contact Notes</h3>

                {/* Scrollable notes container */}
                <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-700 rounded-lg p-3">

                  {(selectedContact.notes || []).map((note: any) => (
                    <div key={note.id} className="border-b border-gray-700 pb-2">
                      <p>{note.text}</p>
                      <p className="text-xs text-gray-400">{note.createdAt}</p>
                    </div>
                  ))}

                </div>

                <textarea
                  placeholder="Add note for this contact..."
                  value={newContactNote}
                  onChange={e => setNewContactNote(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
                />

                <button
                  onClick={handleAddContactNote}
                  className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Contact Note
                </button>

              </div>
            </>
          )}

          <div className="mt-6 flex justify-between">

            <button
              onClick={handleDeleteContact}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete Contact
            </button>

            <div className="space-x-2">
              <button
                onClick={() => setIsEditContactModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateContact}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>

          </div>
        </Dialog.Panel>
      </Dialog>

    </div>
  );
}
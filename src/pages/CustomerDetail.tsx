import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { CustomerType } from "../types/Customer";

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
  // Local state
  // ---------------------------
  const [newNote, setNewNote] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // ---------------------------
  // Find selected customer
  // ---------------------------
  const customer = customers.find(c => c.id === id);

  if (!customer) return <div>Company not found</div>;

  // ---------------------------
  // Add note
  // ---------------------------
  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedCustomers = customers.map(c =>
      c.id === customer.id
        ? {
            ...c,
            notes: [
              ...c.notes,
              {
                id: Date.now().toString(),
                text: newNote,
                createdAt: new Date().toLocaleString()
              }
            ]
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
                ...newContact
              }
            ]
          }
        : c
    );

    setCustomers(updatedCustomers);

    setNewContact({
      name: "",
      email: "",
      phone: ""
    });

    setIsContactModalOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* Company Header */}
      <div className="bg-gray-800 text-white rounded-lg px-6 py-4 shadow">
        <h1 className="text-2xl font-semibold">
          {customer.companyName}
        </h1>
      </div>

      {/* Company Info */}
      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <p><strong>Email:</strong> {customer.companyEmail}</p>
        <p><strong>Phone:</strong> {customer.companyPhone}</p>
      </div>

      {/* Contacts */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Contact Persons
          </h2>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
          >
            Add Contact
          </button>
        </div>

        {customer.contacts.map(contact => (
          <div key={contact.id} className="border-b pb-2">
            <p className="font-medium">{contact.name}</p>
            <p className="text-sm text-gray-600">{contact.email}</p>
            <p className="text-sm text-gray-600">{contact.phone}</p>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <h2 className="text-xl font-semibold">Notes</h2>

        {customer.notes.map(note => (
          <div key={note.id} className="border-b pb-2">
            <p>{note.text}</p>
            <p className="text-xs text-gray-500">
              {note.createdAt}
            </p>
          </div>
        ))}

        <div className="pt-4 space-y-2">
          <textarea
            placeholder="Write a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            onClick={handleAddNote}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Note
          </button>
        </div>

      </div>

      {/* Contact Modal */}
      <Dialog
        open={isContactModalOpen}
        onClose={setIsContactModalOpen}
        className="relative z-50"
      >

        <DialogBackdrop className="fixed inset-0 bg-black/50" />

        <div className="fixed inset-0 flex items-center justify-center p-4">

          <DialogPanel className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-md w-full text-white">

            <DialogTitle className="text-xl font-bold mb-4">
              Add Contact Person
            </DialogTitle>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
              />

              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
              />

              <input
                type="text"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
              />

            </div>

            <div className="mt-6 flex justify-end gap-2">

              <button
                onClick={() => setIsContactModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddContact}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>

            </div>

          </DialogPanel>

        </div>

      </Dialog>

    </div>
  );
}
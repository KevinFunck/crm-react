import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { CustomerType } from "../../types/Customer";

/*
Props coming from parent component
customers = list of all companies
setCustomers = state setter to update companies
*/
interface Props {
  customers: CustomerType[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}

export default function CustomerDetail({ customers, setCustomers }: Props) {

  /*
  Get company ID from URL
  Example route: /customer/123
  */
  const { id } = useParams<{ id: string }>();

  /*
  Find the selected company inside the customers array
  */
  const customer = customers.find((c) => c.id === id);

  /*
  State for new company note input
  */
  const [newNote, setNewNote] = useState("");

  /*
  Modal state for creating a new contact
  */
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  /*
  State for new contact form fields
  */
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  /*
  Modal state for editing/viewing an existing contact
  */
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);

  /*
  Currently selected contact
  */
  const [selectedContact, setSelectedContact] = useState<any>(null);

  /*
  Input state for a new contact note
  */
  const [newContactNote, setNewContactNote] = useState("");

  /*
  If no company was found -> show fallback message
  */
  if (!customer) return <div>Company not found</div>;

  // ------------------------------------------------
  // ADD COMPANY NOTE
  // ------------------------------------------------

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    /*
    Update customers array
    Add note only to the selected company
    */
    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            notes: [
              ...c.notes,
              {
                id: Date.now().toString(),
                text: newNote,
                createdAt: new Date().toLocaleString(),
              },
            ],
          }
        : c
    );

    setCustomers(updatedCustomers);

    /*
    Reset input field
    */
    setNewNote("");
  };

  // ------------------------------------------------
  // DELETE COMPANY NOTE
  // ------------------------------------------------

  const handleDeleteNote = (noteId: string) => {

    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            notes: c.notes.filter((n) => n.id !== noteId),
          }
        : c
    );

    setCustomers(updatedCustomers);
  };

  // ------------------------------------------------
  // ADD CONTACT PERSON
  // ------------------------------------------------

  const handleAddContact = () => {

    /*
    Basic validation
    */
    if (!newContact.name || !newContact.email) return;

    /*
    Create new contact object
    */
    const contact = {
      id: Date.now().toString(),
      ...newContact,
      notes: [],
    };

    /*
    Add contact to the selected company
    */
    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: [...c.contacts, contact],
          }
        : c
    );

    setCustomers(updatedCustomers);

    /*
    Open contact detail modal immediately
    */
    setSelectedContact(contact);
    setIsContactModalOpen(false);
    setIsEditContactModalOpen(true);

    /*
    Reset form fields
    */
    setNewContact({ name: "", email: "", phone: "" });
  };

  // ------------------------------------------------
  // OPEN CONTACT DETAIL MODAL
  // ------------------------------------------------

  const openEditContactModal = (contact: any) => {
    setSelectedContact(contact);
    setIsEditContactModalOpen(true);
  };

  // ------------------------------------------------
  // UPDATE CONTACT INFORMATION
  // ------------------------------------------------

  const handleUpdateContact = () => {

    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.map((contact) =>
              contact.id === selectedContact.id ? selectedContact : contact
            ),
          }
        : c
    );

    setCustomers(updatedCustomers);

    /*
    Close modal after saving
    */
    setIsEditContactModalOpen(false);
  };

  // ------------------------------------------------
  // DELETE CONTACT
  // ------------------------------------------------

  const handleDeleteContact = () => {

    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.filter(
              (contact) => contact.id !== selectedContact.id
            ),
          }
        : c
    );

    setCustomers(updatedCustomers);

    setIsEditContactModalOpen(false);
  };

  // ------------------------------------------------
  // ADD NOTE TO CONTACT
  // ------------------------------------------------

  const handleAddContactNote = () => {

    if (!newContactNote.trim()) return;

    const note = {
      id: Date.now().toString(),
      text: newContactNote,
      createdAt: new Date().toLocaleString(),
    };

    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.map((contact) =>
              contact.id === selectedContact.id
                ? {
                    ...contact,
                    notes: [...(contact.notes || []), note],
                  }
                : contact
            ),
          }
        : c
    );

    setCustomers(updatedCustomers);

    /*
    Also update selectedContact locally
    so UI refreshes immediately
    */
    setSelectedContact({
      ...selectedContact,
      notes: [...(selectedContact.notes || []), note],
    });

    setNewContactNote("");
  };

  // ------------------------------------------------
  // DELETE CONTACT NOTE
  // ------------------------------------------------

  const handleDeleteContactNote = (noteId: string) => {

    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.map((contact) =>
              contact.id === selectedContact.id
                ? {
                    ...contact,
                    notes: contact.notes.filter((n: any) => n.id !== noteId),
                  }
                : contact
            ),
          }
        : c
    );

    setCustomers(updatedCustomers);

    setSelectedContact({
      ...selectedContact,
      notes: selectedContact.notes.filter((n: any) => n.id !== noteId),
    });
  };

  return (
    <div className="space-y-6">

      {/* ------------------------------------------------
      COMPANY HEADER
      ------------------------------------------------ */}

      <div className="bg-gray-800 text-white rounded-lg px-6 py-4 shadow">
        <h1 className="text-2xl font-semibold">{customer.companyName}</h1>
      </div>

      {/* ------------------------------------------------
      COMPANY INFORMATION
      ------------------------------------------------ */}

      <div className="bg-white p-6 rounded-lg shadow space-y-2">
        <p><strong>Email:</strong> {customer.companyEmail}</p>
        <p><strong>Phone:</strong> {customer.companyPhone}</p>
      </div>

      {/* ------------------------------------------------
      CONTACT PERSONS
      ------------------------------------------------ */}

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Contact Persons</h2>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg"
          >
            Add Contact
          </button>
        </div>

        {customer.contacts.map((contact) => (
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

      {/* ------------------------------------------------
      COMPANY NOTES
      ------------------------------------------------ */}

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <h2 className="text-xl font-semibold">Company Notes</h2>

        {customer.notes.map((note) => (

          <div key={note.id} className="border-b pb-2 flex justify-between">

            <div>
              <p>{note.text}</p>
              <p className="text-xs text-gray-500">{note.createdAt}</p>
            </div>

            <button
              onClick={() => handleDeleteNote(note.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>

          </div>
        ))}

        <textarea
          placeholder="Write a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          onClick={handleAddNote}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Note
        </button>

      </div>

      {/* ------------------------------------------------
      ADD CONTACT MODAL
      ------------------------------------------------ */}

      <Dialog
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        className="relative z-50"
      >

        <div className="fixed inset-0 bg-black/50" />

        <div className="fixed inset-0 flex items-center justify-center p-4">

          <Dialog.Panel className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-md w-full text-white">

            <Dialog.Title className="text-xl font-bold mb-4">
              Add Contact
            </Dialog.Title>

            {/* Contact form */}

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-800"
              />

              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-800"
              />

              <input
                type="text"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-800"
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
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                Add
              </button>

            </div>

          </Dialog.Panel>

        </div>

      </Dialog>

      {/* ------------------------------------------------
      CONTACT DETAIL MODAL
      ------------------------------------------------ */}

      <Dialog
        open={isEditContactModalOpen}
        onClose={() => setIsEditContactModalOpen(false)}
        className="relative z-50"
      >

        <div className="fixed inset-0 bg-black/50" />

        <div className="fixed inset-0 flex items-center justify-center p-4">

          <Dialog.Panel className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-2xl w-full text-white">

            {selectedContact && (

              <>
                <Dialog.Title className="text-xl font-bold mb-4">
                  Contact Details
                </Dialog.Title>

                {/* Contact info inputs */}

                <div className="space-y-4 mb-6">

                  <input
                    value={selectedContact.name}
                    onChange={(e) =>
                      setSelectedContact({
                        ...selectedContact,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-gray-800"
                  />

                  <input
                    value={selectedContact.email}
                    onChange={(e) =>
                      setSelectedContact({
                        ...selectedContact,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-gray-800"
                  />

                  <input
                    value={selectedContact.phone}
                    onChange={(e) =>
                      setSelectedContact({
                        ...selectedContact,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-gray-800"
                  />

                </div>

                {/* Contact Notes */}

                <h3 className="text-lg font-semibold mb-2">
                  Contact Notes
                </h3>

                <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-700 rounded-lg p-3">

                  {(selectedContact.notes || []).map((note: any) => (

                    <div
                      key={note.id}
                      className="border-b border-gray-700 pb-2 flex justify-between"
                    >

                      <div>
                        <p>{note.text}</p>
                        <p className="text-xs text-gray-400">
                          {note.createdAt}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteContactNote(note.id)}
                        className="text-red-400 text-sm"
                      >
                        Delete
                      </button>

                    </div>

                  ))}

                </div>

                <textarea
                  placeholder="Add note..."
                  value={newContactNote}
                  onChange={(e) => setNewContactNote(e.target.value)}
                  className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-800"
                />

                <button
                  onClick={handleAddContactNote}
                  className="bg-blue-600 px-4 py-2 mt-2 rounded-lg"
                >
                  Add Contact Note
                </button>

                {/* Modal buttons */}

                <div className="mt-6 flex justify-between">

                  <button
                    onClick={handleDeleteContact}
                    className="px-4 py-2 bg-red-600 rounded-lg"
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
                      className="px-4 py-2 bg-blue-600 rounded-lg"
                    >
                      Save
                    </button>

                  </div>

                </div>

              </>
            )}

          </Dialog.Panel>

        </div>

      </Dialog>

    </div>
  );
}
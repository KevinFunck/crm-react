import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Dialog } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { CustomerType, ContactPerson, Note } from "../../types/Customer";
import Toast from "../../components/Toast";

/* ---------------------------
   API base URL from environment variable
   Falls back to localhost for local development
--------------------------- */
const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

/* ---------------------------
   Props coming from parent component
   customers = list of all companies
   setCustomers = state setter to update companies
--------------------------- */
interface Props {
  customers: CustomerType[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}

export default function CustomerDetail({ customers, setCustomers }: Props) {

  /* ---------------------------
     Get company ID from URL
     Example route: /customers/123
  --------------------------- */
  const { id } = useParams<{ id: string }>();

  /* ---------------------------
     Find the selected company inside the customers array
  --------------------------- */
  const customer = customers.find((c) => c.id === id);

  /* ---------------------------
     State for new company note input
  --------------------------- */
  const [newNote, setNewNote] = useState("");

  /* ---------------------------
     Modal state for creating a new contact
  --------------------------- */
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  /* ---------------------------
     State for new contact form fields
  --------------------------- */
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "" });

  /* ---------------------------
     Modal state for editing/viewing an existing contact
  --------------------------- */
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);

  /* ---------------------------
     Currently selected contact (typed properly)
  --------------------------- */
  const [selectedContact, setSelectedContact] = useState<ContactPerson | null>(null);

  /* ---------------------------
     Input state for a new contact note
  --------------------------- */
  const [newContactNote, setNewContactNote] = useState("");

  /* ---------------------------
     Toast notification state
  --------------------------- */
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ---------------------------
     Stable toast close reference
  --------------------------- */
  const closeToast = useCallback(() => setToast(null), []);

  /* ---------------------------
     Load contacts and notes from backend when component mounts.
     Falls back silently if backend is unavailable.
  --------------------------- */
  useEffect(() => {
    if (!id) return;

    const fetchContactsAndNotes = async () => {
      try {
        const [contactsRes, notesRes] = await Promise.all([
          axios.get(`${API}/contacts?customer_id=${id}`),
          axios.get(`${API}/notes?customer_id=${id}`),
        ]);

        /* Map backend snake_case to frontend camelCase */
        const contacts: ContactPerson[] = (contactsRes.data || []).map((c: any) => ({
          id: String(c.id),
          name: c.name,
          email: c.email,
          phone: c.phone || "",
          notes: [],
        }));

        const notes: Note[] = (notesRes.data || []).map((n: any) => ({
          id: String(n.id),
          text: n.text,
          createdAt: n.created_at || n.createdAt,
        }));

        /* Update the parent customers state with the fetched data */
        setCustomers((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, contacts, notes } : c
          )
        );
      } catch {
        /* Backend unavailable — silently continue with existing state */
      }
    };

    fetchContactsAndNotes();
  }, [id, setCustomers]);

  /* ---------------------------
     Guard: show fallback if company is not found
  --------------------------- */
  if (!customer) return <div className="p-6 text-gray-500">Company not found.</div>;

  // ------------------------------------------------
  // ADD COMPANY NOTE
  // Sends note to backend and updates local state
  // ------------------------------------------------

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const tempNote: Note = {
      id: Date.now().toString(),
      text: newNote,
      createdAt: new Date().toISOString(),
    };

    /* Optimistic UI update */
    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? { ...c, notes: [...c.notes, tempNote] }
        : c
    );
    setCustomers(updatedCustomers);
    setNewNote("");

    try {
      /* Persist to backend */
      await axios.post(`${API}/notes`, {
        customer_id: customer.id,
        text: newNote,
      });
      setToast({ message: "Note added.", type: "success" });
    } catch {
      setToast({ message: "Note saved locally but could not sync to server.", type: "error" });
    }
  };

  // ------------------------------------------------
  // DELETE COMPANY NOTE
  // Removes note from state and syncs with backend
  // ------------------------------------------------

  const handleDeleteNote = async (noteId: string) => {
    /* Optimistic UI update */
    setCustomers(customers.map((c) =>
      c.id === customer.id
        ? { ...c, notes: c.notes.filter((n) => n.id !== noteId) }
        : c
    ));

    try {
      await axios.delete(`${API}/notes/${noteId}`);
    } catch {
      /* Deletion already applied in UI; backend sync failed silently */
    }
  };

  // ------------------------------------------------
  // ADD CONTACT PERSON
  // Creates a new contact and syncs it with backend
  // ------------------------------------------------

  const handleAddContact = async () => {

    /* Basic validation */
    if (!newContact.name || !newContact.email) return;

    /* Temporary contact with local ID until backend responds */
    const tempContact: ContactPerson = {
      id: Date.now().toString(),
      ...newContact,
      notes: [],
    };

    /* Add to state immediately */
    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? { ...c, contacts: [...c.contacts, tempContact] }
        : c
    );
    setCustomers(updatedCustomers);
    setIsContactModalOpen(false);

    /* Open the contact detail modal */
    setSelectedContact(tempContact);
    setIsEditContactModalOpen(true);
    setNewContact({ name: "", email: "", phone: "" });

    try {
      /* Persist to backend and replace temp ID with real ID */
      const res = await axios.post(`${API}/contacts`, {
        customer_id: customer.id,
        name: newContact.name,
        email: newContact.email,
        phone: newContact.phone,
      });

      const savedContact: ContactPerson = {
        id: String(res.data.id),
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || "",
        notes: [],
      };

      /* Replace the temp contact with the one from the server */
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customer.id
            ? {
                ...c,
                contacts: c.contacts.map((contact) =>
                  contact.id === tempContact.id ? savedContact : contact
                ),
              }
            : c
        )
      );
      setSelectedContact(savedContact);
      setToast({ message: "Contact added.", type: "success" });
    } catch {
      setToast({ message: "Contact saved locally but could not sync to server.", type: "error" });
    }
  };

  // ------------------------------------------------
  // OPEN CONTACT DETAIL MODAL
  // Sets the selected contact and opens the modal
  // ------------------------------------------------

  const openEditContactModal = (contact: ContactPerson) => {
    setSelectedContact(contact);
    setIsEditContactModalOpen(true);
  };

  // ------------------------------------------------
  // UPDATE CONTACT INFORMATION
  // Saves changes to the selected contact
  // ------------------------------------------------

  const handleUpdateContact = async () => {
    if (!selectedContact) return;

    /* Update contact inside the customers array */
    setCustomers(customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.map((contact) =>
              contact.id === selectedContact.id ? selectedContact : contact
            ),
          }
        : c
    ));
    setIsEditContactModalOpen(false);

    try {
      await axios.put(`${API}/contacts/${selectedContact.id}`, {
        name: selectedContact.name,
        email: selectedContact.email,
        phone: selectedContact.phone,
      });
      setToast({ message: "Contact updated.", type: "success" });
    } catch {
      setToast({ message: "Contact updated locally but could not sync to server.", type: "error" });
    }
  };

  // ------------------------------------------------
  // DELETE CONTACT
  // Removes the contact from state and backend
  // ------------------------------------------------

  const handleDeleteContact = async () => {
    if (!selectedContact) return;

    setCustomers(customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.filter((contact) => contact.id !== selectedContact.id),
          }
        : c
    ));
    setIsEditContactModalOpen(false);

    try {
      await axios.delete(`${API}/contacts/${selectedContact.id}`);
    } catch {
      /* Deletion already applied in UI; backend sync failed silently */
    }
  };

  // ------------------------------------------------
  // ADD NOTE TO CONTACT
  // Creates a note linked to a specific contact
  // ------------------------------------------------

  const handleAddContactNote = async () => {
    if (!newContactNote.trim() || !selectedContact) return;

    const note: Note = {
      id: Date.now().toString(),
      text: newContactNote,
      createdAt: new Date().toISOString(),
    };

    /* Update contact notes inside the customers array */
    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.map((contact) =>
              contact.id === selectedContact.id
                ? { ...contact, notes: [...(contact.notes || []), note] }
                : contact
            ),
          }
        : c
    );
    setCustomers(updatedCustomers);

    /* Also update selectedContact so the modal refreshes immediately */
    setSelectedContact({
      ...selectedContact,
      notes: [...(selectedContact.notes || []), note],
    });
    setNewContactNote("");

    try {
      await axios.post(`${API}/notes`, {
        customer_id: customer.id,
        contact_id: selectedContact.id,
        text: newContactNote,
      });
    } catch {
      /* Note saved locally; backend sync failed silently */
    }
  };

  // ------------------------------------------------
  // DELETE CONTACT NOTE
  // Removes a note from a specific contact
  // ------------------------------------------------

  const handleDeleteContactNote = async (noteId: string) => {
    if (!selectedContact) return;

    /* Update state */
    const updatedCustomers = customers.map((c) =>
      c.id === customer.id
        ? {
            ...c,
            contacts: c.contacts.map((contact) =>
              contact.id === selectedContact.id
                ? { ...contact, notes: contact.notes.filter((n: Note) => n.id !== noteId) }
                : contact
            ),
          }
        : c
    );
    setCustomers(updatedCustomers);

    setSelectedContact({
      ...selectedContact,
      notes: selectedContact.notes.filter((n: Note) => n.id !== noteId),
    });

    try {
      await axios.delete(`${API}/notes/${noteId}`);
    } catch {
      /* Deletion already applied in UI; backend sync failed silently */
    }
  };

  /* ---------------------------
     Format an ISO date string for display
  --------------------------- */
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
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
        <p><strong>Email:</strong> {customer.companyEmail || "—"}</p>
        <p><strong>Phone:</strong> {customer.companyPhone || "—"}</p>
      </div>

      {/* ------------------------------------------------
      CONTACT PERSONS
      ------------------------------------------------ */}
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

        {customer.contacts.length === 0 && (
          <p className="text-gray-400 text-sm">No contacts yet.</p>
        )}

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

        {customer.notes.length === 0 && (
          <p className="text-gray-400 text-sm">No notes yet.</p>
        )}

        {customer.notes.map((note) => (
          <div key={note.id} className="border-b pb-2 flex justify-between">
            <div>
              <p>{note.text}</p>
              <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
            </div>
            <button
              onClick={() => handleDeleteNote(note.id)}
              className="text-red-500 text-sm hover:underline"
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Note
        </button>

      </div>

      {/* ------------------------------------------------
      ADD CONTACT MODAL
      ------------------------------------------------ */}
      <Dialog open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-md w-full text-white">

            <Dialog.Title className="text-xl font-bold mb-4">Add Contact</Dialog.Title>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name *"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800"
              />
              <input
                type="email"
                placeholder="Email *"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded-lg">
                Cancel
              </button>
              <button onClick={handleAddContact} className="px-4 py-2 bg-blue-600 rounded-lg">
                Add
              </button>
            </div>

          </Dialog.Panel>
        </div>
      </Dialog>

      {/* ------------------------------------------------
      CONTACT DETAIL MODAL
      ------------------------------------------------ */}
      <Dialog open={isEditContactModalOpen} onClose={() => setIsEditContactModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-2xl w-full text-white">

            {selectedContact && (
              <>
                <Dialog.Title className="text-xl font-bold mb-4">Contact Details</Dialog.Title>

                {/* Contact info inputs */}
                <div className="space-y-4 mb-6">
                  <input
                    placeholder="Name"
                    value={selectedContact.name}
                    onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800"
                  />
                  <input
                    placeholder="Email"
                    type="email"
                    value={selectedContact.email}
                    onChange={(e) => setSelectedContact({ ...selectedContact, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800"
                  />
                  <input
                    placeholder="Phone"
                    type="tel"
                    value={selectedContact.phone || ""}
                    onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800"
                  />
                </div>

                {/* Contact notes list */}
                <h3 className="text-lg font-semibold mb-2">Contact Notes</h3>

                <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-700 rounded-lg p-3">
                  {(selectedContact.notes || []).length === 0 && (
                    <p className="text-gray-500 text-sm">No notes for this contact yet.</p>
                  )}
                  {(selectedContact.notes || []).map((note: Note) => (
                    <div key={note.id} className="border-b border-gray-700 pb-2 flex justify-between">
                      <div>
                        <p>{note.text}</p>
                        <p className="text-xs text-gray-400">{formatDate(note.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteContactNote(note.id)}
                        className="text-red-400 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add note input */}
                <textarea
                  placeholder="Add note..."
                  value={newContactNote}
                  onChange={(e) => setNewContactNote(e.target.value)}
                  className="w-full px-4 py-2 mt-3 rounded-lg bg-gray-800"
                />
                <button
                  onClick={handleAddContactNote}
                  className="bg-blue-600 px-4 py-2 mt-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Contact Note
                </button>

                {/* Modal action buttons */}
                <div className="mt-6 flex justify-between">
                  <button onClick={handleDeleteContact} className="px-4 py-2 bg-red-600 rounded-lg">
                    Delete Contact
                  </button>
                  <div className="space-x-2">
                    <button onClick={() => setIsEditContactModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded-lg">
                      Cancel
                    </button>
                    <button onClick={handleUpdateContact} className="px-4 py-2 bg-blue-600 rounded-lg">
                      Save
                    </button>
                  </div>
                </div>
              </>
            )}

          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

    </div>
  );
}

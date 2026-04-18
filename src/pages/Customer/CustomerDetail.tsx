import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useParams, useNavigate } from "react-router-dom";
import { CustomerType, ContactPerson, Note } from "../../types/Customer";
import Toast from "../../components/Toast";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

interface Props {
  customers: CustomerType[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}

/* Shared input styles */
const inputCls = "w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2.5 text-sm text-cyber-text placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-accent/60 focus:ring-1 focus:ring-cyber-accent/30 transition-colors";
const labelCls = "block text-[10px] font-semibold tracking-widest text-cyber-muted uppercase mb-1.5";

export default function CustomerDetail({ customers, setCustomers }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customer = customers.find((c) => c.id === id);

  const [newNote, setNewNote] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "" });
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactPerson | null>(null);
  const [newContactNote, setNewContactNote] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);
  const [notFound, setNotFound] = useState(false);

  /* If customers array is empty (direct nav / reload), fetch this customer first */
  useEffect(() => {
    if (!id || customer) return;
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${API}/customers/${id}`);
        const c = res.data;
        const loaded: CustomerType = {
          id: String(c.id),
          companyName: c.companyName || c.company_name || "",
          companyEmail: c.companyEmail || c.company_email || "",
          companyPhone: c.companyPhone || c.company_phone || "",
          contacts: [],
          notes: [],
        };
        setCustomers(prev => [...prev, loaded]);
      } catch {
        setNotFound(true);
      }
    };
    fetchCustomer();
  }, [id, customer, setCustomers]);

  /* Load contacts and notes from backend on mount */
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [contactsRes, notesRes] = await Promise.all([
          axios.get(`${API}/contacts?customer_id=${id}`),
          axios.get(`${API}/notes?customer_id=${id}`),
        ]);
        const contacts: ContactPerson[] = (contactsRes.data || []).map((c: any) => ({
          id: String(c.id), name: c.name, email: c.email, phone: c.phone || "", notes: [],
        }));
        const notes: Note[] = (notesRes.data || []).map((n: any) => ({
          id: String(n.id), text: n.text, createdAt: n.created_at || n.createdAt,
        }));
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, contacts, notes } : c));
      } catch { /* silently continue */ }
    };
    load();
  }, [id, setCustomers]);

  if (notFound) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-cyber-muted text-sm">Company not found.</p>
    </div>
  );

  if (!customer) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-cyber-muted text-sm animate-pulse">Loading…</p>
    </div>
  );

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const tempNote: Note = { id: Date.now().toString(), text: newNote, createdAt: new Date().toISOString() };
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, notes: [...c.notes, tempNote] } : c));
    setNewNote("");
    try {
      await axios.post(`${API}/notes`, { customer_id: customer.id, text: newNote });
      setToast({ message: "Note added.", type: "success" });
    } catch { setToast({ message: "Note saved locally but could not sync.", type: "error" }); }
  };

  const handleDeleteNote = async (noteId: string) => {
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, notes: c.notes.filter(n => n.id !== noteId) } : c));
    try { await axios.delete(`${API}/notes/${noteId}`); } catch { /* silent */ }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.email) return;
    const tempContact: ContactPerson = { id: Date.now().toString(), ...newContact, notes: [] };
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, contacts: [...c.contacts, tempContact] } : c));
    setIsContactModalOpen(false);
    setSelectedContact(tempContact);
    setIsEditContactModalOpen(true);
    setNewContact({ name: "", email: "", phone: "" });
    try {
      const res = await axios.post(`${API}/contacts`, { customer_id: customer.id, ...newContact });
      const saved: ContactPerson = { id: String(res.data.id), name: res.data.name, email: res.data.email, phone: res.data.phone || "", notes: [] };
      setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, contacts: c.contacts.map(ct => ct.id === tempContact.id ? saved : ct) } : c));
      setSelectedContact(saved);
      setToast({ message: "Contact added.", type: "success" });
    } catch { setToast({ message: "Contact saved locally but could not sync.", type: "error" }); }
  };

  const handleUpdateContact = async () => {
    if (!selectedContact) return;
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, contacts: c.contacts.map(ct => ct.id === selectedContact.id ? selectedContact : ct) } : c));
    setIsEditContactModalOpen(false);
    try {
      await axios.put(`${API}/contacts/${selectedContact.id}`, { name: selectedContact.name, email: selectedContact.email, phone: selectedContact.phone });
      setToast({ message: "Contact updated.", type: "success" });
    } catch { setToast({ message: "Contact updated locally but could not sync.", type: "error" }); }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, contacts: c.contacts.filter(ct => ct.id !== selectedContact.id) } : c));
    setIsEditContactModalOpen(false);
    try { await axios.delete(`${API}/contacts/${selectedContact.id}`); } catch { /* silent */ }
  };

  const handleAddContactNote = async () => {
    if (!newContactNote.trim() || !selectedContact) return;
    const note: Note = { id: Date.now().toString(), text: newContactNote, createdAt: new Date().toISOString() };
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, contacts: c.contacts.map(ct => ct.id === selectedContact.id ? { ...ct, notes: [...(ct.notes || []), note] } : ct) } : c));
    setSelectedContact({ ...selectedContact, notes: [...(selectedContact.notes || []), note] });
    setNewContactNote("");
    try { await axios.post(`${API}/notes`, { customer_id: customer.id, contact_id: selectedContact.id, text: newContactNote }); } catch { /* silent */ }
  };

  const handleDeleteContactNote = async (noteId: string) => {
    if (!selectedContact) return;
    setCustomers(customers.map(c => c.id === customer.id ? { ...c, contacts: c.contacts.map(ct => ct.id === selectedContact.id ? { ...ct, notes: ct.notes.filter((n: Note) => n.id !== noteId) } : ct) } : c));
    setSelectedContact({ ...selectedContact, notes: selectedContact.notes.filter((n: Note) => n.id !== noteId) });
    try { await axios.delete(`${API}/notes/${noteId}`); } catch { /* silent */ }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between bg-cyber-card border border-cyber-border rounded-lg px-5 py-3">
        <div>
          <p className="text-[9px] tracking-widest text-cyber-muted uppercase">Companies / Detail</p>
          <h1 className="text-base font-semibold text-cyber-text mt-0.5">{customer.companyName}</h1>
        </div>
        <button onClick={() => navigate("/customers")} className="text-xs border border-cyber-border text-cyber-muted rounded px-3 py-1.5 hover:text-cyber-text transition-colors">
          ← Back
        </button>
      </div>

      {/* Company info */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase mb-3">Company Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[9px] tracking-widest text-cyber-muted uppercase mb-1">Email</p>
            <p className="text-cyber-text">{customer.companyEmail || "—"}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-widest text-cyber-muted uppercase mb-1">Phone</p>
            <p className="text-cyber-text">{customer.companyPhone || "—"}</p>
          </div>
        </div>
      </div>

      {/* Contact persons */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">Contact Persons</p>
          <button onClick={() => setIsContactModalOpen(true)} className="text-xs bg-cyber-accent text-cyber-bg font-bold px-3 py-1.5 rounded hover:bg-cyber-accent-dim transition-colors">
            + Add Contact
          </button>
        </div>

        {customer.contacts.length === 0 && (
          <p className="text-sm text-cyber-muted py-2">No contacts yet.</p>
        )}

        <div className="space-y-1.5">
          {customer.contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => { setSelectedContact(contact); setIsEditContactModalOpen(true); }}
              className="flex items-center justify-between px-4 py-3 rounded border border-cyber-border/60 hover:border-cyber-accent/30 hover:bg-white/[0.02] cursor-pointer transition-all"
            >
              <div>
                <p className="text-sm font-medium text-cyber-text">{contact.name}</p>
                <p className="text-xs text-cyber-muted mt-0.5">{contact.email} {contact.phone && `· ${contact.phone}`}</p>
              </div>
              <svg className="w-4 h-4 text-cyber-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Company notes */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-3">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">Company Notes</p>

        {customer.notes.length === 0 && (
          <p className="text-sm text-cyber-muted py-1">No notes yet.</p>
        )}

        <div className="space-y-2">
          {customer.notes.map((note) => (
            <div key={note.id} className="flex justify-between items-start px-4 py-3 rounded border border-cyber-border/60 bg-cyber-surface/40">
              <div>
                <p className="text-sm text-cyber-text">{note.text}</p>
                <p className="text-[10px] text-cyber-muted mt-1">{formatDate(note.createdAt)}</p>
              </div>
              <button onClick={() => handleDeleteNote(note.id)} className="text-xs text-cyber-pink hover:text-red-400 transition-colors ml-4 flex-shrink-0">✕</button>
            </div>
          ))}
        </div>

        <div className="pt-1 space-y-2">
          <textarea
            placeholder="Write a note…"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            rows={2}
            className={`${inputCls} resize-none`}
          />
          <button onClick={handleAddNote} className="text-xs bg-cyber-accent text-cyber-bg font-bold px-4 py-2 rounded hover:bg-cyber-accent-dim transition-colors">
            Add Note
          </button>
        </div>
      </div>

      {/* Add contact modal */}
      <Dialog open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-cyber-card border border-cyber-border rounded-xl p-6 max-w-md w-full shadow-glow">
            <DialogTitle className="text-sm font-semibold text-cyber-text tracking-wide mb-4">Add Contact</DialogTitle>
            <div className="space-y-3">
              <div><label className={labelCls}>Name *</label><input type="text" placeholder="Jane Doe" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Email *</label><input type="email" placeholder="jane@example.com" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Phone</label><input type="tel" placeholder="+49 123 456" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className={inputCls} /></div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text transition-colors">Cancel</button>
              <button onClick={handleAddContact} className="px-4 py-2 text-xs bg-cyber-accent text-cyber-bg font-bold rounded hover:bg-cyber-accent-dim transition-colors">Add</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Contact detail modal */}
      <Dialog open={isEditContactModalOpen} onClose={() => setIsEditContactModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-cyber-card border border-cyber-border rounded-xl p-6 max-w-2xl w-full shadow-glow">
            {selectedContact && (
              <>
                <DialogTitle className="text-sm font-semibold text-cyber-text tracking-wide mb-4">Contact Details</DialogTitle>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  <div><label className={labelCls}>Name</label><input value={selectedContact.name} onChange={e => setSelectedContact({ ...selectedContact, name: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Email</label><input type="email" value={selectedContact.email} onChange={e => setSelectedContact({ ...selectedContact, email: e.target.value })} className={inputCls} /></div>
                  <div><label className={labelCls}>Phone</label><input type="tel" value={selectedContact.phone || ""} onChange={e => setSelectedContact({ ...selectedContact, phone: e.target.value })} className={inputCls} /></div>
                </div>

                <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase mb-2">Contact Notes</p>

                <div className="max-h-40 overflow-y-auto space-y-1.5 border border-cyber-border rounded-lg p-3 mb-3 bg-cyber-surface/40">
                  {(selectedContact.notes || []).length === 0 && (
                    <p className="text-xs text-cyber-muted">No notes yet.</p>
                  )}
                  {(selectedContact.notes || []).map((note: Note) => (
                    <div key={note.id} className="flex justify-between items-start border-b border-cyber-border/50 pb-1.5 last:border-0">
                      <div>
                        <p className="text-sm text-cyber-text">{note.text}</p>
                        <p className="text-[10px] text-cyber-muted mt-0.5">{formatDate(note.createdAt)}</p>
                      </div>
                      <button onClick={() => handleDeleteContactNote(note.id)} className="text-xs text-cyber-pink hover:text-red-400 ml-3 flex-shrink-0">✕</button>
                    </div>
                  ))}
                </div>

                <textarea placeholder="Add note…" value={newContactNote} onChange={e => setNewContactNote(e.target.value)} rows={2} className={`${inputCls} resize-none mb-2`} />
                <button onClick={handleAddContactNote} className="text-xs bg-cyber-accent text-cyber-bg font-bold px-4 py-2 rounded hover:bg-cyber-accent-dim transition-colors">
                  Add Note
                </button>

                <div className="mt-5 flex justify-between">
                  <button onClick={handleDeleteContact} className="px-4 py-2 text-xs border border-cyber-pink/30 bg-cyber-pink/10 text-cyber-pink rounded hover:bg-cyber-pink/20 transition-colors">Delete Contact</button>
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditContactModalOpen(false)} className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text transition-colors">Cancel</button>
                    <button onClick={handleUpdateContact} className="px-4 py-2 text-xs bg-cyber-accent text-cyber-bg font-bold rounded hover:bg-cyber-accent-dim transition-colors">Save</button>
                  </div>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}

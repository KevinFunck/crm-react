import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../../components/Toast";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const inputCls = "w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2.5 text-sm text-cyber-text placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-accent/60 focus:ring-1 focus:ring-cyber-accent/30 transition-colors";

interface Note { id: string; text: string; createdAt: string; }
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  customer_id: string;
  customers?: { id: string; companyName: string };
}

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!id) return;
    axios.get(`${API}/contacts/${id}`)
      .then(res => setContact(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  useEffect(() => {
    if (!contact) return;
    axios.get(`${API}/notes?customer_id=${contact.customer_id}&contact_id=${contact.id}`)
      .then(res => {
        const mapped: Note[] = (res.data || []).map((n: any) => ({
          id: String(n.id), text: n.text, createdAt: n.created_at || n.createdAt,
        }));
        setNotes(mapped);
      })
      .catch(() => {});
  }, [contact]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !contact) return;
    try {
      const res = await axios.post(`${API}/notes`, { customer_id: contact.customer_id, contact_id: contact.id, text: newNote });
      setNotes(prev => [...prev, { id: String(res.data.id), text: newNote, createdAt: new Date().toISOString() }]);
      setNewNote("");
      setToast({ message: "Note added.", type: "success" });
    } catch {
      setToast({ message: "Failed to save note.", type: "error" });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    try { await axios.delete(`${API}/notes/${noteId}`); } catch { /* silent */ }
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  if (notFound) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-cyber-muted text-sm">Contact not found.</p>
    </div>
  );

  if (!contact) return (
    <div className="flex items-center justify-center h-48">
      <p className="text-cyber-muted text-sm animate-pulse">Loading…</p>
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between bg-cyber-card border border-cyber-border rounded-lg px-5 py-3">
        <div>
          <p className="text-[9px] tracking-widest text-cyber-muted uppercase">Contacts / Detail</p>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-cyber-accent/15 border border-cyber-accent/30 flex items-center justify-center">
              <span className="text-xs font-bold text-cyber-accent uppercase">{contact.name.charAt(0)}</span>
            </div>
            <h1 className="text-base font-semibold text-cyber-text">{contact.name}</h1>
          </div>
        </div>
        <button onClick={() => navigate("/contacts")} className="text-xs border border-cyber-border text-cyber-muted rounded px-3 py-1.5 hover:text-cyber-text transition-colors">
          ← Back
        </button>
      </div>

      {/* Contact info */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase mb-3">Contact Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-[9px] tracking-widest text-cyber-muted uppercase mb-1">Email</p>
            <a href={`mailto:${contact.email}`} className="text-cyber-accent hover:underline">{contact.email}</a>
          </div>
          <div>
            <p className="text-[9px] tracking-widest text-cyber-muted uppercase mb-1">Phone</p>
            <p className="text-cyber-text">{contact.phone || "—"}</p>
          </div>
          <div>
            <p className="text-[9px] tracking-widest text-cyber-muted uppercase mb-1">Company</p>
            {contact.customers ? (
              <span
                onClick={() => navigate(`/customers/${contact.customers!.id}`)}
                className="text-cyber-accent hover:underline cursor-pointer text-sm"
              >
                {contact.customers.companyName}
              </span>
            ) : <p className="text-cyber-text">—</p>}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg p-5 space-y-3">
        <p className="text-[10px] font-semibold tracking-widest text-cyber-muted uppercase">Notes</p>

        {notes.length === 0 && <p className="text-sm text-cyber-muted py-1">No notes yet.</p>}

        <div className="space-y-2">
          {notes.map(note => (
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
            placeholder="Write a note…" value={newNote}
            onChange={e => setNewNote(e.target.value)} rows={2}
            className={`${inputCls} resize-none`}
          />
          <button onClick={handleAddNote} className="text-xs bg-cyber-accent text-cyber-bg font-bold px-4 py-2 rounded hover:bg-cyber-accent-dim transition-colors">
            Add Note
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}

import axios from "axios";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import Toast from "../../components/Toast";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const inputCls = "w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2.5 text-sm text-cyber-text placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-accent/60 focus:ring-1 focus:ring-cyber-accent/30 transition-colors";

interface RawContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  customer_id: string;
  customers?: { id: string; companyName: string };
}

export default function ContactsList() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<RawContact[]>([]);
  const [customers, setCustomers] = useState<{ id: string; companyName: string }[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<RawContact | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", customer_id: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<RawContact | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    fetchContacts();
    axios.get(`${API}/customers`).then(res => setCustomers(res.data)).catch(() => {});
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API}/contacts`);
      setContacts(res.data);
    } catch {
      setToast({ message: "Failed to load contacts.", type: "error" });
    }
  };

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.customers?.companyName || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({ name: "", email: "", phone: "", customer_id: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (c: RawContact) => {
    setEditingContact(c);
    setFormData({ name: c.name, email: c.email, phone: c.phone || "", customer_id: c.customer_id });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.customer_id) return;
    try {
      if (editingContact) {
        await axios.put(`${API}/contacts/${editingContact.id}`, formData);
        setToast({ message: "Contact updated.", type: "success" });
      } else {
        await axios.post(`${API}/contacts`, formData);
        setToast({ message: "Contact added.", type: "success" });
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch {
      setToast({ message: "Failed to save contact.", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;
    try {
      await axios.delete(`${API}/contacts/${contactToDelete.id}`);
      setContacts(prev => prev.filter(c => c.id !== contactToDelete.id));
      setIsDeleteModalOpen(false);
      setToast({ message: "Contact deleted.", type: "success" });
    } catch {
      setToast({ message: "Failed to delete contact.", type: "error" });
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between bg-cyber-card border border-cyber-border rounded-lg px-5 py-3">
        <div>
          <p className="text-[9px] tracking-widest text-cyber-muted uppercase">CRM</p>
          <h1 className="text-base font-semibold text-cyber-text mt-0.5">Contacts</h1>
        </div>
        <button onClick={openAddModal} className="bg-cyber-accent text-cyber-bg px-4 py-2 rounded text-xs font-bold hover:bg-cyber-accent-dim transition-colors shadow-glow-sm">
          + Add Contact
        </button>
      </div>

      {/* Search */}
      <input
        type="text" placeholder="Search by name, email, phone or company…"
        value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        className={inputCls}
      />

      {/* Table */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-cyber-border">
              <th className="px-5 py-3 text-left text-[9px] font-semibold tracking-widest text-cyber-muted uppercase">Name</th>
              <th className="px-5 py-3 text-left text-[9px] font-semibold tracking-widest text-cyber-muted uppercase hidden sm:table-cell">Email</th>
              <th className="px-5 py-3 text-left text-[9px] font-semibold tracking-widest text-cyber-muted uppercase hidden md:table-cell">Phone</th>
              <th className="px-5 py-3 text-left text-[9px] font-semibold tracking-widest text-cyber-muted uppercase hidden lg:table-cell">Company</th>
              <th className="px-5 py-3 text-right text-[9px] font-semibold tracking-widest text-cyber-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-cyber-muted text-sm">
                  {search ? "No contacts match your search." : "No contacts yet."}
                </td>
              </tr>
            ) : (
              paginated.map(contact => (
                <tr
                  key={contact.id}
                  className="border-b border-cyber-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => navigate(`/contacts/${contact.id}`)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-cyber-accent/15 border border-cyber-accent/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-cyber-accent uppercase">{contact.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-cyber-text">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-cyber-muted hidden sm:table-cell">{contact.email}</td>
                  <td className="px-5 py-3 text-sm text-cyber-muted hidden md:table-cell">{contact.phone || "—"}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    {contact.customers ? (
                      <span
                        onClick={e => { e.stopPropagation(); navigate(`/customers/${contact.customers!.id}`); }}
                        className="text-xs text-cyber-accent hover:underline cursor-pointer"
                      >
                        {contact.customers.companyName}
                      </span>
                    ) : <span className="text-xs text-cyber-muted">—</span>}
                  </td>
                  <td className="px-5 py-3 text-right space-x-3" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openEditModal(contact)} className="text-xs text-cyber-blue hover:text-blue-400 transition-colors">Edit</button>
                    <button onClick={() => { setContactToDelete(contact); setIsDeleteModalOpen(true); }} className="text-xs text-cyber-pink hover:text-red-400 transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text disabled:opacity-30 transition-colors">← Previous</button>
          <span className="text-xs text-cyber-muted">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text disabled:opacity-30 transition-colors">Next →</button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-cyber-card border border-cyber-border rounded-xl p-6 max-w-md w-full shadow-glow">
            <DialogTitle className="text-sm font-semibold text-cyber-text tracking-wide mb-4">
              {editingContact ? "Edit Contact" : "Add Contact"}
            </DialogTitle>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Name *</label>
                <input placeholder="Jane Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Email *</label>
                <input type="email" placeholder="jane@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Phone</label>
                <input type="tel" placeholder="+49 123 456" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Company *</label>
                <select value={formData.customer_id} onChange={e => setFormData({ ...formData, customer_id: e.target.value })} className={inputCls}>
                  <option value="">— Select company —</option>
                  {customers.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-xs bg-cyber-accent text-cyber-bg font-bold rounded hover:bg-cyber-accent-dim transition-colors">Save</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-cyber-card border border-cyber-pink/20 rounded-xl p-6 max-w-sm w-full shadow-glow">
            <DialogTitle className="text-sm font-semibold text-cyber-text mb-2">Delete Contact?</DialogTitle>
            <p className="text-sm text-cyber-muted mb-5">
              Are you sure you want to delete <span className="text-cyber-text font-medium">{contactToDelete?.name}</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text transition-colors">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 text-xs border border-cyber-pink/40 bg-cyber-pink/10 text-cyber-pink rounded hover:bg-cyber-pink/20 transition-colors">Delete</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}

import axios from "axios";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { CustomerType } from "../../types/Customer";
import React, { useState, useEffect, useCallback } from "react";
import Toast from "../../components/Toast";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

interface Props {
  customers: CustomerType[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}

/* Shared input style */
const inputCls = "w-full bg-cyber-surface border border-cyber-border rounded px-3 py-2.5 text-sm text-cyber-text placeholder-cyber-muted/50 focus:outline-none focus:border-cyber-accent/60 focus:ring-1 focus:ring-cyber-accent/30 transition-colors";

export default function Customers({ customers, setCustomers }: Props) {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(null);
  const [formData, setFormData] = useState({ companyName: "", companyEmail: "", companyPhone: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API}/customers`);
      setCustomers(res.data);
    } catch {
      setToast({ message: "Failed to load customers.", type: "error" });
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => a.companyName.localeCompare(b.companyName));

  const filteredCustomers = sortedCustomers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(q) ||
      (c.companyEmail || "").toLowerCase().includes(q) ||
      (c.companyPhone || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ companyName: "", companyEmail: "", companyPhone: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (customer: CustomerType) => {
    setEditingCustomer(customer);
    setFormData({ companyName: customer.companyName, companyEmail: customer.companyEmail || "", companyPhone: customer.companyPhone || "" });
    setIsModalOpen(true);
  };

  const openDeleteModal = (customer: CustomerType) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;
    try {
      await axios.delete(`${API}/customers/${customerToDelete.id}`);
      const updated = customers.filter((c) => c.id !== customerToDelete.id);
      setCustomers(updated);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
      if (indexOfFirstItem >= updated.length && currentPage > 1) setCurrentPage(p => p - 1);
      setToast({ message: "Company deleted.", type: "success" });
    } catch {
      setToast({ message: "Failed to delete company.", type: "error" });
    }
  };

  const handleSubmit = async () => {
    if (!formData.companyName.trim()) return;
    try {
      if (editingCustomer) {
        const res = await axios.put(`${API}/customers/${editingCustomer.id}`, formData);
        setCustomers(customers.map((c) => (c.id === editingCustomer.id ? res.data : c)));
        setToast({ message: "Company updated.", type: "success" });
      } else {
        const res = await axios.post(`${API}/customers`, formData);
        setCustomers([...customers, res.data]);
        setToast({ message: "Company added.", type: "success" });
      }
      setIsModalOpen(false);
    } catch {
      setToast({ message: "Failed to save company.", type: "error" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const closeToast = useCallback(() => setToast(null), []);

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between bg-cyber-card border border-cyber-border rounded-lg px-5 py-3">
        <div>
          <p className="text-[9px] tracking-widest text-cyber-muted uppercase">CRM</p>
          <h1 className="text-base font-semibold text-cyber-text mt-0.5">Companies</h1>
        </div>
        <button
          onClick={openAddModal}
          className="bg-cyber-accent text-cyber-bg px-4 py-2 rounded text-xs font-bold hover:bg-cyber-accent-dim transition-colors shadow-glow-sm"
        >
          + Add Company
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email or phone…"
        value={search}
        onChange={handleSearchChange}
        className={inputCls}
      />

      {/* Table */}
      <div className="bg-cyber-card border border-cyber-border rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-cyber-border">
              <th className="px-5 py-3 text-left text-[9px] font-semibold tracking-widest text-cyber-muted uppercase">Company</th>
              <th className="px-5 py-3 text-left text-[9px] font-semibold tracking-widest text-cyber-muted uppercase hidden sm:table-cell">Email</th>
              <th className="px-5 py-3 text-left text-[9px] font-semibold tracking-widest text-cyber-muted uppercase hidden md:table-cell">Phone</th>
              <th className="px-5 py-3 text-left text-[9px] font-semibold tracking-widest text-cyber-muted uppercase hidden lg:table-cell">Contacts</th>
              <th className="px-5 py-3 text-right text-[9px] font-semibold tracking-widest text-cyber-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-cyber-muted text-sm">
                  {search ? "No companies match your search." : "No companies yet. Add your first one!"}
                </td>
              </tr>
            ) : (
              currentCustomers.map((customer, index) => {
                const firstLetter = customer.companyName.charAt(0).toUpperCase();
                const prevLetter = index > 0 ? currentCustomers[index - 1].companyName.charAt(0).toUpperCase() : null;
                const showLetter = firstLetter !== prevLetter;

                return (
                  <React.Fragment key={customer.id}>
                    {/* Alphabetical group divider */}
                    {showLetter && (
                      <tr>
                        <td colSpan={5} className="px-5 py-1.5 bg-cyber-surface/50">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-cyber-accent">{firstLetter}</span>
                            <div className="flex-1 h-px bg-cyber-border" />
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr
                      className="border-b border-cyber-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-cyber-text">{customer.companyName}</td>
                      <td className="px-5 py-3 text-sm text-cyber-muted hidden sm:table-cell">{customer.companyEmail}</td>
                      <td className="px-5 py-3 text-sm text-cyber-muted hidden md:table-cell">{customer.companyPhone}</td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="text-xs bg-cyber-dim/60 text-cyber-muted px-2 py-0.5 rounded">
                          {customer.contacts?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right space-x-3" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEditModal(customer)} className="text-xs text-cyber-blue hover:text-blue-400 transition-colors">Edit</button>
                        <button onClick={() => openDeleteModal(customer)} className="text-xs text-cyber-pink hover:text-red-400 transition-colors">Delete</button>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text disabled:opacity-30 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-cyber-muted">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Add / Edit modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-cyber-card border border-cyber-border rounded-xl p-6 max-w-md w-full shadow-glow">
            <DialogTitle className="text-sm font-semibold text-cyber-text tracking-wide mb-4">
              {editingCustomer ? "Edit Company" : "Add Company"}
            </DialogTitle>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Company Name *</label>
                <input placeholder="Acme Corp" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Email</label>
                <input type="email" placeholder="info@acme.com" value={formData.companyEmail} onChange={e => setFormData({ ...formData, companyEmail: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest text-cyber-muted uppercase mb-1.5">Phone</label>
                <input type="tel" placeholder="+49 123 456 789" value={formData.companyPhone} onChange={e => setFormData({ ...formData, companyPhone: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs border border-cyber-border text-cyber-muted rounded hover:text-cyber-text transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-xs bg-cyber-accent text-cyber-bg font-bold rounded hover:bg-cyber-accent-dim transition-colors">Save</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Delete modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-cyber-card border border-cyber-pink/20 rounded-xl p-6 max-w-sm w-full shadow-glow">
            <DialogTitle className="text-sm font-semibold text-cyber-text mb-2">Delete Company?</DialogTitle>
            <p className="text-sm text-cyber-muted mb-5">
              Are you sure you want to delete <span className="text-cyber-text font-medium">{customerToDelete?.companyName}</span>? This action cannot be undone.
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

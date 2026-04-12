import axios from "axios";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { CustomerType } from "../../types/Customer";
import React, { useState, useEffect } from "react";

/* ---------------------------
   API BASE URL (FIX)
--------------------------- */
const API = "http://localhost:5001";

/* ---------------------------
   Component Props
   Receives customers state and setter from App
--------------------------- */
interface Props {
  customers: CustomerType[];
  setCustomers: React.Dispatch<React.SetStateAction<CustomerType[]>>;
}

export default function Customers({ customers, setCustomers }: Props) {
  const navigate = useNavigate();

  /* ---------------------------
     Local modal state for add/edit
  --------------------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerType | null>(null);

  /* ---------------------------
     Form state for company data
  --------------------------- */
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
  });

  /* ---------------------------
     Delete modal state
  --------------------------- */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerType | null>(null);

  /* ---------------------------
     Pagination state
  --------------------------- */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ---------------------------
     Load customers from backend on mount
  --------------------------- */
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API}/customers`);
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------
     Sort customers alphabetically
--------------------------- */
  const sortedCustomers = [...customers].sort((a, b) =>
    a.companyName.localeCompare(b.companyName)
  );

  /* ---------------------------
     Pagination calculation
--------------------------- */
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      companyName: "",
      companyEmail: "",
      companyPhone: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (customer: CustomerType) => {
    setEditingCustomer(customer);
    setFormData({
      companyName: customer.companyName,
      companyEmail: customer.companyEmail || "",
      companyPhone: customer.companyPhone || "",
    });
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

      const updated = customers.filter(c => c.id !== customerToDelete.id);
      setCustomers(updated);

      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);

      if (indexOfFirstItem >= updated.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.companyName) return;

    try {
      if (editingCustomer) {
        const res = await axios.put(
          `${API}/customers/${editingCustomer.id}`,
          formData
        );

        setCustomers(
          customers.map(c =>
            c.id === editingCustomer.id ? res.data : c
          )
        );
      } else {
        const res = await axios.post(
          `${API}/customers`,
          formData
        );

        setCustomers([...customers, res.data]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-2 md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-800 text-white rounded-lg px-4 md:px-6 py-4 shadow gap-3 md:gap-0">
        <h1 className="text-2xl font-semibold">Companies</h1>

        <button
          onClick={openAddModal}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Company
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-200 table-auto md:table-fixed">

          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-3 md:px-6 py-2 text-left text-sm font-medium">Company</th>
              <th className="px-3 md:px-6 py-2 text-left text-sm font-medium hidden sm:table-cell">Email</th>
              <th className="px-3 md:px-6 py-2 text-left text-sm font-medium hidden md:table-cell">Phone</th>
              <th className="px-3 md:px-6 py-2 text-left text-sm font-medium hidden lg:table-cell">Contacts</th>
              <th className="px-3 md:px-6 py-2 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentCustomers.map((customer, index) => {
              const firstLetter = customer.companyName.charAt(0).toUpperCase();
              const prevLetter =
                index > 0
                  ? currentCustomers[index - 1].companyName.charAt(0).toUpperCase()
                  : null;

              const showLetter = firstLetter !== prevLetter;

              return (
                <React.Fragment key={customer.id}>

                  {showLetter && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 px-3 md:px-6 py-2">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold text-gray-700">
                            {firstLetter}
                          </span>
                          <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <td className="px-3 md:px-6 py-2 font-medium text-gray-900">
                      {customer.companyName}
                    </td>

                    <td className="px-3 md:px-6 py-2 text-gray-600 hidden sm:table-cell">
                      {customer.companyEmail}
                    </td>

                    <td className="px-3 md:px-6 py-2 text-gray-600 hidden md:table-cell">
                      {customer.companyPhone}
                    </td>

                    {/* ✅ FIX: safe access */}
                    <td className="px-3 md:px-6 py-2 text-gray-600 hidden lg:table-cell">
                      {customer.contacts?.length ?? 0}
                    </td>

                    <td
                      className="px-3 md:px-6 py-2 text-right space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => openEditModal(customer)} className="text-blue-600 hover:underline">
                        Edit
                      </button>

                      <button onClick={() => openDeleteModal(customer)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-40"
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" />
        <Dialog.Panel className="relative bg-gray-900 p-6 rounded-2xl shadow-lg max-w-md w-full text-white">
          <Dialog.Title className="text-xl font-bold mb-4">
            {editingCustomer ? "Edit Company" : "Add Company"}
          </Dialog.Title>

          <div className="space-y-4">
            <input
              value={formData.companyName}
              onChange={e => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />
            <input
              value={formData.companyEmail}
              onChange={e => setFormData({ ...formData, companyEmail: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />
            <input
              value={formData.companyPhone}
              onChange={e => setFormData({ ...formData, companyPhone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded-lg">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 rounded-lg">
              Save
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" />
        <Dialog.Panel className="relative bg-gray-900 p-6 rounded-2xl shadow-lg max-w-sm w-full text-white">
          <Dialog.Title>Delete Company?</Dialog.Title>

          <p className="mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{customerToDelete?.companyName}</span>?
          </p>

          <div className="flex justify-end gap-2">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-700 rounded-lg">
              Cancel
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 rounded-lg">
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>

    </div>
  );
}
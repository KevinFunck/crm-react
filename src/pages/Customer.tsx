import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { CustomerType } from "../types/Customer";

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

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  /* ---------------------------
     Open modal for adding new company
  --------------------------- */
  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      companyName: "",
      companyEmail: "",
      companyPhone: "",
    });
    setIsModalOpen(true);
  };

  /* ---------------------------
     Open modal for editing company
  --------------------------- */
  const openEditModal = (customer: CustomerType) => {
    setEditingCustomer(customer);

    setFormData({
      companyName: customer.companyName,
      companyEmail: customer.companyEmail || "",
      companyPhone: customer.companyPhone || "",
    });

    setIsModalOpen(true);
  };

  /* ---------------------------
     Open delete modal
  --------------------------- */
  const openDeleteModal = (customer: CustomerType) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  /* ---------------------------
     Delete company
  --------------------------- */
  const handleDelete = () => {
    if (!customerToDelete) return;

    const updatedCustomers = customers.filter(
      c => c.id !== customerToDelete.id
    );

    setCustomers(updatedCustomers);

    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);

    if (indexOfFirstItem >= updatedCustomers.length && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  /* ---------------------------
     Add or update company
  --------------------------- */
  const handleSubmit = () => {
    if (!formData.companyName) return;

    if (editingCustomer) {
      setCustomers(
        customers.map(c =>
          c.id === editingCustomer.id ? { ...c, ...formData } : c
        )
      );
    } else {
      const newCompany: CustomerType = {
        id: Date.now().toString(),
        ...formData,
        contacts: [],
        notes: [],
      };

      setCustomers([...customers, newCompany]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">

      {/* ---------------------------
          Header
      --------------------------- */}
      <div className="flex justify-between items-center bg-gray-800 text-white rounded-lg px-6 py-4 shadow">
        <h1 className="text-2xl font-semibold">Companies</h1>

        <button
          onClick={openAddModal}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Company
        </button>
      </div>

      {/* ---------------------------
          Companies Table
      --------------------------- */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Company</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Contacts</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentCustomers.map(customer => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <td className="px-6 py-4">{customer.companyName}</td>
                <td className="px-6 py-4">{customer.companyEmail}</td>
                <td className="px-6 py-4">{customer.companyPhone}</td>
                <td className="px-6 py-4">{customer.contacts.length}</td>

                <td
                  className="px-6 py-4 text-right space-x-2"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEditModal(customer)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteModal(customer)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ---------------------------
          Pagination
      --------------------------- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
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

      {/* ---------------------------
          Add / Edit Modal
      --------------------------- */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >

        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <Dialog.Panel className="relative bg-gray-900 p-6 rounded-2xl shadow-lg max-w-md w-full text-white">

          <Dialog.Title className="text-xl font-bold mb-4">
            {editingCustomer ? "Edit Company" : "Add Company"}
          </Dialog.Title>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />

            <input
              type="email"
              placeholder="Company Email"
              value={formData.companyEmail}
              onChange={(e) =>
                setFormData({ ...formData, companyEmail: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />

            <input
              type="text"
              placeholder="Company Phone"
              value={formData.companyPhone}
              onChange={(e) =>
                setFormData({ ...formData, companyPhone: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            />

          </div>

          <div className="mt-6 flex justify-end gap-2">

            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>

          </div>

        </Dialog.Panel>
      </Dialog>

      {/* ---------------------------
          Delete Modal
      --------------------------- */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >

        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <Dialog.Panel className="relative bg-gray-900 p-6 rounded-2xl shadow-lg max-w-sm w-full text-white">

          <Dialog.Title className="text-xl font-bold mb-4">
            Delete Company?
          </Dialog.Title>

          <p className="mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {customerToDelete?.companyName}
            </span>
            ?
          </p>

          <div className="flex justify-end gap-2">

            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>

          </div>

        </Dialog.Panel>
      </Dialog>

    </div>
  );
}
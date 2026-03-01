import { useState } from "react";
import { Dialog } from "@headlessui/react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "1", name: "Alice Smith", email: "alice@example.com", phone: "123-456-7890", company: "Acme Corp" },
    { id: "2", name: "Bob Johnson", email: "bob@example.com", phone: "555-123-4567", company: "Beta Ltd" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Open modal for adding
  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "", company: "" });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      company: customer.company || "",
    });
    setIsModalOpen(true);
  };

  // Open modal for delete confirmation
  const openDeleteModal = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
      setCustomerToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;

    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...formData } : c
        )
      );
    } else {
      setCustomers([
        ...customers,
        { id: String(customers.length + 1), ...formData },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Customers</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Customer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Company</th>
              <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{customer.name}</td>
                <td className="px-6 py-4 text-gray-800">{customer.email}</td>
                <td className="px-6 py-4 text-gray-800">{customer.phone}</td>
                <td className="px-6 py-4 text-gray-800">{customer.company}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => openEditModal(customer)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => openDeleteModal(customer)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-50 inset-0 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <Dialog.Panel className="bg-gray-900 rounded-2xl shadow-lg max-w-md w-full z-50 p-6 text-white relative">
          <Dialog.Title className="text-xl font-bold mb-4">
            {editingCustomer ? "Edit Customer" : "Add Customer"}
          </Dialog.Title>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              onClick={handleSubmit}
            >
              {editingCustomer ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="fixed z-50 inset-0 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <Dialog.Panel className="bg-gray-900 rounded-2xl shadow-lg max-w-sm w-full z-50 p-6 text-white relative">
          <Dialog.Title className="text-xl font-bold mb-4">Delete Customer?</Dialog.Title>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete <span className="font-semibold">{customerToDelete?.name}</span>?
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
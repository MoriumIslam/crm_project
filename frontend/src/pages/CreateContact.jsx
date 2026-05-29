import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { createContact } from '../services/contactService';
import { toast } from 'react-toastify';

export default function CreateContact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setLoading(true);
      await createContact(formData);
      toast.success('Contact created successfully');
      navigate('/contacts');
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error('Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/contacts')}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1>Create New Contact</h1>
          <p className="text-slate-500 mt-2">Add a new contact to your CRM</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-base"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-base"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-base"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input-base"
                    placeholder="Acme Corporation"
                  />
                </div>
                <div>
                  <label htmlFor="position">Job Title</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="input-base"
                    placeholder="Manager"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-4">Status</h3>
              <div>
                <label htmlFor="status">Contact Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-base"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200 pt-6 flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/contacts')}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                {loading ? 'Creating...' : 'Create Contact'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✓ Add a profile photo for better recognition</li>
              <li>✓ Keep email addresses up to date</li>
              <li>✓ Add company info for better organization</li>
              <li>✓ Set contact status appropriately</li>
            </ul>
          </div>
          <div className="card bg-primary-50">
            <h3 className="font-semibold text-primary-900 mb-3">Pro Tip</h3>
            <p className="text-sm text-primary-800">
              You can add interactions and notes after creating the contact to track all communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

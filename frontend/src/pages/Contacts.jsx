import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, X } from 'lucide-react';
import Table from '../components/Table';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getAllContacts, deleteContact, searchContacts } from '../services/contactService';
import { getInteractionsByContact } from '../services/interactionService';
import { toast } from 'react-toastify';

export default function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, contact: null });
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getAllContacts();
      setAllContacts(data);
      setContacts(data);

      // Extract unique companies for filter dropdown
      const uniqueCompanies = [...new Set(data.map(c => c.company).filter(Boolean))].sort();
      setCompanies(uniqueCompanies);

      setSearchQuery('');
      setStatusFilter('');
      setCompanyFilter('');
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    // If there's a query, prefer server-side search for accuracy and scale
    if (query && query.trim().length > 0) {
      try {
        setLoading(true);
        const params = {
          q: query,
          status: statusFilter || undefined,
          limit: 100,
          page: 1,
        };
        const results = await searchContacts(params);
        setContacts(results);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      // Empty query — fall back to client-side filtering of loaded contacts
      filterContacts('', statusFilter, companyFilter);
    }
  };

  const handleStatusFilter = async (status) => {
    setStatusFilter(status);

    // If we have a server-side search active, re-run it with the status
    if (searchQuery && searchQuery.trim().length > 0) {
      try {
        setLoading(true);
        const params = {
          q: searchQuery,
          status: status || undefined,
          limit: 100,
          page: 1,
        };
        const results = await searchContacts(params);
        setContacts(results);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      filterContacts(searchQuery, status, companyFilter);
    }
  };

  const handleCompanyFilter = (company) => {
    setCompanyFilter(company);
    // Company filter is applied client-side on top of current contacts
    filterContacts(searchQuery, statusFilter, company);
  };

  const filterContacts = (query, status, company) => {
    let filtered = allContacts;

    // Filter by search query (searches in name, email, phone, company)
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name?.toLowerCase().includes(lowerQuery) ||
        contact.email?.toLowerCase().includes(lowerQuery) ||
        contact.phone?.toLowerCase().includes(lowerQuery) ||
        contact.company?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter(contact => contact.status === status);
    }

    // Filter by company
    if (company) {
      filtered = filtered.filter(contact => contact.company === company);
    }

    setContacts(filtered);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setCompanyFilter('');
    setContacts(allContacts);
  };

  const handleDelete = async () => {
    try {
      await deleteContact(deleteModal.contact.id);
      setContacts(contacts.filter(c => c.id !== deleteModal.contact.id));
      setDeleteModal({ isOpen: false, contact: null });
      toast.success('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge-${row.status === 'active' ? 'success' : 'warning'}`}>
          {row.status || 'pending'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Contacts</h1>
          <p className="text-slate-500 mt-2">Manage and organize all your business contacts</p>
        </div>
        <button
          onClick={() => navigate('/contacts/create')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Contact
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Main Search Bar */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name, email, phone or company..."
            />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="btn-secondary flex items-center gap-2 whitespace-nowrap"
          >
            <ChevronDown size={18} className={`transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="card space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Advanced Filters</h3>
              {(statusFilter || companyFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <X size={16} />
                  Clear All
                </button>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="input-base w-full"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label htmlFor="company-filter" className="block text-sm font-medium text-slate-700 mb-2">
                  Company
                </label>
                <select
                  id="company-filter"
                  value={companyFilter}
                  onChange={(e) => handleCompanyFilter(e.target.value)}
                  className="input-base w-full"
                >
                  <option value="">All Companies</option>
                  {companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>
            </div>
            {(statusFilter || companyFilter) && (
              <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                {statusFilter && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-sm">
                    Status: {statusFilter}
                    <button onClick={() => handleStatusFilter('')} className="hover:text-sky-900">
                      <X size={14} />
                    </button>
                  </span>
                )}
                {companyFilter && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    Company: {companyFilter}
                    <button onClick={() => handleCompanyFilter('')} className="hover:text-purple-900">
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Info */}
        {(searchQuery || statusFilter || companyFilter) && (
          <div className="text-sm text-slate-600">
            Found <span className="font-semibold">{contacts.length}</span> contact{contacts.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {statusFilter && ` with status "${statusFilter}"`}
            {companyFilter && ` from "${companyFilter}"`}
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton count={5} />
      ) : contacts.length > 0 ? (
        <Table
          columns={columns}
          data={contacts}
          onView={(contact) => navigate(`/contacts/${contact.id}`)}
          onEdit={(contact) => navigate(`/contacts/edit/${contact.id}`)}
          onDelete={(contact) => setDeleteModal({ isOpen: true, contact })}
        />
      ) : (
        <EmptyState
          title="No contacts found"
          description={searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first contact'}
          action={{ label: 'Add Contact', href: '/contacts/create' }}
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        title="Delete Contact"
        onClose={() => setDeleteModal({ isOpen: false, contact: null })}
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{deleteModal.contact?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => setDeleteModal({ isOpen: false, contact: null })}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

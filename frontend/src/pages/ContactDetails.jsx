import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MessageSquare, Phone, Mail, Check, AlertCircle } from 'lucide-react';
import { getContactById, updateContact } from '../services/contactService';
import { getInteractionsByContact, createInteraction, deleteInteraction } from '../services/interactionService';
import { toast } from 'react-toastify';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Modal from '../components/Modal';


export default function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [interactionForm, setInteractionForm] = useState({
    type: 'email',
    description: '',
  });
  const [quickNote, setQuickNote] = useState('');

  useEffect(() => {
    fetchContactData();
  }, [id]);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const [contactData, interactionsData] = await Promise.all([
        getContactById(id),
        getInteractionsByContact(id),
      ]);
      setContact(contactData);
      setInteractions(interactionsData || []);
    } catch (error) {
      console.error('Error fetching contact:', error);
      toast.error('Failed to fetch contact details');
      navigate('/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      await createInteraction({
        contact_id: parseInt(id),
        interaction_type: interactionForm.type,
        note: interactionForm.description,
      });
      toast.success('Interaction added successfully');
      setShowInteractionModal(false);
      setInteractionForm({ type: 'email', description: '' });
      fetchContactData();
    } catch (error) {
      console.error('Error adding interaction:', error);
      toast.error('Failed to add interaction');
    }
  };

  const handleDeleteInteraction = async (interactionId) => {
    try {
      await deleteInteraction(interactionId);
      setInteractions(interactions.filter(i => i.id !== interactionId));
      toast.success('Interaction deleted');
    } catch (error) {
      console.error('Error deleting interaction:', error);
      toast.error('Failed to delete interaction');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateContact(id, {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        status: newStatus,
      });
      setContact({ ...contact, status: newStatus });
      toast.success(`Contact marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!contact) return null;

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'email':
        return <Mail size={18} />;
      case 'phone':
        return <Phone size={18} />;
      case 'meeting':
        return <MessageSquare size={18} />;
      default:
        return <MessageSquare size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/contacts')}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>{contact.name}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Email</p>
                <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-700 font-medium">
                  {contact.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Phone</p>
                <a href={`tel:${contact.phone}`} className="text-primary-600 hover:text-primary-700 font-medium">
                  {contact.phone || 'Not provided'}
                </a>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Company</p>
                <p className="font-medium text-slate-900">{contact.company || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                <span className={`badge-${contact.status === 'active' ? 'success' : 'warning'}`}>
                  {contact.status || 'pending'}
                </span>
              </div>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-6 flex gap-4">
              <button onClick={() => navigate(`/contacts/${id}/edit`)} className="btn-primary">
                Edit Contact
              </button>
              <button onClick={() => window.location.href = `mailto:${contact.email}?subject=Hello%20${contact.name}&body=Hi%20${contact.name},%0A%0AI%20wanted%20to%20reach%20out%20to%20discuss%20our%20CRM%20solution.%0A%0AVisit%20us:%20www.gmail.com%0A%0ABest%20regards`} className="btn-secondary">
                Send Email
              </button>
            </div>
          </div>

          {/* Notes (admin) */}
          {interactions.filter(i => i.interaction_type === 'note').length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Notes</h2>
                <div className="text-sm text-slate-500">Private to admins</div>
              </div>
              <div className="space-y-4">
                {interactions
                  .filter(i => i.interaction_type === 'note')
                  .map((note, idx) => (
                    <div key={note.id || idx} className="border border-slate-200 rounded-lg p-4 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                            <MessageSquare size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">Note</p>
                            <p className="text-slate-700 text-sm mt-1">{note.note}</p>
                            <p className="text-slate-400 text-xs mt-2">{new Date(note.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteInteraction(note.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Interactions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Interactions</h2>
              <button
                onClick={() => setShowInteractionModal(true)}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <Plus size={18} />
                Add Interaction
              </button>
            </div>

            {interactions.filter(i => i.interaction_type !== 'note').length > 0 ? (
              <div className="space-y-4">
                {interactions
                  .filter(i => i.interaction_type !== 'note')
                  .map((interaction, idx) => (
                    <div key={interaction.id || idx} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            {getInteractionIcon(interaction.interaction_type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 capitalize">
                              {interaction.interaction_type}
                            </p>
                            <p className="text-slate-600 text-sm mt-1">{interaction.note}</p>
                            <p className="text-slate-400 text-xs mt-2">
                              {new Date(interaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteInteraction(interaction.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">No interactions yet. Add one to get started.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button onClick={() => window.location.href = `mailto:${contact.email}?subject=Hello%20${contact.name}&body=Hi%20${contact.name},%0A%0AI%20wanted%20to%20reach%20out%20regarding%20our%20partnership.%0A%0AVisit%20our%20website:%20www.gmail.com%0A%0ABest%20regards`} className="w-full btn-primary flex items-center justify-center gap-2">
                <Mail size={18} />
                Send Email
              </button>
              <button onClick={() => window.location.href = `tel:${contact.phone}`} className="w-full btn-secondary flex items-center justify-center gap-2">
                <Phone size={18} />
                Call
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-3">Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Interactions</span>
                <span className="font-semibold text-slate-900">{interactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Contact</span>
                <span className="font-semibold text-slate-900">
                  {interactions.length > 0
                    ? new Date(interactions[0].created_at).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Note</h3>
            <p className="text-sm text-slate-500 mb-3">Add a private note for this contact. Visible to admins.</p>
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              rows={4}
              placeholder="Write a quick note..."
              className="w-full input-base resize-none"
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={async () => {
                  if (!quickNote.trim()) {
                    toast.info('Please enter a note before saving');
                    return;
                  }
                  try {
                    await createInteraction({
                      contact_id: parseInt(id),
                      interaction_type: 'note',
                      note: quickNote.trim(),
                    });
                    toast.success('Note added');
                    setQuickNote('');
                    fetchContactData();
                  } catch (error) {
                    console.error('Error adding quick note:', error);
                    toast.error('Failed to add note');
                  }
                }}
                className="btn-primary flex-1"
              >
                Save Note
              </button>
              <button
                onClick={() => setQuickNote('')}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-slate-600" />
              Change Status
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleStatusChange('active')}
                disabled={contact.status === 'active'}
                className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${contact.status === 'active'
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
              >
                <Check size={18} />
                Mark Active
              </button>
              <button
                onClick={() => handleStatusChange('inactive')}
                disabled={contact.status === 'inactive'}
                className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${contact.status === 'inactive'
                  ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <AlertCircle size={18} />
                Mark Inactive
              </button>
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={contact.status === 'pending'}
                className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${contact.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                  }`}
              >
                <AlertCircle size={18} />
                Mark Pending
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Interaction Modal */}
      <Modal
        isOpen={showInteractionModal}
        title="Add Interaction"
        onClose={() => setShowInteractionModal(false)}
      >
        <form onSubmit={handleAddInteraction} className="space-y-4">
          <div>
            <label htmlFor="type">Interaction Type</label>
            <select
              id="type"
              value={interactionForm.type}
              onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value })}
              className="input-base"
            >
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
              <option value="meeting">Meeting</option>
              <option value="note">Note</option>
            </select>
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={interactionForm.description}
              onChange={(e) => setInteractionForm({ ...interactionForm, description: e.target.value })}
              className="input-base"
              rows={4}
              placeholder="What happened in this interaction?"
            />
          </div>
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setShowInteractionModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Interaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

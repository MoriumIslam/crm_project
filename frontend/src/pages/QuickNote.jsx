import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { searchContacts } from '../services/contactService';
import { createInteraction, getInteractionsByContact, deleteInteraction } from '../services/interactionService';
import { toast } from 'react-toastify';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function QuickNote() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!query || query.trim().length < 2) {
        setCandidates([]);
        return;
      }
      try {
        setSearching(true);
        const res = await searchContacts({ q: query, limit: 6 });
        if (mounted) setCandidates(res || []);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        if (mounted) setSearching(false);
      }
    };
    const t = setTimeout(run, 250);
    return () => { mounted = false; clearTimeout(t); };
  }, [query]);

  useEffect(() => {
    if (!selected) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getInteractionsByContact(selected.id);
        setNotes((res || []).filter(r => r.interaction_type === 'note'));
      } catch (err) {
        console.error('Failed to load notes', err);
        toast.error('Failed to load notes for contact');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selected]);

  const handleSave = async () => {
    if (!selected) return toast.info('Select a contact');
    if (!note.trim()) return toast.info('Write a note first');
    try {
      await createInteraction({ contact_id: selected.id, interaction_type: 'note', note: note.trim() });
      toast.success('Note saved');
      setNote('');
      // refresh notes
      const res = await getInteractionsByContact(selected.id);
      setNotes((res || []).filter(r => r.interaction_type === 'note'));
    } catch (err) {
      console.error('Save failed', err);
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInteraction(id);
      setNotes(notes.filter(n => n.id !== id));
      toast.success('Note deleted');
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Quick Note</h1>
          <p className="text-slate-500 mt-2">Add and manage admin notes tied to specific contacts.</p>
        </div>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search contact</label>
            <SearchBar value={selected ? selected.name : query} onChange={(v) => { setQuery(v); setSelected(null); }} placeholder="Type at least 2 chars" onClear={() => { setQuery(''); setCandidates([]); setSelected(null); }} />
            {query && !selected && (
              <div className="mt-2 rounded-md border border-slate-200 max-h-56 overflow-auto">
                {searching ? (
                  <div className="p-2 text-sm text-slate-500">Searching...</div>
                ) : candidates.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500">No results</div>
                ) : candidates.map(c => (
                  <button key={c.id} onClick={() => { setSelected(c); setQuery(''); setCandidates([]); }} className="w-full text-left px-3 py-2 hover:bg-slate-50">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.email || c.phone}</div>
                  </button>
                ))}
              </div>
            )}

            {selected && (
              <div className="mt-4 p-3 bg-slate-50 rounded-md">
                <div className="font-semibold">{selected.name}</div>
                <div className="text-sm text-slate-500">{selected.email}</div>
                <div className="text-sm text-slate-500">{selected.phone}</div>
                <div className="mt-2">
                  <button onClick={() => { setSelected(null); setNotes([]); }} className="text-sm text-slate-600">Change</button>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Note</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="input-base w-full resize-none" placeholder="Write a private admin note for the selected contact..." />
            <div className="mt-3 flex gap-2">
              <button onClick={handleSave} className="btn-primary">Save Note</button>
              <button onClick={() => setNote('')} className="btn-ghost">Clear</button>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Recent Notes</h3>
              {loading ? <LoadingSkeleton count={3} /> : (
                notes.length === 0 ? (
                  <div className="text-sm text-slate-500">No notes yet for this contact.</div>
                ) : (
                  <div className="space-y-3">
                    {notes.map(n => (
                      <div key={n.id} className="p-3 border rounded-md">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm text-slate-700">{n.note}</div>
                            <div className="text-xs text-slate-400 mt-2">{new Date(n.created_at).toLocaleString()}</div>
                          </div>
                          <div>
                            <button onClick={() => handleDelete(n.id)} className="text-sm text-red-600">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

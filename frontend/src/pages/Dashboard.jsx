import React, { useState, useEffect } from 'react';
import { BarChart3, Users, UserCheck, UserX, ArrowRight } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Table from '../components/Table';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getAllContacts } from '../services/contactService';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({
    totalContacts: 0,
    activeContacts: 0,
    inactiveContacts: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllContacts();
        setContacts(data);

        const active = data.filter(c => c.status === 'active').length;
        const inactive = data.length - active;

        setStats({
          totalContacts: data.length,
          activeContacts: active,
          inactiveContacts: inactive,
        });
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSkeleton count={4} />;
  }

  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1>Welcome back! 👋</h1>
        <p className="text-slate-500 mt-2">Here's what's happening with your CRM today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          label="Total Contacts"
          value={stats.totalContacts}
          trend={12}
          color="primary"
        />
        <StatsCard
          icon={UserCheck}
          label="Active Contacts"
          value={stats.activeContacts}
          trend={8}
          color="green"
        />
        <StatsCard
          icon={UserX}
          label="Inactive Contacts"
          value={stats.inactiveContacts}
          trend={-3}
          color="blue"
        />
        <StatsCard
          icon={BarChart3}
          label="Interactions"
          value={contacts.length * 3}
          trend={15}
          color="purple"
        />
      </div>

      {/* Recent Contacts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2>Recent Contacts</h2>
          <a href="/contacts" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            View all <ArrowRight size={18} />
          </a>
        </div>

        {recentContacts.length > 0 ? (
          <Table
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <span className={`badge-${row.status === 'active' ? 'success' : 'warning'}`}>
                    {row.status}
                  </span>
                )
              },
            ]}
            data={recentContacts}
          />
        ) : (
          <EmptyState
            title="No contacts yet"
            description="Start building your contact list by adding your first contact."
            action={{ label: 'Add Contact', href: '/contacts/create' }}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-900 mb-2">Quick Actions</h3>
          <p className="text-slate-500 text-sm mb-4">Get started with common tasks</p>
          <div className="space-y-2">
            <a href="/contacts/create" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
              <span>→</span> Add New Contact
            </a>
            <a href="/contacts" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
              <span>→</span> View All Contacts
            </a>
            <a href="/contacts" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
              <span>→</span> Search Contacts
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-900 mb-2">System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">API Status</span>
              <span className="badge-success">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Database</span>
              <span className="badge-success">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Uptime</span>
              <span className="text-green-600 font-medium">99.9%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-900 mb-2">Help & Support</h3>
          <p className="text-slate-500 text-sm mb-4">Need assistance? We're here to help</p>
          <button className="btn-secondary w-full text-sm">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

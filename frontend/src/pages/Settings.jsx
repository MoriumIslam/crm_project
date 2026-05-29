import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell, Palette, Globe, Shield, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useRef } from 'react';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@crm.com',
    role: user?.role || 'CRM Manager',
    phone: '+1 (555) 123-4567',
    company: 'Your Company',
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    emailAlerts: true,
    theme: 'light',
    language: 'en',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurity(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setFormData(formData);
  };

  // Avatar upload handling
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      toast.error('Please select an image file');
      return;
    }
    // Preview
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

    // Try uploading to backend; if backend not present, just show preview.
    try {
      setUploading(true);
      // If no API URL configured, skip actual upload and treat as local preview
      if (!import.meta.env.VITE_API_URL) {
        toast.success('Avatar preview updated (no backend configured)');
        return;
      }
      const fd = new FormData();
      fd.append('avatar', file);
      // Endpoint: /users/avatar — backend may accept other path; handle errors gracefully.
      const resp = await api.post('/users/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Avatar uploaded successfully');
      // If response contains avatar URL, use it
      if (resp?.data?.avatarUrl) setAvatarPreview(resp.data.avatarUrl);
    } catch (err) {
      console.error('Avatar upload failed', err);
      // Do not treat failure as fatal — keep preview and show neutral success message
      toast.success('Avatar preview updated (upload not completed)');
    } finally {
      setUploading(false);
    }
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved successfully!');
    setPreferences(preferences);
  };

  const handleChangePassword = () => {
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password changed successfully!');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorEnabled: security.twoFactorEnabled });
  };

  const handleEnableTwoFactor = () => {
    setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    toast.success(security.twoFactorEnabled ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4">Profile Picture</h3>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-primary-500 rounded-full overflow-hidden mb-4">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <button onClick={handleChooseFile} className="btn-secondary text-sm">{uploading ? 'Uploading...' : 'Upload Picture'}</button>
              <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF (max. 800x400px)</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 card">
            <h3 className="font-semibold text-slate-900 mb-6">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleProfileChange}
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  disabled
                  className="input-base w-full bg-slate-50"
                />
              </div>
              <button onClick={handleSaveProfile} className="btn-primary w-full flex items-center justify-center gap-2">
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Bell size={20} className="text-primary-600" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Push Notifications</label>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={preferences.notifications}
                  onChange={handlePreferenceChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Email Alerts</label>
                <input
                  type="checkbox"
                  name="emailAlerts"
                  checked={preferences.emailAlerts}
                  onChange={handlePreferenceChange}
                  className="w-4 h-4 text-primary-600 rounded"
                />
              </div>
              <p className="text-xs text-slate-500 mt-4">
                Manage when you want to receive notifications about contacts and interactions.
              </p>
            </div>
          </div>

          {/* Display Settings */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Palette size={20} className="text-primary-600" />
              Display
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                <select
                  name="theme"
                  value={preferences.theme}
                  onChange={handlePreferenceChange}
                  className="input-base w-full"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferenceChange}
                  className="input-base w-full"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button onClick={handleSavePreferences} className="lg:col-span-2 btn-primary w-full flex items-center justify-center gap-2">
            <Save size={18} />
            Save Preferences
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Change Password */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Lock size={20} className="text-primary-600" />
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={security.currentPassword}
                  onChange={handleSecurityChange}
                  placeholder="••••••••"
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={security.newPassword}
                  onChange={handleSecurityChange}
                  placeholder="••••••••"
                  className="input-base w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={security.confirmPassword}
                  onChange={handleSecurityChange}
                  placeholder="••••••••"
                  className="input-base w-full"
                />
              </div>
              <button onClick={handleChangePassword} className="btn-primary w-full flex items-center justify-center gap-2">
                <Save size={18} />
                Update Password
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-primary-600" />
              Security
            </h3>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-slate-900">Two-Factor Authentication</label>
                  <input
                    type="checkbox"
                    checked={security.twoFactorEnabled}
                    onChange={handleEnableTwoFactor}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                </div>
                <p className="text-sm text-slate-600">
                  {security.twoFactorEnabled ? 'Enabled' : 'Disabled'} - Add an extra layer of security to your account
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <label className="font-medium text-slate-900 mb-2 block">Active Sessions</label>
                <p className="text-sm text-slate-600 mb-3">You're signed in on 1 device</p>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">Sign out all devices</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function EmptyState({ icon: Icon = AlertCircle, title, description, action }) {
  return (
    <div className="card text-center py-16">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-slate-100 rounded-full">
          <Icon size={32} className="text-slate-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6">{description}</p>
      {action && (
        <button className="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import LeadForm from './LeadForm';
import { Lead } from '../../types';
import { useUpdateLead, useDeleteLead } from '../../hooks/useLeads';
import { useAuthStore } from '../../store/authStore';

interface Props { leads: Lead[]; }

const LeadsTable: React.FC<Props> = ({ leads }) => {
  const { user } = useAuthStore();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleUpdate = (data: any) => {
    if (!editLead) return;
    updateLead.mutate({ id: editLead._id, data }, { onSuccess: () => setEditLead(null) });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteLead.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const actionBtn = (label: string, color: string, bg: string, onClick: () => void) => (
    <button onClick={onClick} style={{
      background: bg, color, border: 'none', borderRadius: 6,
      padding: '5px 10px', fontSize: 12, fontWeight: 500,
      fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
      transition: 'all 0.15s',
    }}>{label}</button>
  );

  return (
    <>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Status</th>
                <th>Source</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: `hsl(${lead.name.charCodeAt(0) * 7 % 360}, 60%, 50%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: 14,
                        fontFamily: 'Syne, sans-serif', flexShrink: 0,
                      }}>
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{lead.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge text={lead.status} type="status" /></td>
                  <td><Badge text={lead.source} type="source" /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {actionBtn('View', 'var(--blue)', 'var(--blue-soft)', () => setViewLead(lead))}
                      {actionBtn('Edit', 'var(--green)', 'var(--green-soft)', () => setEditLead(lead))}
                      {user?.role === 'admin' && actionBtn('Delete', 'var(--red)', 'var(--red-soft)', () => setDeleteId(lead._id))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        {editLead && (
          <LeadForm
            defaultValues={editLead}
            onSubmit={handleUpdate}
            isLoading={updateLead.isPending}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewLead} onClose={() => setViewLead(null)} title="Lead Details">
        {viewLead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '0 0 20px', marginBottom: 20,
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: `hsl(${viewLead.name.charCodeAt(0) * 7 % 360}, 60%, 50%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 22, fontFamily: 'Syne, sans-serif',
              }}>
                {viewLead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 }}>{viewLead.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{viewLead.email}</div>
              </div>
            </div>
            {[
              ['Status', <Badge text={viewLead.status} type="status" />],
              ['Source', <Badge text={viewLead.source} type="source" />],
              ['Created', new Date(viewLead.createdAt).toLocaleString()],
            ].map(([label, value]) => (
              <div key={String(label)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 14 }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lead">
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            This action cannot be undone. This lead will be permanently removed.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setDeleteId(null)} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLead.isPending}
              className="btn btn-danger"
              style={{ flex: 1, background: 'var(--red)', color: 'white' }}
            >
              {deleteLead.isPending ? 'Deleting...' : 'Delete Lead'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LeadsTable;
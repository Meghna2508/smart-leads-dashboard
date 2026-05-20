import React, { useState } from 'react';
import { useLeads, useCreateLead, useExportLeads } from '../hooks/useLeads';
import { useLeadsStore } from '../store/leadsStore';
import { useAuthStore } from '../store/authStore';
import LeadsTable from '../components/leads/LeadsTable';
import LeadFilters from '../components/leads/LeadFilters';
import Pagination from '../components/leads/Pagination';
import Modal from '../components/ui/Modal';
import LeadForm from '../components/leads/LeadForm';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { filters, setFilter } = useLeadsStore();
  const { data, isLoading, isError } = useLeads(filters);
  const createLead = useCreateLead();
  const exportLeads = useExportLeads();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode((d) => !d);
  };

  const handleCreate = (formData: any) => {
    createLead.mutate(formData, { onSuccess: () => setIsCreateOpen(false) });
  };

  const stats = [
    { label: 'Total Leads', value: data?.total ?? 0, color: 'var(--blue)', bg: 'var(--blue-soft)', icon: '◎' },
    { label: 'Qualified', value: data?.data?.filter(l => l.status === 'Qualified').length ?? 0, color: 'var(--green)', bg: 'var(--green-soft)', icon: '✓' },
    { label: 'Contacted', value: data?.data?.filter(l => l.status === 'Contacted').length ?? 0, color: 'var(--yellow)', bg: 'var(--yellow-soft)', icon: '↗' },
    { label: 'Lost', value: data?.data?.filter(l => l.status === 'Lost').length ?? 0, color: 'var(--red)', bg: 'var(--red-soft)', icon: '✕' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Header */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 30,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 24px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: 'var(--bg-primary)', fontSize: 18 }}>◈</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', lineHeight: 1 }}>
                Smart Leads
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Dashboard</div>
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Dark mode toggle */}
            <button onClick={toggleDark} style={{
              background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              borderRadius: 8, width: 36, height: 36, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, transition: 'all 0.15s', color: 'var(--text-secondary)',
            }} title="Toggle dark mode">
              {darkMode ? '☀' : '◑'}
            </button>

            {/* User pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '6px 12px 6px 8px',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--bg-primary)', fontWeight: 700, fontSize: 12,
                fontFamily: 'Syne, sans-serif',
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textTransform: 'capitalize' }}>{user?.role}</div>
              </div>
            </div>

            <button onClick={logout} className="btn btn-ghost btn-sm">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

        {/* Page title + actions */}
        <div className="animate-fade-in" style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: 28, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Leads
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
              Manage and track your sales pipeline
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => exportLeads.mutate()}
              disabled={exportLeads.isPending}
              className="btn btn-secondary"
            >
              {exportLeads.isPending ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Exporting...</> : '↓ Export CSV'}
            </button>
            <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
              + Add Lead
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-in stagger-1" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16, marginBottom: 28,
        }}>
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {stat.label}
                </span>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, fontSize: 15, fontWeight: 700,
                }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card animate-fade-in stagger-2" style={{ padding: '16px 20px', marginBottom: 20 }}>
          <LeadFilters />
        </div>

        {/* Table */}
        <div className="animate-fade-in stagger-3">
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 60, borderRadius: 12 }} />
              ))}
            </div>
          ) : isError ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <p style={{ color: 'var(--red)', fontWeight: 600, marginBottom: 8 }}>Failed to load leads</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Check your connection and try again</p>
            </div>
          ) : !data?.data?.length ? (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
              border: '2px dashed var(--border)',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>◎</div>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>
                No leads found
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                Try adjusting your filters or add your first lead
              </p>
              <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
                + Add First Lead
              </button>
            </div>
          ) : (
            <>
              <LeadsTable leads={data.data} />
              <Pagination
                page={filters.page}
                totalPages={data.totalPages}
                total={data.total}
                onPageChange={(p) => setFilter('page', p)}
              />
            </>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Lead">
        <LeadForm
          onSubmit={handleCreate}
          isLoading={createLead.isPending}
          submitLabel="Create Lead"
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { AuthResponse } from '../types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'sales'>('sales');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('All fields are required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password, role });
      setAuth(data.data.user, data.data.token);
      toast.success('Welcome to Smart Leads!');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -120, left: -120, width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, background: 'var(--accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, boxShadow: 'var(--shadow-md)',
          }}>
            <span style={{ color: 'var(--bg-primary)', fontSize: 24 }}>◈</span>
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Join your team on Smart Leads</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{
              background: 'var(--red-soft)', border: '1px solid var(--red)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20,
              color: 'var(--red)', fontSize: 13,
            }}>⚠ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="input-label">Full Name</label>
              <input type="text" placeholder="John Doe" value={name}
                onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input type="password" placeholder="Min. 6 characters" value={password}
                onChange={(e) => setPassword(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="input-label">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'sales')}
                className="input-field"
                style={{ cursor: 'pointer' }}
              >
                <option value="sales">👤 Sales User</option>
                <option value="admin">⚡ Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
              style={{ marginTop: 8, width: '100%' }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating...</> : 'Create Account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

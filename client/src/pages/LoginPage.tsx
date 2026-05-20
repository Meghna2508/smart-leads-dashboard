import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { AuthResponse } from '../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('All fields are required'); return; }
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
      setAuth(data.data.user, data.data.token);
      toast.success(`Welcome back, ${data.data.user.name}!`);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, left: -80,
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'var(--accent)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, boxShadow: 'var(--shadow-md)',
          }}>
            <span style={{ color: 'var(--bg-primary)', fontSize: 24 }}>◈</span>
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800,
            color: 'var(--text-primary)', margin: '0 0 8px',
          }}>Smart Leads</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{
              background: 'var(--red-soft)', border: '1px solid var(--red)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20,
              color: 'var(--red)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ marginTop: 4, width: '100%' }}
            >
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in...</> : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 24 }}>
          No account yet?{' '}
          <Link to="/register" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
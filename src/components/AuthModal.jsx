import { useState } from 'react'
import { X, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { loginUser } from '../api/anggota'

const labelStyle = {
  fontSize: '11px', fontWeight: '600',
  color: '#6b7191', textTransform: 'uppercase',
  letterSpacing: '0.07em', marginBottom: '6px',
  display: 'block',
}

function InputField({ label, type = 'text', value, onChange, placeholder, error, rightElement }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            background: '#0d0f18',
            border: `1px solid ${error ? '#c87e7e' : '#1e2235'}`,
            borderRadius: '10px',
            padding: '11px 14px',
            paddingRight: rightElement ? '42px' : '14px',
            fontSize: '13.5px',
            color: '#d0d4e8',
            outline: 'none',
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: 'border-box',
            transition: 'border-color 0.18s',
          }}
          onFocus={e => e.target.style.borderColor = error ? '#c87e7e' : 'rgba(200,169,110,0.6)'}
          onBlur={e => e.target.style.borderColor = error ? '#c87e7e' : '#1e2235'}
        />
        {rightElement && (
          <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#454866' }}>
            {rightElement}
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: '11px', color: '#c87e7e', marginTop: '4px', margin: '4px 0 0' }}>{error}</p>}
    </div>
  )
}

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState(null)
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors]     = useState({})

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const validate = () => {
    const e = {}
    if (!email.trim())
      e.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Format email tidak valid'
    if (!password.trim())
      e.password = 'Password wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const res  = await loginUser({ email, password })
      const user = res.data.user

      localStorage.setItem('vihara_auth', JSON.stringify({
        id:    user.id,
        name:  user.nama,
        email: user.email,
      }))

      showToast('success', `Selamat datang, ${user.nama}!`)
      setTimeout(() => {
        onLoginSuccess({ id: user.id, name: user.nama, email: user.email })
        onClose()
      }, 1500)
    } catch (err) {
      const msg = err.response?.data?.error || 'Terjadi kesalahan. Coba lagi.'
      setErrors({ password: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin    { to { transform: rotate(360deg); } }
        input::placeholder { color: #353858; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px #0d0f18 inset !important;
          -webkit-text-fill-color: #d0d4e8 !important;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={!loading ? onClose : undefined}
        style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(4,5,10,0.92)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s ease',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%', maxWidth: '400px',
            background: '#12141f',
            border: '1px solid #1e2235',
            borderRadius: '20px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,169,110,0.06)',
            overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Gold top border */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #c8a96e, #a07840, transparent)' }} />

          {/* Header */}
          <div style={{ padding: '32px 28px 24px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #c8a96e, #a07840)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#0f1117', flexShrink: 0 }}>M</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb', margin: 0 }}>Vihara Ming De</p>
                <p style={{ fontSize: '11px', color: '#454860', margin: 0 }}>Sistem Manajemen Umat</p>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '600', color: '#e8eaf5', margin: '0 0 6px' }}>
              Selamat Datang
            </h2>
            <p style={{ fontSize: '13px', color: '#454866', margin: 0 }}>
              Masuk untuk mengelola data umat vihara
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '0 28px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })) }}
              placeholder="email@contoh.com"
              error={errors.email}
            />
            <InputField
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })) }}
              placeholder="Masukkan password"
              error={errors.password}
              rightElement={
                <span onClick={() => setShowPass(v => !v)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </span>
              }
            />

            <button
              onClick={handleLogin} disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: '11px', background: loading ? '#1e2235' : 'linear-gradient(135deg, #c8a96e, #a07840)', border: 'none', color: loading ? '#454866' : '#0d0f18', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px', boxShadow: loading ? 'none' : '0 4px 20px rgba(200,169,110,0.3)', transition: 'all 0.15s' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity='0.9'; e.currentTarget.style.transform='translateY(-1px)' }}}
              onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)' }}
            >
              {loading
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</>
                : 'Masuk'
              }
            </button>

            {/* Info box */}
            <div style={{ background: 'rgba(200,169,110,0.06)', border: '1px solid rgba(200,169,110,0.15)', borderRadius: '10px', padding: '12px 14px', marginTop: '4px' }}>
              <p style={{ fontSize: '12px', color: '#c8a96e', margin: 0, lineHeight: 1.6 }}>
                🔒 Akses hanya untuk administrator yang ditunjuk. Hubungi Louis Chai untuk mendapatkan akun.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 2100, display: 'flex', alignItems: 'center', gap: '12px', background: toast.type==='success' ? '#0d1a14' : '#1a0d0d', border: `1px solid ${toast.type==='success' ? 'rgba(126,200,160,0.35)' : 'rgba(200,126,126,0.35)'}`, borderRadius: '12px', padding: '14px 18px', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', animation: 'toastIn 0.3s ease', maxWidth: '320px' }}>
          {toast.type === 'success' ? <CheckCircle size={16} color="#7ec8a0" /> : <AlertCircle size={16} color="#c87e7e" />}
          <p style={{ fontSize: '13px', color: toast.type==='success' ? '#7ec8a0' : '#c87e7e', margin: 0 }}>{toast.msg}</p>
        </div>
      )}
    </>
  )
}
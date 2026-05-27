import { useState } from 'react'
import { X, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

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
            width: '100%',
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
  const [mode, setMode]         = useState('login')  // 'login' | 'signup'
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState(null)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Login fields
  const [loginEmail, setLoginEmail]     = useState('')
  const [loginPass, setLoginPass]       = useState('')

  // Signup fields
  const [signupName, setSignupName]         = useState('')
  const [signupEmail, setSignupEmail]       = useState('')
  const [signupPass, setSignupPass]         = useState('')
  const [signupConfirm, setSignupConfirm]   = useState('')

  // Errors
  const [errors, setErrors] = useState({})

  const clearErrors = () => setErrors({})

  const switchMode = (m) => {
    setMode(m)
    clearErrors()
    setToast(null)
  }

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Validate login ────────────────────────────────────────────────────────
  const validateLogin = () => {
    const e = {}
    if (!loginEmail.trim())                               e.loginEmail = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) e.loginEmail = 'Format email tidak valid'
    if (!loginPass.trim())                                e.loginPass  = 'Password wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Validate signup ───────────────────────────────────────────────────────
  const validateSignup = () => {
    const e = {}
    if (!signupName.trim())                               e.signupName    = 'Nama lengkap wajib diisi'
    if (!signupEmail.trim())                              e.signupEmail   = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) e.signupEmail = 'Format email tidak valid'
    if (!signupPass.trim())                               e.signupPass    = 'Password wajib diisi'
    else if (signupPass.length < 6)                       e.signupPass    = 'Password minimal 6 karakter'
    if (!signupConfirm.trim())                            e.signupConfirm = 'Konfirmasi password wajib diisi'
    else if (signupConfirm !== signupPass)                e.signupConfirm = 'Password tidak cocok'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Handle login ──────────────────────────────────────────────────────────
  // To connect to real backend later, replace the fake logic inside here
  // with: const res = await fetch('/api/login', { method:'POST', body: JSON.stringify({email, password}) })
  const handleLogin = async () => {
    if (!validateLogin()) return
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1200)) // simulate API call

      // ── FAKE AUTH — replace this block with real API call ──
      const users = JSON.parse(localStorage.getItem('vihara_users') || '[]')
      const found = users.find(u => u.email === loginEmail && u.password === loginPass)
      if (!found) {
        setErrors({ loginPass: 'Email atau password salah' })
        setLoading(false)
        return
      }
      // ── end fake auth ──

      localStorage.setItem('vihara_auth', JSON.stringify({ name: found.name, email: found.email }))
      showToast('success', `Selamat datang kembali, ${found.name}!`)
      setTimeout(() => { onLoginSuccess(found); onClose() }, 1500)
    } catch {
      showToast('error', 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // ── Handle signup ─────────────────────────────────────────────────────────
  // To connect to real backend later, replace fake logic with real API call
  const handleSignup = async () => {
    if (!validateSignup()) return
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 1200)) // simulate API call

      // ── FAKE REGISTER — replace this block with real API call ──
      const users = JSON.parse(localStorage.getItem('vihara_users') || '[]')
      if (users.find(u => u.email === signupEmail)) {
        setErrors({ signupEmail: 'Email sudah terdaftar' })
        setLoading(false)
        return
      }
      const newUser = { name: signupName, email: signupEmail, password: signupPass }
      users.push(newUser)
      localStorage.setItem('vihara_users', JSON.stringify(users))
      // ── end fake register ──

      showToast('success', 'Akun berhasil dibuat! Silakan login.')
      setTimeout(() => switchMode('login'), 1500)
    } catch {
      showToast('error', 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') mode === 'login' ? handleLogin() : handleSignup()
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
            width: '100%', maxWidth: '420px',
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
          <div style={{ padding: '28px 28px 0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #c8a96e, #a07840)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#0f1117' }}>M</div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#e5e7eb', margin: 0 }}>Vihara Ming De</p>
                    <p style={{ fontSize: '10px', color: '#454860', margin: 0 }}>Manajemen User</p>
                  </div>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '600', color: '#e8eaf5', margin: 0 }}>
                  {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
                </h2>
                <p style={{ fontSize: '13px', color: '#454866', marginTop: '5px' }}>
                  {mode === 'login'
                    ? 'Masukkan kredensial Anda untuk melanjutkan'
                    : 'Daftarkan akun administrator baru'
                  }
                </p>
              </div>
              <button
                onClick={onClose} disabled={loading}
                style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#1a1d2e', border: '1px solid #252840', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7191', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background='#252840'; e.currentTarget.style.color='#c8a96e' }}
                onMouseLeave={e => { e.currentTarget.style.background='#1a1d2e'; e.currentTarget.style.color='#6b7191' }}
              ><X size={13} /></button>
            </div>

            {/* Mode tabs */}
            <div style={{ display: 'flex', background: '#0d0f18', borderRadius: '10px', padding: '3px', marginBottom: '24px' }}>
              {['login', 'signup'].map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  disabled={loading}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px',
                    background: mode === m ? '#1e2235' : 'transparent',
                    border: mode === m ? '1px solid #2a2d48' : '1px solid transparent',
                    color: mode === m ? '#c8a96e' : '#454866',
                    fontSize: '13px', fontWeight: mode === m ? '600' : '400',
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {m === 'login' ? 'Masuk' : 'Daftar'}
                </button>
              ))}
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* ── LOGIN FORM ── */}
            {mode === 'login' && (
              <>
                <InputField
                  label="Email"
                  type="email"
                  value={loginEmail}
                  onChange={e => { setLoginEmail(e.target.value); setErrors(v => ({ ...v, loginEmail: '' })) }}
                  placeholder="contoh@gmail.com"
                  error={errors.loginEmail}
                />
                <InputField
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  value={loginPass}
                  onChange={e => { setLoginPass(e.target.value); setErrors(v => ({ ...v, loginPass: '' })) }}
                  placeholder="Masukkan password"
                  error={errors.loginPass}
                  rightElement={
                    <span onClick={() => setShowPass(v => !v)}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </span>
                  }
                />
                <button
                  onClick={handleLogin} disabled={loading}
                  style={{ width: '100%', padding: '12px', borderRadius: '11px', background: loading ? '#1e2235' : 'linear-gradient(135deg, #c8a96e, #a07840)', border: 'none', color: loading ? '#454866' : '#0d0f18', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px', boxShadow: loading ? 'none' : '0 4px 20px rgba(200,169,110,0.25)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  {loading
                    ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</>
                    : 'Masuk'
                  }
                </button>
                <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#454866', margin: 0 }}>
                  Belum punya akun?{' '}
                  <span onClick={() => switchMode('signup')} style={{ color: '#c8a96e', cursor: 'pointer', fontWeight: '500' }}>
                    Daftar sekarang
                  </span>
                </p>
              </>
            )}

            {/* ── SIGNUP FORM ── */}
            {mode === 'signup' && (
              <>
                <InputField
                  label="Nama Lengkap"
                  value={signupName}
                  onChange={e => { setSignupName(e.target.value); setErrors(v => ({ ...v, signupName: '' })) }}
                  placeholder="Masukkan nama lengkap"
                  error={errors.signupName}
                />
                <InputField
                  label="Email"
                  type="email"
                  value={signupEmail}
                  onChange={e => { setSignupEmail(e.target.value); setErrors(v => ({ ...v, signupEmail: '' })) }}
                  placeholder="contoh@gmail.com"
                  error={errors.signupEmail}
                />
                <InputField
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  value={signupPass}
                  onChange={e => { setSignupPass(e.target.value); setErrors(v => ({ ...v, signupPass: '' })) }}
                  placeholder="Minimal 6 karakter"
                  error={errors.signupPass}
                  rightElement={
                    <span onClick={() => setShowPass(v => !v)}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </span>
                  }
                />
                <InputField
                  label="Konfirmasi Password"
                  type={showConfirm ? 'text' : 'password'}
                  value={signupConfirm}
                  onChange={e => { setSignupConfirm(e.target.value); setErrors(v => ({ ...v, signupConfirm: '' })) }}
                  placeholder="Ulangi password"
                  error={errors.signupConfirm}
                  rightElement={
                    <span onClick={() => setShowConfirm(v => !v)}>
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </span>
                  }
                />
                <button
                  onClick={handleSignup} disabled={loading}
                  style={{ width: '100%', padding: '12px', borderRadius: '11px', background: loading ? '#1e2235' : 'linear-gradient(135deg, #c8a96e, #a07840)', border: 'none', color: loading ? '#454866' : '#0d0f18', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px', boxShadow: loading ? 'none' : '0 4px 20px rgba(200,169,110,0.25)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  {loading
                    ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Memproses...</>
                    : 'Buat Akun'
                  }
                </button>
                <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#454866', margin: 0 }}>
                  Sudah punya akun?{' '}
                  <span onClick={() => switchMode('login')} style={{ color: '#c8a96e', cursor: 'pointer', fontWeight: '500' }}>
                    Masuk di sini
                  </span>
                </p>
              </>
            )}
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
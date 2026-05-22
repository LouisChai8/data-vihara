import { useState } from 'react'
import { X, User, BookOpen, Phone, Shield, Loader2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'
import { createAnggota } from '../api/anggota'

const EMPTY_FORM = {
  nama_lengkap: '',
  nama_baptis: '',
  jenis_kelamin: '',
  tanggal_lahir: '',
  chiu_tao_sejak: '',
  alamat: '',
  no_telepon: '',
  email: '',
  guru_pengajak: '',
  guru_penanggung: '',
  pandita: '',
  peran: 'Viewer',
  status: 'Aktif',
  foto: '',
}

const steps = [
  { id: 1, label: 'Pribadi',    icon: User },
  { id: 2, label: 'Keagamaan', icon: BookOpen },
  { id: 3, label: 'Kontak',    icon: Phone },
  { id: 4, label: 'Akses',     icon: Shield },
]

export default function TambahAnggota({ onClose, onSuccess }) {
  const [form, setForm]         = useState(EMPTY_FORM)
  const [step, setStep]         = useState(1)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState(null) // { type: 'success'|'error', msg }

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.nama_lengkap.trim()) e.nama_lengkap = 'Nama lengkap wajib diisi'
    if (!form.jenis_kelamin)       e.jenis_kelamin = 'Pilih jenis kelamin'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Format email tidak valid'
    if (form.no_telepon && !/^[0-9+\-\s]{8,15}$/.test(form.no_telepon))
      e.no_telepon = 'Format nomor telepon tidak valid'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      setStep(1)
      return
    }
    setLoading(true)
    try {
      await createAnggota(form)
      setToast({ type: 'success', msg: `Anggota "${form.nama_lengkap}" berhasil ditambahkan!` })
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1800)
    } catch (err) {
      setToast({ type: 'error', msg: 'Gagal menyimpan data. Periksa koneksi server.' })
      setTimeout(() => setToast(null), 3500)
    } finally {
      setLoading(false)
    }
  }

  // ── Shared input styles ──
  const inputStyle = (field) => ({
    width: '100%',
    background: '#0d0f18',
    border: `1px solid ${errors[field] ? '#c87e7e' : '#1e2235'}`,
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '13.5px',
    color: '#d0d4e8',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.18s',
  })

  const labelStyle = {
    fontSize: '11px', fontWeight: '600',
    color: '#6b7191', textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: '6px',
    display: 'block',
  }

  const Field = ({ label, field, type = 'text', placeholder = '' }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={form[field]}
        placeholder={placeholder}
        onChange={e => set(field, e.target.value)}
        style={inputStyle(field)}
        onFocus={e => e.target.style.borderColor = errors[field] ? '#c87e7e' : 'rgba(200,169,110,0.6)'}
        onBlur={e => e.target.style.borderColor = errors[field] ? '#c87e7e' : '#1e2235'}
      />
      {errors[field] && <p style={{ fontSize: '11px', color: '#c87e7e', marginTop: '4px' }}>{errors[field]}</p>}
    </div>
  )

  const SelectField = ({ label, field, options }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select
          value={form[field]}
          onChange={e => set(field, e.target.value)}
          style={{ ...inputStyle(field), appearance: 'none', paddingRight: '36px', cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = errors[field] ? '#c87e7e' : 'rgba(200,169,110,0.6)'}
          onBlur={e => e.target.style.borderColor = errors[field] ? '#c87e7e' : '#1e2235'}
        >
          <option value="" disabled>Pilih...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#454866', pointerEvents: 'none' }} />
      </div>
      {errors[field] && <p style={{ fontSize: '11px', color: '#c87e7e', marginTop: '4px' }}>{errors[field]}</p>}
    </div>
  )

  const TextAreaField = ({ label, field, placeholder = '' }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={form[field]}
        placeholder={placeholder}
        rows={3}
        onChange={e => set(field, e.target.value)}
        style={{ ...inputStyle(field), resize: 'vertical', lineHeight: 1.6 }}
        onFocus={e => e.target.style.borderColor = 'rgba(200,169,110,0.6)'}
        onBlur={e => e.target.style.borderColor = '#1e2235'}
      />
    </div>
  )

  // ── Step content ──
  const stepContent = {
    1: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Nama Lengkap *" field="nama_lengkap" placeholder="Masukkan nama lengkap" />
          </div>
          <Field label="Nama Baptis" field="nama_baptis" placeholder="Nama baptis" />
          <SelectField label="Jenis Kelamin *" field="jenis_kelamin" options={['Laki-laki', 'Perempuan']} />
          <Field label="Tanggal Lahir" field="tanggal_lahir" type="date" />
        </div>
        <TextAreaField label="Alamat Lengkap" field="alamat" placeholder="Masukkan alamat lengkap..." />
      </div>
    ),
    2: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Chiu Tao Sejak" field="chiu_tao_sejak" type="date" />
          </div>
          <Field label="Guru Pengajak" field="guru_pengajak" placeholder="Nama guru pengajak" />
          <Field label="Guru Penanggung" field="guru_penanggung" placeholder="Nama guru penanggung" />
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Pandita" field="pandita" placeholder="Nama pandita" />
          </div>
        </div>
      </div>
    ),
    3: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Field label="Nomor Telepon" field="no_telepon" placeholder="08xx-xxxx-xxxx" type="tel" />
        <Field label="Email" field="email" placeholder="email@contoh.com" type="email" />
        <Field label="URL Foto Profil" field="foto" placeholder="https://... (opsional)" />
      </div>
    ),
    4: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SelectField label="Peran (Role)" field="peran" options={['Administrator', 'Manajer', 'Viewer']} />
        <SelectField label="Status" field="status" options={['Aktif', 'Tidak Aktif']} />

        {/* Preview card */}
        <div style={{ marginTop: '8px', background: '#0d0f18', border: '1px solid #1e2235', borderRadius: '12px', padding: '18px' }}>
          <p style={{ fontSize: '10.5px', color: '#454866', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: '600', marginBottom: '14px' }}>Ringkasan Data</p>
          {[
            ['Nama', form.nama_lengkap || '—'],
            ['Nama Baptis', form.nama_baptis || '—'],
            ['Jenis Kelamin', form.jenis_kelamin || '—'],
            ['Tanggal Lahir', form.tanggal_lahir || '—'],
            ['Chiu Tao Sejak', form.chiu_tao_sejak || '—'],
            ['Pandita', form.pandita || '—'],
            ['Peran', form.peran],
            ['Status', form.status],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #1a1d2e' }}>
              <span style={{ fontSize: '12px', color: '#454866' }}>{k}</span>
              <span style={{ fontSize: '12px', color: '#c9cdd8', fontWeight: '500', maxWidth: '60%', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        select option { background: #12141f; color: #d0d4e8; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={!loading ? onClose : undefined}
        style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,6,12,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      >
        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth: '580px', background: '#12141f', border: '1px solid #1e2235', borderRadius: '20px', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', animation: 'slideUp 0.28s ease', overflow: 'hidden' }}
        >
          {/* Header */}
          <div style={{ padding: '24px 28px 0', background: 'linear-gradient(180deg, #161928 0%, #12141f 100%)', borderBottom: '1px solid #1a1d2e' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '22px' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#c8a96e', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '5px' }}>Vihara Ming De</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '600', color: '#e8eaf5', margin: 0 }}>Tambah Anggota Baru</h2>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#1a1d2e', border: '1px solid #252840', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7191', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#252840'; e.currentTarget.style.color = '#c8a96e' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#1a1d2e'; e.currentTarget.style.color = '#6b7191' }}
              ><X size={14} /></button>
            </div>

            {/* Step indicators */}
            <div style={{ display: 'flex', gap: 0, marginBottom: '-1px' }}>
              {steps.map(s => {
                const active = step === s.id
                const done   = step > s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                      padding: '10px 8px', background: 'none', border: 'none',
                      borderBottom: `2px solid ${active ? '#c8a96e' : 'transparent'}`,
                      cursor: 'pointer', transition: 'all 0.18s',
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700',
                      background: done ? 'rgba(126,200,160,0.15)' : active ? 'rgba(200,169,110,0.15)' : '#1a1d2e',
                      color: done ? '#7ec8a0' : active ? '#c8a96e' : '#454866',
                      border: `1px solid ${done ? 'rgba(126,200,160,0.3)' : active ? 'rgba(200,169,110,0.35)' : '#252840'}`,
                    }}>
                      {done ? '✓' : s.id}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: active ? '600' : '400', color: active ? '#c8a96e' : done ? '#7ec8a0' : '#454866' }}>{s.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: '24px 28px', maxHeight: '52vh', overflowY: 'auto' }}>
            {stepContent[step]}
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #1a1d2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
              disabled={loading}
              style={{ padding: '10px 20px', borderRadius: '10px', background: 'transparent', border: '1px solid #1e2235', color: '#6b7191', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e3150'; e.currentTarget.style.color = '#c9cdd8' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2235'; e.currentTarget.style.color = '#6b7191' }}
            >
              {step === 1 ? 'Batal' : '← Kembali'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Step dots */}
              {steps.map(s => (
                <div key={s.id} style={{ width: step === s.id ? '16px' : '6px', height: '6px', borderRadius: '3px', background: step === s.id ? '#c8a96e' : step > s.id ? '#7ec8a0' : '#1e2235', transition: 'all 0.25s' }} />
              ))}
            </div>

            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                style={{ padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #c8a96e, #a07840)', border: 'none', color: '#0d0f18', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 16px rgba(200,169,110,0.2)', transition: 'opacity 0.15s, transform 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Lanjut →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ padding: '10px 22px', borderRadius: '10px', background: loading ? '#1e2235' : 'linear-gradient(135deg, #c8a96e, #a07840)', border: 'none', color: loading ? '#454866' : '#0d0f18', fontSize: '13px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '8px', boxShadow: loading ? 'none' : '0 4px 16px rgba(200,169,110,0.2)', minWidth: '140px', justifyContent: 'center' }}
              >
                {loading
                  ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Menyimpan...</>
                  : '✓ Simpan Anggota'
                }
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 1200,
          display: 'flex', alignItems: 'center', gap: '12px',
          background: toast.type === 'success' ? '#0d1a14' : '#1a0d0d',
          border: `1px solid ${toast.type === 'success' ? 'rgba(126,200,160,0.35)' : 'rgba(200,126,126,0.35)'}`,
          borderRadius: '12px', padding: '14px 18px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          animation: 'toastIn 0.3s ease',
          maxWidth: '340px',
        }}>
          {toast.type === 'success'
            ? <CheckCircle size={18} color="#7ec8a0" />
            : <AlertCircle size={18} color="#c87e7e" />
          }
          <p style={{ fontSize: '13px', color: toast.type === 'success' ? '#7ec8a0' : '#c87e7e', margin: 0 }}>{toast.msg}</p>
        </div>
      )}
    </>
  )
}
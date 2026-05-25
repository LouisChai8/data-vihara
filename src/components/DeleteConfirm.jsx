import { useState, useEffect } from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'

function getInisial(nama) {
  if (!nama) return '?'
  const parts = nama.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}

const warnaList = ['#c8a96e','#7eb8d4','#8a7ec8','#c87ea0','#7ec8a0','#c8b07e','#d47e7e','#7ec8c8']
const getWarna = (id) => warnaList[(id - 1) % warnaList.length]

export default function DeleteConfirm({ anggota, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [phase, setPhase]     = useState('idle') // idle | shaking | done

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 260)
  }

  const handleDelete = async () => {
    setPhase('shaking')
    setTimeout(() => setPhase('idle'), 500)
    setLoading(true)
    try {
      await onConfirm(anggota.id)
    } finally {
      setLoading(false)
    }
  }

  const warna = getWarna(anggota?.id || 1)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-6px) rotate(-1deg); }
          30%     { transform: translateX(6px) rotate(1deg); }
          45%     { transform: translateX(-4px); }
          60%     { transform: translateX(4px); }
          75%     { transform: translateX(-2px); }
        }
        @keyframes pulseRed {
          0%,100% { box-shadow: 0 0 0 0 rgba(200,100,100,0); }
          50%     { box-shadow: 0 0 0 8px rgba(200,100,100,0.12); }
        }
        @keyframes warningPop {
          0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .del-backdrop { transition: opacity 0.26s ease; }
        .del-modal    { transition: opacity 0.26s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .del-btn-cancel { transition: all 0.15s; }
        .del-btn-cancel:hover { background: #1e2235 !important; color: #c9cdd8 !important; border-color: #2e3150 !important; }
      `}</style>

      {/* Backdrop */}
      <div
        className="del-backdrop"
        onClick={!loading ? handleClose : undefined}
        style={{
          position: 'fixed', inset: 0, zIndex: 1150,
          background: 'rgba(5,6,12,0.92)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Modal */}
        <div
          className="del-modal"
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '420px',
            background: '#12141f',
            border: '1px solid #2a1a1a',
            borderRadius: '20px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,100,100,0.08)',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.94)',
            animation: phase === 'shaking' ? 'shake 0.45s ease' : 'none',
          }}
        >
          {/* Red top accent */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #c87e7e, #a04040, transparent)' }} />

          {/* Body */}
          <div style={{ padding: '32px 32px 28px', textAlign: 'center' }}>

            {/* Warning icon */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(200,100,100,0.08)',
              border: '1.5px solid rgba(200,100,100,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              animation: visible ? 'warningPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards, pulseRed 2.5s 0.5s infinite' : 'none',
            }}>
              <AlertTriangle size={28} color="#c87e7e" strokeWidth={1.8} />
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '600', color: '#e8eaf5', margin: '0 0 8px' }}>
              Hapus Anggota?
            </h2>
            <p style={{ fontSize: '13.5px', color: '#6b7191', margin: '0 0 24px', lineHeight: 1.6 }}>
              Tindakan ini tidak dapat dibatalkan. Data anggota akan dihapus secara permanen dari sistem.
            </p>

            {/* Member preview card */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: '#0d0f18',
              border: '1px solid #1e2235',
              borderRadius: '12px',
              padding: '14px 16px',
              marginBottom: '28px',
              textAlign: 'left',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: `${warna}18`, border: `1.5px solid ${warna}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '600', color: warna, flexShrink: 0,
              }}>{getInisial(anggota?.nama_lengkap)}</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#e0e2f0', margin: 0 }}>{anggota?.nama_lengkap}</p>
                <p style={{ fontSize: '12px', color: '#454866', margin: '2px 0 0', fontStyle: 'italic' }}>{anggota?.nama_baptis || anggota?.peran}</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: anggota?.status === 'Aktif' ? '#7ec8a0' : '#c87e7e' }} />
                <span style={{ fontSize: '11px', color: anggota?.status === 'Aktif' ? '#7ec8a0' : '#c87e7e' }}>{anggota?.status}</span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="del-btn-cancel"
                onClick={handleClose}
                disabled={loading}
                style={{ flex: 1, padding: '12px', borderRadius: '11px', background: 'transparent', border: '1px solid #1e2235', color: '#6b7191', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif' " }}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                style={{
                  flex: 1, padding: '12px', borderRadius: '11px',
                  background: loading
                    ? '#1e2235'
                    : 'linear-gradient(135deg, #c84040, #8a2020)',
                  border: `1px solid ${loading ? '#1e2235' : 'rgba(200,64,64,0.4)'}`,
                  color: loading ? '#454866' : '#fff',
                  fontSize: '13.5px', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(200,64,64,0.25)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {loading
                  ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Menghapus...</>
                  : <><Trash2 size={14} /> Ya, Hapus</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
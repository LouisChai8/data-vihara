import { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, MoreHorizontal, ArrowUpRight, Calendar, MapPin } from 'lucide-react'
import { getAnggota } from '../api/anggota'

function formatDate(dateStr) {
  if (!dateStr || dateStr === '0000-00-00') return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getInisial(nama) {
  if (!nama) return '?'
  const parts = nama.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}

const warnaList = ['#c8a96e','#7eb8d4','#8a7ec8','#c87ea0','#7ec8a0','#c8b07e','#d47e7e','#7ec8c8']
const getWarna = (id) => warnaList[(id - 1) % warnaList.length]

const roleStyle = {
  Administrator: { bg: 'rgba(200,169,110,0.15)', color: '#c8a96e' },
  Manajer:       { bg: 'rgba(126,184,212,0.15)', color: '#7eb8d4' },
  Viewer:        { bg: 'rgba(160,160,170,0.12)', color: '#9ca3af' },
}

export default function Dashboard() {
  const [anggotaList, setAnggotaList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnggota()
      .then(res => setAnggotaList(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total   = anggotaList.length
  const aktif   = anggotaList.filter(a => a.status === 'Aktif').length
  const nonAktif = anggotaList.filter(a => a.status === 'Tidak Aktif').length
  const recent  = [...anggotaList].slice(0, 5)

  const StatCard = ({ icon: Icon, label, value, color, bg, sub }) => (
    <div style={{
      background: '#13151f',
      border: `1px solid #1e2030`,
      borderRadius: '18px',
      padding: '36px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e3150'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2030'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Background glow */}
      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: color, opacity: 0.04, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ background: bg, borderRadius: '14px', padding: '14px', display: 'flex' }}>
          <Icon size={26} color={color} strokeWidth={1.8} />
        </div>
        <span style={{ fontSize: '12px', color: '#454866' }}>{sub}</span>
      </div>

      <div>
        {loading ? (
          <div style={{ height: '52px', width: '120px', background: '#1e2030', borderRadius: '8px', animation: 'shimmer 1.5s infinite' }} />
        ) : (
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '52px', fontWeight: '600',
            color: '#e8eaf5', margin: 0, lineHeight: 1,
            letterSpacing: '-1px',
          }}>{value.toLocaleString('id-ID')}</p>
        )}
        <p style={{ fontSize: '15px', color: '#6b7191', marginTop: '10px', fontWeight: '400' }}>{label}</p>
      </div>

      {/* Bottom accent bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${color}60, transparent)` }} />
    </div>
  )

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        * { box-sizing: border-box; }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #1a1d2e 25%, #20243a 50%, #1a1d2e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        .table-row { transition: background 0.15s; }
        .table-row:hover { background: #16192a !important; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '28px', fontWeight: '600',
          color: '#e5e7eb', margin: '0 0 6px',
        }}>Selamat datang kembali 👋</h1>
        <p style={{ fontSize: '13.5px', color: '#454860' }}>
          Berikut ringkasan data umat Vihara Ming De hari ini.
        </p>
      </div>

      {/* 3 Big stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatCard
          icon={Users}
          label="Total Umat"
          value={total}
          color="#c8a96e"
          bg="rgba(200,169,110,0.1)"
          sub="Semua terdaftar"
        />
        <StatCard
          icon={UserCheck}
          label="Umat Aktif"
          value={aktif}
          color="#4ade80"
          bg="rgba(74,222,128,0.08)"
          sub="Status aktif"
        />
        <StatCard
          icon={UserX}
          label="Umat Tidak Aktif"
          value={nonAktif}
          color="#f87171"
          bg="rgba(248,113,113,0.08)"
          sub="Status tidak aktif"
        />
      </div>

      {/* Active % banner */}
      {!loading && total > 0 && (
        <div style={{
          background: '#13151f',
          border: '1px solid #1e2030',
          borderRadius: '14px',
          padding: '20px 28px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#6b7191' }}>Tingkat keaktifan umat</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#4ade80' }}>
                {total > 0 ? Math.round((aktif / total) * 100) : 0}% aktif
              </span>
            </div>
            <div style={{ height: '8px', background: '#1e2030', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${total > 0 ? (aktif / total) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                borderRadius: '4px',
                transition: 'width 1s ease',
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#4ade80', margin: 0 }}>{aktif}</p>
              <p style={{ fontSize: '11px', color: '#454866', marginTop: '2px' }}>Aktif</p>
            </div>
            <div style={{ width: '1px', background: '#1e2030' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#f87171', margin: 0 }}>{nonAktif}</p>
              <p style={{ fontSize: '11px', color: '#454866', marginTop: '2px' }}>Tidak Aktif</p>
            </div>
            <div style={{ width: '1px', background: '#1e2030' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#c8a96e', margin: 0 }}>{total}</p>
              <p style={{ fontSize: '11px', color: '#454866', marginTop: '2px' }}>Total</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent members table */}
      <div style={{ background: '#13151f', border: '1px solid #1e2030', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '22px 24px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e2030' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#c9cdd8', margin: 0 }}>Umat Terbaru</p>
            <p style={{ fontSize: '12px', color: '#454860', marginTop: '3px' }}>5 pendaftaran terakhir</p>
          </div>
          <a href="/user" style={{ fontSize: '12px', color: '#c8a96e', background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '7px', padding: '6px 14px', cursor: 'pointer', textDecoration: 'none' }}>
            Lihat Semua →
          </a>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 32px', padding: '10px 22px', borderBottom: '1px solid #1a1d2a' }}>
          {['Nama', 'Peran', 'Chiu Tao', 'Status', ''].map((h, i) => (
            <span key={i} style={{ fontSize: '10.5px', fontWeight: '600', color: '#353850', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && [...Array(5)].map((_, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 32px', padding: '14px 22px', borderBottom: '1px solid #1a1d2a', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="skeleton" style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }} />
              <div className="skeleton" style={{ height: 13, width: '60%' }} />
            </div>
            <div className="skeleton" style={{ height: 13, width: '70%' }} />
            <div className="skeleton" style={{ height: 13, width: '80%' }} />
            <div className="skeleton" style={{ height: 13, width: '50%' }} />
          </div>
        ))}

        {/* Empty */}
        {!loading && recent.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#353858' }}>
            <Users size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ fontSize: '13px' }}>Belum ada umat terdaftar.</p>
          </div>
        )}

        {/* Rows */}
        {!loading && recent.map((u) => {
          const rs = roleStyle[u.peran] || roleStyle.Viewer
          const warna = getWarna(u.id)
          return (
            <div
              key={u.id}
              className="table-row"
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 32px', padding: '13px 22px', borderBottom: '1px solid #1a1d2a', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: `${warna}18`, border: `1.5px solid ${warna}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '600', color: warna, flexShrink: 0
                }}>{getInisial(u.nama_lengkap)}</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#c9cdd8', margin: 0 }}>{u.nama_lengkap}</p>
                  {u.nama_baptis && <p style={{ fontSize: '11px', color: '#454866', margin: '1px 0 0', fontStyle: 'italic' }}>{u.nama_baptis}</p>}
                </div>
              </div>

              <span style={{ fontSize: '11.5px', fontWeight: '500', color: rs.color, background: rs.bg, padding: '3px 10px', borderRadius: '20px', display: 'inline-block' }}>{u.peran}</span>

              <span style={{ fontSize: '12.5px', color: '#454860' }}>{formatDate(u.chiu_tao_sejak)}</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'Aktif' ? '#4ade80' : '#f87171' }} />
                <span style={{ fontSize: '12.5px', color: u.status === 'Aktif' ? '#4ade80' : '#f87171' }}>{u.status}</span>
              </div>

              <div style={{ color: '#353850', display: 'flex' }}>
                <MoreHorizontal size={15} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
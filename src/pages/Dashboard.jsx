import { Users, UserCheck, UserX, TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react'

const stats = [
  { label: 'Total Anggota', value: '1,284', change: '+12%', up: true,  icon: Users,      color: '#f0c060', bg: 'rgba(240,192,96,0.08)' },
  { label: 'Anggota Aktif', value: '947',   change: '+8%',  up: true,  icon: UserCheck,  color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
  { label: 'Tidak Aktif',   value: '337',   change: '-3%',  up: false, icon: UserX,      color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
  { label: 'Pertumbuhan',   value: '23.5%', change: '+4%',  up: true,  icon: TrendingUp, color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
]

const recentUsers = [
  { name: 'Kimleng',  role: 'Administrator', date: '18 Mei 2025', status: 'Aktif',       avatar: 'KL' },
  { name: 'Siti Rahayu',   role: 'Manajer',       date: '17 Mei 2025', status: 'Aktif',       avatar: 'SR' },
  { name: 'Ahmad Fauzi',   role: 'Viewer',        date: '15 Mei 2025', status: 'Tidak Aktif', avatar: 'AF' },
  { name: 'Dewi Lestari',  role: 'Manajer',       date: '14 Mei 2025', status: 'Aktif',       avatar: 'DL' },
  { name: 'Rizky Pratama', role: 'Viewer',        date: '12 Mei 2025', status: 'Aktif',       avatar: 'RP' },
]

const roleColors = {
  Administrator: { bg: 'rgba(240,192,96,0.12)',  color: '#f0c060' },
  Manajer:       { bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa' },
  Viewer:        { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
}

const barData = [42, 68, 55, 80, 63, 91, 74, 88, 57, 76, 95, 83]
const months  = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

export default function Dashboard() {
  const maxBar = Math.max(...barData)

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .stat-card {
          background: #13151f;
          border: 1px solid #1e2030;
          border-radius: 14px;
          padding: 22px;
          transition: border-color 0.2s, transform 0.2s;
          cursor: default;
        }
        .stat-card:hover { border-color: #2e3150; transform: translateY(-2px); }
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 32px;
          align-items: center;
          padding: 13px 18px;
          border-bottom: 1px solid #1a1d2a;
          transition: background 0.15s;
        }
        .table-row:hover { background: #16192a; }
        .table-row:last-child { border-bottom: none; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '26px', fontWeight: '600',
          color: '#e5e7eb', marginBottom: '6px'
        }}>Selamat datang kembali 👋</h1>
        <p style={{ fontSize: '13.5px', color: '#454860' }}>Berikut ringkasan data anggota Data Vihara hari ini.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: bg, borderRadius: '10px', padding: '9px', display: 'flex' }}>
                <Icon size={17} color={color} />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', fontWeight: '500', color: up ? '#4ade80' : '#f87171' }}>
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </span>
            </div>
            <p style={{ fontSize: '24px', fontWeight: '600', color: '#e5e7eb', letterSpacing: '-0.5px' }}>{value}</p>
            <p style={{ fontSize: '12px', color: '#454860', marginTop: '4px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px', marginBottom: '24px' }}>

        {/* Bar Chart */}
        <div style={{ background: '#13151f', border: '1px solid #1e2030', borderRadius: '14px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#c9cdd8' }}>Pertumbuhan Anggota</p>
              <p style={{ fontSize: '11.5px', color: '#454860', marginTop: '2px' }}>Januari — Desember 2024</p>
            </div>
            <span style={{ fontSize: '11px', color: '#f0c060', background: 'rgba(240,192,96,0.1)', padding: '4px 10px', borderRadius: '20px' }}>+23.5% YTD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
            {barData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%',
                  height: `${(val / maxBar) * 100}%`,
                  borderRadius: '5px 5px 3px 3px',
                  background: i === 10
                    ? 'linear-gradient(180deg, #f0c060 0%, #d4860a 100%)'
                    : '#1e2030',
                  minHeight: '6px',
                }} />
                <span style={{ fontSize: '10px', color: '#353850' }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div style={{ background: '#13151f', border: '1px solid #1e2030', borderRadius: '14px', padding: '22px' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#c9cdd8', marginBottom: '4px' }}>Distribusi Peran</p>
          <p style={{ fontSize: '11.5px', color: '#454860', marginBottom: '22px' }}>Berdasarkan role aktif</p>
          {[
            { label: 'Viewer',        val: 58, color: '#9ca3af' },
            { label: 'Manajer',       val: 29, color: '#60a5fa' },
            { label: 'Administrator', val: 13, color: '#f0c060' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12.5px', color: '#6b7280' }}>{label}</span>
                <span style={{ fontSize: '12.5px', color: '#c9cdd8', fontWeight: '500' }}>{val}%</span>
              </div>
              <div style={{ height: '5px', background: '#1e2030', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${val}%`, background: color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="35" fill="none" stroke="#1e2030" strokeWidth="12" />
              <circle cx="45" cy="45" r="35" fill="none" stroke="#f0c060" strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 35 * 0.13} ${2 * Math.PI * 35 * 0.87}`}
                strokeDashoffset={`${2 * Math.PI * 35 * 0.25}`} strokeLinecap="round" />
              <circle cx="45" cy="45" r="35" fill="none" stroke="#60a5fa" strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 35 * 0.29} ${2 * Math.PI * 35 * 0.71}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (0.25 - 0.13)}`} strokeLinecap="round" />
              <circle cx="45" cy="45" r="35" fill="none" stroke="#9ca3af" strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 35 * 0.58} ${2 * Math.PI * 35 * 0.42}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (0.25 - 0.13 - 0.29)}`} strokeLinecap="round" />
              <text x="45" y="49" textAnchor="middle" fontSize="11" fontWeight="600" fill="#e5e7eb" fontFamily="DM Sans">1,284</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div style={{ background: '#13151f', border: '1px solid #1e2030', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 22px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e2030' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#c9cdd8' }}>Anggota Terbaru</p>
            <p style={{ fontSize: '11.5px', color: '#454860', marginTop: '2px' }}>5 pendaftaran terakhir</p>
          </div>
          <button style={{ fontSize: '12px', color: '#f0c060', background: 'rgba(240,192,96,0.08)', border: '1px solid rgba(240,192,96,0.2)', borderRadius: '7px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'DM Sans' }}>
            Lihat Semua
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 32px', padding: '10px 18px', borderBottom: '1px solid #1a1d2a' }}>
          {['Nama', 'Peran', 'Tanggal Daftar', 'Status', ''].map((h, i) => (
            <span key={i} style={{ fontSize: '10.5px', fontWeight: '600', color: '#353850', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {recentUsers.map((u) => (
          <div key={u.name} className="table-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e2030, #2a2d3a)',
                border: '1px solid #2e3150',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '600', color: '#f0c060', flexShrink: 0
              }}>{u.avatar}</div>
              <p style={{ fontSize: '13px', fontWeight: '500', color: '#c9cdd8' }}>{u.name}</p>
            </div>
            <span style={{
              fontSize: '11.5px', fontWeight: '500',
              color: roleColors[u.role].color,
              background: roleColors[u.role].bg,
              padding: '3px 10px', borderRadius: '20px', display: 'inline-block'
            }}>{u.role}</span>
            <span style={{ fontSize: '12.5px', color: '#454860' }}>{u.date}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'Aktif' ? '#4ade80' : '#f87171' }} />
              <span style={{ fontSize: '12.5px', color: u.status === 'Aktif' ? '#4ade80' : '#f87171' }}>{u.status}</span>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#353850', padding: '4px', borderRadius: '5px', display: 'flex' }}>
              <MoreHorizontal size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Search, ChevronRight } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/user',      icon: Users,           label: 'User' },
]

export default function MainLayout() {
  const location = useLocation()
  const currentLabel = navItems.find(n => location.pathname.startsWith(n.to))?.label ?? 'Dashboard'

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f1117', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 2px; }

        .nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 13.5px; font-weight: 400;
          color: #6b7280; text-decoration: none;
          transition: all 0.18s ease;
          position: relative;
        }
        .nav-link:hover { background: #1a1d27; color: #c9cdd8; }
        .nav-link.active {
          background: #1e2030; color: #f0c060; font-weight: 500;
        }
        .nav-link.active::before {
          content: '';
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; border-radius: 0 2px 2px 0;
          background: #f0c060;
        }
        .nav-link svg { flex-shrink: 0; }

        .add-btn {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 9px 14px; border-radius: 8px;
          background: #f0c060; color: #0f1117;
          font-size: 13px; font-weight: 600;
          border: none; cursor: pointer;
          transition: background 0.18s, transform 0.1s;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
        }
        .add-btn:hover { background: #e6b44a; transform: translateY(-1px); }
        .add-btn:active { transform: translateY(0); }

        .top-search {
          background: #1a1d27; border: 1px solid #23263a;
          border-radius: 8px; padding: 8px 14px;
          font-size: 13px; color: #c9cdd8;
          outline: none; width: 220px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.18s;
        }
        .top-search::placeholder { color: #454860; }
        .top-search:focus { border-color: #f0c060; }

        .icon-btn {
          background: #1a1d27; border: 1px solid #23263a;
          border-radius: 8px; padding: 8px; cursor: pointer;
          color: #6b7280; display: flex; align-items: center;
          transition: color 0.18s, border-color 0.18s;
        }
        .icon-btn:hover { color: #f0c060; border-color: #f0c060; }

        .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #454860; }
        .breadcrumb span:last-child { color: #c9cdd8; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '220px', flexShrink: 0,
        background: '#13151f',
        borderRight: '1px solid #1e2030',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1e2030' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #f0c060 0%, #d4860a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: '#0f1117',
              flexShrink: 0,
            }}>M</div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#e5e7eb', lineHeight: 1.2 }}>Vihara Ming De</p>
              <p style={{ fontSize: '10.5px', color: '#454860', marginTop: '1px' }}>Manajemen User</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: '#353850', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px', marginBottom: '6px' }}>Menu</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{
          background: '#13151f', borderBottom: '1px solid #1e2030',
          padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div className="breadcrumb">
            <span>Vihara Ming De</span>
            <ChevronRight size={12} />
            <span>{currentLabel}</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#454860' }} />
            <input className="top-search" style={{ paddingLeft: '32px' }} placeholder="Cari anggota..." />
          </div>

          {/* Avatar */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #f0c060, #d4860a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700', color: '#0f1117', cursor: 'pointer',
            flexShrink: 0,
          }}>K</div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Activity, Settings,
  HelpCircle, LogOut, Plus, Bell, HelpingHand
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/user',      icon: Users,           label: 'User' },
  { to: '/aktivitas', icon: Activity,        label: 'Aktivitas' },
  { to: '/pengaturan',icon: Settings,        label: 'Pengaturan' },
]

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="font-bold text-gray-900 text-sm">Vihara Ming De</p>
          <p className="text-xs text-gray-400 mt-0.5">User Management</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ` +
                (isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50')
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Add User Button */}
        <div className="px-3 pb-4">
          <NavLink
            to="/user/tambah"
            className="flex items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Tambah User Baru
          </NavLink>
        </div>

        {/* Bottom links */}
        <div className="px-3 pb-5 space-y-1 border-t border-gray-100 pt-3">
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg w-full">
            <HelpCircle size={16} /> Pusat Bantuan
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg w-full">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
          <input
            type="text"
            placeholder="Cari anggota..."
            className="flex-1 max-w-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
          <nav className="flex gap-5 text-sm ml-4">
            <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-0.5">User</button>
            <button className="text-gray-500 hover:text-gray-700">Laporan</button>
            <button className="text-gray-500 hover:text-gray-700">Log</button>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700">Undang</button>
            <Bell size={18} className="text-gray-400" />
            <HelpCircle size={18} className="text-gray-400" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
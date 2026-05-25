import EditAnggota from "../components/EditAnggota";
import DeleteConfirm from "../components/DeleteConfirm";
import TambahAnggota from "../components/TambahAnggota";

import { useState, useEffect } from "react";
import {
  X, Phone, MapPin, Calendar,
  User as UserIcon, BookOpen,
  Users, Search, Plus, ChevronRight,
  Edit3, Trash2, Eye, Loader2, AlertCircle,
} from "lucide-react";
import { getAnggota, deleteAnggota } from "../api/anggota";

const roleStyle = {
  Administrator: { bg: "rgba(200,169,110,0.15)", color: "#c8a96e", border: "rgba(200,169,110,0.3)" },
  Manajer:       { bg: "rgba(126,184,212,0.15)", color: "#7eb8d4", border: "rgba(126,184,212,0.3)" },
  Viewer:        { bg: "rgba(160,160,170,0.12)", color: "#9ca3af", border: "rgba(160,160,170,0.25)" },
};

function getInisial(nama) {
  if (!nama) return "?";
  const parts = nama.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

const warnaList = ["#c8a96e","#7eb8d4","#8a7ec8","#c87ea0","#7ec8a0","#c8b07e","#d47e7e","#7ec8c8"];
function getWarna(id) { return warnaList[(id - 1) % warnaList.length]; }

function formatDate(dateStr) {
  if (!dateStr || dateStr === "0000-00-00") return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function Avatar({ nama, id, size = 52 }) {
  const warna = getWarna(id);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${warna}18`, border: `1.5px solid ${warna}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: "600", color: warna,
      flexShrink: 0, letterSpacing: "0.02em",
    }}>
      {getInisial(nama)}
    </div>
  );
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
function DetailModal({ anggota, onClose, onDelete, onEdit }) {
  if (!anggota) return null;
  const rs = roleStyle[anggota.peran] || roleStyle.Viewer;

  const Section = ({ icon: Icon, title, children }) => (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(200,169,110,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={13} color="#c8a96e" />
        </div>
        <span style={{ fontSize: "11px", fontWeight: "600", color: "#c8a96e", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {title}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {children}
      </div>
    </div>
  );

  const Field = ({ label, value, full }) => (
    <div style={{ gridColumn: full ? "1 / -1" : "auto", background: "#0d0f18", border: "1px solid #1e2235", borderRadius: "10px", padding: "12px 14px" }}>
      <p style={{ fontSize: "10.5px", color: "#454866", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: "500" }}>
        {label}
      </p>
      <p style={{ fontSize: "13.5px", color: "#d0d4e8" }}>{value || "—"}</p>
    </div>
  );

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,6,12,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: "blur(6px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "620px", maxHeight: "90vh", overflowY: "auto", background: "#12141f", border: "1px solid #1e2235", borderRadius: "18px", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #1a1d2e", display: "flex", alignItems: "center", gap: "16px", position: "sticky", top: 0, background: "#12141f", borderRadius: "18px 18px 0 0", zIndex: 2 }}>
          <Avatar nama={anggota.nama_lengkap} id={anggota.id} size={56} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#e8eaf5", margin: 0, fontFamily: "'Playfair Display', serif" }}>
              {anggota.nama_lengkap}
            </h2>
            <p style={{ fontSize: "12.5px", color: "#6b7191", margin: "3px 0 0", fontStyle: "italic" }}>
              {anggota.nama_baptis || "—"}
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: "500", color: rs.color, background: rs.bg, border: `1px solid ${rs.border}`, padding: "2px 10px", borderRadius: "20px" }}>
                {anggota.peran}
              </span>
              <span style={{ fontSize: "11px", fontWeight: "500", color: anggota.status === "Aktif" ? "#7ec8a0" : "#c87e7e", background: anggota.status === "Aktif" ? "rgba(126,200,160,0.1)" : "rgba(200,126,126,0.1)", border: `1px solid ${anggota.status === "Aktif" ? "rgba(126,200,160,0.25)" : "rgba(200,126,126,0.25)"}`, padding: "2px 10px", borderRadius: "20px" }}>
                {anggota.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#1a1d2e", border: "1px solid #252840", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6b7191" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#252840"; e.currentTarget.style.color = "#c8a96e"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1d2e"; e.currentTarget.style.color = "#6b7191"; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          <Section icon={UserIcon} title="Informasi Pribadi">
            <Field label="Nama Lengkap"  value={anggota.nama_lengkap} />
            <Field label="Nama Baptis"   value={anggota.nama_baptis} />
            <Field label="Jenis Kelamin" value={anggota.jenis_kelamin} />
            <Field label="Tanggal Lahir" value={formatDate(anggota.tanggal_lahir)} />
            <Field label="Alamat Lengkap" value={anggota.alamat} full />
          </Section>

          <Section icon={BookOpen} title="Informasi Keagamaan">
            <Field label="Chiu Tao Sejak"  value={formatDate(anggota.chiu_tao_sejak)} full />
            <Field label="Guru Pengajak"   value={anggota.guru_pengajak} />
            <Field label="Guru Penanggung" value={anggota.guru_penanggung} />
            <Field label="Pandita"         value={anggota.pandita} full />
          </Section>

          <Section icon={Phone} title="Kontak">
            <Field label="No. Telepon" value={anggota.no_telepon} />
            <Field label="Email"       value={anggota.email} />
          </Section>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button
              onClick={() => onEdit(anggota)}
              style={{ flex: 1, padding: "11px", borderRadius: "10px", background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.25)", color: "#c8a96e", fontSize: "13px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,169,110,0.18)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(200,169,110,0.1)")}
            >
              <Edit3 size={13} /> Edit Anggota
            </button>
            <button
              onClick={() => onDelete(anggota)}
              style={{ flex: 1, padding: "11px", borderRadius: "10px", background: "rgba(200,100,100,0.08)", border: "1px solid rgba(200,100,100,0.2)", color: "#c87e7e", fontSize: "13px", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,100,100,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(200,100,100,0.08)")}
            >
              <Trash2 size={13} /> Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Member Card ─────────────────────────────────────────────────────────────
function AnggotaCard({ anggota, onClick }) {
  const [hovered, setHovered] = useState(false);
  const rs = roleStyle[anggota.peran] || roleStyle.Viewer;
  const warna = getWarna(anggota.id);

  return (
    <div
      onClick={() => onClick(anggota)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#15172a" : "#12141f",
        border: `1px solid ${hovered ? "#2a2d48" : "#1a1d2e"}`,
        borderRadius: "16px", padding: "22px", cursor: "pointer",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.2)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Top glow line */}
      <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1px", background: hovered ? `linear-gradient(90deg, transparent, ${warna}60, transparent)` : "transparent", transition: "all 0.3s" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <Avatar nama={anggota.nama_lengkap} id={anggota.id} size={48} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: anggota.status === "Aktif" ? "#7ec8a0" : "#c87e7e" }} />
          <span style={{ fontSize: "11px", color: anggota.status === "Aktif" ? "#7ec8a0" : "#c87e7e" }}>{anggota.status}</span>
        </div>
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#e0e2f0", margin: "0 0 3px", fontFamily: "'Playfair Display', serif" }}>
        {anggota.nama_lengkap}
      </h3>
      <p style={{ fontSize: "12px", color: "#454866", margin: "0 0 14px", fontStyle: "italic" }}>
        {anggota.nama_baptis || "—"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <UserIcon size={11} color="#454866" />
          <span style={{ fontSize: "12px", color: "#6b7191" }}>{anggota.jenis_kelamin}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Calendar size={11} color="#454866" />
          <span style={{ fontSize: "12px", color: "#6b7191" }}>
            Chiu Tao {formatDate(anggota.chiu_tao_sejak)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
          <MapPin size={11} color="#454866" style={{ marginTop: "2px", flexShrink: 0 }} />
          <span style={{ fontSize: "12px", color: "#6b7191", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {anggota.alamat || "—"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #1a1d2e" }}>
        <span style={{ fontSize: "11px", fontWeight: "500", color: rs.color, background: rs.bg, border: `1px solid ${rs.border}`, padding: "3px 10px", borderRadius: "20px" }}>
          {anggota.peran}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", color: hovered ? "#c8a96e" : "#353858", transition: "color 0.2s" }}>
          <Eye size={12} /><span>Detail</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserPage() {
  const [anggotaList, setAnggotaList] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selected, setSelected]       = useState(null);
  const [search, setSearch]           = useState("");
  const [filterRole, setFilterRole]   = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [showTambah, setShowTambah]   = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAnggota();
      setAnggotaList(res.data);
    } catch {
      setError("Gagal memuat data. Pastikan server PHP berjalan di localhost.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = anggotaList.filter((a) => {
    const matchSearch =
      a.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
      a.nama_baptis?.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole   === "Semua" || a.peran   === filterRole;
    const matchStatus = filterStatus === "Semua" || a.status  === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const FilterBtn = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", border: `1px solid ${active ? "rgba(200,169,110,0.4)" : "#1e2235"}`, background: active ? "rgba(200,169,110,0.12)" : "transparent", color: active ? "#c8a96e" : "#454866", cursor: "pointer", transition: "all 0.15s" }}>
      {label}
    </button>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e2235; border-radius: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .search-input {
          background: #12141f; border: 1px solid #1e2235;
          border-radius: 10px; padding: 9px 14px 9px 38px;
          font-size: 13px; color: #c9cdd8; outline: none;
          width: 260px; transition: border-color 0.18s;
        }
        .search-input::placeholder { color: #353858; }
        .search-input:focus { border-color: rgba(200,169,110,0.5); }
        .skeleton {
          background: linear-gradient(90deg, #1a1d2e 25%, #20243a 50%, #1a1d2e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 10px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "#454866", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: "500" }}>Vihara Ming De</span>
              <ChevronRight size={12} color="#353858" />
              <span style={{ fontSize: "11px", color: "#c8a96e", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: "500" }}>Manajemen Anggota</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "600", color: "#e8eaf5", margin: 0 }}>
              Daftar Anggota
            </h1>
            <p style={{ fontSize: "13px", color: "#454866", marginTop: "5px" }}>
              {loading ? "Memuat data..." : `${filtered.length} anggota ditemukan`}
            </p>
          </div>
          <button
            onClick={() => setShowTambah(true)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", background: "linear-gradient(135deg, #c8a96e, #a07840)", border: "none", color: "#0d0f18", fontSize: "13px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 20px rgba(200,169,110,0.25)" }}
          >
            <Plus size={15} /> Tambah Anggota
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#353858" }} />
            <input className="search-input" placeholder="Cari nama atau nama baptis..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["Semua", "Administrator", "Manajer", "Viewer"].map((r) => (
              <FilterBtn key={r} label={r} active={filterRole === r} onClick={() => setFilterRole(r)} />
            ))}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
            {["Semua", "Aktif", "Tidak Aktif"].map((s) => (
              <FilterBtn key={s} label={s} active={filterStatus === s} onClick={() => setFilterStatus(s)} />
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ background: "#12141f", border: "1px solid #1a1d2e", borderRadius: "16px", padding: "22px" }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%" }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 11, width: "50%" }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: 11, width: "60%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: "80%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: "55%" }} />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", gap: "12px" }}>
            <AlertCircle size={36} color="#c87e7e" opacity={0.6} />
            <p style={{ fontSize: "14px", color: "#c87e7e" }}>{error}</p>
            <button onClick={fetchData} style={{ fontSize: "13px", color: "#c8a96e", background: "rgba(200,169,110,0.1)", border: "1px solid rgba(200,169,110,0.25)", borderRadius: "8px", padding: "8px 18px", cursor: "pointer" }}>
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#353858" }}>
            <Users size={36} style={{ marginBottom: "12px", opacity: 0.4 }} />
            <p style={{ fontSize: "14px" }}>
              {anggotaList.length === 0
                ? 'Belum ada anggota. Klik "Tambah Anggota" untuk mulai.'
                : "Tidak ada anggota yang sesuai filter."}
            </p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {filtered.map((a) => (
              <AnggotaCard key={a.id} anggota={a} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {selected && (
        <DetailModal
          anggota={selected}
          onClose={() => setSelected(null)}
          onDelete={(a) => { setSelected(null); setDeleteTarget(a); }}
          onEdit={(a)   => { setSelected(null); setEditTarget(a); }}
        />
      )}

      {editTarget && (
        <EditAnggota
          anggota={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => { fetchData(); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          anggota={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async (id) => {
            await deleteAnggota(id);
            await fetchData();
            setDeleteTarget(null);
          }}
        />
      )}

      {showTambah && (
        <TambahAnggota
          onClose={() => setShowTambah(false)}
          onSuccess={fetchData}
        />
      )}
    </>
  );
}
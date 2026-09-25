import { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard, Map, List, BarChart2, Settings, LogOut,
  Bell, Search, TrendingUp, TrendingDown, AlertTriangle, Clock,
  Users, CheckCircle2, ChevronDown, ChevronUp, Filter,
  ArrowUpRight, Flame, Zap, Droplets, Lightbulb, Trash2,
  ShieldAlert, Eye, RefreshCw, X, Menu
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── FIX LEAFLET ICONS ───────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const URGENCY_MAP = {
  Crítica:  { label: 'Crítica',  color: '#ef4444', bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',    score: 4 },
  Alta:     { label: 'Alta',     color: '#f97316', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', score: 3 },
  Média:    { label: 'Média',    color: '#eab308', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', score: 2 },
  Baixa:    { label: 'Baixa',    color: '#3b82f6', bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300',   score: 1 },
};

const STATUS_OPTIONS = ['Aberto', 'Em Análise', 'Em Manutenção', 'Resolvido'];

const STATUS_CONFIG = {
  'Aberto':        { bg: 'bg-red-50',      badge: 'bg-red-100 text-red-700'          },
  'Em Análise':    { bg: 'bg-yellow-50',   badge: 'bg-yellow-100 text-yellow-800'    },
  'Em Manutenção': { bg: 'bg-blue-50',     badge: 'bg-blue-100 text-blue-700'        },
  'Resolvido':     { bg: 'bg-emerald-50',  badge: 'bg-emerald-100 text-emerald-700'  },
};

const INITIAL_REPORTS = [
  { id: 1,  title: 'Elevador da UED com defeito',           location: 'UED — Bloco Principal',        category: 'Infraestrutura', urgency: 'Crítica',  likes: 47, status: 'Aberto',     created: '2026-09-20', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=60', lat: -15.7632, lng: -47.8720 },
  { id: 2,  title: 'Infiltração sala 19 — UAC',             location: 'UAC — Ala Norte, Sala 19',     category: 'Infraestrutura', urgency: 'Crítica',  likes: 39, status: 'Em Análise', created: '2026-09-21', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=80&q=60', lat: -15.7641, lng: -47.8705 },
  { id: 3,  title: 'Lâmpadas queimadas — Estacionamento',   location: 'Estacionamento Central',       category: 'Iluminação',     urgency: 'Alta',     likes: 31, status: 'Aberto',     created: '2026-09-22', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&q=60', lat: -15.9896, lng: -48.0443 },
  { id: 4,  title: 'Rampa de acessibilidade interditada',   location: 'FGA — Bloco S, Entrada',       category: 'Acessibilidade', urgency: 'Alta',     likes: 28, status: 'Em Análise', created: '2026-09-22', img: 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=80&q=60', lat: -15.9901, lng: -48.0451 },
  { id: 5,  title: 'Banheiro sem água — Bloco UED B',       location: 'UED — Bloco B, 2º Andar',      category: 'Infraestrutura', urgency: 'Alta',     likes: 23, status: 'Aberto',     created: '2026-09-23', img: 'https://images.unsplash.com/photo-1620626011761-996317702782?w=80&q=60', lat: -15.7635, lng: -47.8715 },
  { id: 6,  title: 'Curto-circuito tomadas — Lab. Comp.',   location: 'FGA — Laboratório 3',          category: 'Elétrica',       urgency: 'Crítica',  likes: 19, status: 'Em Manutenção', created: '2026-09-19', img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=80&q=60', lat: -15.9890, lng: -48.0440 },
  { id: 7,  title: 'Acúmulo de lixo — área de convivência', location: 'UED — Área de Convivência',    category: 'Limpeza',        urgency: 'Média',    likes: 17, status: 'Aberto',     created: '2026-09-23', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=80&q=60', lat: -15.7629, lng: -47.8722 },
  { id: 8,  title: 'Ar-condicionado com vazamento',         location: 'UAC — Sala de Reuniões 02',    category: 'Infraestrutura', urgency: 'Média',    likes: 14, status: 'Em Análise', created: '2026-09-21', img: 'https://images.unsplash.com/photo-1516709575804-bf24e1b5f80d?w=80&q=60', lat: -15.7645, lng: -47.8710 },
  { id: 9,  title: 'Buraco na calçada — Entrada FGA',       location: 'FGA — Via de Acesso Principal', category: 'Infraestrutura', urgency: 'Alta',    likes: 12, status: 'Aberto',     created: '2026-09-24', img: 'https://images.unsplash.com/photo-1501187630570-a9b1a45bd5c1?w=80&q=60', lat: -15.9898, lng: -48.0438 },
  { id: 10, title: 'Projetor danificado — Sala 08',         location: 'UAC — Bloco D, Sala 08',       category: 'Elétrica',       urgency: 'Média',    likes: 9,  status: 'Aberto',     created: '2026-09-24', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=80&q=60', lat: -15.7638, lng: -47.8700 },
  { id: 11, title: 'Extintores sem recarga — UED Térreo',  location: 'UED — Corredor Térreo',        category: 'Segurança',      urgency: 'Crítica',  likes: 8,  status: 'Em Análise', created: '2026-09-23', img: 'https://images.unsplash.com/photo-1590856029620-66c5c84f8555?w=80&q=60', lat: -15.7630, lng: -47.8718 },
  { id: 12, title: 'Lâmpada UED — Corredor Bloco B',        location: 'UED — Bloco B, Corredor',      category: 'Iluminação',     urgency: 'Baixa',    likes: 3,  status: 'Resolvido',  created: '2026-09-18', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=60', lat: -15.7633, lng: -47.8712 },
];

const DONUT_DATA = [
  { name: 'Infraestrutura', value: 5, color: '#059669' },
  { name: 'Iluminação',     value: 3, color: '#f59e0b' },
  { name: 'Elétrica',       value: 2, color: '#ef4444' },
  { name: 'Acessibilidade', value: 1, color: '#3b82f6' },
  { name: 'Limpeza',        value: 1, color: '#8b5cf6' },
];

const BAR_DATA = [
  { day: 'Seg',  abertos: 3, resolvidos: 1 },
  { day: 'Ter',  abertos: 5, resolvidos: 2 },
  { day: 'Qua',  abertos: 4, resolvidos: 3 },
  { day: 'Qui',  abertos: 6, resolvidos: 2 },
  { day: 'Sex',  abertos: 8, resolvidos: 4 },
  { day: 'Sáb',  abertos: 2, resolvidos: 1 },
  { day: 'Dom',  abertos: 1, resolvidos: 3 },
];

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',           Icon: LayoutDashboard },
  { id: 'heatmap',     label: 'Mapa de Calor',       Icon: Map             },
  { id: 'incidents',   label: 'Lista de Ocorrências', Icon: List           },
  { id: 'reports',     label: 'Relatórios',          Icon: BarChart2       },
  { id: 'settings',    label: 'Configurações',       Icon: Settings        },
];

// ─── KPI CARD ──────────────────────────────────────────────────────────────
function KPICard({ title, value, subtitle, Icon, iconBg, iconColor, trend, trendValue, accent }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4 ${accent ? `border-l-4 ${accent}` : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${iconBg} ${iconColor} p-3 rounded-xl`}>
          <Icon size={22} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{subtitle}</span>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-red-600' : 'text-emerald-600'}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── URGENCY BADGE ─────────────────────────────────────────────────────────
function UrgencyBadge({ urgency }) {
  const cfg = URGENCY_MAP[urgency] || {};
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {urgency === 'Crítica' && <Flame size={11} />}
      {urgency === 'Alta'    && <AlertTriangle size={11} />}
      {urgency}
    </span>
  );
}

// ─── PRIORITY FORMULA ──────────────────────────────────────────────────────
function priorityScore(r) {
  if (r.status === 'Resolvido') return -1;
  const urgScore = URGENCY_MAP[r.urgency]?.score ?? 0;
  return urgScore * 10 + r.likes;
}

// ─── MAP PIN ICON ──────────────────────────────────────────────────────────
function getMapColor(urgency, status) {
  if (status === 'Resolvido') return '#10b981';
  return URGENCY_MAP[urgency]?.color ?? '#6b7280';
}

// ─── CUSTOM TOOLTIP (Donut) ────────────────────────────────────────────────
const DonutTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-2 text-sm">
        <p className="font-bold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-500">{payload[0].value} ocorrências</p>
      </div>
    );
  }
  return null;
};

// ─── STATUS SELECT ─────────────────────────────────────────────────────────
function StatusSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`text-xs font-semibold rounded-lg border px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-colors
        ${STATUS_CONFIG[value]?.badge ?? 'bg-gray-100 text-gray-700'}`}
    >
      {STATUS_OPTIONS.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [search, setSearch]   = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortDir, setSortDir] = useState('desc');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(console.error);
  }, []);

  // Update status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // KPIs
  const openReports     = reports.filter(r => r.status !== 'Resolvido').length;
  const criticalReports = reports.filter(r => r.urgency === 'Crítica' && r.status !== 'Resolvido').length;
  const resolvedThisWeek = reports.filter(r => r.status === 'Resolvido').length;
  const totalEngagement = reports.reduce((acc, r) => acc + r.likes, 0);

  // Filtered & Sorted table
  const filtered = useMemo(() => {
    let list = [...reports];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    list.sort((a, b) => sortDir === 'desc' ? priorityScore(b) - priorityScore(a) : priorityScore(a) - priorityScore(b));
    return list;
  }, [reports, search, sortDir]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} shrink-0 bg-emerald-900 text-white flex flex-col transition-all duration-300 shadow-xl z-20`}>
        {/* Logo */}
        <div className="px-4 py-5 border-b border-emerald-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center shrink-0 shadow">
            <MapPin2Icon />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-extrabold text-sm leading-tight">Lumina Admin</p>
              <p className="text-emerald-300 text-[10px]">Campus UnB Gama</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeNav === id
                  ? 'bg-emerald-700 text-white shadow'
                  : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'}`}
            >
              <Icon size={19} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* Admin profile */}
        <div className="p-4 border-t border-emerald-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-extrabold text-sm shrink-0">G</div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">Gustavo Admin</p>
                <p className="text-[10px] text-emerald-300 truncate">admin@unb.br</p>
              </div>
            )}
            {sidebarOpen && (
              <button className="text-emerald-400 hover:text-white transition-colors" title="Sair">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── TOP BAR ── */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between gap-4 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(p => !p)} className="text-gray-500 hover:text-gray-800 transition-colors">
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar ocorrência, local ou categoria..."
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick filter */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
              <Filter size={14} className="text-gray-500" />
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="today">Hoje</option>
                <option value="week">Últimos 7 dias</option>
                <option value="all">Todos</option>
              </select>
            </div>

            {/* Notifications */}
            <button className="relative p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Refresh */}
            <button className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <main className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Page heading */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Dashboard de Ocorrências</h1>
              <p className="text-sm text-gray-500 mt-0.5">Campus UnB Gama — painel de gestão em tempo real</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-bold">
              🟢 Atualizado agora
            </span>
          </div>

          {/* ── KPI CARDS ── */}
          <div className="grid grid-cols-4 gap-4">
            <KPICard
              title="Ocorrências Abertas"
              value={openReports}
              subtitle="Total no período"
              Icon={AlertTriangle}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              trend="up"
              trendValue="+12% esta semana"
              accent="border-l-red-500"
            />
            <KPICard
              title="Casos Críticos"
              value={criticalReports}
              subtitle="Requerem ação imediata"
              Icon={ShieldAlert}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              trend="up"
              trendValue="+3 novos"
              accent="border-l-orange-500"
            />
            <KPICard
              title="Tempo Médio Resolução"
              value="48h"
              subtitle="Meta: 72h por ticket"
              Icon={Clock}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
              trend="down"
              trendValue="-8h vs semana anterior"
            />
            <KPICard
              title="Engajamento Estudantil"
              value={`${totalEngagement}`}
              subtitle="Confirmações e likes"
              Icon={Users}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              trend="up"
              trendValue="+{resolvedThisWeek} resolvidos"
            />
          </div>

          {/* ── MAP + CHARTS ── */}
          <div className="grid grid-cols-5 gap-4" style={{ height: '380px' }}>
            {/* MAP — 60% */}
            <div className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="font-extrabold text-gray-800">Mapa de Ocorrências</h2>
                  <p className="text-xs text-gray-500">Clique em um marcador para detalhes</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold">
                  {Object.entries(URGENCY_MAP).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1" style={{ color: v.color }}>
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: v.color }} />
                      {k}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full inline-block bg-emerald-500" />
                    Resolvido
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <MapContainer
                  center={[-15.877, -47.958]}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='© OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {reports.map(r => (
                    <CircleMarker
                      key={r.id}
                      center={[r.lat, r.lng]}
                      radius={r.urgency === 'Crítica' ? 14 : r.urgency === 'Alta' ? 11 : 9}
                      pathOptions={{
                        color: '#fff',
                        weight: 2,
                        fillColor: getMapColor(r.urgency, r.status),
                        fillOpacity: 0.92,
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: 200 }}>
                          <p style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{r.title}</p>
                          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>📍 FGA - UnB</p>
                          <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>📂 {r.category} • ⚡ {r.urgency}</p>
                          <p style={{ fontSize: 11, color: '#6b7280' }}>👍 {r.likes} confirmações • {r.status}</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* CHARTS — 40% */}
            <div className="col-span-2 flex flex-col gap-4">
              {/* Donut */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col">
                <h2 className="font-extrabold text-gray-800 text-sm mb-1">Por Categoria</h2>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DONUT_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius="45%"
                        outerRadius="70%"
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {DONUT_DATA.map((entry, i) => (
                          <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip content={<DonutTooltip />} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 11, color: '#4b5563', fontWeight: 600 }}>{v}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col">
                <h2 className="font-extrabold text-gray-800 text-sm mb-1">Últimos 7 Dias</h2>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BAR_DATA} barSize={10} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={20} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                      <Bar dataKey="abertos" name="Abertos" fill="#f97316" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="resolvidos" name="Resolvidos" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ── TABLE ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-gray-800">Lista de Triagem Inteligente</h2>
                <p className="text-xs text-gray-500 mt-0.5">Ordenado por criticidade × engajamento — {filtered.length} ocorrências</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Ordenação:</span>
                <button
                  onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
                  className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {sortDir === 'desc' ? <><ChevronDown size={14} /> Mais críticos primeiro</> : <><ChevronUp size={14} /> Menos críticos primeiro</>}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left w-12">ID</th>
                    <th className="px-4 py-3 text-left">Ocorrência</th>
                    <th className="px-4 py-3 text-left w-32">Categoria</th>
                    <th className="px-4 py-3 text-center w-28">Urgência</th>
                    <th className="px-4 py-3 text-center w-28">Engajamento</th>
                    <th className="px-4 py-3 text-center w-28">Data</th>
                    <th className="px-4 py-3 text-center w-40">Status / Ação</th>
                    <th className="px-4 py-3 text-center w-16">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(r => {
                    const isResolved = r.status === 'Resolvido';
                    return (
                      <tr
                        key={r.id}
                        className={`transition-colors hover:bg-gray-50/70 ${isResolved ? 'bg-emerald-50/60' : ''} ${selectedRow === r.id ? 'bg-emerald-50 ring-1 ring-inset ring-emerald-300' : ''}`}
                      >
                        {/* ID */}
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono font-bold text-gray-400">#{r.id}</span>
                        </td>

                        {/* Title + Location */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={r.image || "https://images.unsplash.com/photo-1596700813735-02117f739679?w=80&q=60"}
                              alt="thumbnail"
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-gray-800 text-sm truncate max-w-[220px]">{r.title}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[220px]">📍 FGA - UnB</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                            {r.category === 'Iluminação'     && <Lightbulb size={13} className="text-yellow-500" />}
                            {r.category === 'Elétrica'       && <Zap size={13} className="text-orange-500" />}
                            {r.category === 'Limpeza'        && <Trash2 size={13} className="text-purple-500" />}
                            {r.category === 'Acessibilidade' && <Users size={13} className="text-blue-500" />}
                            {r.category === 'Infraestrutura' && <Settings size={13} className="text-emerald-600" />}
                            {r.category === 'Segurança'      && <ShieldAlert size={13} className="text-red-500" />}
                            {r.category}
                          </span>
                        </td>

                        {/* Urgency */}
                        <td className="px-4 py-3 text-center">
                          <UrgencyBadge urgency={r.urgency} />
                        </td>

                        {/* Engagement */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-gray-700">
                            <span className="text-red-400">👍</span>
                            {r.likes}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs text-gray-400 font-medium">{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</span>
                        </td>

                        {/* Status Select */}
                        <td className="px-4 py-3 text-center">
                          <StatusSelect
                            value={r.status}
                            onChange={newStatus => updateStatus(r.id, newStatus)}
                          />
                        </td>

                        {/* View button */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedRow(selectedRow === r.id ? null : r.id)}
                            className={`p-2 rounded-xl transition-colors ${selectedRow === r.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
                            title="Visualizar"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Mostrando {filtered.length} de {reports.length} ocorrências
              </p>
              <div className="flex gap-1">
                {['Abertos', 'Em Análise', 'Resolvidos'].map(s => (
                  <span key={s} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border
                    ${s === 'Abertos'     ? 'bg-red-50 text-red-600 border-red-200'         : ''}
                    ${s === 'Em Análise'  ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                    ${s === 'Resolvidos'  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>
                    {s}: {s === 'Abertos' ? reports.filter(r => r.status === 'Aberto').length
                        : s === 'Em Análise' ? reports.filter(r => r.status === 'Em Análise' || r.status === 'Em Manutenção').length
                        : reports.filter(r => r.status === 'Resolvido').length}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── MINI ICON (map pin SVG inline) ──────────────────────────────────────────
function MapPin2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

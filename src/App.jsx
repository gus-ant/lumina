import { useState, useEffect, useCallback } from 'react';
import {
  MapPin, User, Trophy, ChevronRight, AlertTriangle, CheckCircle2,
  ThumbsUp, ArrowLeft, Home, FileText, Medal, Camera, MessageSquare,
  X, Loader2
} from 'lucide-react';
import MapView from './components/MapView';
import 'leaflet/dist/leaflet.css';

const URGENCY_CONFIG = {
  Baixa:    { color: 'bg-sky-100 text-sky-700 border-sky-300',    dot: 'bg-sky-500'    },
  Média:    { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', dot: 'bg-yellow-500' },
  Alta:     { color: 'bg-orange-100 text-orange-700 border-orange-300', dot: 'bg-orange-500' },
  Crítica:  { color: 'bg-red-100 text-red-700 border-red-300',    dot: 'bg-red-600'    },
};

const CATEGORIES = ['Iluminação', 'Acessibilidade', 'Segurança', 'Infraestrutura', 'Limpeza', 'Outros'];

// ---------- HOME SCREEN ----------
function HomeScreen({ setCurrentView, reports, setSelectedReport }) {
  const recent = reports.slice(0, 3);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header / Hero ── */}
      <div className="relative bg-emerald-900 pt-12 pb-16 px-5 rounded-b-3xl shadow-xl mb-4">
        {/* subtle grid pattern background layer */}
        <div className="absolute inset-0 overflow-hidden rounded-b-3xl">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Floating decorative pins */}
          <span className="absolute top-8 right-20 text-2xl opacity-30 animate-bounce">📍</span>
          <span className="absolute top-16 right-8 text-lg opacity-20">📍</span>
          <span className="absolute top-6 left-1/2 text-xl opacity-25 -translate-x-1/2">📍</span>
        </div>

        <div className="relative z-10 flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Olá, Gustavo! 👋</h1>
            <p className="text-emerald-300 text-sm mt-0.5">usuario@aluno.unb.br</p>
          </div>
          <button className="bg-white/15 backdrop-blur-sm p-2.5 rounded-full border border-white/20 active:scale-95 transition-all">
            <User className="text-white" size={22} />
          </button>
        </div>

        {/* CTA Button — sits smoothly over bottom boundary */}
        <div className="absolute -bottom-6 left-5 right-5 z-20">
          <button
            onClick={() => setCurrentView('map')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-95 transition-all text-base"
          >
            <MapPin size={20} />
            REPORTAR NOVO PONTO
          </button>
        </div>
      </div>

      {/* ── Gamification ── */}
      <div className="px-4 mt-10">
        <h2 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Suas Contribuições e Conquistas</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-3xl font-black text-emerald-600">120</span>
              <span className="text-gray-400 font-medium text-sm">/500 PTS</span>
            </div>
            <Trophy className="text-yellow-500" size={32} />
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all" style={{ width: '24%' }} />
          </div>
          <p className="text-xs text-center text-gray-500 font-medium">(Nível 2: Guardião do Campus — Bronze)</p>
        </div>
      </div>

      {/* ── Recent Reports ── */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Ocorrências Recentes</h2>
          <button onClick={() => setCurrentView('map')} className="text-emerald-600 text-xs font-bold active:opacity-70">
            Ver mapa →
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {recent.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-6">Nenhum reporte ainda. Seja o primeiro!</p>
          )}
          {recent.map(r => {
            const isResolved = r.status === 'Resolvido';
            return (
              <button
                key={r.id}
                onClick={() => { setSelectedReport(r); setCurrentView('details'); }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-95 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isResolved ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                    {isResolved
                      ? <CheckCircle2 className="text-emerald-600" size={20} />
                      : <AlertTriangle className="text-orange-500" size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">#{r.id} {r.title}</p>
                    <p className={`text-xs font-medium ${isResolved ? 'text-emerald-600' : 'text-orange-500'}`}>{r.status}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300" size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- MAP SCREEN (with bottom sheet) ----------
function MapScreen({ setCurrentView, reports, onNewReport }) {
  const [clickedPos, setClickedPos] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'Iluminação', urgency: 'Alta' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleMapClick = useCallback((latlng) => {
    setClickedPos(latlng);
    setForm({ title: '', category: 'Iluminação', urgency: 'Alta' });
    setError('');
  }, []);

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Informe um título para o reporte.'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lat: clickedPos.lat, lng: clickedPos.lng }),
      });
      const newReport = await res.json();
      onNewReport(newReport);
      setClickedPos(null);
    } catch {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Back button */}
      <div className="absolute top-12 left-4 z-[1000]">
        <button
          onClick={() => setCurrentView('home')}
          className="bg-white shadow-md p-2.5 rounded-full active:scale-95 transition-all"
        >
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
      </div>

      {/* Hint */}
      {!clickedPos && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs font-semibold text-gray-700 whitespace-nowrap">
          👆 Toque no mapa para reportar
        </div>
      )}

      {/* Full-screen Map */}
      <div className="flex-1">
        <MapView reports={reports} onMapClick={handleMapClick} clickedPos={clickedPos} />
      </div>

      {/* Bottom Sheet */}
      {clickedPos && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-[0_-8px_40px_-10px_rgba(0,0,0,0.25)] p-6">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-extrabold text-gray-800">📍 Novo Reporte</h2>
            <button onClick={() => setClickedPos(null)} className="text-gray-400 hover:text-gray-600 active:scale-90 transition-all">
              <X size={20} />
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mb-4 font-mono">
            Lat: {clickedPos.lat.toFixed(5)}, Lng: {clickedPos.lng.toFixed(5)}
          </p>

          <div className="flex flex-col gap-3">
            {/* Title */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Título da Ocorrência *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Lâmpada queimada no estacionamento"
                className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Categoria</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2 block">Urgência</label>
              <div className="grid grid-cols-4 gap-2">
                {['Baixa', 'Média', 'Alta', 'Crítica'].map(u => (
                  <button
                    key={u}
                    onClick={() => setForm(f => ({ ...f, urgency: u }))}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                      form.urgency === u
                        ? URGENCY_CONFIG[u].color + ' border-current shadow-sm'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
              {saving ? 'Salvando...' : 'SALVAR PONTO'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- DETAILS SCREEN ----------
function DetailsScreen({ report, setCurrentView, onLike }) {
  if (!report) return null;
  const urgCfg = URGENCY_CONFIG[report.urgency] || URGENCY_CONFIG['Alta'];
  const isResolved = report.status === 'Resolvido';

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Hero Image */}
      <div className="relative h-56 bg-emerald-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1596700813735-02117f739679?w=800&q=80"
          alt="Local"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <button
          onClick={() => setCurrentView('home')}
          className="absolute top-12 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white active:scale-95"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="absolute -bottom-4 right-5 bg-white p-1 rounded-full shadow-lg">
          <span className={`px-3 py-1.5 rounded-full text-[11px] font-black flex items-center gap-1 ${isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
            {isResolved ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {report.status?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-5 pt-8 flex flex-col gap-5">
        {/* Title & Meta */}
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 leading-snug">{report.title}</h1>
          <p className="text-xs text-gray-400 mt-1">{report.reporter} • #{report.id}</p>
        </div>

        {/* Category & Urgency */}
        <div className="flex gap-3">
          <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Categoria</span>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{report.category}</p>
          </div>
          <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Urgência</span>
            <p className={`text-sm font-bold mt-0.5 ${urgCfg.color.split(' ')[1]}`}>{report.urgency}</p>
          </div>
          <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Coords</span>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5 leading-tight">
              {Number(report.lat).toFixed(4)}<br />{Number(report.lng).toFixed(4)}
            </p>
          </div>
        </div>

        {/* Like / Validate */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onLike(report.id)}
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-5 rounded-xl flex items-center gap-2 shadow active:scale-95 transition-all text-sm"
            >
              <ThumbsUp size={18} />
              EU TAMBÉM VI / CONFIRMAR
            </button>
            <div className="text-center min-w-[48px]">
              <span className="block text-3xl font-black text-emerald-800 leading-none">{report.likes}</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Likes</span>
            </div>
          </div>
          <p className="text-xs text-emerald-700 mt-3 text-center opacity-80">
            +{report.likes} estudantes já confirmaram este problema
          </p>
        </div>

        {/* Comment box (UI only) */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">Comentários</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Adicione um comentário..."
              className="w-full p-3 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <MessageSquare size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- PLACEHOLDER SCREENS ----------
function RankingScreen() {
  const users = [
    { pos: 1, name: 'Ana Beatriz S.', pts: 480, badge: '🥇' },
    { pos: 2, name: 'Pedro Alvares C.', pts: 340, badge: '🥈' },
    { pos: 3, name: 'Gustavo R.', pts: 120, badge: '🥉' },
    { pos: 4, name: 'Maria Clara F.', pts: 95, badge: '' },
    { pos: 5, name: 'João Paulo T.', pts: 60, badge: '' },
  ];
  return (
    <div className="p-5 pt-12">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Ranking</h1>
      <p className="text-gray-400 text-sm mb-6">Top contribuidores do campus</p>
      <div className="flex flex-col gap-3">
        {users.map(u => (
          <div key={u.pos} className={`bg-white rounded-xl p-4 flex items-center gap-4 border shadow-sm ${u.pos === 3 ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100'}`}>
            <span className="text-2xl w-8 text-center">{u.badge || `#${u.pos}`}</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">{u.name}</p>
              <p className="text-xs text-gray-400">{u.pts} pontos</p>
            </div>
            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(u.pts / 500) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="p-5 pt-12">
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-20 h-20 rounded-full bg-emerald-700 flex items-center justify-center shadow-lg">
          <User size={36} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-gray-800">Gustavo R.</h1>
          <p className="text-gray-400 text-sm">usuario@aluno.unb.br</p>
          <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
            Nível 2 — Guardião do Campus 🛡️
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['Reportes', '8'], ['Confirmações', '23'], ['Pts', '120']].map(([label, val]) => (
          <div key={label} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-2xl font-black text-emerald-600">{val}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- ROOT APP ----------
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch reports on mount
  useEffect(() => {
    fetch('/api/reports')
      .then(r => r.json())
      .then(data => { setReports(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleNewReport = (report) => {
    setReports(prev => [report, ...prev]);
    setCurrentView('map');
  };

  const handleLike = async (id) => {
    const res = await fetch(`/api/reports/${id}/like`, { method: 'POST' });
    const updated = await res.json();
    setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedReport(updated);
  };

  const NAV = [
    { id: 'home',    label: 'Início',       Icon: Home     },
    { id: 'map',     label: 'Mapa',         Icon: MapPin   },
    { id: 'ranking', label: 'Ranking',      Icon: Medal    },
    { id: 'profile', label: 'Perfil',       Icon: User     },
  ];

  const renderView = () => {
    if (loading) return (
      <div className="flex-1 flex items-center justify-center flex-col gap-3">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
        <p className="text-gray-400 text-sm">Carregando mapa...</p>
      </div>
    );
    switch (currentView) {
      case 'home':    return <HomeScreen setCurrentView={setCurrentView} reports={reports} setSelectedReport={setSelectedReport} />;
      case 'map':     return <MapScreen setCurrentView={setCurrentView} reports={reports} onNewReport={handleNewReport} />;
      case 'details': return <DetailsScreen report={selectedReport} setCurrentView={setCurrentView} onLike={handleLike} />;
      case 'ranking': return <RankingScreen />;
      case 'profile': return <ProfileScreen />;
      default:        return null;
    }
  };

  const isMapView = currentView === 'map';

  return (
    <div className="max-w-md mx-auto h-screen relative overflow-hidden bg-gray-50 flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${isMapView ? 'overflow-hidden' : ''}`} style={{ scrollbarWidth: 'none' }}>
        {renderView()}
      </div>

      {/* Bottom Nav */}
      {currentView !== 'details' && (
        <nav className="shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-2px_20px_-5px_rgba(0,0,0,0.1)]">
          <div className="flex justify-around items-center py-2 px-1">
            {NAV.map(({ id, label, Icon }) => {
              const active = currentView === id || (id === 'home' && currentView === 'details');
              return (
                <button
                  key={id}
                  onClick={() => setCurrentView(id)}
                  className={`flex flex-col items-center px-3 py-1.5 rounded-xl min-w-[60px] transition-all active:scale-90 ${active ? 'text-emerald-600' : 'text-gray-400'}`}
                >
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                  <span className={`text-[10px] mt-0.5 font-semibold ${active ? 'text-emerald-600' : 'text-gray-400'}`}>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Users, Zap, TrendingUp,
  Shield, Globe, AlertTriangle, CheckCircle2, ThumbsUp, Trophy,
  Smartphone, BarChart2, ArrowRight, Star, Clock, Lightbulb,
  Building2, Leaf, Heart
} from 'lucide-react';

// ─── SLIDE DATA ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    section: 'O Problema',
    time: '0:00 – 1:00',
    type: 'problem',
  },
  {
    id: 2,
    section: 'A Solução',
    time: '1:00 – 2:00',
    type: 'solution',
  },
  {
    id: 3,
    section: 'Demonstração',
    time: '2:00 – 3:30',
    type: 'demo',
  },
  {
    id: 4,
    section: 'Viabilidade & Escala',
    time: '3:30 – 4:30',
    type: 'viability',
  },
  {
    id: 5,
    section: 'Fechamento',
    time: '4:30 – 5:00',
    type: 'closing',
  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Tag({ children, accent }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${
      accent
        ? 'bg-orange-400/20 text-orange-300 border border-orange-400/30'
        : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
    }`}>
      {children}
    </span>
  );
}

function Stat({ value, label, Icon, accent }) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${
      accent
        ? 'bg-orange-400/10 border-orange-400/20'
        : 'bg-white/5 border-white/10'
    }`}>
      {Icon && <Icon size={28} className={accent ? 'text-orange-300 mb-2' : 'text-emerald-300 mb-2'} />}
      <span className={`text-4xl font-black ${accent ? 'text-orange-300' : 'text-white'}`}>{value}</span>
      <span className="text-sm text-emerald-100/70 mt-1 text-center font-medium">{label}</span>
    </div>
  );
}

function Bullet({ children, icon: Icon, accent }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${accent ? 'bg-orange-400/20' : 'bg-emerald-500/20'}`}>
        <Icon size={18} className={accent ? 'text-orange-300' : 'text-emerald-300'} />
      </div>
      <p className="text-white/85 text-lg leading-snug font-medium">{children}</p>
    </div>
  );
}

// ─── SLIDE 1: PROBLEM ─────────────────────────────────────────────────────────
function SlideProblema() {
  return (
    <div className="flex flex-col h-full p-14 gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Tag accent>⚠️ O Problema</Tag>
        <h1 className="text-5xl font-black text-white leading-tight">
          2800 estudantes.<br />
          <span className="text-orange-300">Zero visibilidade</span> para a gestão.
        </h1>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Left: big statement */}
        <div className="flex flex-col justify-center gap-6">
          <Bullet icon={AlertTriangle} accent>
            Se um elevador da UED quebra, a gestão pode levar <strong className="text-orange-300">dias</strong> para descobrir.
          </Bullet>
          <Bullet icon={Users} accent>
            Entrevistamos alunos hoje: <strong className="text-orange-300">todos</strong> já viram problemas de infraestrutura, <strong className="text-orange-300">ninguém</strong> abriu chamado.
          </Bullet>
          <Bullet icon={Clock} accent>
            O processo burocrático desestimula. A manutenção é <strong className="text-orange-300">reativa</strong>, cara e lenta.
          </Bullet>
        </div>

        {/* Right: visual consequences */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-white/60 text-xs uppercase font-bold tracking-wider mb-3">Consequências reais</p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Custo de manutenção corretiva vs preventiva', val: '3× mais caro' },
                { label: 'Tempo médio até resolução de um chamado', val: '+72 horas'       },
                { label: 'Alunos com mobilidade reduzida afetados', val: 'Invisíveis'      },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-white/70 text-sm">{label}</span>
                  <span className="text-orange-300 font-black text-sm shrink-0">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote card */}
          <div className="bg-orange-400/10 border border-orange-400/20 rounded-2xl p-5">
            <p className="text-orange-200 italic text-lg leading-relaxed">
              "Eu vi a rampa bloqueada por uma semana. Não sabia para quem falar."
            </p>
            <p className="text-orange-300/70 text-xs mt-2 font-semibold">— Estudante do Campus Gama, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDE 2: SOLUTION ────────────────────────────────────────────────────────
function SlideSolucao() {
  return (
    <div className="flex flex-col h-full p-14 gap-10">
      <div className="flex flex-col gap-3">
        <Tag>💡 A Solução</Tag>
        <h1 className="text-5xl font-black text-white leading-tight">
          O <span className="text-emerald-300">Waze</span> da<br />
          infraestrutura do campus.
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1">
        {/* How it works */}
        <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
          <p className="text-white/60 text-xs uppercase font-bold tracking-wider mb-5">Como funciona em 3 passos</p>
          <div className="flex flex-col gap-6 flex-1 justify-center">
            {[
              { n: '01', icon: Smartphone, title: 'Abre o mapa',   desc: 'O aluno abre o AcessaGama e vê os problemas reportados ao redor.' },
              { n: '02', icon: MapPin,     title: 'Reporta',       desc: 'Clica no local exato, seleciona a categoria e envia com foto.' },
              { n: '03', icon: BarChart2,  title: 'A gestão age',  desc: 'O painel mostra automaticamente os problemas mais críticos já triados pela comunidade.' },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="flex items-start gap-5">
                <div className="bg-emerald-500/20 text-emerald-300 font-black text-sm w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  {n}
                </div>
                <div className="flex items-start gap-3 flex-1">
                  <Icon size={20} className="text-emerald-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-white font-bold">{title}</p>
                    <p className="text-white/65 text-sm mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiator */}
        <div className="flex flex-col gap-4">
          <div className="bg-emerald-500/15 border border-emerald-400/25 rounded-2xl p-6 flex-1">
            <Trophy size={28} className="text-yellow-400 mb-3" />
            <p className="text-white font-black text-lg mb-2">Gamificação</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Reportes verificados geram pontos. Suba de nível e torne-se
              <span className="text-emerald-300 font-bold"> "Guardião do Campus"</span>.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
            <ThumbsUp size={28} className="text-orange-300 mb-3" />
            <p className="text-white font-black text-lg mb-2">"Eu também vi"</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Confirmações da comunidade elevam automaticamente a prioridade do chamado no painel administrativo.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
            <Shield size={28} className="text-sky-300 mb-3" />
            <p className="text-white font-black text-lg mb-2">Sem burocracia</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Nenhum formulário, nenhum e-mail. Apenas apontar, clicar e enviar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDE 3: DEMO ────────────────────────────────────────────────────────────
function SlideDemo() {
  return (
    <div className="flex flex-col h-full p-14 gap-8">
      <div className="flex flex-col gap-3">
        <Tag>📱 Demonstração</Tag>
        <h1 className="text-5xl font-black text-white leading-tight">
          Veja como a <span className="text-emerald-300">comunidade</span><br />
          tria os problemas por você.
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1">
        {/* Flow diagram */}
        <div className="col-span-2 flex flex-col justify-center gap-4">
          {/* Flow steps */}
          {[
            {
              icon: Smartphone, label: 'Estudante',
              desc: 'Vê o mapa e reporta o problema com localização exata e foto.',
              color: 'emerald'
            },
            {
              icon: ThumbsUp, label: 'Comunidade',
              desc: '"EU TAMBÉM VI" — confirmações somam e elevam a prioridade automaticamente.',
              color: 'orange'
            },
            {
              icon: BarChart2, label: 'Gestão do Campus',
              desc: 'Painel administrativo mostra mapa de calor com os casos mais críticos triados.',
              color: 'sky'
            },
            {
              icon: CheckCircle2, label: 'Resolução',
              desc: 'Status atualizado em tempo real para todos os estudantes que confirmaram.',
              color: 'emerald'
            },
          ].map(({ icon: Icon, label, desc, color }, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg
                ${color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300'
                : color === 'orange'  ? 'bg-orange-500/20 text-orange-300'
                :                      'bg-sky-500/20 text-sky-300'}`}>
                <Icon size={22} />
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-white/65 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
              {i < 3 && <ArrowRight size={18} className="text-emerald-400/50 shrink-0 rotate-90" />}
            </div>
          ))}
        </div>

        {/* Key insight */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-white/60 text-xs uppercase font-bold tracking-wider mb-4">O algoritmo</p>
            <div className="bg-white/5 rounded-xl p-4 font-mono text-xs text-emerald-300 mb-4">
              <p className="text-white/40 mb-1">// Prioridade automática</p>
              <p>score = urgência × 10</p>
              <p className="text-orange-300">     + confirmações</p>
              <p className="text-white/40 mt-2">// Muda de Aberto para</p>
              <p className="text-white/40">// Crítico sem intervenção humana</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              A própria comunidade faz a triagem. A prefeitura recebe os problemas <strong className="text-emerald-300">já ordenados por impacto real</strong>.
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-emerald-300 mb-1">47</p>
            <p className="text-white/70 text-sm">confirmações no caso do elevador → automaticamente <strong className="text-white">Crítico #1</strong> no painel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDE 4: VIABILITY ──────────────────────────────────────────────────────
function SlideViabilidade() {
  return (
    <div className="flex flex-col h-full p-14 gap-8">
      <div className="flex flex-col gap-3">
        <Tag>📈 Viabilidade & Escala</Tag>
        <h1 className="text-5xl font-black text-white leading-tight">
          Custo zero para a UnB.<br />
          <span className="text-emerald-300">ROI comprovado</span> desde o primeiro dia.
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-5 flex-1">
        {/* Left col: costs */}
        <div className="flex flex-col gap-4">
          <div className="bg-emerald-500/15 border border-emerald-400/25 rounded-2xl p-6 flex-1">
            <Leaf size={28} className="text-emerald-300 mb-3" />
            <p className="text-white font-black text-lg mb-2">Implantação = R$ 0</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Projeto de código aberto. Mantido pelas disciplinas de Engenharia de Software da FCTE.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
            <TrendingUp size={28} className="text-orange-300 mb-3" />
            <p className="text-white font-black text-lg mb-2">Manutenção preventiva</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Detecção precoce reduz custos de reparo em até <span className="text-orange-300 font-bold">3×</span> versus intervenção corretiva.
            </p>
          </div>
        </div>

        {/* Center: big stats */}
        <div className="flex flex-col gap-4 justify-center">
          <Stat value="2.800+" label="Estudantes sensores no campus" Icon={Users} />
          <Stat value="3×"    label="Economia vs manutenção corretiva" Icon={TrendingUp} accent />
          <Stat value="100%"  label="Open Source — código disponível no GitHub" Icon={Globe} />
        </div>

        {/* Right col: scale */}
        <div className="flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1">
            <Building2 size={28} className="text-sky-300 mb-3" />
            <p className="text-white font-black text-lg mb-2">Arquitetura SaaS</p>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Nasce na FCTE. Pronta para ser licenciada para qualquer prefeitura universitária do Brasil.
            </p>
            <div className="flex flex-col gap-2 text-xs">
              {['UnB Gama (hoje)', 'Outras 4 FCTE', 'Rede UnB completa', 'Universidades do Brasil'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-400' : i === 1 ? 'bg-emerald-600' : i === 2 ? 'bg-emerald-800' : 'bg-white/20'}`} />
                  <span className={`${i === 0 ? 'text-emerald-300 font-bold' : 'text-white/60'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <Globe size={28} className="text-emerald-300 mb-3" />
            <p className="text-white font-black text-lg mb-1">Stack moderna</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['React', 'Node.js', 'SQLite', 'Leaflet', 'Tailwind'].map(t => (
                <span key={t} className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDE 5: CLOSING ─────────────────────────────────────────────────────────
function SlideFechamento() {
  return (
    <div className="flex h-full">
      {/* Left — big statement */}
      <div className="flex-1 flex flex-col justify-center p-14 gap-8">
        <Tag>🎯 Conclusão</Tag>

        <div>
          <p className="text-emerald-300 text-lg font-bold mb-3 leading-relaxed italic">
            "Um campus humano não é aquele que não tem problemas —<br />
            mas aquele que <span className="text-white font-black not-italic">escuta a sua comunidade</span><br />
            e <span className="text-white font-black not-italic">age rápido</span> para não deixar ninguém para trás."
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <p className="text-white/80 text-lg">Crowdsourcing que substitui burocracia</p>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <p className="text-white/80 text-lg">Triagem automática por impacto comunitário</p>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <p className="text-white/80 text-lg">Open source, escalável, custo zero</p>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <p className="text-white/80 text-lg">Gamificação para engajamento estudantil</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <div className="w-12 h-12 bg-emerald-400/20 rounded-xl flex items-center justify-center">
            <MapPin size={24} className="text-emerald-300" />
          </div>
          <div>
            <p className="text-white font-black text-xl">Lumina · AcessaGama</p>
            <p className="text-emerald-300 text-sm">github.com/gus-ant/lumina</p>
          </div>
        </div>
      </div>

      {/* Right — big visual cta */}
      <div className="w-80 bg-emerald-700/30 border-l border-emerald-700/40 flex flex-col items-center justify-center gap-8 p-10">
        <div className="w-24 h-24 bg-emerald-400/20 rounded-3xl flex items-center justify-center border border-emerald-400/30">
          <Heart size={44} className="text-emerald-300" />
        </div>
        <div className="text-center">
          <p className="text-5xl font-black text-white mb-2">Obrigado!</p>
          <p className="text-emerald-300 text-base font-medium leading-relaxed">
            Cada estudante tem o poder de tornar a UnB mais segura, acessível e inteligente.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {[
            { icon: Users,     label: '2.800 sensores humanos' },
            { icon: MapPin,    label: 'Mapa colaborativo' },
            { icon: Trophy,    label: 'Gamificação & engajamento' },
            { icon: Globe,     label: 'Escalável para o Brasil' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
              <Icon size={16} className="text-emerald-300 shrink-0" />
              <span className="text-white/80 text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SLIDE RENDERER ───────────────────────────────────────────────────────────
function renderSlide(type) {
  switch (type) {
    case 'problem':    return <SlideProblema />;
    case 'solution':   return <SlideSolucao />;
    case 'demo':       return <SlideDemo />;
    case 'viability':  return <SlideViabilidade />;
    case 'closing':    return <SlideFechamento />;
    default:           return null;
  }
}

// ─── TIMER ───────────────────────────────────────────────────────────────────
function Timer({ running }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  const pct = Math.min((seconds / 300) * 100, 100);
  const color = seconds > 270 ? 'text-red-400' : seconds > 240 ? 'text-orange-400' : 'text-emerald-400';

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-7 h-7">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
          <circle
            cx="14" cy="14" r="11"
            fill="none"
            stroke={seconds > 270 ? '#f87171' : seconds > 240 ? '#fb923c' : '#34d399'}
            strokeWidth="2.5"
            strokeDasharray={`${2 * Math.PI * 11}`}
            strokeDashoffset={`${2 * Math.PI * 11 * (1 - pct / 100)}`}
            strokeLinecap="round"
            className="transition-all"
          />
        </svg>
      </div>
      <span className={`text-sm font-mono font-bold ${color}`}>{m}:{s}<span className="text-white/30 font-normal"> / 5:00</span></span>
    </div>
  );
}

// ─── MAIN PITCH SLIDES ───────────────────────────────────────────────────────
export default function PitchSlides() {
  const [current, setCurrent] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const total = SLIDES.length;

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(total - 1, c + 1)), [total]);

  // Keyboard navigation
  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')                    { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [next, prev]);

  const slide = SLIDES[current];

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── TOP BAR ── */}
      <header className="shrink-0 flex items-center justify-between px-8 py-3 border-b border-white/10 bg-black/10 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-emerald-400/20 rounded-lg flex items-center justify-center border border-emerald-400/30">
            <MapPin size={16} className="text-emerald-300" />
          </div>
          <div>
            <span className="text-white font-extrabold text-sm">Lumina</span>
            <span className="text-emerald-300/70 text-xs ml-1.5 font-medium">· AcessaGama</span>
          </div>
        </div>

        {/* Progress pills */}
        <div className="flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                i === current
                  ? 'bg-white text-emerald-900 shadow'
                  : i < current
                  ? 'bg-emerald-500/40 text-white'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              {i < current && <CheckCircle2 size={11} />}
              {s.section}
            </button>
          ))}
        </div>

        {/* Timer & controls */}
        <div className="flex items-center gap-4">
          <Timer running={timerRunning} />
          <button
            onClick={() => setTimerRunning(r => !r)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              timerRunning
                ? 'bg-orange-400/20 border-orange-400/40 text-orange-300 hover:bg-orange-400/30'
                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
            }`}
          >
            {timerRunning ? '⏸ Pausar' : '▶ Iniciar timer'}
          </button>
          <span className="text-white/40 text-xs font-medium">{current + 1} / {total}</span>
        </div>
      </header>

      {/* ── SLIDE CONTENT ── */}
      <main className="flex-1 min-h-0 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-800/20 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Slide */}
        <div className="h-full relative z-10" key={current}>
          {renderSlide(slide.type)}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed z-20"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          disabled={current === total - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed z-20"
        >
          <ChevronRight size={20} />
        </button>
      </main>

      {/* ── BOTTOM BAR ── */}
      <footer className="shrink-0 flex items-center justify-between px-8 py-2 border-t border-white/10 bg-black/10 backdrop-blur-sm">
        <span className="text-white/40 text-xs font-medium">Use ← → ou Espaço para navegar</span>

        {/* Progress bar */}
        <div className="flex-1 mx-8 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>

        <span className="text-white/40 text-xs font-medium italic">
          ⏱ {slide.time}
        </span>
      </footer>
    </div>
  );
}

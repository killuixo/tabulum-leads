import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Users, Map as MapIcon, BarChart3, Database, 
  LayoutGrid, List, ChevronLeft, ChevronRight, Lock, AlertCircle, RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis 
} from 'recharts';

// --- CONFIGURAÇÃO DE CORES MONDRIAN ---
const COLORS = {
  crimson: '#c91429', // Vermelho Carmesim
  mustard: '#eab308', // Mostarda
  teal: '#0f766e',    // Azul Esverdeado
  black: '#000000',
  white: '#ffffff',
  gray: '#f3f4f6'
};

// --- DADOS SIMULADOS (Para visualização no Canvas) ---
// Em produção, isso virá da sua API no Vercel.
const generateMockData = () => {
  const cidades = ['Florianópolis', 'São José', 'Palhoça', 'Biguaçu', 'Garopaba'];
  const bairros = ['Agronômica', 'Centro', 'Trindade', 'Campeche', 'Ingleses', 'Armação'];
  const origens = ['CARTA - PANDEMIA', 'Leads Marquito para EVAG', 'Seminários Turismo', 'Formulário Site'];
  const data = [];
  
  for (let i = 1; i <= 250; i++) {
    const isRepetido = Math.random() > 0.85;
    data.push({
      id: i,
      status: isRepetido ? 'repetido' : 'ok',
      nome: `Contato Simulado ${i}`,
      cidade: cidades[Math.floor(Math.random() * cidades.length)],
      bairroRevisado: bairros[Math.floor(Math.random() * bairros.length)],
      bairroReplan: bairros[Math.floor(Math.random() * bairros.length)],
      uf: 'SC',
      email: `contato${i}@exemplo.com`,
      whatsapp: `4899${Math.floor(1000000 + Math.random() * 9000000)}`,
      origem: origens[Math.floor(Math.random() * origens.length)],
      observacoes: isRepetido ? 'Entrada duplicada no evento' : 'Lead qualificado'
    });
  }
  
  // Adicionando os casos reais do CSV fornecido
  data.push({ id: 9001, status: '', nome: 'Zenir Gelsleichter', cidade: 'Florianópolis', bairroRevisado: 'Agronômica', bairroReplan: 'Agronômica', uf: 'SC', email: 'zenirg@gmail.com', whatsapp: '', origem: 'CARTA - PANDEMIA', observacoes: '' });
  data.push({ id: 9002, status: 'lead evag', nome: 'Zenon Brignol Walotek', cidade: 'Garopaba', bairroRevisado: '', bairroReplan: '', uf: 'SC', email: 'zenonwalotek@gmail.com', whatsapp: '48991743407', origem: 'ASSINE | SC Cotas', observacoes: '' });
  data.push({ id: 9003, status: 'google contatos', nome: 'Zenon Brzeski Boeing', cidade: 'Florianópolis', bairroRevisado: '', bairroReplan: '', uf: 'SC', email: 'zeboeing@yahoo.com.br', whatsapp: '48988546586', origem: 'Seminários de Regionalização', observacoes: '' });
  data.push({ id: 9004, status: 'repetido', nome: 'Zenon Brzeski Boeing', cidade: 'Florianópolis', bairroRevisado: '', bairroReplan: '', uf: 'SC', email: 'zeboeing@yahoo.com.br', whatsapp: '48988546586', origem: 'Seminários de Regionalização', observacoes: '' });
  
  return data.reverse();
};

const CHART_COLORS = [COLORS.crimson, COLORS.mustard, COLORS.teal, '#333333'];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('main'); // 'main' ou 'dashboard'
  
  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    // SIMULAÇÃO DE CHAMADA DE API SEGURA
    // Em produção: 
    // const response = await fetch('/api/get-leads', { method: 'POST', body: JSON.stringify({ password }) });
    // if(response.ok) { setLeads(await response.json()); setIsAuthenticated(true); }
    
    setTimeout(() => {
      if (password === 'marquito2026') {
        setLeads(generateMockData());
        setIsAuthenticated(true);
      } else {
        setAuthError('Senha incorreta. Acesso negado ao ecossistema.');
      }
      setLoading(false);
    }, 800);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans selection:bg-yellow-500 selection:text-black">
        <div className="max-w-md w-full bg-white border-4 border-black p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Mondrian Accents */}
          <div className="absolute top-0 left-0 w-4 h-full bg-teal-700 border-r-4 border-black" />
          <div className="absolute top-0 right-0 w-1/3 h-4 bg-red-700 border-b-4 border-black" />
          
          <div className="pl-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 border-4 border-black mb-6">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-black text-black mb-2 tracking-tight">TABULUM</h1>
            <h2 className="text-xl font-bold text-gray-600 mb-6 uppercase tracking-widest">Leads</h2>
            
            <p className="text-sm text-gray-600 mb-8 font-medium">
              Acesso restrito. Insira a chave de segurança para descriptografar os dados da planilha.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha de Acesso"
                  className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-bold text-center"
                  required
                />
              </div>
              
              {authError && (
                <div className="flex items-center justify-center gap-2 text-red-700 font-bold text-sm bg-red-100 p-2 border-2 border-red-700">
                  <AlertCircle className="w-4 h-4" />
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-bold py-4 px-6 border-4 border-black hover:bg-yellow-400 hover:text-black transition-colors flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Desbloquear Sistema'}
              </button>
            </form>
            <p className="mt-6 text-xs text-gray-400 font-bold">Dica no Canvas: a senha é marquito2026</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-yellow-400">
      {/* Header Mondrian */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center w-full sm:w-auto">
            <div className="bg-red-700 w-16 h-16 border-r-4 border-black flex items-center justify-center shrink-0">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div className="px-4 py-2">
              <h1 className="text-2xl font-black tracking-tighter leading-none">TABULUM</h1>
              <span className="text-sm font-bold text-teal-700 tracking-widest uppercase">Leads</span>
            </div>
          </div>
          
          <div className="flex w-full sm:w-auto border-t-4 sm:border-t-0 border-black h-14 sm:h-16">
            <button
              onClick={() => setActiveTab('main')}
              className={`flex-1 sm:px-8 flex items-center justify-center gap-2 font-bold border-r-4 border-black transition-colors ${
                activeTab === 'main' ? 'bg-yellow-400' : 'hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline">Base de Leads</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 sm:px-8 flex items-center justify-center gap-2 font-bold sm:border-l-0 border-black transition-colors ${
                activeTab === 'dashboard' ? 'bg-yellow-400' : 'hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'main' ? <LeadsView leads={leads} /> : <DashboardView leads={leads} />}
      </main>
    </div>
  );
}

// ==========================================
// ABA 1: VISUALIZAÇÃO PRINCIPAL (TABELA/CARDS)
// ==========================================
function LeadsView({ leads }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Processamento de Dados: Filtro e Busca Universal
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        (lead.nome || '').toLowerCase().includes(searchStr) ||
        (lead.cidade || '').toLowerCase().includes(searchStr) ||
        (lead.bairroRevisado || '').toLowerCase().includes(searchStr) ||
        (lead.email || '').toLowerCase().includes(searchStr) ||
        (lead.whatsapp || '').toLowerCase().includes(searchStr) ||
        (lead.origem || '').toLowerCase().includes(searchStr) ||
        (lead.status || '').toLowerCase().includes(searchStr)
      );
    });
  }, [leads, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentItems = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset page on search
  }, [searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Barra de Ferramentas */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Busca universal (Nome, Cidade, Bairro, Email, etc)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-bold"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <div className="text-sm font-bold bg-teal-700 text-white px-4 py-2 border-2 border-black">
            {filteredLeads.length} Registros
          </div>
          <div className="flex border-2 border-black">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-400' : 'bg-white hover:bg-gray-100'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <div className="w-0.5 bg-black"></div>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-yellow-400' : 'bg-white hover:bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo (Grid ou Lista) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentItems.map((lead, idx) => (
            <LeadCard key={lead.id || idx} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-4 border-black overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-100 border-b-4 border-black">
                <th className="p-3 font-black border-r-2 border-black">Status</th>
                <th className="p-3 font-black border-r-2 border-black">Nome</th>
                <th className="p-3 font-black border-r-2 border-black">Localização</th>
                <th className="p-3 font-black border-r-2 border-black">Contato</th>
                <th className="p-3 font-black">Origem</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((lead, idx) => (
                <tr key={lead.id || idx} className="border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors">
                  <td className="p-3 border-r-2 border-black">
                    {lead.status === 'repetido' ? (
                      <span className="bg-red-700 text-white text-xs font-bold px-2 py-1 uppercase border border-black">Repetido</span>
                    ) : (
                      <span className="text-gray-500 text-xs font-bold uppercase">{lead.status || 'OK'}</span>
                    )}
                  </td>
                  <td className="p-3 font-bold border-r-2 border-black">{lead.nome || '-'}</td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="text-sm">{lead.cidade || '-'}</div>
                    <div className="text-xs text-gray-500">{lead.bairroRevisado || lead.bairroReplan || '-'}</div>
                  </td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="text-sm">{lead.whatsapp || '-'}</div>
                    <div className="text-xs text-gray-500">{lead.email || '-'}</div>
                  </td>
                  <td className="p-3 text-sm">{lead.origem || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border-4 border-black bg-white hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-black text-lg bg-white border-4 border-black px-4 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border-4 border-black bg-white hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

// Componente Card de Lead
function LeadCard({ lead }) {
  const isRepetido = lead.status?.toLowerCase() === 'repetido';
  
  return (
    <div className={`bg-white border-4 border-black p-4 relative flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 ${isRepetido ? 'opacity-80' : ''}`}>
      {/* Detalhe Visual Mondrian */}
      <div className={`absolute top-0 right-0 w-8 h-8 border-b-4 border-l-4 border-black ${isRepetido ? 'bg-red-700' : 'bg-teal-700'}`}></div>
      
      <div className="mb-2 pr-8">
        {isRepetido && <span className="inline-block bg-red-700 text-white text-[10px] font-black px-2 py-0.5 uppercase border-2 border-black mb-1">Repetido</span>}
        <h3 className="font-black text-lg leading-tight line-clamp-2">{lead.nome || 'Sem Nome'}</h3>
      </div>
      
      <div className="flex-grow space-y-3 mt-2 text-sm font-medium">
        <div className="bg-gray-50 p-2 border-2 border-black">
          <div className="text-xs text-gray-500 font-bold uppercase mb-0.5">Localização</div>
          <div>{lead.cidade || '-'}</div>
          <div className="text-gray-600">{lead.bairroRevisado || lead.bairroReplan || '-'}, {lead.uf}</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 bg-mustard rounded-full shrink-0"></div>
            <span className="truncate">{lead.whatsapp || 'Sem WhatsApp'}</span>
          </div>
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 bg-black rounded-full shrink-0"></div>
            <span className="truncate">{lead.email || 'Sem E-mail'}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t-4 border-black">
        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Origem</div>
        <div className="text-xs font-bold line-clamp-1">{lead.origem || '-'}</div>
      </div>
    </div>
  );
}

// ==========================================
// ABA 2: DASHBOARD (MÉTRICAS E MAPAS)
// ==========================================
function DashboardView({ leads }) {
  const [mapView, setMapView] = useState('SC'); // 'SC' ou 'FLN'

  // Cálculos de Lógica (Desconsiderando repetidos para os gráficos gerais, mantendo apenas contagem)
  const stats = useMemo(() => {
    const total = leads.length;
    const uniqueLeads = leads.filter(l => l.status?.toLowerCase() !== 'repetido');
    const repetidos = total - uniqueLeads.length;
    
    // Contagem Cidades (Somente únicos)
    const cidadesCount = {};
    const bairrosFlnCount = {};
    const origemCount = {};

    uniqueLeads.forEach(l => {
      // Cidades
      const cid = l.cidade || 'Não Informado';
      cidadesCount[cid] = (cidadesCount[cid] || 0) + 1;
      
      // Bairros Floripa
      if (cid.toLowerCase().includes('florian') || cid.toLowerCase().includes('floripa')) {
        const bairro = l.bairroRevisado || l.bairroReplan || 'Não Informado';
        bairrosFlnCount[bairro] = (bairrosFlnCount[bairro] || 0) + 1;
      }

      // Origem
      const orig = l.origem || 'Outros';
      origemCount[orig] = (origemCount[orig] || 0) + 1;
    });

    const topCidades = Object.entries(cidadesCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const topBairrosFln = Object.entries(bairrosFlnCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const topOrigens = Object.entries(origemCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    return { total, unique: uniqueLeads.length, repetidos, topCidades, topBairrosFln, topOrigens };
  }, [leads]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total de Entradas" value={stats.total} color="bg-black" textColor="text-white" />
        <StatCard title="Leads Únicos (Válidos)" value={stats.unique} color="bg-teal-700" textColor="text-white" />
        <StatCard title="Entradas Repetidas" value={stats.repetidos} color="bg-red-700" textColor="text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico: Top Cidades */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">Top Cidades</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topCidades} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#000', fontWeight: 'bold' }} width={120} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ border: '4px solid black', borderRadius: 0, fontWeight: 'bold' }} />
                <Bar dataKey="value" fill={COLORS.mustard} radius={[0, 4, 4, 0]} barSize={32}>
                  {stats.topCidades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.crimson : COLORS.mustard} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico: Origens */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <h3 className="text-xl font-black uppercase mb-6 border-b-4 border-black pb-2 self-start">Origem dos Leads</h3>
          <div className="h-[300px] flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.topOrigens} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" stroke="#000" strokeWidth={2}>
                  {stats.topOrigens.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: '4px solid black', borderRadius: 0, fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {stats.topOrigens.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1 text-xs font-bold border-2 border-black px-2 py-1">
                <div className="w-3 h-3 border border-black" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de Mapa / Mapa de Calor Estilizado */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="flex flex-col sm:flex-row border-b-4 border-black">
          <div className="p-4 sm:p-6 bg-yellow-400 border-b-4 sm:border-b-0 sm:border-r-4 border-black flex items-center justify-center gap-3 w-full sm:w-1/3 shrink-0">
            <MapIcon className="w-8 h-8" />
            <h3 className="text-xl font-black uppercase">Mapa de Calor</h3>
          </div>
          <div className="flex w-full">
            <button 
              onClick={() => setMapView('SC')}
              className={`flex-1 py-4 font-black uppercase border-r-4 border-black transition-colors ${mapView === 'SC' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              Santa Catarina
            </button>
            <button 
              onClick={() => setMapView('FLN')}
              className={`flex-1 py-4 font-black uppercase transition-colors ${mapView === 'FLN' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
            >
              Florianópolis
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider">
            {mapView === 'SC' ? 'Concentração por Município' : 'Concentração por Bairros (Ilha/Continente)'}
          </p>
          
          {/* Visualização alternativa de Heatmap (Mondrian Style) usando Scatter/Treemap concept */}
          <div className="h-[400px] w-full bg-gray-50 border-4 border-black relative overflow-hidden flex items-center justify-center p-4">
            {/* Elementos Decorativos Mondrian de Fundo */}
            <div className="absolute top-10 left-10 w-full h-1 bg-gray-200"></div>
            <div className="absolute top-0 left-1/3 w-1 h-full bg-gray-200"></div>
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200"></div>
            <div className="absolute top-0 left-2/3 w-1 h-full bg-gray-200"></div>

            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="x" name="Posição X" hide />
                <YAxis type="number" dataKey="y" name="Posição Y" hide />
                <ZAxis type="number" dataKey="value" range={[500, 8000]} name="Leads" />
                <Tooltip cursor={{strokeDasharray: '3 3'}} content={<CustomHeatmapTooltip />} />
                
                <Scatter data={generateHeatmapNodes(mapView === 'SC' ? stats.topCidades : stats.topBairrosFln)} fill={COLORS.teal}>
                  {
                    generateHeatmapNodes(mapView === 'SC' ? stats.topCidades : stats.topBairrosFln).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        index === 0 ? COLORS.crimson : 
                        index === 1 ? COLORS.mustard : 
                        index === 2 ? COLORS.teal : COLORS.black
                      } />
                    ))
                  }
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}

// Sub-componentes do Dashboard
function StatCard({ title, value, color, textColor }) {
  return (
    <div className={`${color} ${textColor} border-4 border-black p-6 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform`}>
      <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">{title}</h4>
      <div className="text-5xl font-black tracking-tighter">{value}</div>
      <div className="absolute top-0 right-0 w-4 h-4 border-b-4 border-l-4 border-black bg-white"></div>
    </div>
  );
}

// Função utilitária para espalhar as bolhas no gráfico de dispersão simulando um mapa de calor estilizado
function generateHeatmapNodes(dataList) {
  // Posicionamento estilizado
  const positions = [
    { x: 50, y: 50 }, { x: 30, y: 70 }, { x: 70, y: 30 }, 
    { x: 20, y: 30 }, { x: 80, y: 70 }, { x: 50, y: 80 }, 
    { x: 80, y: 20 }, { x: 20, y: 80 }, { x: 60, y: 60 }, { x: 40, y: 40 }
  ];
  
  return dataList.map((item, index) => ({
    name: item.name,
    value: item.value,
    x: positions[index % positions.length].x + (Math.random() * 10 - 5), // Pequena variação
    y: positions[index % positions.length].y + (Math.random() * 10 - 5),
  }));
}

const CustomHeatmapTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <p className="font-black text-lg uppercase border-b-2 border-black pb-1 mb-1">{data.name}</p>
        <p className="font-bold text-teal-700">{data.value} leads concentrados</p>
      </div>
    );
  }
  return null;
};

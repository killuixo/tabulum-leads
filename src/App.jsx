import React, { useState, useMemo, useEffect } from 'react';

// --- CONFIGURAÇÃO DE CORES MONDRIAN ---
const COLORS = {
  crimson: '#c91429',
  mustard: '#eab308',
  teal: '#0f766e',
  black: '#000000',
  white: '#ffffff',
  gray: '#f3f4f6'
};

const CHART_COLORS = [COLORS.crimson, COLORS.mustard, COLORS.teal, '#333333'];

// ==========================================
// CONFIGURAÇÕES DE LIGAÇÃO
// ==========================================
let gasUrl = 'COLE_SEU_LINK_DO_GOOGLE_AQUI_SE_QUISER';
let appPass = 'marquito2026';

try {
  gasUrl = import.meta.env.VITE_GAS_URL || gasUrl;
  appPass = import.meta.env.VITE_TABULUM_PASSWORD || appPass;
} catch (e) {
  // Fallback silencioso para ambientes que não suportam import.meta
}

const GAS_URL = gasUrl;
const APP_PASSWORD = appPass;

// ==========================================
// URL DO ÍCONE PERSONALIZADO
// ==========================================
const ICON_URL = 'https://raw.githubusercontent.com/killuixo/tabulum-leads/refs/heads/main/icon-192.png';

// ==========================================
// ÍCONES NATIVOS
// ==========================================
const SearchIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UsersIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const MapIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="18"></line><line x1="15" y1="6" x2="15" y2="21"></line></svg>;
const ChartIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>;
const GridIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const ListIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const AlertIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const FilterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('main'); 

  // --- ESTADO GLOBAL DOS FILTROS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ cidade: [], bairro: [], origem: [] });
  const [viewMode, setViewMode] = useState('grid');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    if (password !== APP_PASSWORD) {
      setAuthError('Senha incorreta. Acesso negado.');
      setLoading(false);
      return;
    }

    try {
      if (!GAS_URL || GAS_URL === 'COLE_SEU_LINK_DO_GOOGLE_AQUI_SE_QUISER') {
        throw new Error("URL do Google Script não configurada.");
      }
      const response = await fetch(GAS_URL);
      if (!response.ok) throw new Error("Erro na resposta do servidor");
      const data = await response.json();
      
      if (data.error) {
        setAuthError(data.error);
      } else {
        setLeads(data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error(error);
      setAuthError('Falha ao conectar. A planilha pode estar grande demais para carregar nesta conexão.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Agrupar Leads e gerar Opções de Filtros
  const { groupedLeads, filterOptions } = useMemo(() => {
    const map = new Map();
    const opts = { cidade: {}, bairro: {}, origem: {} };

    leads.forEach((l) => {
      const rawName = (l.nome || 'Sem Nome').trim();
      const key = rawName.toLowerCase();
      
      const cid = (l.cidade || '').trim() || 'Não Informado';
      const bai = (l.bairroReplan || l.bairroRevisado || '').trim() || 'Não Informado';
      const ori = (l.origem || '').trim() || 'Não Informado';

      if (!map.has(key)) {
        map.set(key, { ...l, nome: rawName, repeatCount: 1, _cidadeObj: cid, _bairroObj: bai, _origemObj: ori });
      } else {
        const existing = map.get(key);
        existing.repeatCount += 1;
      }
    });

    const groupedArray = Array.from(map.values()).sort((a, b) => a.nome.localeCompare(b.nome));

    groupedArray.forEach(l => {
      opts.cidade[l._cidadeObj] = (opts.cidade[l._cidadeObj] || 0) + 1;
      opts.bairro[l._bairroObj] = (opts.bairro[l._bairroObj] || 0) + 1;
      opts.origem[l._origemObj] = (opts.origem[l._origemObj] || 0) + 1;
    });

    return { 
      groupedLeads: groupedArray,
      filterOptions: {
        cidade: Object.entries(opts.cidade).sort((a, b) => b[1] - a[1]),
        bairro: Object.entries(opts.bairro).sort((a, b) => b[1] - a[1]),
        origem: Object.entries(opts.origem).sort((a, b) => b[1] - a[1]),
      }
    };
  }, [leads]);

  // 2. Aplicar Filtros Globais (usados tanto no LeadsView quanto no Dashboard)
  const filteredLeads = useMemo(() => {
    return groupedLeads.filter((lead) => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = !searchStr || (
        (lead.nome || '').toLowerCase().includes(searchStr) ||
        (lead._cidadeObj || '').toLowerCase().includes(searchStr) ||
        (lead._bairroObj || '').toLowerCase().includes(searchStr) ||
        (lead.email || '').toLowerCase().includes(searchStr) ||
        (lead.whatsapp || '').toLowerCase().includes(searchStr) ||
        (lead._origemObj || '').toLowerCase().includes(searchStr)
      );
      if (!matchesSearch) return false;

      if (filters.cidade.length > 0 && !filters.cidade.includes(lead._cidadeObj)) return false;
      if (filters.bairro.length > 0 && !filters.bairro.includes(lead._bairroObj)) return false;
      if (filters.origem.length > 0 && !filters.origem.includes(lead._origemObj)) return false;

      return true;
    });
  }, [groupedLeads, searchTerm, filters]);

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const countActiveFilters = filters.cidade.length + filters.bairro.length + filters.origem.length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans selection:bg-yellow-500 selection:text-black">
        <div className="max-w-md w-full bg-white border-4 border-black p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute top-0 left-0 w-4 h-full bg-teal-700 border-r-4 border-black" />
          <div className="absolute top-0 right-0 w-1/3 h-4 bg-red-700 border-b-4 border-black" />
          <div className="pl-6 text-center">
            
            {/* ÍCONE NA TELA DE LOGIN AQUI */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 border-4 border-black mb-6 overflow-hidden p-2">
              <img src={ICON_URL} alt="Ícone TABULUM" className="w-full h-full object-contain" />
            </div>
            
            <h1 className="text-3xl font-black text-black mb-2 tracking-tight">TABULUM</h1>
            <h2 className="text-xl font-bold text-gray-600 mb-6 uppercase tracking-widest">Leads</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha de Acesso" className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-bold text-center" required />
              </div>
              {authError && (
                <div className="flex items-center justify-center gap-2 text-red-700 font-bold text-sm bg-red-100 p-2 border-2 border-red-700">
                  <AlertIcon className="w-4 h-4" />
                  {authError}
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold py-4 px-6 border-4 border-black hover:bg-yellow-400 hover:text-black transition-colors flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50">
                {loading ? 'Conectando...' : 'Desbloquear Sistema'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-yellow-400">
      <header className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center w-full sm:w-auto">
            
            {/* ÍCONE NO CABEÇALHO AQUI */}
            <div className="bg-red-700 w-16 h-16 border-r-4 border-black flex items-center justify-center shrink-0 p-2">
               <img src={ICON_URL} alt="Ícone TABULUM" className="w-full h-full object-contain filter invert opacity-90" />
            </div>
            
            <div className="px-4 py-2">
              <h1 className="text-2xl font-black tracking-tighter leading-none">TABULUM</h1>
              <span className="text-sm font-bold text-teal-700 tracking-widest uppercase">Leads</span>
            </div>
          </div>
          
          <div className="flex w-full sm:w-auto border-t-4 sm:border-t-0 border-black h-14 sm:h-16">
            <button onClick={() => setActiveTab('main')} className={`flex-1 sm:px-8 flex items-center justify-center gap-2 font-bold border-r-4 border-black transition-colors ${ activeTab === 'main' ? 'bg-yellow-400' : 'hover:bg-gray-100' }`}>
              <UsersIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Base de Leads</span>
            </button>
            <button onClick={() => setActiveTab('dashboard')} className={`flex-1 sm:px-8 flex items-center justify-center gap-2 font-bold sm:border-l-0 border-black transition-colors ${ activeTab === 'dashboard' ? 'bg-yellow-400' : 'hover:bg-gray-100' }`}>
              <ChartIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* BARRA DE PESQUISA E FILTRO GLOBAL */}
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in fade-in">
          <div className="flex flex-col md:flex-row gap-0 md:gap-4 p-4 items-center">
            <div className="relative w-full md:flex-1 mb-4 md:mb-0">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="text" placeholder="Busca universal..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 font-bold" />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto justify-between">
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-3 border-2 border-black font-bold transition-colors ${showFilters || countActiveFilters > 0 ? 'bg-yellow-400' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <FilterIcon className="w-5 h-5" />
                <span>Filtros {countActiveFilters > 0 && `(${countActiveFilters})`}</span>
              </button>

              {activeTab === 'main' && (
                <div className="flex border-2 border-black">
                  <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-400' : 'bg-white hover:bg-gray-100'}`}><GridIcon className="w-5 h-5" /></button>
                  <div className="w-0.5 bg-black"></div>
                  <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-yellow-400' : 'bg-white hover:bg-gray-100'}`}><ListIcon className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="border-t-4 border-black p-4 bg-gray-50 flex flex-col md:flex-row gap-6">
              <FilterColumn title="CIDADE" type="cidade" options={filterOptions.cidade} activeFilters={filters.cidade} toggleFn={toggleFilter} />
              <div className="hidden md:block w-1 bg-gray-200"></div>
              <FilterColumn title="BAIRRO (REPLAN)" type="bairro" options={filterOptions.bairro} activeFilters={filters.bairro} toggleFn={toggleFilter} />
              <div className="hidden md:block w-1 bg-gray-200"></div>
              <FilterColumn title="ORIGEM" type="origem" options={filterOptions.origem} activeFilters={filters.origem} toggleFn={toggleFilter} />
            </div>
          )}
        </div>

        {activeTab === 'main' ? (
          <LeadsView filteredLeads={filteredLeads} viewMode={viewMode} />
        ) : (
          <DashboardView filteredLeads={filteredLeads} />
        )}

      </main>
    </div>
  );
}

// ==========================================
// ABA 1: VISUALIZAÇÃO PRINCIPAL (Cards/Lista)
// ==========================================
function LeadsView({ filteredLeads, viewMode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentItems = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [filteredLeads]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b-4 border-black pb-2">
        <span className="font-black uppercase text-xl">Leads Filtrados</span>
        <span className="bg-black text-white px-3 py-1 font-bold text-sm">{filteredLeads.length} Registros</span>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentItems.map((lead, idx) => <LeadCard key={lead.id || idx} lead={lead} />)}
        </div>
      ) : (
        <div className="bg-white border-4 border-black overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-100 border-b-4 border-black">
                <th className="p-3 font-black border-r-2 border-black w-24">Repetições</th>
                <th className="p-3 font-black border-r-2 border-black">Nome</th>
                <th className="p-3 font-black border-r-2 border-black">Localização</th>
                <th className="p-3 font-black border-r-2 border-black">Contato</th>
                <th className="p-3 font-black">Origem</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((lead, idx) => (
                <tr key={lead.id || idx} className="border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors">
                  <td className="p-3 border-r-2 border-black text-center">
                    {lead.repeatCount > 1 ? (
                      <span className="bg-mustard text-black px-2 py-1 font-black border-2 border-black">{lead.repeatCount}x</span>
                    ) : <span className="text-gray-400 font-bold">-</span>}
                  </td>
                  <td className="p-3 font-bold border-r-2 border-black">{lead.nome || '-'}</td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="text-sm">{lead._cidadeObj || '-'}</div>
                    <div className="text-xs text-gray-500">{lead._bairroObj || '-'}</div>
                  </td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="text-sm">{lead.whatsapp || '-'}</div>
                    <div className="text-xs text-gray-500">{lead.email || '-'}</div>
                  </td>
                  <td className="p-3 text-sm">{lead._origemObj || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border-4 border-black bg-white font-bold hover:bg-yellow-400 disabled:opacity-50 transition-colors">
            &laquo; Ant
          </button>
          <span className="font-black text-lg bg-white border-4 border-black px-4 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {currentPage} / {totalPages}
          </span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border-4 border-black bg-white font-bold hover:bg-yellow-400 disabled:opacity-50 transition-colors">
            Próx &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

function FilterColumn({ title, type, options, activeFilters, toggleFn }) {
  return (
    <div className="flex-1">
      <h4 className="font-black mb-3 border-b-2 border-black pb-1 uppercase text-sm">{title}</h4>
      <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
        {options.map(([val, count]) => (
          <label key={val} className="flex items-start gap-2 cursor-pointer group p-1 hover:bg-gray-200">
            <div className={`w-4 h-4 mt-0.5 border-2 border-black shrink-0 flex items-center justify-center transition-colors ${activeFilters.includes(val) ? 'bg-black' : 'bg-white'}`}>
              {activeFilters.includes(val) && <div className="w-2 h-2 bg-yellow-400" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-tight">
              <span className="group-hover:font-bold">{val}</span>
              <span className="ml-1 text-xs text-gray-500 font-bold">({count})</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function LeadCard({ lead }) {
  const isRepetido = lead.repeatCount > 1;
  return (
    <div className="bg-white border-4 border-black p-4 relative flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-8 h-8 border-b-4 border-l-4 border-black ${isRepetido ? 'bg-mustard' : 'bg-teal-700'}`}></div>
      <div className="mb-2 pr-8">
        {isRepetido && (
          <div className="inline-block bg-black text-white text-[10px] font-black px-2 py-0.5 uppercase border-2 border-black mb-1">
            {lead.repeatCount} Entradas
          </div>
        )}
        <h3 className="font-black text-lg leading-tight line-clamp-2">{lead.nome || 'Sem Nome'}</h3>
      </div>
      <div className="flex-grow space-y-3 mt-2 text-sm font-medium">
        <div className="bg-gray-50 p-2 border-2 border-black">
          <div className="text-xs text-gray-500 font-bold uppercase mb-0.5">Localização</div>
          <div>{lead._cidadeObj}</div>
          <div className="text-gray-600">{lead._bairroObj}</div>
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
        <div className="text-xs font-bold line-clamp-1">{lead._origemObj}</div>
      </div>
    </div>
  );
}

// ==========================================
// ABA 2: DASHBOARD
// ==========================================
function DashboardView({ filteredLeads }) {
  const [activeVisualMap, setActiveVisualMap] = useState('SC');

  const stats = useMemo(() => {
    let total = 0;
    const cidadesCount = {};
    const bairrosFlnCount = {};
    const origemCount = {};
    let naoInformadoCidade = 0;
    let naoInformadoBairroFln = 0;

    filteredLeads.forEach(l => {
      total += l.repeatCount;
      const cid = l._cidadeObj;
      const isFln = cid.toLowerCase().includes('florian') || cid.toLowerCase().includes('floripa');
      const bairro = l._bairroObj;
      
      if (cid === 'Não Informado') naoInformadoCidade++;
      else if (!isFln) cidadesCount[cid] = (cidadesCount[cid] || 0) + 1;
      
      if (isFln) {
        if (bairro === 'Não Informado') naoInformadoBairroFln++;
        else bairrosFlnCount[bairro] = (bairrosFlnCount[bairro] || 0) + 1;
      }
      origemCount[l._origemObj] = (origemCount[l._origemObj] || 0) + 1;
    });

    const unique = filteredLeads.length;
    const repetidos = total - unique;
    
    const topCidades = Object.entries(cidadesCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const topBairrosFln = Object.entries(bairrosFlnCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const topOrigens = Object.entries(origemCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

    return { 
      total, unique, repetidos, 
      topCidades: topCidades.slice(0, 6), 
      heatCidades: topCidades.slice(0, 20),
      mapCidades: topCidades,
      topBairrosFln: topBairrosFln.slice(0, 6), 
      heatBairros: topBairrosFln.slice(0, 20),
      mapBairros: topBairrosFln,
      topOrigens, naoInformadoCidade, naoInformadoBairroFln
    };
  }, [filteredLeads]);

  const maxCidadeValue = stats.topCidades.length > 0 ? stats.topCidades[0].value : 1;
  const maxBairroValue = stats.topBairrosFln.length > 0 ? stats.topBairrosFln[0].value : 1;
  const totalTopOrigens = stats.topOrigens.reduce((acc, curr) => acc + curr.value, 0) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Entradas Atuais (No Filtro)" value={stats.total} color="bg-black" textColor="text-white" />
        <StatCard title="Leads Únicos (No Filtro)" value={stats.unique} color="bg-teal-700" textColor="text-white" />
        <StatCard title="Repetições" value={stats.repetidos} color="bg-mustard" textColor="text-black" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black uppercase mb-1 inline-block">Top Cidades</h3>
          <p className="text-xs font-bold text-gray-500 mb-6 uppercase border-b-4 border-black pb-2">* Omitindo Florianópolis</p>
          <div className="space-y-4">
            {stats.topCidades.map((cidade, index) => (
              <div key={cidade.name} className="flex items-center gap-3">
                <div className="w-24 md:w-32 font-bold truncate text-sm" title={cidade.name}>{cidade.name}</div>
                <div className="flex-1 bg-gray-100 h-8 relative border-2 border-black flex items-center">
                  <div className={`h-full border-r-2 border-black ${index === 0 ? 'bg-red-700' : 'bg-yellow-400'}`} style={{ width: `${(cidade.value / maxCidadeValue) * 100}%` }}></div>
                </div>
                <div className="w-12 text-right font-black">{cidade.value}</div>
              </div>
            ))}
            {stats.topCidades.length === 0 && <div className="text-sm font-bold text-gray-400">Nenhum dado com este filtro.</div>}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black uppercase mb-1 inline-block">Top Bairros</h3>
          <p className="text-xs font-bold text-gray-500 mb-6 uppercase border-b-4 border-black pb-2">* Exclusivo Florianópolis</p>
          <div className="space-y-4">
            {stats.topBairrosFln.map((bairro, index) => (
              <div key={bairro.name} className="flex items-center gap-3">
                <div className="w-24 md:w-32 font-bold truncate text-sm" title={bairro.name}>{bairro.name}</div>
                <div className="flex-1 bg-gray-100 h-8 relative border-2 border-black flex items-center">
                  <div className={`h-full border-r-2 border-black ${index === 0 ? 'bg-teal-700' : 'bg-yellow-400'}`} style={{ width: `${(bairro.value / maxBairroValue) * 100}%` }}></div>
                </div>
                <div className="w-12 text-right font-black">{bairro.value}</div>
              </div>
            ))}
            {stats.topBairrosFln.length === 0 && <div className="text-sm font-bold text-gray-400">Nenhum dado com este filtro.</div>}
          </div>
        </div>
      </div>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="flex flex-col sm:flex-row border-b-4 border-black">
          <div className="p-4 sm:p-6 bg-red-700 text-white border-b-4 sm:border-b-0 sm:border-r-4 border-black flex items-center justify-center gap-3 w-full sm:w-1/3 shrink-0">
            <MapIcon className="w-8 h-8" />
            <h3 className="text-xl font-black uppercase">Mapas Geográficos</h3>
          </div>
          <div className="flex w-full bg-white">
            <button onClick={() => setActiveVisualMap('SC')} className={`flex-1 py-4 font-black uppercase border-r-4 border-black transition-colors ${activeVisualMap === 'SC' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
              Santa Catarina
            </button>
            <button onClick={() => setActiveVisualMap('FLN')} className={`flex-1 py-4 font-black uppercase transition-colors ${activeVisualMap === 'FLN' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
              Florianópolis
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex items-center justify-center relative">
           <LiteralMap type={activeVisualMap} data={activeVisualMap === 'SC' ? stats.mapCidades : stats.mapBairros} />
        </div>
      </div>

      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="p-4 border-b-4 border-black bg-yellow-400">
           <h3 className="text-xl font-black uppercase text-center">Visão Árvore (Volume de Leads)</h3>
        </div>
        <div className="p-4 md:p-6 bg-gray-50 flex flex-col items-center">
          <div className="flex flex-wrap gap-1 justify-center w-full max-w-5xl">
            {stats.heatCidades.map((item, index) => {
              let bg = 'bg-white'; let text = 'text-black';
              if(index === 0) { bg = 'bg-red-700'; text = 'text-white'; }
              else if(index === 1 || index === 2) { bg = 'bg-mustard'; text = 'text-black'; }
              else if(index > 2 && index < 6) { bg = 'bg-teal-700'; text = 'text-white'; }
              else if(index === 6 || index === 7) { bg = 'bg-black'; text = 'text-white'; }

              const sizeClass = index === 0 ? 'w-[48%] md:w-[32%] h-32 md:h-48 text-xl md:text-3xl' : 
                                index < 3 ? 'w-[48%] md:w-[32%] h-24 md:h-32 text-lg md:text-xl' : 
                                index < 7 ? 'w-[31%] md:w-[24%] h-20 md:h-24 text-sm md:text-base' :
                                'w-[23%] md:w-[15%] h-16 md:h-20 text-xs';

              return (
                <div key={item.name} className={`${bg} ${text} ${sizeClass} border-[3px] border-black p-2 flex flex-col items-center justify-center text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.02] transition-transform z-10 hover:z-20`}>
                  <span className="font-black uppercase leading-tight line-clamp-2 w-full truncate px-1">{item.name}</span>
                  <span className={`mt-1 font-bold px-1.5 py-0.5 text-[10px] md:text-xs border-2 border-current ${bg === 'bg-white' ? 'bg-gray-100' : 'bg-black/20'}`}>
                    {item.value}
                  </span>
                </div>
              );
            })}
            {stats.heatCidades.length === 0 && <p className="font-bold p-8">Sem dados geográficos para este filtro.</p>}
          </div>

          <div className="mt-4 w-full max-w-5xl flex justify-end">
             <div className="text-[11px] font-bold text-gray-500 bg-gray-200 border-2 border-gray-300 px-3 py-1 uppercase tracking-wider">
               Leads s/ Cidade: {stats.naoInformadoCidade} | s/ Bairro Floripa: {stats.naoInformadoBairroFln}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, textColor }) {
  return (
    <div className={`${color} ${textColor} border-4 border-black p-6 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform`}>
      <h4 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">{title}</h4>
      <div className="text-5xl font-black tracking-tighter">{value}</div>
      <div className="absolute top-0 right-0 w-4 h-4 border-b-4 border-l-4 border-black bg-white"></div>
    </div>
  );
}

const SC_COORDS = {
  'florianópolis': [85, 60], 'são josé': [83, 60], 'palhoça': [83, 63], 'biguaçu': [82, 58], 
  'joinville': [75, 20], 'blumenau': [70, 35], 'itajaí': [85, 33], 'balneário camboriú': [85, 35], 
  'criciúma': [70, 85], 'tubarão': [75, 80], 'garopaba': [85, 70], 'lages': [50, 65], 
  'chapecó': [20, 45], 'joaçaba': [35, 45], 'concórdia': [25, 50], 'rio do sul': [60, 45], 
  'brusque': [78, 38], 'jaraguá do sul': [72, 22], 'mafra': [60, 15], 'caçador': [40, 30], 
  'são miguel do oeste': [5, 45], 'laguna': [80, 75], 'imbituba': [82, 72]
};

const FLN_COORDS = {
  'centro': [45, 45], 'agronômica': [46, 42], 'trindade': [48, 43], 'itacorubi': [52, 42], 
  'santa mônica': [50, 41], 'pantanal': [49, 44], 'saco dos limões': [48, 48], 
  'costeira do pirajubaé': [49, 52], 'rio tavares': [52, 60], 'tavares': [52, 60],
  'campeche': [55, 68], 'lagoa da conceição': [58, 48], 'barra da lagoa': [65, 45], 
  'ingleses': [65, 20], 'rio vermelho': [68, 30], 'santinho': [70, 20], 
  'canasvieiras': [55, 12], 'jurerê': [45, 12], 'daniela': [40, 15], 
  'santo antônio de lisboa': [42, 28], 'cacupé': [42, 32], 'joão paulo': [44, 38], 
  'armação': [60, 80], 'pântano do sul': [58, 85], 'ribeirão da ilha': [45, 75], 'tapera': [42, 65], 
  'coqueiros': [33, 46], 'estreito': [33, 42], 'capoeiras': [28, 44], 'abraão': [30, 48]
};

function LiteralMap({ type, data }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  
  const dict = type === 'SC' ? SC_COORDS : FLN_COORDS;
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;
  
  const scPath = "M 5 45 L 20 20 L 50 15 L 75 20 L 90 35 L 90 70 L 70 95 L 45 90 L 15 65 Z";
  const flnIslandPath = "M 60 10 Q 75 30 70 60 Q 65 85 55 95 Q 45 70 40 40 Q 45 20 60 10 Z";
  const flnContinentPath = "M 10 30 Q 30 35 35 45 Q 30 65 10 70 Z";

  return (
    <div className="relative w-full max-w-2xl aspect-square sm:aspect-video bg-white border-[6px] border-black p-4">
       <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
         {type === 'SC' ? (
           <path d={scPath} fill="#f3f4f6" stroke="#000" strokeWidth="1" strokeLinejoin="round" />
         ) : (
           <>
             <path d={flnContinentPath} fill="#e5e7eb" stroke="#000" strokeWidth="1" strokeLinejoin="round" />
             <path d={flnIslandPath} fill="#f3f4f6" stroke="#000" strokeWidth="1" strokeLinejoin="round" />
           </>
         )}

         {data.map(item => {
            const coords = dict[item.name.toLowerCase()];
            if (!coords) return null;
            
            const size = Math.max(3, (item.value / maxVal) * 8);
            
            return (
              <g 
                key={item.name} 
                onMouseEnter={() => setHoveredNode({ ...item, x: coords[0], y: coords[1] })}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-transform hover:scale-[1.5]"
                style={{ transformOrigin: `${coords[0]}px ${coords[1]}px` }}
              >
                <rect 
                  x={coords[0] - size/2} 
                  y={coords[1] - size/2} 
                  width={size} 
                  height={size} 
                  fill={COLORS.crimson} 
                  stroke={COLORS.black} 
                  strokeWidth="0.8" 
                />
              </g>
            );
         })}
       </svg>

       {hoveredNode && (
         <div 
           className="absolute pointer-events-none bg-white border-4 border-black px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col"
           style={{ 
             left: `${hoveredNode.x}%`, 
             top: `${hoveredNode.y}%`,
             transform: 'translate(-50%, -120%)'
           }}
         >
           <span className="font-black text-sm uppercase whitespace-nowrap">{hoveredNode.name}</span>
           <span className="text-teal-700 font-bold text-xs">{hoveredNode.value} Leads</span>
         </div>
       )}
       
       <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white border-2 border-black px-2 py-1 text-[10px] md:text-xs font-bold uppercase text-gray-500">
          Mapa Geográfico {type === 'SC' ? 'Estadual' : 'Municipal'}
       </div>
    </div>
  );
}

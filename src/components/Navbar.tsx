import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Truck, 
  PlusCircle, 
  Database,
  Menu,
  X,
  Share2,
  ChevronRight,
  Building2,
  Phone
} from 'lucide-react';
import { Orcamento } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  orcamentos: Orcamento[];
  onOpenDbModal: () => void;
  onOpenNovoOrcamentoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  orcamentos,
  onOpenDbModal,
  onOpenNovoOrcamentoModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const solicitadosCount = orcamentos.filter(o => o.status === 'solicitado').length;
  const entregasHojeCount = orcamentos.filter(o => o.status === 'aprovado' || o.status === 'em_producao' || o.status === 'aguardando_entrega').length;

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="top-navbar no-print">
        <div className="nav-wrapper">
          {/* Logo Oficial da Olividros */}
          <div className="logo-brand" onClick={() => handleSelectTab('dashboard')}>
            <div className="logo-badge">
              <Building2 size={22} />
            </div>
            <div className="brand-text">
              <h1>Olividros</h1>
              <span>Vidraçaria & Esquadrias</span>
            </div>
          </div>

          {/* Menu Desktop (> 992px) */}
          <nav className="nav-links desktop-only">
            <button
              type="button"
              className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSelectTab('dashboard')}
            >
              <LayoutDashboard size={16} />
              Início
            </button>

            <button
              type="button"
              className={`nav-item ${currentTab === 'orcamentos' ? 'active' : ''}`}
              onClick={() => handleSelectTab('orcamentos')}
            >
              <FileText size={16} />
              Orçamentos
              {solicitadosCount > 0 && (
                <span className="badge-count" title={`${solicitadosCount} orçamentos solicitados`}>
                  {solicitadosCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`nav-item ${currentTab === 'financeiro' ? 'active' : ''}`}
              onClick={() => handleSelectTab('financeiro')}
            >
              <DollarSign size={16} />
              Financeiro
            </button>

            <button
              type="button"
              className={`nav-item ${currentTab === 'funcionario' ? 'active' : ''}`}
              onClick={() => handleSelectTab('funcionario')}
            >
              <Truck size={16} />
              Instalações / Equipe
              {entregasHojeCount > 0 && (
                <span className="badge-count" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                  {entregasHojeCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`nav-item ${currentTab === 'solicitar' ? 'active' : ''}`}
              onClick={() => handleSelectTab('solicitar')}
            >
              <Share2 size={16} />
              Link p/ Cliente
            </button>
          </nav>

          {/* Ações Direitas no Desktop */}
          <div className="desktop-actions desktop-only">
            <button
              type="button"
              onClick={onOpenDbModal}
              className="btn btn-secondary btn-sm"
              title="Banco de dados & Backup"
            >
              <Database size={15} />
              <span>Banco de Dados</span>
            </button>

            <button
              type="button"
              onClick={onOpenNovoOrcamentoModal}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={15} />
              <span>Novo Orçamento</span>
            </button>
          </div>

          {/* Ações Mobile: Botão rápido "+ Orçamento" + Botão de Barrinhas (Hamburger ☰) */}
          <div className="mobile-header-actions">
            <button
              type="button"
              onClick={onOpenNovoOrcamentoModal}
              className="btn btn-primary btn-sm mobile-quick-add"
            >
              <PlusCircle size={15} />
              <span>+ Orçamento</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hamburger-btn"
              aria-label="Abrir Menu de Navegação"
              title="Menu de Opções"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* GAVETA LATERAL MOBILE (Menu de Barrinhas ☰ Deslizante) */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay no-print" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div className="logo-badge" style={{ width: 34, height: 34 }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>Olividros</h3>
                  <p style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>
                    Vidraçaria & Esquadrias
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-drawer-close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, padding: '0.5rem 0.75rem 0.25rem 0.75rem' }}>
                Navegação Principal
              </div>

              <button
                type="button"
                className={`drawer-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleSelectTab('dashboard')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <LayoutDashboard size={18} />
                  <span>Início (Visão Geral)</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <button
                type="button"
                className={`drawer-item ${currentTab === 'orcamentos' ? 'active' : ''}`}
                onClick={() => handleSelectTab('orcamentos')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={18} />
                  <span>Orçamentos</span>
                </div>
                {solicitadosCount > 0 ? (
                  <span className="badge-count" style={{ background: '#fef3c7', color: '#b45309' }}>
                    {solicitadosCount} novos
                  </span>
                ) : (
                  <ChevronRight size={16} color="#94a3b8" />
                )}
              </button>

              <button
                type="button"
                className={`drawer-item ${currentTab === 'financeiro' ? 'active' : ''}`}
                onClick={() => handleSelectTab('financeiro')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <DollarSign size={18} />
                  <span>Financeiro & Caixa</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <button
                type="button"
                className={`drawer-item ${currentTab === 'funcionario' ? 'active' : ''}`}
                onClick={() => handleSelectTab('funcionario')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Truck size={18} />
                  <span>Instalações / Equipe</span>
                </div>
                {entregasHojeCount > 0 ? (
                  <span className="badge-count" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                    {entregasHojeCount}
                  </span>
                ) : (
                  <ChevronRight size={16} color="#94a3b8" />
                )}
              </button>

              <button
                type="button"
                className={`drawer-item ${currentTab === 'solicitar' ? 'active' : ''}`}
                onClick={() => handleSelectTab('solicitar')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Share2 size={18} />
                  <span>Link p/ Cliente</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>

              <div style={{ height: '1px', background: '#e2e8f0', margin: '0.75rem 0' }}></div>

              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, padding: '0.25rem 0.75rem' }}>
                Sistema & Ações
              </div>

              <button
                type="button"
                className="drawer-item"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenNovoOrcamentoModal();
                }}
                style={{ color: '#15803d', fontWeight: 700 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PlusCircle size={18} color="#16a34a" />
                  <span>+ Criar Novo Orçamento</span>
                </div>
              </button>

              <button
                type="button"
                className="drawer-item"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenDbModal();
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Database size={18} />
                  <span>Banco de Dados & Backup</span>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </button>
            </div>

            <div className="mobile-drawer-footer">
              <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginBottom: '0.5rem' }}>
                Rua XV de Novembro, 319 - Austin / RJ
              </div>
              <a 
                href="https://wa.me/5521967578040" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-whatsapp btn-sm btn-full"
              >
                <Phone size={15} />
                WhatsApp: (21) 96757-8040
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Navegação Inferior Fixa (App Feel no Celular) */}
      <div className="mobile-bottom-nav no-print">
        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleSelectTab('dashboard')}
        >
          <LayoutDashboard size={18} />
          Início
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'orcamentos' ? 'active' : ''}`}
          onClick={() => handleSelectTab('orcamentos')}
        >
          <FileText size={18} />
          Orçamentos
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'funcionario' ? 'active' : ''}`}
          onClick={() => handleSelectTab('funcionario')}
        >
          <Truck size={18} />
          Equipe
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'financeiro' ? 'active' : ''}`}
          onClick={() => handleSelectTab('financeiro')}
        >
          <DollarSign size={18} />
          Finanças
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'solicitar' ? 'active' : ''}`}
          onClick={() => handleSelectTab('solicitar')}
        >
          <Share2 size={18} />
          Cliente
        </button>
      </div>
    </>
  );
};

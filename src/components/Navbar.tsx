import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Truck, 
  PlusCircle, 
  Database,
  ReceiptText
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
  const solicitadosCount = orcamentos.filter(o => o.status === 'solicitado').length;
  const entregasHojeCount = orcamentos.filter(o => o.status === 'aprovado' || o.status === 'em_producao' || o.status === 'aguardando_entrega').length;

  return (
    <>
      <header className="top-navbar no-print">
        <div className="nav-wrapper">
          {/* Brand Logo & Name */}
          <div className="logo-brand" onClick={() => setCurrentTab('dashboard')}>
            <div className="logo-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div className="brand-text">
              <h1>Olividros</h1>
              <span>Vidraçaria & Esquadrias</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            <button
              type="button"
              className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('dashboard')}
            >
              <LayoutDashboard size={17} />
              Início
            </button>

            <button
              type="button"
              className={`nav-item ${currentTab === 'orcamentos' ? 'active' : ''}`}
              onClick={() => setCurrentTab('orcamentos')}
            >
              <FileText size={17} />
              Orçamentos
              {solicitadosCount > 0 && (
                <span className="badge-count" title={`${solicitadosCount} novos orçamentos solicitados`}>
                  {solicitadosCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`nav-item ${currentTab === 'financeiro' ? 'active' : ''}`}
              onClick={() => setCurrentTab('financeiro')}
            >
              <DollarSign size={17} />
              Financeiro
            </button>

            <button
              type="button"
              className={`nav-item ${currentTab === 'funcionario' ? 'active' : ''}`}
              onClick={() => setCurrentTab('funcionario')}
            >
              <Truck size={17} />
              Instalações / Equipe
              {entregasHojeCount > 0 && (
                <span className="badge-count" style={{ background: '#0284c7' }}>
                  {entregasHojeCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className={`nav-item ${currentTab === 'solicitar' ? 'active' : ''}`}
              onClick={() => setCurrentTab('solicitar')}
            >
              <PlusCircle size={17} />
              Link p/ Cliente
            </button>
          </nav>

          {/* Quick Action Buttons Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={onOpenDbModal}
              className="btn btn-secondary btn-sm"
              title="Banco de dados grátis & Sincronização"
            >
              <Database size={16} />
              <span className="hide-mobile">Banco de Dados</span>
            </button>

            <button
              type="button"
              onClick={onOpenNovoOrcamentoModal}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={16} />
              <span>Novo Orçamento</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Native App feel on phones) */}
      <div className="mobile-bottom-nav no-print">
        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentTab('dashboard')}
        >
          <LayoutDashboard size={20} />
          Início
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'orcamentos' ? 'active' : ''}`}
          onClick={() => setCurrentTab('orcamentos')}
        >
          <FileText size={20} />
          Orçamentos
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'funcionario' ? 'active' : ''}`}
          onClick={() => setCurrentTab('funcionario')}
        >
          <Truck size={20} />
          Equipe
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'financeiro' ? 'active' : ''}`}
          onClick={() => setCurrentTab('financeiro')}
        >
          <DollarSign size={20} />
          Finanças
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${currentTab === 'solicitar' ? 'active' : ''}`}
          onClick={() => setCurrentTab('solicitar')}
        >
          <PlusCircle size={20} />
          Cliente
        </button>
      </div>
    </>
  );
};

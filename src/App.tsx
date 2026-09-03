import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { OrcamentosAdm } from './pages/OrcamentosAdm';
import { Financeiro } from './pages/Financeiro';
import { PainelFuncionario } from './pages/PainelFuncionario';
import { SolicitarOrcamentoPublico } from './pages/SolicitarOrcamentoPublico';
import { VerAprovarOrcamento } from './pages/VerAprovarOrcamento';
import { NotaSimples } from './pages/NotaSimples';
import { NovoOrcamentoModal } from './components/NovoOrcamentoModal';
import { DbModal } from './components/DbModal';
import { storageService } from './services/storage';
import { Orcamento, TransacaoFinanceira } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedOrcamentoId, setSelectedOrcamentoId] = useState<string | undefined>(undefined);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);

  const [isNovoModalOpen, setIsNovoModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Carrega dados iniciais e reage a mudanças de storage
  const reloadData = () => {
    setOrcamentos(storageService.getOrcamentos());
    setTransacoes(storageService.getTransacoes());
  };

  useEffect(() => {
    reloadData();
    const unsubscribe = storageService.subscribe(reloadData);

    // Suporte a URLs com parâmetros para links enviados aos clientes no WhatsApp
    // Ex: ?tab=ver_proposta&id=orc-001 ou ?tab=solicitar ou ?tab=nota&id=orc-004
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    const idParam = urlParams.get('id');

    if (tabParam) {
      setCurrentTab(tabParam);
      if (idParam) {
        setSelectedOrcamentoId(idParam);
      }
    }

    return () => unsubscribe();
  }, []);

  const handleNavigate = (tab: string, orcamentoId?: string) => {
    setCurrentTab(tab);
    if (orcamentoId) {
      setSelectedOrcamentoId(orcamentoId);
    }
    // Atualiza a URL suavemente sem reload
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tab', tab);
    if (orcamentoId) {
      newUrl.searchParams.set('id', orcamentoId);
    } else {
      newUrl.searchParams.delete('id');
    }
    window.history.pushState({}, '', newUrl.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNovoOrcamentoSuccess = (novoId: string) => {
    handleNavigate('orcamentos', novoId);
  };

  return (
    <div className="app-container">
      {/* Barra de Navegação Superior e Mobile */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        orcamentos={orcamentos}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenNovoOrcamentoModal={() => setIsNovoModalOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="main-content">
        {currentTab === 'dashboard' && (
          <Dashboard
            orcamentos={orcamentos}
            transacoes={transacoes}
            onNavigate={handleNavigate}
            onOpenNovoOrcamento={() => setIsNovoModalOpen(true)}
          />
        )}

        {currentTab === 'orcamentos' && (
          <OrcamentosAdm
            orcamentos={orcamentos}
            onNavigate={handleNavigate}
            onOpenNovoOrcamento={() => setIsNovoModalOpen(true)}
          />
        )}

        {currentTab === 'financeiro' && (
          <Financeiro transacoes={transacoes} />
        )}

        {currentTab === 'funcionario' && (
          <PainelFuncionario
            orcamentos={orcamentos}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'solicitar' && (
          <SolicitarOrcamentoPublico
            onSuccessNavigate={(id) => handleNavigate('ver_proposta', id)}
          />
        )}

        {currentTab === 'ver_proposta' && (
          <VerAprovarOrcamento
            orcamentoId={selectedOrcamentoId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'nota' && (
          <NotaSimples
            orcamentoId={selectedOrcamentoId}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Modais Globais */}
      <NovoOrcamentoModal
        isOpen={isNovoModalOpen}
        onClose={() => setIsNovoModalOpen(false)}
        onSuccess={handleNovoOrcamentoSuccess}
      />

      <DbModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />
    </div>
  );
}

export default App;

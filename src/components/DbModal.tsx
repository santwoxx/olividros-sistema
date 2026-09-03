import React, { useState } from 'react';
import { 
  Database, 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Copy, 
  Cloud, 
  ShieldCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { storageService } from '../services/storage';

interface DbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DbModal: React.FC<DbModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'recomendacao' | 'backup' | 'sql'>('recomendacao');

  const supabaseSql = `-- ==========================================
-- SCHEMA POSTGRESQL PARA VIDRAÇARIA OLIVIDROS (SUPABASE)
-- Grátis no plano Free do Supabase (500MB)
-- ==========================================

create table if not exists orcamentos (
  id text primary key,
  numero_protocolo text not null,
  cliente jsonb not null,
  itens jsonb not null,
  valor_total numeric(10,2) not null,
  condicoes_pagamento text,
  status text not null default 'solicitado',
  assinatura_cliente jsonb,
  entrega jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists transacoes_financeiras (
  id text primary key,
  tipo text not null check (tipo in ('receita', 'despesa')),
  descricao text not null,
  categoria text not null,
  valor numeric(10,2) not null,
  data date not null,
  forma_pagamento text not null,
  status text default 'pago',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ativar Sincronização em Tempo Real (Realtime)
alter publication supabase_realtime add table orcamentos;
alter publication supabase_realtime add table transacoes_financeiras;
`;

  const handleDownloadBackup = () => {
    const json = storageService.exportarBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_olividros_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (storageService.importarBackup(content)) {
        alert('Dados importados com sucesso!');
        onClose();
      } else {
        alert('Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Database className="icon-teal" size={22} color="#00d2b4" />
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Banco de Dados Simples & Grátis</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                Recomendações para o Sistema Olividros Vidraçaria
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Abas */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(7, 14, 20, 0.4)', padding: '0 1.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('recomendacao')}
            className={`btn btn-sm ${activeTab === 'recomendacao' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
          >
            Qual Escolher? (Top Opções)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`btn btn-sm ${activeTab === 'backup' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none', marginLeft: '0.5rem' }}
          >
            Backup Local (JSON)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`btn btn-sm ${activeTab === 'sql' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: 'none', marginLeft: '0.5rem' }}
          >
            Script SQL Supabase
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
          {activeTab === 'recomendacao' && (
            <div>
              {/* Opção 1: Supabase (A melhor recomendação) */}
              <div style={{ background: 'rgba(0, 210, 180, 0.08)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#00d2b4', color: '#04121a', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      #1 MAIS RECOMENDADO
                    </span>
                    <h4 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Supabase (PostgreSQL Grátis)</h4>
                  </div>
                  <a href="https://supabase.com" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                    supabase.com <ExternalLink size={14} />
                  </a>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  É a melhor opção para esse sistema por 3 motivos cruciais:
                </p>
                <ul style={{ fontSize: '0.82rem', color: '#ffffff', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
                  <li><strong>100% Gratuito:</strong> 500 MB de banco relacional PostgreSQL (suficiente para anos de orçamentos e notas).</li>
                  <li><strong>Tempo Real (Realtime):</strong> Quando o cliente assina no WhatsApp ou o instalador assina na rua, o painel do ADM atualiza na hora sem precisar recarregar a página!</li>
                  <li><strong>Storage para Fotos:</strong> Permite salvar fotos das instalações concluídas.</li>
                </ul>
              </div>

              {/* Opção 2: Firebase Firestore */}
              <div style={{ background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#0284c7', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      OPÇÃO #2
                    </span>
                    <h4 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Firebase Firestore (Google)</h4>
                  </div>
                  <a href="https://firebase.google.com" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    firebase.google.com <ExternalLink size={14} />
                  </a>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Banco NoSQL simples do Google com 1GB grátis e sincronização mobile automática.
                </p>
              </div>

              {/* Opção 3: Modo Local Híbrido Atual */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <ShieldCheck size={20} color="#10b981" />
                  <h4 style={{ color: '#ffffff', fontSize: '1.05rem' }}>Modo Nativo Ativo: LocalStorage Reativo</h4>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                  O sistema já vem <strong>100% funcional sem precisar configurar nada</strong>. Os dados de orçamentos, financeiro e assinaturas ficam salvos no navegador e sincronizam entre abas. Você pode exportar backups em JSON quando quiser!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Backup dos Dados do Sistema</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Baixe uma cópia de segurança de todos os orçamentos, assinaturas e lançamentos financeiros em arquivo JSON.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <button type="button" onClick={handleDownloadBackup} className="btn btn-primary">
                  <Download size={16} />
                  Baixar Backup JSON
                </button>

                <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                  <Upload size={16} />
                  Importar Backup JSON
                  <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Deseja resetar para os dados iniciais de demonstração da Olividros?')) {
                      storageService.restaurarPadroes();
                      alert('Dados restaurados com sucesso!');
                      onClose();
                    }
                  }}
                  className="btn btn-danger btn-sm"
                >
                  <RotateCcw size={14} />
                  Restaurar Dados Padrão de Demonstração
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Copie e cole no <strong>SQL Editor</strong> do Supabase:
                </span>
                <button type="button" onClick={handleCopySql} className="btn btn-primary btn-sm">
                  {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                  {copiedSql ? 'Copiado!' : 'Copiar Script SQL'}
                </button>
              </div>

              <pre style={{ background: '#050a0f', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', fontSize: '0.78rem', color: '#00d2b4', overflowX: 'auto', maxHeight: '280px' }}>
                {supabaseSql}
              </pre>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

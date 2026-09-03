import React, { useState } from 'react';
import { 
  Database, 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Copy, 
  ShieldCheck,
  ExternalLink
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
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="#16a34a" />
            <div>
              <h3 style={{ color: '#0f172a', fontSize: '1.15rem' }}>Banco de Dados Simples & Grátis</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                Opções para produção no Sistema Olividros Vidraçaria
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Abas */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 1.25rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('recomendacao')}
            className={`btn btn-sm ${activeTab === 'recomendacao' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none' }}
          >
            Qual Escolher?
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`btn btn-sm ${activeTab === 'backup' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none', marginLeft: '0.4rem' }}
          >
            Backup & Exportar (JSON)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`btn btn-sm ${activeTab === 'sql' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none', marginLeft: '0.4rem' }}
          >
            Script SQL Supabase
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {activeTab === 'recomendacao' && (
            <div>
              {/* Supabase */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ background: '#16a34a', color: '#ffffff', fontWeight: 800, fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      #1 RECOMENDADO
                    </span>
                    <strong style={{ color: '#0f172a', fontSize: '1rem' }}>Supabase (PostgreSQL Grátis)</strong>
                  </div>
                  <a href="https://supabase.com" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                    supabase.com <ExternalLink size={12} />
                  </a>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.5rem' }}>
                  A melhor escolha para vidraçarias e sistemas web modernos:
                </p>
                <ul style={{ fontSize: '0.8rem', color: '#0f172a', paddingLeft: '1.15rem', lineHeight: 1.5 }}>
                  <li><strong>100% Gratuito:</strong> 500 MB de banco relacional PostgreSQL (espaço para milhares de orçamentos).</li>
                  <li><strong>Tempo Real (Realtime):</strong> Quando o cliente assina pelo WhatsApp ou o instalador na rua, a tela do ADM atualiza na hora sem recarregar.</li>
                </ul>
              </div>

              {/* Modo Nativo */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <ShieldCheck size={18} color="#16a34a" />
                  <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Modo Nativo Ativo: LocalStorage</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>
                  O sistema já salva seus dados no navegador automaticamente. Você pode baixar backups em arquivo JSON quando desejar na aba de Backup.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '0.35rem' }}>Backup dos Dados da Vidraçaria</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Baixe uma cópia de segurança de todos os seus orçamentos, assinaturas e lançamentos financeiros.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <button type="button" onClick={handleDownloadBackup} className="btn btn-primary">
                  <Download size={15} />
                  Baixar Backup JSON
                </button>

                <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                  <Upload size={15} />
                  Importar Backup JSON
                  <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Deseja limpar todos os dados armazenados no navegador?')) {
                      storageService.limparDados();
                      alert('Dados limpos com sucesso.');
                      onClose();
                    }
                  }}
                  className="btn btn-danger btn-sm"
                >
                  <RotateCcw size={13} />
                  Limpar Todos os Dados
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                  Copie e cole no <strong>SQL Editor</strong> do Supabase:
                </span>
                <button type="button" onClick={handleCopySql} className="btn btn-primary btn-sm">
                  {copiedSql ? <Check size={13} /> : <Copy size={13} />}
                  {copiedSql ? 'Copiado!' : 'Copiar Script SQL'}
                </button>
              </div>

              <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.85rem', fontSize: '0.75rem', color: '#0f172a', overflowX: 'auto', maxHeight: '250px' }}>
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

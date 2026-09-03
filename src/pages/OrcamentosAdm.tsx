import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Share2, 
  MessageSquare, 
  ExternalLink, 
  Receipt, 
  Trash2, 
  CheckCircle2, 
  Copy,
  FileSpreadsheet
} from 'lucide-react';
import { Orcamento, OrcamentoStatus } from '../types';
import { storageService } from '../services/storage';

interface OrcamentosAdmProps {
  orcamentos: Orcamento[];
  onNavigate: (tab: string, orcamentoId?: string) => void;
  onOpenNovoOrcamento: () => void;
}

export const OrcamentosAdm: React.FC<OrcamentosAdmProps> = ({
  orcamentos,
  onNavigate,
  onOpenNovoOrcamento
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = orcamentos.filter(orc => {
    const matchesSearch = 
      orc.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.numeroProtocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.cliente.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.cliente.cidade.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'todos') return true;
    return orc.status === statusFilter;
  });

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCopyLink = (orc: Orcamento) => {
    const url = `${window.location.origin}${window.location.pathname}?tab=ver_proposta&id=${orc.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(orc.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = (id: string, nome: string) => {
    if (window.confirm(`Deseja realmente excluir o orçamento de "${nome}"?`)) {
      storageService.deleteOrcamento(id);
    }
  };

  const handleChangeStatus = (orc: Orcamento, newStatus: OrcamentoStatus) => {
    const updated: Orcamento = {
      ...orc,
      status: newStatus
    };
    storageService.saveOrcamento(updated);
  };

  const getStatusBadge = (status: OrcamentoStatus) => {
    switch (status) {
      case 'solicitado':
        return <span className="status-pill status-solicitado">Solicitado</span>;
      case 'em_analise':
        return <span className="status-pill status-em_analise">Em Análise</span>;
      case 'enviado_cliente':
        return <span className="status-pill status-enviado_cliente">Enviado</span>;
      case 'aprovado':
        return <span className="status-pill status-aprovado">Aprovado</span>;
      case 'em_producao':
        return <span className="status-pill status-em_producao">Em Produção</span>;
      case 'aguardando_entrega':
        return <span className="status-pill status-aguardando_entrega">Pronto / Rota</span>;
      case 'concluido':
        return <span className="status-pill status-concluido">Concluído</span>;
      case 'cancelado':
        return <span className="status-pill status-cancelado">Cancelado</span>;
    }
  };

  return (
    <div className="orcamentos-view">
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#0f172a' }}>Gestão de Orçamentos</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Controle de pedidos, links de WhatsApp e aceite digital do cliente
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onNavigate('solicitar')}
            className="btn btn-secondary btn-sm"
          >
            <Share2 size={15} />
            Link p/ Clientes
          </button>
          <button
            type="button"
            onClick={onOpenNovoOrcamento}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={15} />
            Novo Orçamento
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={17} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por cliente, protocolo ou bairro..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${statusFilter === 'todos' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('todos')}
            >
              Todos ({orcamentos.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${statusFilter === 'solicitado' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('solicitado')}
            >
              Solicitados ({orcamentos.filter(o => o.status === 'solicitado').length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${statusFilter === 'aprovado' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('aprovado')}
            >
              Aprovados
            </button>
            <button
              type="button"
              className={`btn btn-sm ${statusFilter === 'concluido' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter('concluido')}
            >
              Concluídos
            </button>
          </div>
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <FileSpreadsheet size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3>Nenhum orçamento encontrado</h3>
          <p>
            {orcamentos.length === 0 
              ? 'Ainda não há orçamentos cadastrados. Crie um novo ou envie o link para seus clientes.'
              : 'Nenhum resultado corresponde aos filtros selecionados.'}
          </p>
          {orcamentos.length === 0 && (
            <button
              type="button"
              onClick={onOpenNovoOrcamento}
              className="btn btn-primary"
            >
              <PlusCircle size={16} />
              Criar Primeiro Orçamento
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(orc => {
            const shareUrl = `${window.location.origin}${window.location.pathname}?tab=ver_proposta&id=${orc.id}`;
            const whatsAppText = `Olá ${orc.cliente.nome}, aqui é da Vidraçaria Olividros! Segue o link com seu orçamento detalhado nº ${orc.numeroProtocolo}: ${shareUrl}\n\nVocê pode abrir no celular, conferir os detalhes e assinar digitalmente para aprovarmos seu pedido!`;

            return (
              <div key={orc.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>
                        {orc.numeroProtocolo}
                      </span>
                      {getStatusBadge(orc.status)}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>{orc.cliente.nome}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {orc.cliente.endereco} • {orc.cliente.bairro}, {orc.cliente.cidade}
                      {orc.cliente.telefone && ` • Tel: ${orc.cliente.telefone}`}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      {formatBRL(orc.valorTotal)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Prazo: {orc.prazoInstalacaoDias} dias úteis
                    </span>
                  </div>
                </div>

                {/* Detalhes dos Itens */}
                <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '0.85rem', border: '1px solid #e2e8f0' }}>
                  {orc.itens.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0', borderBottom: idx < orc.itens.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                      <div>
                        <strong style={{ color: '#0f172a' }}>{item.quantidade}x {item.descricao}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {item.larguraCm}cm x {item.alturaCm}cm ({item.m2.toFixed(2)} m²) • Vidro {item.corVidro} • Perfil {item.corPerfil}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: '#16a34a' }}>
                        {formatBRL(item.valorTotal)}
                      </div>
                    </div>
                  ))}
                  {orc.observacoes && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#b45309' }}>
                      Obs: {orc.observacoes}
                    </div>
                  )}
                </div>

                {/* Carimbo de Assinatura se já assinado */}
                {orc.assinaturaClienteAprovacao && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.85rem' }}>
                    <CheckCircle2 size={18} color="#16a34a" />
                    <div style={{ fontSize: '0.8rem' }}>
                      <strong style={{ color: '#15803d' }}>Orçamento Aprovado com Assinatura Digital:</strong>{' '}
                      <span style={{ color: '#0f172a' }}>{orc.assinaturaClienteAprovacao.autorNome}</span> em{' '}
                      <span style={{ color: '#64748b' }}>{orc.assinaturaClienteAprovacao.dataHora}</span>
                    </div>
                  </div>
                )}

                {/* Linha de Ações */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status:</span>
                    <select
                      value={orc.status}
                      onChange={e => handleChangeStatus(orc, e.target.value as OrcamentoStatus)}
                      className="form-select"
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
                    >
                      <option value="solicitado">Solicitado</option>
                      <option value="em_analise">Em Análise</option>
                      <option value="enviado_cliente">Enviado</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="em_producao">Em Produção</option>
                      <option value="aguardando_entrega">Pronto / Rota</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(orc)}
                      className="btn btn-secondary btn-sm"
                      title="Copiar link"
                    >
                      <Copy size={14} />
                      {copiedId === orc.id ? 'Copiado!' : 'Copiar Link'}
                    </button>

                    <a
                      href={`https://wa.me/${orc.cliente.whatsapp}?text=${encodeURIComponent(whatsAppText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-whatsapp btn-sm"
                    >
                      <MessageSquare size={14} />
                      WhatsApp
                    </a>

                    <button
                      type="button"
                      onClick={() => onNavigate('ver_proposta', orc.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLink size={14} />
                      Ver / Assinar
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigate('nota', orc.id)}
                      className="btn btn-outline btn-sm"
                    >
                      <Receipt size={14} />
                      Nota
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(orc.id, orc.cliente.nome)}
                      className="btn btn-danger btn-sm"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

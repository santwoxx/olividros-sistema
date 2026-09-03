import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Share2, 
  MessageSquare, 
  ExternalLink, 
  Receipt, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Filter,
  Copy,
  PenTool
} from 'lucide-react';
import { Orcamento, ItemOrcamento, TipoServico, TipoVidro, CorVidro, CorPerfil, OrcamentoStatus } from '../types';
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

  // Filtragem
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
        return <span className="status-pill status-solicitado">Novo Solicitado</span>;
      case 'em_analise':
        return <span className="status-pill status-em_analise">Em Análise</span>;
      case 'enviado_cliente':
        return <span className="status-pill status-enviado_cliente">Enviado WhatsApp</span>;
      case 'aprovado':
        return <span className="status-pill status-aprovado">Aprovado / Assinado</span>;
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
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Gestão de Orçamentos</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Controle propostas, envios para WhatsApp e aceite com assinatura digital
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onNavigate('solicitar')}
            className="btn btn-secondary btn-sm"
          >
            <Share2 size={16} />
            Link Público p/ Clientes
          </button>
          <button
            type="button"
            onClick={onOpenNovoOrcamento}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={16} />
            Criar Orçamento
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Busca por texto */}
          <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por cliente, protocolo ou bairro..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Filtros rápidos de Status */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
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
              Aprovados / Assinados
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

      {/* Lista de Orçamentos */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Nenhum orçamento encontrado para os critérios selecionados.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(orc => {
            const shareUrl = `${window.location.origin}${window.location.pathname}?tab=ver_proposta&id=${orc.id}`;
            const whatsAppText = `Olá ${orc.cliente.nome}, tudo bem? Aqui é da Vidraçaria Olividros em Austin! Segue o link com seu orçamento detalhado nº ${orc.numeroProtocolo}: ${shareUrl}\n\nVocê pode abrir no celular, conferir os detalhes e assinar digitalmente para aprovarmos seu pedido!`;

            return (
              <div key={orc.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {orc.numeroProtocolo}
                      </span>
                      {getStatusBadge(orc.status)}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>{orc.cliente.nome}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {orc.cliente.endereco} • {orc.cliente.bairro}, {orc.cliente.cidade}
                      {orc.cliente.telefone && ` • Tel: ${orc.cliente.telefone}`}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                      {formatBRL(orc.valorTotal)}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      Prazo: {orc.prazoInstalacaoDias} dias úteis
                    </span>
                  </div>
                </div>

                {/* Itens do Orçamento */}
                <div style={{ background: 'rgba(8, 18, 27, 0.6)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Vidros & Ferragens Especificados:
                  </div>
                  {orc.itens.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.3rem 0', borderBottom: idx < orc.itens.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                      <div>
                        <strong style={{ color: '#ffffff' }}>{item.quantidade}x {item.descricao}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Medidas: {item.larguraCm}cm x {item.alturaCm}cm ({item.m2.toFixed(2)} m²) • Vidro: {item.corVidro} • Perfil: {item.corPerfil}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        {formatBRL(item.valorTotal)}
                      </div>
                    </div>
                  ))}
                  {orc.observacoes && (
                    <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: 'var(--warning)', fontStyle: 'italic' }}>
                      Obs: {orc.observacoes}
                    </div>
                  )}
                </div>

                {/* Carimbo de Assinatura se já foi assinado pelo cliente */}
                {orc.assinaturaClienteAprovacao && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                    <CheckCircle className="icon-success" size={20} color="#10b981" />
                    <div style={{ fontSize: '0.82rem' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Orçamento Aceito & Assinado Digitalmente:</span>{' '}
                      <span style={{ color: '#ffffff' }}>{orc.assinaturaClienteAprovacao.autorNome}</span> em{' '}
                      <span style={{ color: 'var(--text-muted)' }}>{orc.assinaturaClienteAprovacao.dataHora}</span>
                    </div>
                  </div>
                )}

                {/* Linha de Ações */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  {/* Seletor rápido de Status para o Administrador */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Alterar Status:</span>
                    <select
                      value={orc.status}
                      onChange={e => handleChangeStatus(orc, e.target.value as OrcamentoStatus)}
                      className="form-select"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto' }}
                    >
                      <option value="solicitado">Novo Solicitado</option>
                      <option value="em_analise">Em Análise</option>
                      <option value="enviado_cliente">Enviado WhatsApp</option>
                      <option value="aprovado">Aprovado / Assinado</option>
                      <option value="em_producao">Em Produção</option>
                      <option value="aguardando_entrega">Pronto p/ Entrega</option>
                      <option value="concluido">Concluído</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Copiar Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(orc)}
                      className="btn btn-secondary btn-sm"
                      title="Copiar link direto para enviar ao cliente"
                    >
                      <Copy size={15} />
                      {copiedId === orc.id ? 'Link Copiado!' : 'Copiar Link'}
                    </button>

                    {/* Enviar WhatsApp */}
                    <a
                      href={`https://wa.me/${orc.cliente.whatsapp}?text=${encodeURIComponent(whatsAppText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-whatsapp btn-sm"
                    >
                      <MessageSquare size={15} />
                      Enviar no WhatsApp
                    </a>

                    {/* Ver Proposta / Aceite */}
                    <button
                      type="button"
                      onClick={() => onNavigate('ver_proposta', orc.id)}
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLink size={15} />
                      Ver / Assinar
                    </button>

                    {/* Nota Simples */}
                    <button
                      type="button"
                      onClick={() => onNavigate('nota', orc.id)}
                      className="btn btn-outline btn-sm"
                    >
                      <Receipt size={15} />
                      Nota Simples
                    </button>

                    {/* Excluir */}
                    <button
                      type="button"
                      onClick={() => handleDelete(orc.id, orc.cliente.nome)}
                      className="btn btn-danger btn-sm"
                      title="Excluir Orçamento"
                    >
                      <Trash2 size={15} />
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

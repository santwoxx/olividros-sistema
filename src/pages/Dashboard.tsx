import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Truck, 
  Share2, 
  PlusCircle, 
  MessageSquare, 
  ArrowUpRight, 
  ExternalLink,
  FileCheck,
  Receipt,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { Orcamento, TransacaoFinanceira } from '../types';

interface DashboardProps {
  orcamentos: Orcamento[];
  transacoes: TransacaoFinanceira[];
  onNavigate: (tab: string, orcamentoId?: string) => void;
  onOpenNovoOrcamento: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  orcamentos,
  transacoes,
  onNavigate,
  onOpenNovoOrcamento
}) => {
  const solicitados = orcamentos.filter(o => o.status === 'solicitado');
  const aprovados = orcamentos.filter(o => o.status === 'aprovado' || o.status === 'em_producao');
  const entregasHoje = orcamentos.filter(o => o.entrega && o.entrega.statusEntrega !== 'instalado');

  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getStatusBadge = (status: Orcamento['status']) => {
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

  const copyClienteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=solicitar`;
    navigator.clipboard.writeText(url);
    alert('Link copiado com sucesso! Envie para o seu cliente pelo WhatsApp:\n' + url);
  };

  return (
    <div className="dashboard-view">
      {/* Banner Superior Limpo */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', background: '#ffffff', borderColor: '#e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
              Sistema de Gestão • Olividros Vidraçaria
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '0.2rem' }}>
              Painel Administrativo
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Acompanhe pedidos, orçamentos, assinaturas digitais e fluxo de caixa da vidraçaria.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={copyClienteLink}
              className="btn btn-secondary"
            >
              <Share2 size={16} />
              Copiar Link p/ Cliente
            </button>
            <button 
              type="button" 
              onClick={onOpenNovoOrcamento}
              className="btn btn-primary"
            >
              <PlusCircle size={16} />
              Novo Orçamento
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Indicadores Chave (KPIs) */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => onNavigate('financeiro')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-label">Saldo em Caixa</div>
            <div className="kpi-val" style={{ color: saldoLiquido >= 0 ? '#16a34a' : '#dc2626' }}>
              {formatBRL(saldoLiquido)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Entradas: {formatBRL(totalReceitas)} | Saídas: {formatBRL(totalDespesas)}
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('orcamentos')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-label">Novas Solicitações</div>
            <div className="kpi-val" style={{ color: '#d97706' }}>
              {solicitados.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Aguardando envio de proposta
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={22} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('orcamentos')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-label">Aprovados / Em Produção</div>
            <div className="kpi-val" style={{ color: '#16a34a' }}>
              {aprovados.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Assinados pelo cliente
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <FileCheck size={22} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('funcionario')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-label">Instalações em Rota</div>
            <div className="kpi-val" style={{ color: '#0284c7' }}>
              {entregasHoje.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Pendentes de assinatura na entrega
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Truck size={22} />
          </div>
        </div>
      </div>

      {/* Lista Recente de Orçamentos */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>Orçamentos e Pedidos Recentes</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Histórico de solicitações, propostas e instalações
            </p>
          </div>
          {orcamentos.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('orcamentos')}
              className="btn btn-secondary btn-sm"
            >
              Ver Todos ({orcamentos.length})
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>

        {orcamentos.length === 0 ? (
          <div className="empty-state">
            <FileSpreadsheet size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3>Nenhum orçamento cadastrado ainda</h3>
            <p>
              Crie o primeiro orçamento da vidraçaria ou copie o link para que seus clientes façam solicitações online diretamente pelo WhatsApp.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={onOpenNovoOrcamento}
                className="btn btn-primary"
              >
                <PlusCircle size={16} />
                Criar Primeiro Orçamento
              </button>
              <button
                type="button"
                onClick={copyClienteLink}
                className="btn btn-secondary"
              >
                <Share2 size={16} />
                Copiar Link p/ Clientes
              </button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Protocolo</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Cliente</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Itens / Serviço</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Valor Total</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.65rem 0.5rem', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orcamentos.slice(0, 6).map((orc) => (
                  <tr 
                    key={orc.id} 
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                  >
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#16a34a' }}>
                      {orc.numeroProtocolo}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{orc.cliente.nome}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{orc.cliente.bairro} - {orc.cliente.cidade}</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                      {orc.itens.map(i => i.descricao).join(', ').substring(0, 40)}...
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>
                      {formatBRL(orc.valorTotal)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      {getStatusBadge(orc.status)}
                    </td>
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => onNavigate('ver_proposta', orc.id)}
                          className="btn btn-secondary btn-sm"
                          title="Ver proposta e assinatura do cliente"
                        >
                          <ExternalLink size={14} />
                          Proposta
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate('nota', orc.id)}
                          className="btn btn-outline btn-sm"
                          title="Ver Nota Simples"
                        >
                          <Receipt size={14} />
                          Nota
                        </button>
                        <a
                          href={`https://wa.me/${orc.cliente.whatsapp}?text=${encodeURIComponent(
                            `Olá ${orc.cliente.nome}, aqui é da Vidraçaria Olividros! Segue seu orçamento detalhado: ${window.location.origin}${window.location.pathname}?tab=ver_proposta&id=${orc.id}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-whatsapp btn-sm"
                          title="Enviar no WhatsApp"
                        >
                          <MessageSquare size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dados Institucionais do Rodapé */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
          <Building2 size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
            Olividros Vidraçaria & Esquadrias • Austin / Nova Iguaçu - RJ
          </div>
          <div style={{ fontSize: '0.8rem', color: '#475569' }}>
            Rua XV de Novembro, 319 (Em frente à estação) • WhatsApp: (21) 96757-8040 • Instagram: @olividros.vidracaria
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Truck, 
  Share2, 
  PlusCircle, 
  MessageSquare, 
  ArrowUpRight, 
  ExternalLink,
  ShieldAlert,
  FileCheck,
  Receipt
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
  // Cálculos de Indicadores
  const solicitados = orcamentos.filter(o => o.status === 'solicitado');
  const aprovados = orcamentos.filter(o => o.status === 'aprovado' || o.status === 'em_producao');
  const concluidos = orcamentos.filter(o => o.status === 'concluido');
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

  const copyClienteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=solicitar`;
    navigator.clipboard.writeText(url);
    alert('Link de solicitação copiado! Envie para o seu cliente pelo WhatsApp:\n' + url);
  };

  return (
    <div className="dashboard-view">
      {/* Banner de Boas-Vindas & Ações Rápidas */}
      <div className="glass-panel glass-panel-glow" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 210, 180, 0.12)', padding: '0.25rem 0.75rem', borderRadius: '999px', marginBottom: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d2b4', display: 'inline-block', boxShadow: '0 0 8px #00d2b4' }}></span>
              <span style={{ fontSize: '0.75rem', color: '#00d2b4', fontWeight: 700, textTransform: 'uppercase' }}>Sistema Online • Olividros Austin / RJ</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.25rem' }}>
              Painel de Controle Vidraçaria
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Gerencie orçamentos, assinaturas digitais, rotas de instaladores e fluxo financeiro em tempo real.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
            <div className="kpi-label">Saldo em Caixa Líquido</div>
            <div className="kpi-val" style={{ color: saldoLiquido >= 0 ? '#10b981' : '#ef4444' }}>
              {formatBRL(saldoLiquido)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Entradas: {formatBRL(totalReceitas)} | Saídas: {formatBRL(totalDespesas)}
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('orcamentos')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-label">Novas Solicitações</div>
            <div className="kpi-val" style={{ color: '#f59e0b' }}>
              {solicitados.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Clientes aguardando orçamento no WhatsApp
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('orcamentos')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-label">Em Produção / Aprovados</div>
            <div className="kpi-val" style={{ color: '#00d2b4' }}>
              {aprovados.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Assinados e prontos para corte / montagem
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: 'rgba(0, 210, 180, 0.15)', color: '#00d2b4' }}>
            <FileCheck size={24} />
          </div>
        </div>

        <div className="kpi-card" onClick={() => onNavigate('funcionario')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="kpi-label">Instalações em Campo</div>
            <div className="kpi-val" style={{ color: '#0284c7' }}>
              {entregasHoje.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Aguardando assinatura de entrega
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
            <Truck size={24} />
          </div>
        </div>
      </div>

      {/* Seção Principal: Lista Recente de Orçamentos com Ações Imediatas */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Atendimentos & Pedidos Recentes</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Orçamentos solicitados, links enviados e ordens em andamento
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('orcamentos')}
            className="btn btn-outline btn-sm"
          >
            Ver Todos ({orcamentos.length})
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Protocolo</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Cliente</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Serviço / Itens</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Valor Total</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Ações Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {orcamentos.slice(0, 6).map((orc) => (
                <tr 
                  key={orc.id} 
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s' }}
                >
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {orc.numeroProtocolo}
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{orc.cliente.nome}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{orc.cliente.bairro} - {orc.cliente.cidade}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>
                    {orc.itens.map(i => i.descricao).join(', ').substring(0, 45)}...
                  </td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 700, color: '#ffffff' }}>
                    {formatBRL(orc.valorTotal)}
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    {getStatusBadge(orc.status)}
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      {/* Botão Ver / Assinar Proposta */}
                      <button
                        type="button"
                        onClick={() => onNavigate('ver_proposta', orc.id)}
                        className="btn btn-secondary btn-sm"
                        title="Abrir página de aceite/assinatura do cliente"
                      >
                        <ExternalLink size={14} />
                        Proposta
                      </button>

                      {/* Botão Gerar Nota Simples */}
                      <button
                        type="button"
                        onClick={() => onNavigate('nota', orc.id)}
                        className="btn btn-outline btn-sm"
                        title="Ver Nota Simples / Recibo Comercial"
                      >
                        <Receipt size={14} />
                        Nota
                      </button>

                      {/* Botão WhatsApp */}
                      <a
                        href={`https://wa.me/${orc.cliente.whatsapp}?text=${encodeURIComponent(
                          `Olá ${orc.cliente.nome}, aqui é da Vidraçaria Olividros! Segue o link com seu orçamento detalhado: ${window.location.origin}${window.location.pathname}?tab=ver_proposta&id=${orc.id}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-whatsapp btn-sm"
                        title="Enviar orçamento no WhatsApp"
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
      </div>

      {/* Banner Informativo sobre a Vidraçaria Olividros */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(13, 39, 56, 0.7) 0%, rgba(7, 14, 20, 0.9) 100%)', border: '1px solid rgba(0, 210, 180, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(0, 210, 180, 0.15)', padding: '1rem', borderRadius: 'var(--radius-lg)', color: '#00d2b4' }}>
            <ShieldAlert size={32} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.2rem' }}>
              Olividros Vidraçaria • Austin / Nova Iguaçu - RJ
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Rua XV de Novembro, 319 (Em frente à estação) • WhatsApp: <strong>(21) 96757-8040</strong> • Instagram: <strong>@olividros.vidracaria</strong>
            </p>
            <p style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: '0.35rem', fontWeight: 600 }}>
              Especialistas em Portas e Janelas de Vidro, Box Blindex, Guarda-Corpo, Espelhos Bisotados e Manutenção Preventiva/Corretiva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

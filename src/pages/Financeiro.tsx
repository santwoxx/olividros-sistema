import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  Trash2, 
  Filter, 
  Wallet, 
  CreditCard, 
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
  X
} from 'lucide-react';
import { TransacaoFinanceira } from '../types';
import { storageService } from '../services/storage';

interface FinanceiroProps {
  transacoes: TransacaoFinanceira[];
}

export const Financeiro: React.FC<FinanceiroProps> = ({ transacoes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'receita' | 'despesa'>('todos');

  // Form State
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<TransacaoFinanceira['categoria']>('vidro_temperado');
  const [valor, setValor] = useState<number>(150);
  const [data, setData] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formaPagamento, setFormaPagamento] = useState<TransacaoFinanceira['formaPagamento']>('pix');

  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const filteredTransacoes = transacoes.filter(t => {
    if (tipoFiltro === 'todos') return true;
    return t.tipo === tipoFiltro;
  });

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleDelete = (id: string, desc: string) => {
    if (window.confirm(`Deseja remover o lançamento "${desc}"?`)) {
      storageService.deleteTransacao(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || valor <= 0) {
      alert('Informe a descrição e um valor válido.');
      return;
    }

    const nova: TransacaoFinanceira = {
      id: `trans-${Date.now()}`,
      tipo,
      descricao,
      categoria,
      valor,
      data,
      formaPagamento,
      status: 'pago'
    };

    storageService.saveTransacao(nova);
    setIsModalOpen(false);
    setDescricao('');
    setValor(150);
  };

  const getCategoriaLabel = (cat: TransacaoFinanceira['categoria']) => {
    switch (cat) {
      case 'servico_vidracaria': return 'Serviço / Instalação Vidro';
      case 'vidro_temperado': return 'Fornecedor Vidro Temperado';
      case 'kits_aluminio': return 'Perfis & Kits de Alumínio';
      case 'ferragens': return 'Ferragens & Puxadores';
      case 'silicone_vedacao': return 'Silicone & Vedação';
      case 'combustivel_frete': return 'Combustível & Frete';
      case 'salarios_comissoes': return 'Salários & Comissões';
      case 'ferramentas': return 'Ferramentas & Discos';
      default: return 'Geral';
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Gestão Financeira</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Fluxo de caixa, recebimentos de instalações e custos com fornecedores
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <PlusCircle size={16} />
          Novo Lançamento
        </button>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-label">Entradas (Receitas)</div>
            <div className="kpi-val" style={{ color: '#10b981' }}>
              {formatBRL(totalReceitas)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vendas & Serviços de Vidros</span>
          </div>
          <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Saídas (Despesas)</div>
            <div className="kpi-val" style={{ color: '#ef4444' }}>
              {formatBRL(totalDespesas)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vidros, Perfis, Silicone, Combustível</span>
          </div>
          <div className="kpi-icon-box" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-label">Lucro Líquido</div>
            <div className="kpi-val" style={{ color: saldoLiquido >= 0 ? '#00d2b4' : '#ef4444' }}>
              {formatBRL(saldoLiquido)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Margem: {totalReceitas > 0 ? ((saldoLiquido / totalReceitas) * 100).toFixed(1) : '0'}%
            </span>
          </div>
          <div className="kpi-icon-box" style={{ background: 'rgba(0, 210, 180, 0.15)', color: '#00d2b4' }}>
            <Wallet size={24} />
          </div>
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Extrato de Entradas e Saídas</h3>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${tipoFiltro === 'todos' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTipoFiltro('todos')}
            >
              Todos ({transacoes.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${tipoFiltro === 'receita' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTipoFiltro('receita')}
            >
              Receitas
            </button>
            <button
              type="button"
              className={`btn btn-sm ${tipoFiltro === 'despesa' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTipoFiltro('despesa')}
            >
              Despesas
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '0.65rem', textAlign: 'left' }}>Descrição / Categoria</th>
                <th style={{ padding: '0.65rem', textAlign: 'center' }}>Data</th>
                <th style={{ padding: '0.65rem', textAlign: 'center' }}>Pagamento</th>
                <th style={{ padding: '0.65rem', textAlign: 'right' }}>Valor</th>
                <th style={{ padding: '0.65rem', textAlign: 'center' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransacoes.map(t => {
                const isReceita = t.tipo === 'receita';

                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: isReceita ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isReceita ? '#10b981' : '#ef4444'
                      }}>
                        {isReceita ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                        {isReceita ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      <strong style={{ color: '#ffffff', display: 'block' }}>{t.descricao}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {getCategoriaLabel(t.categoria)}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(t.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                      {t.formaPagamento}
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'right', fontWeight: 700, color: isReceita ? '#10b981' : '#ef4444', fontSize: '1rem' }}>
                      {isReceita ? '+' : '-'} {formatBRL(t.valor)}
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id, t.descricao)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.3rem' }}
                        title="Excluir Lançamento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Novo Lançamento */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ color: '#ffffff', fontSize: '1.15rem' }}>Novo Lançamento Financeiro</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tipo de Movimentação</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className={`btn ${tipo === 'receita' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => { setTipo('receita'); setCategoria('servico_vidracaria'); }}
                    >
                      <ArrowDownLeft size={16} />
                      Receita (Entrada)
                    </button>
                    <button
                      type="button"
                      className={`btn ${tipo === 'despesa' ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => { setTipo('despesa'); setCategoria('vidro_temperado'); }}
                    >
                      <ArrowUpRight size={16} />
                      Despesa (Saída)
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descrição *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder={tipo === 'receita' ? 'Ex: Entrada Pix Box - Cliente Carlos' : 'Ex: Fornecedor Cebrace - Chapas 8mm'}
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Categoria</label>
                    <select
                      className="form-select"
                      value={categoria}
                      onChange={e => setCategoria(e.target.value as TransacaoFinanceira['categoria'])}
                    >
                      {tipo === 'receita' ? (
                        <option value="servico_vidracaria">Serviço de Vidraçaria / Venda</option>
                      ) : (
                        <>
                          <option value="vidro_temperado">Vidro Temperado (Chapas)</option>
                          <option value="kits_aluminio">Perfis & Kits de Alumínio</option>
                          <option value="ferragens">Ferragens & Puxadores</option>
                          <option value="silicone_vedacao">Silicone PU & Vedação</option>
                          <option value="combustivel_frete">Combustível & Van</option>
                          <option value="salarios_comissoes">Salários / Instalador</option>
                          <option value="ferramentas">Ferramentas & Discos</option>
                          <option value="outro">Outro Custo</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Valor (R$) *</label>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      className="form-control"
                      value={valor}
                      onChange={e => setValor(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Data</label>
                    <input
                      type="date"
                      className="form-control"
                      value={data}
                      onChange={e => setData(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Forma de Pagamento</label>
                    <select
                      className="form-select"
                      value={formaPagamento}
                      onChange={e => setFormaPagamento(e.target.value as TransacaoFinanceira['formaPagamento'])}
                    >
                      <option value="pix">Pix</option>
                      <option value="cartao_credito">Cartão de Crédito</option>
                      <option value="cartao_debito">Cartão de Débito</option>
                      <option value="dinheiro">Dinheiro em Espécie</option>
                      <option value="boleto">Boleto Bancário</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar no Caixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

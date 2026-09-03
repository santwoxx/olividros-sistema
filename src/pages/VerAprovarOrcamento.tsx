import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare, 
  Printer, 
  Receipt,
  AlertCircle,
  ArrowLeft,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Orcamento, AssinaturaDigital } from '../types';
import { storageService, DADOS_VIDRACARIA_PADRAO } from '../services/storage';
import { SignaturePad } from '../components/SignaturePad';

interface VerAprovarOrcamentoProps {
  orcamentoId?: string;
  onNavigate: (tab: string, orcamentoId?: string) => void;
}

export const VerAprovarOrcamento: React.FC<VerAprovarOrcamentoProps> = ({
  orcamentoId,
  onNavigate
}) => {
  const orcamentos = storageService.getOrcamentos();
  const orcamento = orcamentos.find(o => o.id === orcamentoId) || orcamentos[0];

  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [signerNome, setSignerNome] = useState(orcamento?.cliente.nome || '');
  const [signerCpf, setSignerCpf] = useState(orcamento?.cliente.cpf || '');

  if (!orcamento) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <AlertCircle size={36} color="#d97706" style={{ margin: '0 auto 0.75rem auto' }} />
        <h3 style={{ color: '#0f172a', marginBottom: '0.35rem' }}>Orçamento não encontrado</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>O link pode estar expirado ou o código do orçamento foi digitado incorretamente.</p>
        <button type="button" onClick={() => onNavigate('dashboard')} className="btn btn-primary">
          Voltar ao Início
        </button>
      </div>
    );
  }

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSaveSignature = (dataUrl: string) => {
    if (!signerNome.trim()) {
      alert('Por favor, informe seu nome completo.');
      return;
    }

    const assinatura: AssinaturaDigital = {
      autorNome: signerNome,
      autorCpf: signerCpf || 'Não informado',
      tipo: 'cliente_aprovacao',
      dataHora: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR'),
      dataUrl
    };

    const updated: Orcamento = {
      ...orcamento,
      status: 'aprovado',
      assinaturaClienteAprovacao: assinatura
    };

    storageService.saveOrcamento(updated);
    setIsSigningOpen(false);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const isApproved = orcamento.status === 'aprovado' || orcamento.status === 'em_producao' || orcamento.status === 'aguardando_entrega' || orcamento.status === 'concluido';

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Botões de Ação Topo */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => onNavigate('orcamentos')}
          className="btn btn-secondary btn-sm no-print"
        >
          <ArrowLeft size={15} />
          Voltar
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onNavigate('nota', orcamento.id)}
            className="btn btn-outline btn-sm no-print"
          >
            <Receipt size={14} />
            Nota Simples
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm no-print"
          >
            <Printer size={14} />
            Imprimir
          </button>
        </div>
      </div>

      {/* Cartão Oficial da Proposta */}
      <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid #16a34a' }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: 46, height: 46, borderRadius: '8px', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 800 }}>
                {DADOS_VIDRACARIA_PADRAO.nome}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {DADOS_VIDRACARIA_PADRAO.endereco} • {DADOS_VIDRACARIA_PADRAO.bairro} - {DADOS_VIDRACARIA_PADRAO.cidade}/{DADOS_VIDRACARIA_PADRAO.uf}
              </p>
              <p style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>
                WhatsApp: {DADOS_VIDRACARIA_PADRAO.whatsapp} • {DADOS_VIDRACARIA_PADRAO.instagram}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Proposta Nº</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#16a34a' }}>
              {orcamento.numeroProtocolo}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Data: {new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
            Cliente & Local de Instalação:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Cliente: </span>
              <strong style={{ color: '#0f172a' }}>{orcamento.cliente.nome}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>WhatsApp: </span>
              <span style={{ color: '#0f172a' }}>{orcamento.cliente.whatsapp}</span>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--text-muted)' }}>Endereço: </span>
              <span style={{ color: '#0f172a' }}>
                {orcamento.cliente.endereco}, {orcamento.cliente.bairro} - {orcamento.cliente.cidade}
              </span>
            </div>
          </div>
        </div>

        {/* Itens */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.92rem', color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            Especificações dos Vidros e Materiais
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.65rem', textAlign: 'left' }}>Item</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center' }}>Medidas (m²)</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center' }}>Vidro / Perfil</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center' }}>Qtd</th>
                  <th style={{ padding: '0.65rem', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orcamento.itens.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 0.65rem' }}>
                      <strong style={{ color: '#0f172a' }}>{item.descricao}</strong>
                    </td>
                    <td style={{ padding: '0.75rem 0.65rem', textAlign: 'center', color: '#475569' }}>
                      {item.larguraCm > 0 ? `${item.larguraCm} x ${item.alturaCm} cm` : 'Sob medida'}
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>({item.m2.toFixed(2)} m²)</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.65rem', textAlign: 'center', textTransform: 'capitalize' }}>
                      Vidro {item.corVidro} • Perfil {item.corPerfil}
                    </td>
                    <td style={{ padding: '0.75rem 0.65rem', textAlign: 'center', fontWeight: 600 }}>
                      {item.quantidade}
                    </td>
                    <td style={{ padding: '0.75rem 0.65rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                      {formatBRL(item.valorTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
              Condições & Prazos
            </div>
            <p style={{ fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              <strong>Forma de Pagamento:</strong> {orcamento.condicoesPagamento}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              <strong>Prazo de Instalação:</strong> {orcamento.prazoInstalacaoDias} dias úteis
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Garantia de 1 ano para ferragens e vedação / 5 anos para têmpera conforme normas ABNT.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Produtos: {formatBRL(orcamento.valorItens)}</div>
            {orcamento.valorMaoDeObra > 0 && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instalação: {formatBRL(orcamento.valorMaoDeObra)}</div>
            )}
            {orcamento.valorDesconto > 0 && (
              <div style={{ fontSize: '0.85rem', color: '#16a34a' }}>Desconto: - {formatBRL(orcamento.valorDesconto)}</div>
            )}
            <div style={{ marginTop: '0.35rem', textAlign: 'right', borderTop: '2px solid #0f172a', paddingTop: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Valor Total:</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>
                {formatBRL(orcamento.valorTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* ASSINATURA DIGITAL */}
        {isApproved && orcamento.assinaturaClienteAprovacao ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
              <CheckCircle2 size={20} color="#16a34a" />
              Proposta Aprovada com Assinatura Digital
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
              Assinado eletronicamente por <strong>{orcamento.assinaturaClienteAprovacao.autorNome}</strong> em {orcamento.assinaturaClienteAprovacao.dataHora}
            </p>

            <div style={{ maxWidth: '320px', margin: '0 auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 'var(--radius-sm)', padding: '0.5rem' }}>
              <img
                src={orcamento.assinaturaClienteAprovacao.dataUrl}
                alt="Assinatura Digital"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              Aprovar Proposta & Assinar Digitalmente
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
              Assine digitalmente na tela do seu celular ou computador para confirmarmos seu pedido e iniciarmos a produção.
            </p>

            {!isSigningOpen ? (
              <button
                type="button"
                onClick={() => setIsSigningOpen(true)}
                className="btn btn-primary btn-lg"
              >
                <ShieldCheck size={20} />
                Aprovar & Assinar Agora
              </button>
            ) : (
              <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'left' }}>
                <div className="form-grid-2" style={{ marginBottom: '0.85rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={signerNome}
                      onChange={e => setSignerNome(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CPF (opcional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={signerCpf}
                      onChange={e => setSignerCpf(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <SignaturePad
                  titulo="Assinatura de Aceite"
                  subtitulo="Desenhe sua assinatura com o dedo ou mouse"
                  autorNome={signerNome}
                  onSave={handleSaveSignature}
                  onCancel={() => setIsSigningOpen(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* Rodapé */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Olividros Vidraçaria • Austin - Nova Iguaçu / RJ
          </div>
          <a
            href={`https://wa.me/${DADOS_VIDRACARIA_PADRAO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, estou com dúvidas sobre o orçamento ${orcamento.numeroProtocolo}`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-sm no-print"
          >
            <MessageSquare size={15} />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

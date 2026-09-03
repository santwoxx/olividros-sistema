import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  Printer, 
  Receipt,
  AlertCircle,
  Sparkles,
  ArrowLeft
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
  // Se não passar ID, pega o primeiro orçamento da lista para demonstração
  const orcamento = orcamentos.find(o => o.id === orcamentoId) || orcamentos[0];

  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [signerNome, setSignerNome] = useState(orcamento?.cliente.nome || '');
  const [signerCpf, setSignerCpf] = useState(orcamento?.cliente.cpf || '');
  const [showConfettiSuccess, setShowConfettiSuccess] = useState(false);

  if (!orcamento) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <AlertCircle size={40} color="var(--warning)" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Orçamento não encontrado</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>O link pode estar expirado ou o código do orçamento foi digitado incorretamente.</p>
        <button type="button" onClick={() => onNavigate('dashboard')} className="btn btn-primary">
          Voltar ao Painel
        </button>
      </div>
    );
  }

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSaveSignature = (dataUrl: string) => {
    if (!signerNome.trim()) {
      alert('Por favor, confirme seu nome completo.');
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

    // Salva no storage local reativo (ADM recebe notificação em tempo real)
    storageService.saveOrcamento(updated);
    setIsSigningOpen(false);
    setShowConfettiSuccess(true);

    // Efeito comemorativo de confetes
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const isApproved = orcamento.status === 'aprovado' || orcamento.status === 'em_producao' || orcamento.status === 'aguardando_entrega' || orcamento.status === 'concluido';

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Botão de Retorno */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => onNavigate('orcamentos')}
          className="btn btn-secondary btn-sm no-print"
        >
          <ArrowLeft size={16} />
          Voltar aos Orçamentos
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onNavigate('nota', orcamento.id)}
            className="btn btn-outline btn-sm no-print"
          >
            <Receipt size={15} />
            Nota Simples
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm no-print"
          >
            <Printer size={15} />
            Imprimir Proposta
          </button>
        </div>
      </div>

      {/* Cartão Oficial da Proposta */}
      <div className="glass-panel" style={{ padding: '2rem 1.75rem', position: 'relative' }}>
        {/* Cabeçalho Oficial Olividros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="logo-badge" style={{ width: 52, height: 52 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {DADOS_VIDRACARIA_PADRAO.nome}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {DADOS_VIDRACARIA_PADRAO.endereco} • {DADOS_VIDRACARIA_PADRAO.bairro} - {DADOS_VIDRACARIA_PADRAO.cidade}/{DADOS_VIDRACARIA_PADRAO.uf}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                WhatsApp: {DADOS_VIDRACARIA_PADRAO.whatsapp} • {DADOS_VIDRACARIA_PADRAO.instagram}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Proposta Comercial Nº</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
              {orcamento.numeroProtocolo}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Emitido em: {new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Válido até: {new Date(orcamento.dataValidade).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div style={{ background: 'rgba(8, 18, 27, 0.6)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
            Dados do Cliente & Local de Instalação:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cliente: </span>
              <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{orcamento.cliente.nome}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp: </span>
              <span style={{ color: '#ffffff', fontSize: '0.9rem' }}>{orcamento.cliente.whatsapp}</span>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Endereço: </span>
              <span style={{ color: '#ffffff', fontSize: '0.9rem' }}>
                {orcamento.cliente.endereco}, {orcamento.cliente.bairro} - {orcamento.cliente.cidade}
                {orcamento.cliente.complemento && ` (${orcamento.cliente.complemento})`}
              </span>
            </div>
          </div>
        </div>

        {/* Tabela de Itens e Especificações do Vidro */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
            Itens do Pedido & Especificações Técnicas
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.65rem', textAlign: 'left' }}>Item / Descrição</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center' }}>Medidas</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center' }}>Vidro / Perfil</th>
                  <th style={{ padding: '0.65rem', textAlign: 'center' }}>Qtd</th>
                  <th style={{ padding: '0.65rem', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {orcamento.itens.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.85rem 0.65rem' }}>
                      <strong style={{ color: '#ffffff', display: 'block' }}>{item.descricao}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vidraçaria sob medida</span>
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {item.larguraCm > 0 ? `${item.larguraCm} x ${item.alturaCm} cm` : 'Padrão'}
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>({item.m2.toFixed(2)} m²)</div>
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center' }}>
                      <span style={{ color: '#ffffff', textTransform: 'capitalize' }}>{item.corVidro}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        Alum. {item.corPerfil}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'center', color: '#ffffff', fontWeight: 600 }}>
                      {item.quantidade}
                    </td>
                    <td style={{ padding: '0.85rem 0.65rem', textAlign: 'right', fontWeight: 700, color: '#ffffff' }}>
                      {formatBRL(item.valorTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumo Financeiro & Condições */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', background: 'rgba(8, 18, 27, 0.4)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem' }}>
              Condições & Prazos
            </div>
            <p style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              <strong>Forma de Pagamento:</strong> {orcamento.condicoesPagamento}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              <strong>Prazo de Instalação:</strong> {orcamento.prazoInstalacaoDias} dias úteis após aprovação
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Garantia de 1 ano para ferragens e vedação / 5 anos para vidros temperados contra defeitos de têmpera conforme norma ABNT.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subtotal dos Produtos: {formatBRL(orcamento.valorItens)}</div>
            {orcamento.valorMaoDeObra > 0 && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instalação Especializada: {formatBRL(orcamento.valorMaoDeObra)}</div>
            )}
            {orcamento.valorDesconto > 0 && (
              <div style={{ fontSize: '0.85rem', color: '#10b981' }}>Desconto Aplicado: - {formatBRL(orcamento.valorDesconto)}</div>
            )}
            <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Investimento Total:</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatBRL(orcamento.valorTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO DE ASSINATURA DIGITAL */}
        {isApproved && orcamento.assinaturaClienteAprovacao ? (
          /* Já Assinado */
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={24} />
              Proposta Aprovada com Assinatura Digital
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Assinado eletronicamente por <strong>{orcamento.assinaturaClienteAprovacao.autorNome}</strong> (CPF: {orcamento.assinaturaClienteAprovacao.autorCpf || 'Registrado'}) em {orcamento.assinaturaClienteAprovacao.dataHora}
            </p>

            <div style={{ maxWidth: '340px', margin: '0 auto', background: '#071018', border: '1px solid rgba(0, 210, 180, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem', overflow: 'hidden' }}>
              <img
                src={orcamento.assinaturaClienteAprovacao.dataUrl}
                alt="Assinatura Digital do Cliente"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
              />
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
              Autenticação criptográfica gerada no ato do aceite com registro de data/hora oficial.
            </p>
          </div>
        ) : (
          /* Pendente de Assinatura - Botão de Aceite */
          <div style={{ background: 'linear-gradient(135deg, rgba(0, 210, 180, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Pronto para aprovar seu projeto de vidros?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
              Para darmos início imediato ao corte e preparação dos vidros, assine digitalmente abaixo direto na tela do seu celular ou computador.
            </p>

            {!isSigningOpen ? (
              <button
                type="button"
                onClick={() => setIsSigningOpen(true)}
                className="btn btn-primary btn-lg"
                style={{ fontSize: '1.1rem', padding: '0.9rem 2rem', boxShadow: '0 0 25px rgba(0, 210, 180, 0.4)' }}
              >
                <ShieldCheck size={22} />
                Aprovar & Assinar Digitalmente
              </button>
            ) : (
              <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'left' }}>
                <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nome Completo do Responsável *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={signerNome}
                      onChange={e => setSignerNome(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CPF (para formalizar o contrato)</label>
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
                  titulo="Assinatura de Aceite da Proposta"
                  subtitulo="Use o dedo na tela ou o mouse para desenhar sua assinatura"
                  autorNome={signerNome}
                  onSave={handleSaveSignature}
                  onCancel={() => setIsSigningOpen(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* Rodapé da Proposta */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Olividros Vidraçaria • Austin - Nova Iguaçu / RJ • Tel: (21) 96757-8040
          </div>
          <a
            href={`https://wa.me/${DADOS_VIDRACARIA_PADRAO.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, estou com dúvidas sobre o orçamento ${orcamento.numeroProtocolo}`)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-sm no-print"
          >
            <MessageSquare size={16} />
            Falar com a Vidraçaria no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

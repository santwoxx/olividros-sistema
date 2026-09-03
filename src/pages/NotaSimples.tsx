import React from 'react';
import { 
  Printer, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare,
  FileText
} from 'lucide-react';
import { Orcamento } from '../types';
import { storageService, DADOS_VIDRACARIA_PADRAO } from '../services/storage';

interface NotaSimplesProps {
  orcamentoId?: string;
  onNavigate: (tab: string, orcamentoId?: string) => void;
}

export const NotaSimples: React.FC<NotaSimplesProps> = ({
  orcamentoId,
  onNavigate
}) => {
  const orcamentos = storageService.getOrcamentos();
  const orcamento = orcamentos.find(o => o.id === orcamentoId) || orcamentos[0];

  if (!orcamento) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Nenhum pedido selecionado para emissão de nota.</p>
        <button type="button" onClick={() => onNavigate('orcamentos')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Voltar aos Orçamentos
        </button>
      </div>
    );
  }

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}?tab=nota&id=${orcamento.id}`;
  const whatsAppText = `Olá ${orcamento.cliente.nome}, segue sua Nota Simples / Recibo de Garantia dos vidros instalados da Olividros Vidraçaria: ${shareUrl}`;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Botões de Ação Superiores (ocultos na impressão) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => onNavigate('orcamentos')}
          className="btn btn-secondary btn-sm"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/${orcamento.cliente.whatsapp}?text=${encodeURIComponent(whatsAppText)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-sm"
          >
            <MessageSquare size={16} />
            Enviar no WhatsApp
          </a>

          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-primary btn-sm"
          >
            <Printer size={16} />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* DOCUMENTO DA NOTA SIMPLES / RECIBO (Estilo Papel Timbrado Oficial) */}
      <div 
        className="nota-documento" 
        style={{ 
          background: '#ffffff', 
          color: '#1e293b', 
          borderRadius: '12px', 
          padding: '2.5rem', 
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Cabeçalho da Vidraçaria */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
              {DADOS_VIDRACARIA_PADRAO.nome}
            </h1>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
              Vidraçaria, Esquadrias de Alumínio & Manutenção
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '2px 0' }}>
              CNPJ: {DADOS_VIDRACARIA_PADRAO.cnpj}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '2px 0' }}>
              {DADOS_VIDRACARIA_PADRAO.endereco} - {DADOS_VIDRACARIA_PADRAO.bairro}, {DADOS_VIDRACARIA_PADRAO.cidade} / {DADOS_VIDRACARIA_PADRAO.uf} ({DADOS_VIDRACARIA_PADRAO.pontoReferencia})
            </p>
            <p style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, margin: '2px 0' }}>
              WhatsApp: {DADOS_VIDRACARIA_PADRAO.whatsapp} • Instagram: {DADOS_VIDRACARIA_PADRAO.instagram}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.6rem 1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>
                Nota Simples de Serviço
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                Nº {orcamento.numeroProtocolo}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Data: {new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Dados do Destinatário / Cliente */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '0.4rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.25rem' }}>
            Dados do Cliente / Tomador do Serviço
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.88rem' }}>
            <div><strong>Nome:</strong> {orcamento.cliente.nome}</div>
            <div><strong>WhatsApp:</strong> {orcamento.cliente.whatsapp}</div>
            <div><strong>CPF:</strong> {orcamento.cliente.cpf || 'Consumidor Final'}</div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong>Endereço de Instalação:</strong> {orcamento.cliente.endereco}, {orcamento.cliente.bairro} - {orcamento.cliente.cidade}
              {orcamento.cliente.complemento && ` (${orcamento.cliente.complemento})`}
            </div>
          </div>
        </div>

        {/* Discriminação dos Serviços e Vidros */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.5rem' }}>
            Discriminação dos Produtos e Serviços
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.6rem', textAlign: 'center', width: '50px' }}>Qtd</th>
                <th style={{ padding: '0.6rem', textAlign: 'left' }}>Descrição Detalhada</th>
                <th style={{ padding: '0.6rem', textAlign: 'center' }}>Medidas (m²)</th>
                <th style={{ padding: '0.6rem', textAlign: 'center' }}>Acabamento</th>
                <th style={{ padding: '0.6rem', textAlign: 'right', width: '110px' }}>Total (R$)</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.itens.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', fontWeight: 700 }}>
                    {item.quantidade}
                  </td>
                  <td style={{ padding: '0.75rem 0.6rem' }}>
                    <strong style={{ color: '#0f172a' }}>{item.descricao}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fornecimento e colocação com vedação e fixação técnica</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center' }}>
                    {item.larguraCm} x {item.alturaCm} cm
                    <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>({item.m2.toFixed(2)} m²)</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.6rem', textAlign: 'center', textTransform: 'capitalize' }}>
                    Vidro {item.corVidro} • Perfil {item.corPerfil}
                  </td>
                  <td style={{ padding: '0.75rem 0.6rem', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                    {formatBRL(item.valorTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totais e Forma de Pagamento */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ maxWidth: '420px', fontSize: '0.85rem' }}>
            <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#0f172a' }}>Condição de Pagamento:</strong>
            <p style={{ color: '#475569', margin: 0 }}>{orcamento.condicoesPagamento}</p>
            <p style={{ color: '#16a34a', fontWeight: 700, marginTop: '0.35rem' }}>
              Situação: {orcamento.status === 'concluido' ? '✓ Pedido Concluído e Entregue' : 'Em Andamento'}
            </p>
          </div>

          <div style={{ textAlign: 'right', minWidth: '220px' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>
              Produtos: {formatBRL(orcamento.valorItens)}
            </div>
            {orcamento.valorMaoDeObra > 0 && (
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>
                Instalação: {formatBRL(orcamento.valorMaoDeObra)}
              </div>
            )}
            {orcamento.valorDesconto > 0 && (
              <div style={{ fontSize: '0.85rem', color: '#16a34a', marginBottom: '0.2rem' }}>
                Desconto: - {formatBRL(orcamento.valorDesconto)}
              </div>
            )}
            <div style={{ borderTop: '2px solid #0f172a', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 800, color: '#64748b' }}>Valor Total:</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
                {formatBRL(orcamento.valorTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Termo de Garantia e Cuidados */}
        <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '0.85rem 1.25rem', marginBottom: '1.75rem', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
          <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>
            CERTIFICADO DE GARANTIA & RECOMENDAÇÕES TÉCNICAS:
          </strong>
          <p style={{ margin: '2px 0' }}>
            1. <strong>Garantia Legal:</strong> 12 (doze) meses para serviços de instalação, regulagens, fechaduras, roldanas e vedação de silicone. 5 (cinco) anos contra defeitos de têmpera do vidro temperado conforme normas ABNT NBR 14698 / NBR 14207.
          </p>
          <p style={{ margin: '2px 0' }}>
            2. <strong>Limpeza e Conservação:</strong> Limpar exclusivamente com pano macio, água e sabão neutro. Não utilizar produtos abrasivos (palha de aço, água sanitária ou ácidos) que danificam perfis de alumínio e espelhos.
          </p>
        </div>

        {/* Assinaturas Digitais Autenticadas Registradas */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: '0.75rem', textAlign: 'center' }}>
            Registro de Assinaturas Digitais Autenticadas
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            {/* Assinatura do Cliente (Aprovação da Proposta) */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Aceite da Proposta pelo Cliente
              </div>
              {orcamento.assinaturaClienteAprovacao ? (
                <>
                  <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={orcamento.assinaturaClienteAprovacao.dataUrl}
                      alt="Assinatura Cliente"
                      style={{ maxHeight: '60px', maxWidth: '100%' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', borderTop: '1px solid #cbd5e1', paddingTop: '0.25rem' }}>
                    {orcamento.assinaturaClienteAprovacao.autorNome}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Assinado em: {orcamento.assinaturaClienteAprovacao.dataHora}
                  </div>
                </>
              ) : (
                <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>
                  Aguardando assinatura digital
                </div>
              )}
            </div>

            {/* Assinatura do Instalador Olividros */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Responsável Técnico / Instalação
              </div>
              {orcamento.entrega?.assinaturaFuncionario ? (
                <>
                  <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={orcamento.entrega.assinaturaFuncionario.dataUrl}
                      alt="Assinatura Instalador"
                      style={{ maxHeight: '60px', maxWidth: '100%' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', borderTop: '1px solid #cbd5e1', paddingTop: '0.25rem' }}>
                    {orcamento.entrega.assinaturaFuncionario.autorNome}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Instalado em: {orcamento.entrega.assinaturaFuncionario.dataHora}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>
                    Equipe Técnica Olividros Vidraçaria
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', borderTop: '1px solid #cbd5e1', paddingTop: '0.25rem' }}>
                    Olividros Vidros e Esquadrias Ltda
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Austin - Nova Iguaçu / RJ
                  </div>
                </>
              )}
            </div>

            {/* Assinatura do Cliente no Recebimento */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', background: '#f8fafc' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Recebimento & Teste do Vidro
              </div>
              {orcamento.entrega?.assinaturaClienteEntrega ? (
                <>
                  <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={orcamento.entrega.assinaturaClienteEntrega.dataUrl}
                      alt="Assinatura Cliente Entrega"
                      style={{ maxHeight: '60px', maxWidth: '100%' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', borderTop: '1px solid #cbd5e1', paddingTop: '0.25rem' }}>
                    {orcamento.entrega.assinaturaClienteEntrega.autorNome}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Recebido em: {orcamento.entrega.assinaturaClienteEntrega.dataHora}
                  </div>
                </>
              ) : (
                <div style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>
                  Assinatura coletada na entrega
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé do Documento */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
          Documento gerado eletronicamente por Olividros Vidraçaria • Autenticação de Assinatura Digital vinculada ao protocolo {orcamento.numeroProtocolo}
        </div>
      </div>
    </div>
  );
};

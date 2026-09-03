import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  Ruler, 
  MapPin, 
  MessageSquare, 
  Layers,
  Check,
  Building2
} from 'lucide-react';
import { TipoServico, CorVidro, CorPerfil, Orcamento, ItemOrcamento } from '../types';
import { storageService, DADOS_VIDRACARIA_PADRAO } from '../services/storage';

interface SolicitarOrcamentoPublicoProps {
  onSuccessNavigate?: (novoId: string) => void;
}

export const SolicitarOrcamentoPublico: React.FC<SolicitarOrcamentoPublicoProps> = ({
  onSuccessNavigate
}) => {
  const [servico, setServico] = useState<TipoServico>('box');
  const [larguraCm, setLarguraCm] = useState<number>(140);
  const [alturaCm, setAlturaCm] = useState<number>(190);
  const [corVidro, setCorVidro] = useState<CorVidro>('incolor');
  const [corPerfil, setCorPerfil] = useState<CorPerfil>('preto');
  
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('Austin');
  const [cidade, setCidade] = useState('Nova Iguaçu');
  const [observacoes, setObservacoes] = useState('');

  const [protocoloGerado, setProtocoloGerado] = useState<string | null>(null);
  const [orcamentoCriadoId, setOrcamentoCriadoId] = useState<string | null>(null);

  const servicosLista = [
    { id: 'box', title: 'Box para Banheiro', desc: 'Frontal ou de canto em vidro temperado 8mm' },
    { id: 'janela', title: 'Janelas de Vidro', desc: '2 ou 4 folhas temperadas ou comuns' },
    { id: 'porta', title: 'Portas de Vidro', desc: 'De correr ou pivotante com puxadores' },
    { id: 'espelho', title: 'Espelhos Bisotados / Lapidados', desc: 'Para banheiros, salas e closets' },
    { id: 'guarda_corpo', title: 'Guarda-Corpo & Corrimão', desc: 'Vidros de segurança para sacadas e escadas' },
    { id: 'cortina_vidro', title: 'Cortina de Vidros', desc: 'Fechamento de sacadas e varandas articulado' },
    { id: 'tampo_mesa', title: 'Tampos de Mesas', desc: 'Redondos, quadrados ou retangulares' },
    { id: 'manutencao', title: 'Manutenção Preventiva / Reparo', desc: 'Troca de roldanas, guias e vedação' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !whatsapp.trim()) {
      alert('Por favor, informe seu nome e número de WhatsApp.');
      return;
    }

    const protocoloNum = Math.floor(100 + Math.random() * 900);
    const novoProtocolo = `OLI-2024-${protocoloNum}`;
    const novoId = `orc-${Date.now()}`;

    let cleanWa = whatsapp.replace(/\D/g, '');
    if (cleanWa.length === 11 || cleanWa.length === 10) {
      cleanWa = '55' + cleanWa;
    }

    const m2 = Number(((larguraCm * alturaCm) / 10000).toFixed(2));
    
    let estimativaBase = 0;
    if (servico === 'box') estimativaBase = 1150;
    if (servico === 'janela') estimativaBase = 980;
    if (servico === 'porta') estimativaBase = 1850;
    if (servico === 'espelho') estimativaBase = 750;
    if (servico === 'guarda_corpo') estimativaBase = 2200;

    const item: ItemOrcamento = {
      id: `item-${Date.now()}`,
      tipoServico: servico,
      descricao: servicosLista.find(s => s.id === servico)?.title || 'Serviço de Vidraçaria',
      larguraCm,
      alturaCm,
      m2,
      tipoVidro: servico === 'porta' ? 'temperado_10mm' : 'temperado_8mm',
      corVidro,
      corPerfil,
      quantidade: 1,
      valorUnitario: estimativaBase,
      valorTotal: estimativaBase
    };

    const novoOrcamento: Orcamento = {
      id: novoId,
      numeroProtocolo: novoProtocolo,
      dataCriacao: new Date().toISOString(),
      dataValidade: new Date(Date.now() + 15 * 86400000).toISOString(),
      status: 'solicitado',
      prazoInstalacaoDias: 5,
      cliente: {
        nome,
        whatsapp: cleanWa,
        telefone: whatsapp,
        endereco,
        bairro,
        cidade
      },
      itens: [item],
      valorItens: estimativaBase,
      valorMaoDeObra: 150,
      valorFrete: 0,
      valorDesconto: 0,
      valorTotal: estimativaBase + 150,
      condicoesPagamento: 'A combinar com a Olividros (Pix, Cartão até 12x ou Dinheiro)',
      observacoes: observacoes ? `Solicitado pelo cliente via link online: ${observacoes}` : 'Solicitado pelo cliente via link online.'
    };

    storageService.saveOrcamento(novoOrcamento);
    setProtocoloGerado(novoProtocolo);
    setOrcamentoCriadoId(novoId);
  };

  const getWhatsAppMessage = () => {
    return encodeURIComponent(
      `Olá Vidraçaria Olividros! Acabei de solicitar um orçamento pelo site.\n\n` +
      `*Protocolo:* ${protocoloGerado}\n` +
      `*Nome:* ${nome}\n` +
      `*Serviço:* ${servicosLista.find(s => s.id === servico)?.title}\n` +
      `*Medidas aproximadas:* ${larguraCm}cm x ${alturaCm}cm\n` +
      `*Endereço:* ${endereco ? `${endereco}, ` : ''}${bairro} - ${cidade}\n\n` +
      `Aguardo o envio da proposta detalhada por aqui!`
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Top Banner de Identidade Institucional */}
      <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem 1.5rem', marginBottom: '1.5rem', borderTop: '4px solid #16a34a' }}>
        <div style={{ width: 44, height: 44, borderRadius: '8px', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
          <Building2 size={24} />
        </div>
        <h1 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.35rem' }}>
          Olividros Vidraçaria
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '560px', margin: '0 auto' }}>
          Solicite seu orçamento online. Nossa equipe em Austin / Nova Iguaçu vai calcular e enviar sua proposta com o melhor preço da região!
        </p>
      </div>

      {protocoloGerado ? (
        /* Tela de Sucesso */
        <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <CheckCircle2 size={38} />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '0.4rem' }}>
            Orçamento Solicitado com Sucesso!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Recebemos seu pedido. O seu protocolo oficial de atendimento é:
          </p>

          <div style={{ background: '#f8fafc', border: '2px dashed #16a34a', borderRadius: 'var(--radius-md)', padding: '1.25rem', maxWidth: '340px', margin: '0 auto 1.75rem auto' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Número do Protocolo</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>
              {protocoloGerado}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '380px', margin: '0 auto' }}>
            <a
              href={`https://wa.me/${DADOS_VIDRACARIA_PADRAO.whatsapp.replace(/\D/g, '')}?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <MessageSquare size={18} />
              Avisar a Vidraçaria no WhatsApp
            </a>

            {onSuccessNavigate && orcamentoCriadoId && (
              <button
                type="button"
                onClick={() => onSuccessNavigate(orcamentoCriadoId)}
                className="btn btn-outline"
              >
                Ver Prévia da Proposta
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setProtocoloGerado(null);
                setNome('');
                setWhatsapp('');
                setObservacoes('');
              }}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '0.5rem' }}
            >
              Fazer Outra Solicitação
            </button>
          </div>
        </div>
      ) : (
        /* Formulário de Solicitação */
        <form onSubmit={handleSubmit}>
          {/* Passo 1: Escolha do Serviço */}
          <div className="glass-panel" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#16a34a" />
              1. Qual serviço ou vidro você precisa?
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
              {servicosLista.map(item => {
                const isSelected = servico === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setServico(item.id as TipoServico);
                      if (item.id === 'box') { setLarguraCm(140); setAlturaCm(190); }
                      if (item.id === 'janela') { setLarguraCm(200); setAlturaCm(120); }
                      if (item.id === 'porta') { setLarguraCm(100); setAlturaCm(215); }
                      if (item.id === 'espelho') { setLarguraCm(180); setAlturaCm(100); }
                    }}
                    style={{
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      border: isSelected ? '2px solid #16a34a' : '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <strong style={{ color: isSelected ? '#15803d' : '#0f172a', fontSize: '0.9rem' }}>
                        {item.title}
                      </strong>
                      {isSelected && <Check size={16} color="#16a34a" />}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Passo 2: Medidas & Cores */}
          <div className="glass-panel" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ruler size={18} color="#16a34a" />
              2. Medidas aproximadas e cores desejadas
            </h3>

            <div className="form-grid-2" style={{ marginBottom: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Largura Estimada (em cm)</label>
                <input
                  type="number"
                  min="10"
                  className="form-control"
                  value={larguraCm}
                  onChange={e => setLarguraCm(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Ex: 140 cm = 1 metro e 40 centímetros</span>
              </div>

              <div className="form-group">
                <label className="form-label">Altura Estimada (em cm)</label>
                <input
                  type="number"
                  min="10"
                  className="form-control"
                  value={alturaCm}
                  onChange={e => setAlturaCm(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Ex: 190 cm = padrão box de banheiro</span>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Cor do Vidro</label>
                <select
                  className="form-select"
                  value={corVidro}
                  onChange={e => setCorVidro(e.target.value as CorVidro)}
                >
                  <option value="incolor">Incolor (Transparente tradicional)</option>
                  <option value="fume">Fumê (Cinza escuro moderno)</option>
                  <option value="verde">Verde Esmeralda</option>
                  <option value="bronze">Bronze</option>
                  <option value="jateado">Jateado / Fosco</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cor do Alumínio / Ferragens</label>
                <select
                  className="form-select"
                  value={corPerfil}
                  onChange={e => setCorPerfil(e.target.value as CorPerfil)}
                >
                  <option value="preto">Preto Fosco</option>
                  <option value="branco">Branco</option>
                  <option value="fosco">Alumínio Fosco Natural</option>
                  <option value="bronze">Bronze</option>
                  <option value="inox">Inox / Cromado</option>
                  <option value="dourado">Dourado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Passo 3: Contato */}
          <div className="glass-panel" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#16a34a" />
              3. Dados para envio do orçamento e instalação
            </h3>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Seu Nome Completo *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Como podemos te chamar?"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Seu WhatsApp *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Ex: (21) 99999-8888"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Endereço de Instalação</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rua, condomínio..."
                  value={endereco}
                  onChange={e => setEndereco(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bairro</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Austin"
                  value={bairro}
                  onChange={e => setBairro(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cidade</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nova Iguaçu"
                  value={cidade}
                  onChange={e => setCidade(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Observações ou dúvidas</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Ex: Instalação no 2º andar, preciso de puxador diferenciado, etc."
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            style={{ fontSize: '1rem', padding: '0.85rem' }}
          >
            <Send size={18} />
            Enviar Solicitação de Orçamento
          </button>
        </form>
      )}
    </div>
  );
};

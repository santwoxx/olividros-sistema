import React, { useState } from 'react';
import { X, Plus, Calculator } from 'lucide-react';
import { Orcamento, ItemOrcamento, TipoServico, TipoVidro, CorVidro, CorPerfil } from '../types';
import { storageService } from '../services/storage';

interface NovoOrcamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (novoId: string) => void;
}

export const NovoOrcamentoModal: React.FC<NovoOrcamentoModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  // Dados do Cliente
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telefone] = useState('');
  const [cpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('Austin');
  const [cidade, setCidade] = useState('Nova Iguaçu');
  const [complemento] = useState('');

  // Item do Orçamento
  const [tipoServico, setTipoServico] = useState<TipoServico>('box');
  const [descricao, setDescricao] = useState('Box Frontal Blindex 8mm');
  const [larguraCm, setLarguraCm] = useState(140);
  const [alturaCm, setAlturaCm] = useState(190);
  const [tipoVidro, setTipoVidro] = useState<TipoVidro>('temperado_8mm');
  const [corVidro, setCorVidro] = useState<CorVidro>('incolor');
  const [corPerfil, setCorPerfil] = useState<CorPerfil>('preto');
  const [quantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState(1150);

  // Valores Extras
  const [valorMaoDeObra, setValorMaoDeObra] = useState(150);
  const [valorFrete] = useState(0);
  const [valorDesconto, setValorDesconto] = useState(0);
  const [condicoesPagamento, setCondicoesPagamento] = useState('50% sinal via Pix + saldo na conclusão (ou cartão até 6x)');
  const [prazoDias, setPrazoDias] = useState(5);
  const [observacoes] = useState('');

  const m2 = Number(((larguraCm * alturaCm) / 10000).toFixed(2));
  const valorTotalItens = valorUnitario * quantidade;
  const valorTotalGeral = Math.max(0, valorTotalItens + valorMaoDeObra + valorFrete - valorDesconto);

  const handleServiceChange = (st: TipoServico) => {
    setTipoServico(st);
    switch (st) {
      case 'box':
        setDescricao('Box Frontal Blindex de Correr (1 Fixo + 1 Móvel)');
        setLarguraCm(140);
        setAlturaCm(190);
        setValorUnitario(1150);
        break;
      case 'janela':
        setDescricao('Janela 4 Folhas Vidro Temperado 8mm');
        setLarguraCm(200);
        setAlturaCm(120);
        setValorUnitario(980);
        break;
      case 'porta':
        setDescricao('Porta Pivotante em Vidro Temperado 10mm com Puxador Inox');
        setLarguraCm(100);
        setAlturaCm(215);
        setValorUnitario(2100);
        break;
      case 'espelho':
        setDescricao('Espelho Cristal Bisotado 25mm');
        setLarguraCm(180);
        setAlturaCm(100);
        setValorUnitario(850);
        break;
      case 'guarda_corpo':
        setDescricao('Guarda-Corpo Vidro Laminado/Temperado');
        setLarguraCm(300);
        setAlturaCm(110);
        setValorUnitario(2800);
        break;
      case 'tampo_mesa':
        setDescricao('Tampo de Mesa Vidro Lapidado 10mm');
        setLarguraCm(120);
        setAlturaCm(120);
        setValorUnitario(650);
        break;
      case 'manutencao':
        setDescricao('Manutenção Preventiva / Troca de Roldanas e Vedação');
        setLarguraCm(0);
        setAlturaCm(0);
        setValorUnitario(350);
        break;
      default:
        setDescricao('Serviço Especial de Vidraçaria');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !whatsapp.trim()) {
      alert('Por favor, informe o nome e o WhatsApp do cliente.');
      return;
    }

    const protocoloNum = Math.floor(100 + Math.random() * 900);
    const novoId = `orc-${Date.now()}`;

    let cleanWa = whatsapp.replace(/\D/g, '');
    if (cleanWa.length === 11 || cleanWa.length === 10) {
      cleanWa = '55' + cleanWa;
    }

    const item: ItemOrcamento = {
      id: `item-${Date.now()}`,
      tipoServico,
      descricao,
      larguraCm,
      alturaCm,
      m2,
      tipoVidro,
      corVidro,
      corPerfil,
      quantidade,
      valorUnitario,
      valorTotal: valorTotalItens
    };

    const novoOrcamento: Orcamento = {
      id: novoId,
      numeroProtocolo: `OLI-2024-${protocoloNum}`,
      dataCriacao: new Date().toISOString(),
      dataValidade: new Date(Date.now() + 15 * 86400000).toISOString(),
      status: 'enviado_cliente',
      prazoInstalacaoDias: prazoDias,
      cliente: {
        nome,
        whatsapp: cleanWa,
        telefone: telefone || whatsapp,
        cpf,
        endereco,
        bairro,
        cidade,
        complemento
      },
      itens: [item],
      valorItens: valorTotalItens,
      valorMaoDeObra,
      valorFrete,
      valorDesconto,
      valorTotal: valorTotalGeral,
      condicoesPagamento,
      observacoes
    };

    storageService.saveOrcamento(novoOrcamento);
    onSuccess(novoId);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={20} color="#16a34a" />
            <div>
              <h3 style={{ color: '#0f172a', fontSize: '1.15rem' }}>Criar Novo Orçamento</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Olividros Vidraçaria • Calculadora de Metragem e Proposta
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Dados do Cliente */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                1. Dados do Cliente
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Ex: João da Silva"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp (com DDD) *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Ex: (21) 98844-1234"
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
                    placeholder="Rua, Número"
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
            </div>

            {/* Vidro e Medidas */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                2. Especificações do Vidro & Medidas
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Tipo de Serviço</label>
                  <select
                    className="form-select"
                    value={tipoServico}
                    onChange={e => handleServiceChange(e.target.value as TipoServico)}
                  >
                    <option value="box">Box para Banheiro</option>
                    <option value="janela">Janela de Vidro</option>
                    <option value="porta">Porta de Vidro / Pivotante</option>
                    <option value="espelho">Espelho Bisotado / Lapidado</option>
                    <option value="guarda_corpo">Guarda-Corpo</option>
                    <option value="cortina_vidro">Cortina de Vidro (Fechamento)</option>
                    <option value="tampo_mesa">Tampo de Mesa</option>
                    <option value="manutencao">Manutenção / Reparo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Descrição do Item</label>
                  <input
                    type="text"
                    className="form-control"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Largura (cm)</label>
                  <input
                    type="number"
                    min="10"
                    className="form-control"
                    value={larguraCm}
                    onChange={e => setLarguraCm(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Altura (cm)</label>
                  <input
                    type="number"
                    min="10"
                    className="form-control"
                    value={alturaCm}
                    onChange={e => setAlturaCm(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Área Calculada</label>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: '#16a34a', fontWeight: 800, fontSize: '1rem', textAlign: 'center' }}>
                    {m2.toFixed(2)} m²
                  </div>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Tipo de Vidro</label>
                  <select
                    className="form-select"
                    value={tipoVidro}
                    onChange={e => setTipoVidro(e.target.value as TipoVidro)}
                  >
                    <option value="temperado_8mm">Temperado 8mm</option>
                    <option value="temperado_10mm">Temperado 10mm</option>
                    <option value="comum_4mm">Comum 4mm</option>
                    <option value="comum_6mm">Comum 6mm</option>
                    <option value="laminado_8mm">Laminado 8mm</option>
                    <option value="espelho_bisotado">Espelho Bisotado</option>
                    <option value="espelho_lapidado">Espelho Lapidado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cor do Vidro</label>
                  <select
                    className="form-select"
                    value={corVidro}
                    onChange={e => setCorVidro(e.target.value as CorVidro)}
                  >
                    <option value="incolor">Incolor</option>
                    <option value="fume">Fumê</option>
                    <option value="verde">Verde</option>
                    <option value="bronze">Bronze</option>
                    <option value="jateado">Jateado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cor do Alumínio</label>
                  <select
                    className="form-select"
                    value={corPerfil}
                    onChange={e => setCorPerfil(e.target.value as CorPerfil)}
                  >
                    <option value="preto">Preto Fosco</option>
                    <option value="branco">Branco</option>
                    <option value="fosco">Fosco Natural</option>
                    <option value="bronze">Bronze</option>
                    <option value="inox">Inox / Cromado</option>
                    <option value="dourado">Dourado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Valores */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                3. Valores & Condições
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Valor do Produto (R$)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={valorUnitario}
                    onChange={e => setValorUnitario(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mão de Obra (R$)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={valorMaoDeObra}
                    onChange={e => setValorMaoDeObra(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Desconto (R$)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={valorDesconto}
                    onChange={e => setValorDesconto(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Prazo de Instalação (dias)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={prazoDias}
                    onChange={e => setPrazoDias(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Condições de Pagamento</label>
                  <input
                    type="text"
                    className="form-control"
                    value={condicoesPagamento}
                    onChange={e => setCondicoesPagamento(e.target.value)}
                  />
                </div>
              </div>

              {/* Totalizador */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>Total do Orçamento:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>
                  {valorTotalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={15} />
              Gerar Orçamento & Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

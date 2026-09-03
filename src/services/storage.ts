import { Orcamento, TransacaoFinanceira, DadosVidracaria } from '../types';

const STORAGE_KEYS = {
  ORCAMENTOS: 'olividros_orcamentos_v1',
  TRANSACOES: 'olividros_transacoes_v1',
  CONFIG: 'olividros_config_v1',
};

export const DADOS_VIDRACARIA_PADRAO: DadosVidracaria = {
  nome: 'Olividros Vidraçaria',
  razaoSocial: 'Olividros Vidros e Esquadrias Ltda',
  cnpj: '38.452.891/0001-20',
  whatsapp: '(21) 96757-8040',
  telefone: '(21) 96757-8040',
  instagram: '@olividros.vidracaria',
  endereco: 'Rua XV de Novembro, 319',
  bairro: 'Austin',
  cidade: 'Nova Iguaçu',
  uf: 'RJ',
  pontoReferencia: 'Em frente à estação de trem de Austin',
  email: 'contato@olividros.com.br',
  chavePix: '21967578040'
};

// Dados realistas de demonstração inicial
const ORCAMENTOS_INICIAIS: Orcamento[] = [
  {
    id: 'orc-001',
    numeroProtocolo: 'OLI-2024-001',
    dataCriacao: new Date(Date.now() - 2 * 86400000).toISOString(),
    dataValidade: new Date(Date.now() + 10 * 86400000).toISOString(),
    status: 'enviado_cliente',
    prazoInstalacaoDias: 5,
    cliente: {
      nome: 'Carlos Eduardo Menezes',
      telefone: '(21) 98844-1234',
      whatsapp: '5521988441234',
      cpf: '123.456.789-00',
      endereco: 'Rua Dr. Barros Júnior, 450 - Apto 302',
      bairro: 'Centro',
      cidade: 'Nova Iguaçu',
      complemento: 'Próximo ao Top Shopping',
      cep: '26210-010'
    },
    itens: [
      {
        id: 'item-1',
        tipoServico: 'box',
        descricao: 'Box Frontal Blindex de Correr (1 Fixo + 1 Móvel)',
        larguraCm: 140,
        alturaCm: 190,
        m2: 2.66,
        tipoVidro: 'temperado_8mm',
        corVidro: 'incolor',
        corPerfil: 'preto',
        quantidade: 1,
        valorUnitario: 1150,
        valorTotal: 1150
      }
    ],
    valorItens: 1150,
    valorMaoDeObra: 150,
    valorFrete: 0,
    valorDesconto: 50,
    valorTotal: 1250,
    condicoesPagamento: 'Entrada de 50% via Pix + 50% na conclusão da instalação (ou até 6x no cartão).',
    observacoes: 'Instalação com kit alumínio preto fosco linha robusta e batedor amortecedor.'
  },
  {
    id: 'orc-002',
    numeroProtocolo: 'OLI-2024-002',
    dataCriacao: new Date(Date.now() - 4 * 86400000).toISOString(),
    dataValidade: new Date(Date.now() + 8 * 86400000).toISOString(),
    status: 'aprovado',
    prazoInstalacaoDias: 4,
    cliente: {
      nome: 'Mariana Vasconcelos',
      telefone: '(21) 97722-5566',
      whatsapp: '5521977225566',
      cpf: '321.654.987-11',
      endereco: 'Rua Coriolano, 120 - Casa 2',
      bairro: 'Austin',
      cidade: 'Nova Iguaçu',
      complemento: 'Entrando na rua da praça',
      cep: '26086-050'
    },
    itens: [
      {
        id: 'item-2',
        tipoServico: 'janela',
        descricao: 'Janela 4 Folhas Vidro Temperado (2 Fixas + 2 Móveis)',
        larguraCm: 200,
        alturaCm: 120,
        m2: 2.40,
        tipoVidro: 'temperado_8mm',
        corVidro: 'fume',
        corPerfil: 'branco',
        quantidade: 1,
        valorUnitario: 980,
        valorTotal: 980
      }
    ],
    valorItens: 980,
    valorMaoDeObra: 120,
    valorFrete: 0,
    valorDesconto: 0,
    valorTotal: 1100,
    condicoesPagamento: 'Pix à vista na entrega com 5% de desconto.',
    observacoes: 'Vidro temperado 8mm fumê de alta privacidade com roldanas blindadas.',
    assinaturaClienteAprovacao: {
      autorNome: 'Mariana Vasconcelos',
      autorCpf: '321.654.987-11',
      tipo: 'cliente_aprovacao',
      dataHora: new Date(Date.now() - 1 * 86400000).toLocaleString('pt-BR'),
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><path d="M20 50 Q 80 10 140 60 T 260 40" stroke="%230ea5e9" stroke-width="3" fill="none"/></svg>'
    },
    entrega: {
      dataAgendada: new Date().toISOString().split('T')[0],
      instaladorNome: 'Marcos Silva (Instalador Olividros)',
      observacoesEntrega: 'Levar silicone neutro branco e chave allen 4mm.',
      statusEntrega: 'em_rota'
    }
  },
  {
    id: 'orc-003',
    numeroProtocolo: 'OLI-2024-003',
    dataCriacao: new Date(Date.now() - 3 * 3600000).toISOString(),
    dataValidade: new Date(Date.now() + 15 * 86400000).toISOString(),
    status: 'solicitado',
    prazoInstalacaoDias: 7,
    cliente: {
      nome: 'Roberto Antunes',
      telefone: '(21) 99182-3344',
      whatsapp: '5521991823344',
      endereco: 'Av. Abílio Augusto Távora, 2400',
      bairro: 'Valverde',
      cidade: 'Nova Iguaçu',
      complemento: 'Condomínio Reserva das Palmeiras'
    },
    itens: [
      {
        id: 'item-3',
        tipoServico: 'espelho',
        descricao: 'Espelho Cristal Lapidado com Bisotê 25mm para Sala de Jantar',
        larguraCm: 180,
        alturaCm: 120,
        m2: 2.16,
        tipoVidro: 'espelho_bisotado',
        corVidro: 'incolor',
        corPerfil: 'preto',
        quantidade: 1,
        valorUnitario: 890,
        valorTotal: 890
      }
    ],
    valorItens: 890,
    valorMaoDeObra: 160,
    valorFrete: 50,
    valorDesconto: 0,
    valorTotal: 1100,
    condicoesPagamento: '50% entrada + saldo em 3x no cartão.',
    observacoes: 'Solicitado pelo cliente via link do site. Cliente aguarda envio da proposta oficial no WhatsApp.'
  },
  {
    id: 'orc-004',
    numeroProtocolo: 'OLI-2024-004',
    dataCriacao: new Date(Date.now() - 7 * 86400000).toISOString(),
    dataValidade: new Date(Date.now() - 1 * 86400000).toISOString(),
    status: 'concluido',
    prazoInstalacaoDias: 3,
    cliente: {
      nome: 'Dra. Juliana Mendes - Clínica Sorriso Austin',
      telefone: '(21) 96455-8899',
      whatsapp: '5521964558899',
      cpf: '445.667.889-22',
      endereco: 'Rua XV de Novembro, 280 - Sala 104',
      bairro: 'Austin',
      cidade: 'Nova Iguaçu',
      complemento: 'Em frente ao banco',
      cep: '26086-100'
    },
    itens: [
      {
        id: 'item-4',
        tipoServico: 'porta',
        descricao: 'Porta Pivotante em Vidro Temperado 10mm Incolor com Puxador Tubular Inox 60cm e Mola Hidráulica de Piso',
        larguraCm: 100,
        alturaCm: 215,
        m2: 2.15,
        tipoVidro: 'temperado_10mm',
        corVidro: 'incolor',
        corPerfil: 'inox',
        quantidade: 1,
        valorUnitario: 2100,
        valorTotal: 2100
      }
    ],
    valorItens: 2100,
    valorMaoDeObra: 250,
    valorFrete: 0,
    valorDesconto: 100,
    valorTotal: 2250,
    condicoesPagamento: 'Pago integralmente via Pix.',
    observacoes: 'Instalação concluída com sucesso. Mola regulada e teste de abertura suave.',
    assinaturaClienteAprovacao: {
      autorNome: 'Juliana Mendes',
      autorCpf: '445.667.889-22',
      tipo: 'cliente_aprovacao',
      dataHora: new Date(Date.now() - 6 * 86400000).toLocaleString('pt-BR'),
      dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><path d="M10 60 Q 60 20 120 70 T 250 30" stroke="%2310b981" stroke-width="3" fill="none"/></svg>'
    },
    entrega: {
      dataAgendada: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      dataConclusao: new Date(Date.now() - 3 * 86400000).toLocaleString('pt-BR'),
      instaladorNome: 'Roberto Silva (Equipe Olividros)',
      observacoesEntrega: 'Porta nivelada, silicone transparente de alta resistência aplicado nas frestas e mola conferida.',
      statusEntrega: 'instalado',
      assinaturaFuncionario: {
        autorNome: 'Roberto Silva - Olividros',
        tipo: 'funcionario_entrega',
        dataHora: new Date(Date.now() - 3 * 86400000).toLocaleString('pt-BR'),
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><path d="M15 40 Q 90 90 160 30 T 270 50" stroke="%2300d2b4" stroke-width="3" fill="none"/></svg>'
      },
      assinaturaClienteEntrega: {
        autorNome: 'Juliana Mendes',
        autorCpf: '445.667.889-22',
        tipo: 'cliente_entrega',
        dataHora: new Date(Date.now() - 3 * 86400000).toLocaleString('pt-BR'),
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><path d="M25 65 Q 70 15 130 65 T 260 35" stroke="%2310b981" stroke-width="3" fill="none"/></svg>'
      }
    }
  }
];

const TRANSACOES_INICIAIS: TransacaoFinanceira[] = [
  {
    id: 'trans-1',
    tipo: 'receita',
    descricao: 'Entrada 50% - Box Blindex (Carlos Eduardo)',
    categoria: 'servico_vidracaria',
    valor: 625,
    data: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    formaPagamento: 'pix',
    status: 'pago',
    orcamentoId: 'orc-001'
  },
  {
    id: 'trans-2',
    tipo: 'receita',
    descricao: 'Pagamento Integral Pix - Porta Pivotante Clínica Sorriso',
    categoria: 'servico_vidracaria',
    valor: 2250,
    data: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    formaPagamento: 'pix',
    status: 'pago',
    orcamentoId: 'orc-004'
  },
  {
    id: 'trans-3',
    tipo: 'despesa',
    descricao: 'Fornecedor Cebrace - Chapas Vidro Temperado 8mm e 10mm',
    categoria: 'vidro_temperado',
    valor: 1120,
    data: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    formaPagamento: 'pix',
    status: 'pago'
  },
  {
    id: 'trans-4',
    tipo: 'despesa',
    descricao: 'Distribuidora Alclean - Perfis de Alumínio e Kits de Box',
    categoria: 'kits_aluminio',
    valor: 480,
    data: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    formaPagamento: 'cartao_credito',
    status: 'pago'
  },
  {
    id: 'trans-5',
    tipo: 'despesa',
    descricao: 'Caixa de Silicone PU Neutro + Fita Dupla Face Estrutural',
    categoria: 'silicone_vedacao',
    valor: 165,
    data: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    formaPagamento: 'pix',
    status: 'pago'
  },
  {
    id: 'trans-6',
    tipo: 'despesa',
    descricao: 'Abastecimento Fiorino da Instalação - Rota Austin / NI',
    categoria: 'combustivel_frete',
    valor: 150,
    data: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    formaPagamento: 'cartao_debito',
    status: 'pago'
  }
];

const emitChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('olividros_storage_update'));
  }
};

export const storageService = {
  getOrcamentos(): Orcamento[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORCAMENTOS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORCAMENTOS, JSON.stringify(ORCAMENTOS_INICIAIS));
        return ORCAMENTOS_INICIAIS;
      }
      return JSON.parse(data);
    } catch {
      return ORCAMENTOS_INICIAIS;
    }
  },

  getOrcamentoById(id: string): Orcamento | undefined {
    const list = this.getOrcamentos();
    return list.find(o => o.id === id || o.numeroProtocolo === id);
  },

  saveOrcamento(orcamento: Orcamento): void {
    const list = this.getOrcamentos();
    const index = list.findIndex(o => o.id === orcamento.id);
    if (index >= 0) {
      list[index] = orcamento;
    } else {
      list.unshift(orcamento);
    }
    localStorage.setItem(STORAGE_KEYS.ORCAMENTOS, JSON.stringify(list));
    emitChange();
  },

  deleteOrcamento(id: string): void {
    const list = this.getOrcamentos().filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.ORCAMENTOS, JSON.stringify(list));
    emitChange();
  },

  getTransacoes(): TransacaoFinanceira[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACOES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TRANSACOES, JSON.stringify(TRANSACOES_INICIAIS));
        return TRANSACOES_INICIAIS;
      }
      return JSON.parse(data);
    } catch {
      return TRANSACOES_INICIAIS;
    }
  },

  saveTransacao(transacao: TransacaoFinanceira): void {
    const list = this.getTransacoes();
    const index = list.findIndex(t => t.id === transacao.id);
    if (index >= 0) {
      list[index] = transacao;
    } else {
      list.unshift(transacao);
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACOES, JSON.stringify(list));
    emitChange();
  },

  deleteTransacao(id: string): void {
    const list = this.getTransacoes().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACOES, JSON.stringify(list));
    emitChange();
  },

  getConfig(): DadosVidracaria {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DADOS_VIDRACARIA_PADRAO));
        return DADOS_VIDRACARIA_PADRAO;
      }
      return { ...DADOS_VIDRACARIA_PADRAO, ...JSON.parse(data) };
    } catch {
      return DADOS_VIDRACARIA_PADRAO;
    }
  },

  saveConfig(dados: Partial<DadosVidracaria>): void {
    const current = this.getConfig();
    const updated = { ...current, ...dados };
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    emitChange();
  },

  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener('olividros_storage_update', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('olividros_storage_update', handler);
      window.removeEventListener('storage', handler);
    };
  },

  exportarBackup(): string {
    const backup = {
      orcamentos: this.getOrcamentos(),
      transacoes: this.getTransacoes(),
      config: this.getConfig(),
      dataExportacao: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  importarBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.orcamentos && Array.isArray(parsed.orcamentos)) {
        localStorage.setItem(STORAGE_KEYS.ORCAMENTOS, JSON.stringify(parsed.orcamentos));
      }
      if (parsed.transacoes && Array.isArray(parsed.transacoes)) {
        localStorage.setItem(STORAGE_KEYS.TRANSACOES, JSON.stringify(parsed.transacoes));
      }
      if (parsed.config) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(parsed.config));
      }
      emitChange();
      return true;
    } catch (err) {
      console.error('Erro ao importar backup:', err);
      return false;
    }
  },

  restaurarPadroes(): void {
    localStorage.setItem(STORAGE_KEYS.ORCAMENTOS, JSON.stringify(ORCAMENTOS_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.TRANSACOES, JSON.stringify(TRANSACOES_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DADOS_VIDRACARIA_PADRAO));
    emitChange();
  }
};

export type OrcamentoStatus = 
  | 'solicitado'         // Cliente preencheu no link público
  | 'em_analise'         // ADM está calculando
  | 'enviado_cliente'    // ADM enviou link no WhatsApp
  | 'aprovado'           // Cliente aceitou e assinou digitalmente
  | 'em_producao'        // Vidro foi encomendado / cortado
  | 'aguardando_entrega' // Pronto para ir com o instalador
  | 'concluido'          // Instalado e assinado na entrega
  | 'cancelado';

export type TipoServico = 
  | 'box'
  | 'porta'
  | 'janela'
  | 'espelho'
  | 'guarda_corpo'
  | 'cortina_vidro'
  | 'tampo_mesa'
  | 'manutencao'
  | 'outro';

export type TipoVidro = 
  | 'temperado_8mm'
  | 'temperado_10mm'
  | 'comum_4mm'
  | 'comum_6mm'
  | 'laminado_8mm'
  | 'espelho_bisotado'
  | 'espelho_lapidado';

export type CorVidro = 
  | 'incolor'
  | 'fume'
  | 'verde'
  | 'bronze'
  | 'jateado'
  | 'antiope';

export type CorPerfil = 
  | 'branco'
  | 'preto'
  | 'fosco'
  | 'bronze'
  | 'dourado'
  | 'inox';

export interface Cliente {
  nome: string;
  telefone: string;
  whatsapp: string;
  cpf?: string;
  endereco: string;
  bairro: string;
  cidade: string;
  complemento?: string;
  cep?: string;
}

export interface ItemOrcamento {
  id: string;
  tipoServico: TipoServico;
  descricao: string;
  larguraCm: number;
  alturaCm: number;
  m2: number;
  tipoVidro: TipoVidro;
  corVidro: CorVidro;
  corPerfil: CorPerfil;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface AssinaturaDigital {
  autorNome: string;
  autorCpf?: string;
  tipo: 'cliente_aprovacao' | 'cliente_entrega' | 'funcionario_entrega';
  dataHora: string;
  dataUrl: string; // Base64 PNG
  ipInfo?: string;
}

export interface EntregaInstalacao {
  dataAgendada?: string;
  dataConclusao?: string;
  instaladorNome?: string;
  observacoesEntrega?: string;
  fotoInstalacao?: string;
  assinaturaFuncionario?: AssinaturaDigital;
  assinaturaClienteEntrega?: AssinaturaDigital;
  statusEntrega: 'pendente' | 'em_rota' | 'instalado';
}

export interface Orcamento {
  id: string;
  numeroProtocolo: string; // Ex: OLI-2024-001
  dataCriacao: string;
  dataValidade: string;
  cliente: Cliente;
  itens: ItemOrcamento[];
  valorItens: number;
  valorMaoDeObra: number;
  valorFrete: number;
  valorDesconto: number;
  valorTotal: number;
  condicoesPagamento: string;
  prazoInstalacaoDias: number;
  status: OrcamentoStatus;
  observacoes?: string;
  fotoLocal?: string;
  assinaturaClienteAprovacao?: AssinaturaDigital;
  entrega?: EntregaInstalacao;
}

export interface TransacaoFinanceira {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  categoria: 
    | 'servico_vidracaria'
    | 'vidro_temperado'
    | 'kits_aluminio'
    | 'ferragens'
    | 'silicone_vedacao'
    | 'combustivel_frete'
    | 'salarios_comissoes'
    | 'ferramentas'
    | 'outro';
  valor: number;
  data: string;
  formaPagamento: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'boleto';
  status: 'pago' | 'pendente';
  orcamentoId?: string;
  comprovante?: string;
}

export interface DadosVidracaria {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  whatsapp: string;
  telefone: string;
  instagram: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  pontoReferencia: string;
  email: string;
  chavePix: string;
}

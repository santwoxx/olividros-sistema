import { Orcamento, TransacaoFinanceira, DadosVidracaria } from '../types';

const STORAGE_KEYS = {
  ORCAMENTOS: 'olividros_orcamentos_prod_v1',
  TRANSACOES: 'olividros_transacoes_prod_v1',
  CONFIG: 'olividros_config_prod_v1',
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

// Produção: Lista limpa e pronta para uso real
const ORCAMENTOS_INICIAIS: Orcamento[] = [];
const TRANSACOES_INICIAIS: TransacaoFinanceira[] = [];

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

  limparDados(): void {
    localStorage.setItem(STORAGE_KEYS.ORCAMENTOS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TRANSACOES, JSON.stringify([]));
    emitChange();
  }
};

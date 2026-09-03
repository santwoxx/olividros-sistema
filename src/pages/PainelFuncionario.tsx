import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  PenTool, 
  Camera, 
  ShieldCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Orcamento, AssinaturaDigital } from '../types';
import { storageService } from '../services/storage';
import { SignaturePad } from '../components/SignaturePad';

interface PainelFuncionarioProps {
  orcamentos: Orcamento[];
  onNavigate: (tab: string, orcamentoId?: string) => void;
}

export const PainelFuncionario: React.FC<PainelFuncionarioProps> = ({
  orcamentos,
  onNavigate
}) => {
  // Filtra pedidos em fase de instalação ou entrega
  const ordens = orcamentos.filter(o => 
    o.status === 'aprovado' || 
    o.status === 'em_producao' || 
    o.status === 'aguardando_entrega' || 
    o.status === 'concluido'
  );

  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [stepAssinatura, setStepAssinatura] = useState<'nenhum' | 'funcionario' | 'cliente'>('nenhum');
  const [nomeInstalador, setNomeInstalador] = useState('Marcos Silva (Instalador Olividros)');
  const [nomeClienteRecebedor, setNomeClienteRecebedor] = useState('');
  const [tempAssinaturaFuncionario, setTempAssinaturaFuncionario] = useState<AssinaturaDigital | null>(null);
  const [checklist, setChecklist] = useState({
    vidroSemAvarias: true,
    roldanasReguladas: true,
    siliconeAplicado: true,
    areaLimpa: true
  });

  const handleOpenFinalizar = (orc: Orcamento) => {
    setSelectedOrcamento(orc);
    setNomeClienteRecebedor(orc.cliente.nome);
    setTempAssinaturaFuncionario(orc.entrega?.assinaturaFuncionario || null);
    setStepAssinatura('funcionario');
  };

  const handleSaveAssinaturaFuncionario = (dataUrl: string) => {
    const assinatura: AssinaturaDigital = {
      autorNome: nomeInstalador,
      tipo: 'funcionario_entrega',
      dataHora: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
      dataUrl
    };
    setTempAssinaturaFuncionario(assinatura);
    // Avança para a assinatura do cliente na mesma tela
    setStepAssinatura('cliente');
  };

  const handleSaveAssinaturaCliente = (dataUrl: string) => {
    if (!selectedOrcamento || !tempAssinaturaFuncionario) return;

    const assinaturaCli: AssinaturaDigital = {
      autorNome: nomeClienteRecebedor || selectedOrcamento.cliente.nome,
      tipo: 'cliente_entrega',
      dataHora: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
      dataUrl
    };

    const updated: Orcamento = {
      ...selectedOrcamento,
      status: 'concluido',
      entrega: {
        dataAgendada: selectedOrcamento.entrega?.dataAgendada || new Date().toISOString().split('T')[0],
        dataConclusao: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR'),
        instaladorNome: nomeInstalador,
        statusEntrega: 'instalado',
        observacoesEntrega: 'Instalação finalizada em perfeito estado de conformidade com teste de abertura e vedação.',
        assinaturaFuncionario: tempAssinaturaFuncionario,
        assinaturaClienteEntrega: assinaturaCli
      }
    };

    storageService.saveOrcamento(updated);
    setSelectedOrcamento(null);
    setStepAssinatura('nenhum');

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    alert('Instalação e Entrega Concluídas com Sucesso! As assinaturas foram carimbadas e o painel administrativo foi atualizado.');
  };

  const openMaps = (endereco: string, bairro: string, cidade: string) => {
    const query = encodeURIComponent(`${endereco}, ${bairro}, ${cidade}, RJ`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Banner de Topo - Equipe de Campo */}
      <div className="glass-panel glass-panel-glow" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #0284c7 0%, #00d2b4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04121a' }}>
            <Truck size={26} />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d2b4', display: 'inline-block' }}></span>
              Módulo Mobile de Instalação & Entregas
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Equipe de Campo Olividros</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Rotas no Maps, checklist de conferência e protocolo de <strong>Assinatura Digital Dupla</strong> (Instalador + Cliente)
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Ordens de Instalação */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {ordens.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Clock size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>Nenhuma instalação na rota no momento</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Os orçamentos aprovados aparecerão automaticamente aqui.</p>
          </div>
        ) : (
          ordens.map(orc => {
            const isFinished = orc.status === 'concluido';

            return (
              <div 
                key={orc.id} 
                className="glass-panel" 
                style={{ 
                  borderLeft: isFinished ? '4px solid #10b981' : '4px solid #00d2b4',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                      OS #{orc.numeroProtocolo}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginTop: '0.2rem' }}>
                      {orc.cliente.nome}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <MapPin size={15} color="var(--primary)" />
                      <span>{orc.cliente.endereco}, {orc.cliente.bairro} - {orc.cliente.cidade}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {isFinished ? (
                      <span className="status-pill status-concluido">
                        <CheckCircle2 size={13} /> Concluído & Assinado
                      </span>
                    ) : (
                      <span className="status-pill status-em_producao">
                        Em Rota / Para Instalar
                      </span>
                    )}
                  </div>
                </div>

                {/* Itens para Instalação */}
                <div style={{ background: 'rgba(8, 18, 27, 0.7)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Vidros a serem instalados:
                  </div>
                  {orc.itens.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.88rem', color: '#ffffff', padding: '0.25rem 0' }}>
                      • <strong>{item.descricao}</strong> ({item.larguraCm}x{item.alturaCm}cm) - Vidro {item.corVidro} / Perfil {item.corPerfil}
                    </div>
                  ))}
                </div>

                {/* Se já foi finalizado, exibe as duas assinaturas carimbadas */}
                {isFinished && orc.entrega?.assinaturaFuncionario && orc.entrega?.assinaturaClienteEntrega && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', background: 'rgba(16, 185, 129, 0.08)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: '0.35rem' }}>
                        ✓ Assinatura do Instalador:
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                        {orc.entrega.assinaturaFuncionario.autorNome}
                      </div>
                      <div style={{ background: '#050c12', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(0, 210, 180, 0.2)' }}>
                        <img src={orc.entrega.assinaturaFuncionario.dataUrl} alt="Assinatura Instalador" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginBottom: '0.35rem' }}>
                        ✓ Assinatura do Cliente no Recebimento:
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                        {orc.entrega.assinaturaClienteEntrega.autorNome}
                      </div>
                      <div style={{ background: '#050c12', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <img src={orc.entrega.assinaturaClienteEntrega.dataUrl} alt="Assinatura Cliente" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Botões de Ação na Rua / Celular */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Abrir Rota no GPS */}
                    <button
                      type="button"
                      onClick={() => openMaps(orc.cliente.endereco, orc.cliente.bairro, orc.cliente.cidade)}
                      className="btn btn-secondary btn-sm"
                      title="Abrir GPS no Google Maps"
                    >
                      <Navigation size={15} color="var(--primary)" />
                      Rota no Maps
                    </button>

                    {/* Ligar / WhatsApp */}
                    <a
                      href={`tel:${orc.cliente.telefone || orc.cliente.whatsapp}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <Phone size={15} />
                      Ligar
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!isFinished ? (
                      <button
                        type="button"
                        onClick={() => handleOpenFinalizar(orc)}
                        className="btn btn-primary btn-sm"
                        style={{ boxShadow: '0 0 15px rgba(0, 210, 180, 0.35)' }}
                      >
                        <PenTool size={16} />
                        Coletar Assinaturas de Entrega
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onNavigate('nota', orc.id)}
                        className="btn btn-outline btn-sm"
                      >
                        Ver Nota de Entrega
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL / TELA DE ASSINATURA DUPLA DE ENTREGA */}
      {selectedOrcamento && stepAssinatura !== 'nenhum' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>
                  Finalização de Instalação • OS #{selectedOrcamento.numeroProtocolo}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Cliente: {selectedOrcamento.cliente.nome} ({selectedOrcamento.cliente.bairro})
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => { setSelectedOrcamento(null); setStepAssinatura('nenhum'); }}
                className="btn-icon-close" 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Checklist de Qualidade da Vidraçaria */}
              <div style={{ background: 'rgba(8, 18, 27, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Checklist de Qualidade Olividros:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                    <input type="checkbox" checked={checklist.vidroSemAvarias} onChange={e => setChecklist({ ...checklist, vidroSemAvarias: e.target.checked })} />
                    Vidro sem trincas ou riscos
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                    <input type="checkbox" checked={checklist.roldanasReguladas} onChange={e => setChecklist({ ...checklist, roldanasReguladas: e.target.checked })} />
                    Roldanas/Puxadores regulados
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                    <input type="checkbox" checked={checklist.siliconeAplicado} onChange={e => setChecklist({ ...checklist, siliconeAplicado: e.target.checked })} />
                    Silicone de vedação aplicado
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
                    <input type="checkbox" checked={checklist.areaLimpa} onChange={e => setChecklist({ ...checklist, areaLimpa: e.target.checked })} />
                    Local limpo e aspirado
                  </label>
                </div>
              </div>

              {stepAssinatura === 'funcionario' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.75rem', fontWeight: 700 }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', color: '#04121a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                    PASSO 1 DE 2: Assinatura do Instalador Olividros
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nome do Instalador Responsável</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nomeInstalador}
                      onChange={e => setNomeInstalador(e.target.value)}
                    />
                  </div>

                  <SignaturePad
                    titulo="Assinatura do Instalador"
                    subtitulo="Assine atestando a instalação correta e conformidade técnica dos vidros"
                    autorNome={nomeInstalador}
                    onSave={handleSaveAssinaturaFuncionario}
                    onCancel={() => setStepAssinatura('nenhum')}
                  />
                </div>
              )}

              {stepAssinatura === 'cliente' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '0.75rem', fontWeight: 700 }}>
                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#10b981', color: '#04121a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                    PASSO 2 DE 2: Assinatura do Cliente no Recebimento
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nome de Quem Está Recebendo na Residência</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nomeClienteRecebedor}
                      onChange={e => setNomeClienteRecebedor(e.target.value)}
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Entregue o celular ao cliente para que ele assine com o dedo confirmando o recebimento em perfeito estado:
                  </p>

                  <SignaturePad
                    titulo="Termo de Recebimento do Cliente"
                    subtitulo="Recebi o produto instalado e testado em perfeito estado"
                    autorNome={nomeClienteRecebedor}
                    onSave={handleSaveAssinaturaCliente}
                    onCancel={() => setStepAssinatura('funcionario')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

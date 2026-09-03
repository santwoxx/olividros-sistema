import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  PenTool, 
  FileSpreadsheet
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
  const ordens = orcamentos.filter(o => 
    o.status === 'aprovado' || 
    o.status === 'em_producao' || 
    o.status === 'aguardando_entrega' || 
    o.status === 'concluido'
  );

  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);
  const [stepAssinatura, setStepAssinatura] = useState<'nenhum' | 'funcionario' | 'cliente'>('nenhum');
  const [nomeInstalador, setNomeInstalador] = useState('Instalador Olividros');
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
        observacoesEntrega: 'Instalação concluída com teste de conformidade.',
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

    alert('Instalação concluída com sucesso! As assinaturas foram registradas no sistema.');
  };

  const openMaps = (endereco: string, bairro: string, cidade: string) => {
    const query = encodeURIComponent(`${endereco}, ${bairro}, ${cidade}, RJ`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #0284c7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#0f172a' }}>Equipe de Instalação & Entregas</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Rotas no Maps, checklist de instalação e protocolo de <strong>Assinatura Digital Dupla</strong> (Instalador + Cliente)
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Ordens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ordens.length === 0 ? (
          <div className="empty-state">
            <FileSpreadsheet size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3>Nenhuma instalação agendada</h3>
            <p>Assim que um orçamento for aprovado pelo cliente, ele aparecerá aqui com o endereço e rota para instalação.</p>
          </div>
        ) : (
          ordens.map(orc => {
            const isFinished = orc.status === 'concluido';

            return (
              <div 
                key={orc.id} 
                className="glass-panel" 
                style={{ 
                  borderLeft: isFinished ? '4px solid #16a34a' : '4px solid #0284c7',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16a34a' }}>
                      OS #{orc.numeroProtocolo}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginTop: '0.15rem' }}>
                      {orc.cliente.nome}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                      <MapPin size={14} color="#16a34a" />
                      <span>{orc.cliente.endereco}, {orc.cliente.bairro} - {orc.cliente.cidade}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {isFinished ? (
                      <span className="status-pill status-concluido">
                        <CheckCircle2 size={12} /> Concluído
                      </span>
                    ) : (
                      <span className="status-pill status-em_producao">
                        Em Rota / Instalação
                      </span>
                    )}
                  </div>
                </div>

                {/* Itens */}
                <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.85rem', marginBottom: '0.85rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Vidros a serem instalados:
                  </div>
                  {orc.itens.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', color: '#0f172a', padding: '0.15rem 0' }}>
                      • <strong>{item.descricao}</strong> ({item.larguraCm}x{item.alturaCm}cm) - Vidro {item.corVidro} / Perfil {item.corPerfil}
                    </div>
                  ))}
                </div>

                {/* Assinaturas se concluído */}
                {isFinished && orc.entrega?.assinaturaFuncionario && orc.entrega?.assinaturaClienteEntrega && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', background: '#f0fdf4', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', marginBottom: '0.85rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, marginBottom: '0.25rem' }}>
                        ✓ Assinatura do Instalador:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                        {orc.entrega.assinaturaFuncionario.autorNome}
                      </div>
                      <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <img src={orc.entrega.assinaturaFuncionario.dataUrl} alt="Assinatura Instalador" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, marginBottom: '0.25rem' }}>
                        ✓ Assinatura do Cliente no Recebimento:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                        {orc.entrega.assinaturaClienteEntrega.autorNome}
                      </div>
                      <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <img src={orc.entrega.assinaturaClienteEntrega.dataUrl} alt="Assinatura Cliente" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => openMaps(orc.cliente.endereco, orc.cliente.bairro, orc.cliente.cidade)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Navigation size={14} color="#0284c7" />
                      Rota no Maps
                    </button>

                    <a
                      href={`tel:${orc.cliente.telefone || orc.cliente.whatsapp}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <Phone size={14} />
                      Ligar
                    </a>
                  </div>

                  <div>
                    {!isFinished ? (
                      <button
                        type="button"
                        onClick={() => handleOpenFinalizar(orc)}
                        className="btn btn-primary btn-sm"
                      >
                        <PenTool size={15} />
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

      {/* MODAL DE ASSINATURA DUPLA */}
      {selectedOrcamento && stepAssinatura !== 'nenhum' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ color: '#0f172a', fontSize: '1.15rem' }}>
                  Finalização de Instalação • OS #{selectedOrcamento.numeroProtocolo}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  Cliente: {selectedOrcamento.cliente.nome} ({selectedOrcamento.cliente.bairro})
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => { setSelectedOrcamento(null); setStepAssinatura('nenhum'); }}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Checklist */}
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Checklist de Qualidade Olividros:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.82rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input type="checkbox" checked={checklist.vidroSemAvarias} onChange={e => setChecklist({ ...checklist, vidroSemAvarias: e.target.checked })} />
                    Vidro sem trincas ou riscos
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input type="checkbox" checked={checklist.roldanasReguladas} onChange={e => setChecklist({ ...checklist, roldanasReguladas: e.target.checked })} />
                    Roldanas reguladas
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input type="checkbox" checked={checklist.siliconeAplicado} onChange={e => setChecklist({ ...checklist, siliconeAplicado: e.target.checked })} />
                    Silicone de vedação
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input type="checkbox" checked={checklist.areaLimpa} onChange={e => setChecklist({ ...checklist, areaLimpa: e.target.checked })} />
                    Local limpo
                  </label>
                </div>
              </div>

              {stepAssinatura === 'funcionario' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', marginBottom: '0.65rem', fontWeight: 700, fontSize: '0.88rem' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
                    PASSO 1 DE 2: Assinatura do Instalador Olividros
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nome do Instalador</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nomeInstalador}
                      onChange={e => setNomeInstalador(e.target.value)}
                    />
                  </div>

                  <SignaturePad
                    titulo="Assinatura do Instalador"
                    subtitulo="Assine atestando a instalação correta e conformidade técnica"
                    autorNome={nomeInstalador}
                    onSave={handleSaveAssinaturaFuncionario}
                    onCancel={() => setStepAssinatura('nenhum')}
                  />
                </div>
              )}

              {stepAssinatura === 'cliente' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', marginBottom: '0.65rem', fontWeight: 700, fontSize: '0.88rem' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
                    PASSO 2 DE 2: Assinatura do Cliente no Recebimento
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nome de Quem Está Recebendo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nomeClienteRecebedor}
                      onChange={e => setNomeClienteRecebedor(e.target.value)}
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                    Entregue o celular ao cliente para que ele assine confirmando o recebimento:
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

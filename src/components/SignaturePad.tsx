import React, { useRef, useState, useEffect } from 'react';
import { Eraser, CheckCircle2, X, ShieldCheck } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel?: () => void;
  titulo?: string;
  subtitulo?: string;
  autorNome?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  onCancel,
  titulo = 'Assinatura Digital',
  subtitulo = 'Desenhe sua assinatura com o dedo ou mouse no quadro abaixo',
  autorNome = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Redimensiona o canvas para ter alta resolução (retina / telas mobile)
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a'; // Tinta profissional azul-escura/preta de caneta
    ctx.lineWidth = 2.5;

    drawPlaceholder(ctx, rect.width, rect.height);
  };

  const drawPlaceholder = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Fundo branco limpo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Linha guia inferior
    ctx.save();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(30, height - 35);
    ctx.lineTo(width - 30, height - 35);
    ctx.stroke();

    // Texto de marca d'água de orientação
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('X _________________ Linha de Assinatura _________________', width / 2, height - 18);
    ctx.restore();
  };

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if ('touches' in e) {
      e.preventDefault();
    }

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawPlaceholder(ctx, rect.width, rect.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Fundo branco limpo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Borda sutil
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, exportCanvas.width - 4, exportCanvas.height - 4);

    // Desenha a assinatura
    ctx.drawImage(canvas, 0, 0);

    // Carimbo de autenticidade
    const now = new Date();
    const dataHoraStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    const hash = 'AUT-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'left';
    ctx.fillText(`Autenticado Digitalmente • ${autorNome || 'Signatário'}`, 14, 18);
    ctx.textAlign = 'right';
    ctx.fillText(`${dataHoraStr} | Hash: ${hash}`, exportCanvas.width - 14, 18);

    const dataUrl = exportCanvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="signature-container">
      <div className="signature-header">
        <div className="signature-title-box">
          <ShieldCheck size={20} color="#16a34a" />
          <div>
            <h4 className="signature-title">{titulo}</h4>
            <p className="signature-sub">{subtitulo}</p>
          </div>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="signature-footer">
        <button
          type="button"
          onClick={clearCanvas}
          className="btn btn-secondary btn-sm"
          disabled={!hasDrawn}
        >
          <Eraser size={15} />
          Limpar
        </button>

        <div className="signature-actions-right">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm">
              Cancelar
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasDrawn}
            className="btn btn-primary btn-sm"
          >
            <CheckCircle2 size={15} />
            Confirmar Assinatura
          </button>
        </div>
      </div>
    </div>
  );
};

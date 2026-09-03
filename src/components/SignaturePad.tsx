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
    ctx.strokeStyle = '#00d2b4'; // Tom neon cyan característico da Olividros
    ctx.lineWidth = 2.5;

    // Fundo transparente com guia sutil
    drawPlaceholder(ctx, rect.width, rect.height);
  };

  const drawPlaceholder = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Linha guia inferior
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(30, height - 40);
    ctx.lineTo(width - 30, height - 40);
    ctx.stroke();

    // Texto de marca d'água de orientação
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('X _________________ Linha de Assinatura _________________', width / 2, height - 20);
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
      e.preventDefault(); // Previne rolar a tela enquanto assina no celular
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

    // Criamos um canvas temporário com fundo escuro e carimbo oficial com data/hora e hash de autenticidade
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Fundo elegante escuro
    ctx.fillStyle = '#0a141d';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Borda suave
    ctx.strokeStyle = '#00d2b4';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, exportCanvas.width - 8, exportCanvas.height - 8);

    // Desenha a assinatura
    ctx.drawImage(canvas, 0, 0);

    // Carimbo de autenticidade
    const now = new Date();
    const dataHoraStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    const hash = 'AUT-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(`Autenticado Digitalmente • ${autorNome || 'Signatário'}`, 14, 20);
    ctx.textAlign = 'right';
    ctx.fillText(`${dataHoraStr} | Hash: ${hash}`, exportCanvas.width - 14, 20);

    const dataUrl = exportCanvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="signature-container">
      <div className="signature-header">
        <div className="signature-title-box">
          <ShieldCheck className="icon-teal" size={22} />
          <div>
            <h4 className="signature-title">{titulo}</h4>
            <p className="signature-sub">{subtitulo}</p>
          </div>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-icon-close" title="Fechar">
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
          <Eraser size={16} />
          Limpar
        </button>

        <div className="signature-actions-right">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-outline btn-sm">
              Cancelar
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasDrawn}
            className="btn btn-primary btn-sm"
          >
            <CheckCircle2 size={16} />
            Confirmar Assinatura
          </button>
        </div>
      </div>
    </div>
  );
};

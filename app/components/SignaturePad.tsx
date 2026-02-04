'use client';

import { useRef, useEffect, useState } from 'react';
import SignaturePad from 'signature_pad';

interface SignaturePadComponentProps {
  onSave: (signature: string) => void;
  onClear?: () => void;
}

export default function SignaturePadComponent({ onSave, onClear }: SignaturePadComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      
      // Set canvas size
      const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d')?.scale(ratio, ratio);
        
        // Redraw signature if it exists
        if (signaturePad && !signaturePad.isEmpty()) {
          const data = signaturePad.toData();
          signaturePad.fromData(data);
        }
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // Initialize signature pad
      const pad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
        minWidth: 1,
        maxWidth: 2.5,
      });
      
      // Listen for signature changes
      pad.addEventListener('endStroke', () => {
        setIsEmpty(pad.isEmpty());
      });
      
      setSignaturePad(pad);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        pad.off();
      };
    }
  }, []);

  const handleClear = () => {
    if (signaturePad) {
      signaturePad.clear();
      setIsEmpty(true);
      if (onClear) onClear();
    }
  };

  const handleSave = () => {
    if (signaturePad && !signaturePad.isEmpty()) {
      const dataURL = signaturePad.toDataURL('image/png');
      onSave(dataURL);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none"
          style={{ height: '200px' }}
        />
      </div>
      
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={handleClear}
          disabled={isEmpty}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isEmpty
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600'
          }`}
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isEmpty}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isEmpty
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
          }`}
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}

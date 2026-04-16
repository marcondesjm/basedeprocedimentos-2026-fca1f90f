import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PreparacaoFerramentaCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`p-4 border-l-4 border-l-amber-500 ${isOpen ? 'col-span-full' : 'hover:shadow-md cursor-pointer'}`}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)}>
          <h3 className="font-semibold">Preparação da Ferramenta</h3>
          <p className="text-xs text-muted-foreground mt-1">Preparação do pendrive para baixa de master</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Preparação da Ferramenta</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
            <p>📄 Documentação: <strong>Preparação do Pendrive para Baixa de Master</strong></p>
            <p>🎬 Passo a passo em vídeo: <strong>Preparando Pendrive - Boot_Correios.mp4</strong></p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="text-blue-800">💡 Se tiver espaço, leve uma ISO do <strong>Hirens Boot</strong> em <code className="font-mono text-xs">\ISOS</code>.</p>
          </div>
        </div>
      )}
    </Card>
  );
}

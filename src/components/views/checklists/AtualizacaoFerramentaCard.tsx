import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AtualizacaoFerramentaCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`p-4 border-l-4 border-l-amber-500 ${isOpen ? 'col-span-full' : 'hover:shadow-md cursor-pointer'}`}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)}>
          <h3 className="font-semibold">Atualização da Ferramenta</h3>
          <p className="text-xs text-muted-foreground mt-1">Estrutura e atualização do pendrive de deploy</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Atualização da Ferramenta</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
            <p className="font-semibold text-primary mb-2">Estrutura de Diretórios do Pendrive</p>
            <div className="font-mono text-xs space-y-0.5 bg-background p-3 rounded border">
              <p>📁 <strong>\Deploy_Win7</strong></p>
              <p>📁 <strong>\DeployPendrive</strong></p>
              <p className="ml-4">📁 \Operating Systems</p>
              <p>📁 <strong>\ISOS</strong></p>
            </div>
          </div>
          <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-sm text-red-800 font-semibold">⚠️ Atenção</p>
            <p className="text-sm text-red-700">Os diretórios <code className="font-mono text-xs">\ISOS_ECT</code>, <code className="font-mono text-xs">\ventoy</code> e <code className="font-mono text-xs">\TEMP</code> <strong>NÃO</strong> devem ser modificados.</p>
          </div>
        </div>
      )}
    </Card>
  );
}

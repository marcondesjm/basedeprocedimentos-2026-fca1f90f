import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EspansoCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`p-4 border-l-4 border-l-amber-500 ${isOpen ? 'col-span-full' : 'hover:shadow-md cursor-pointer'}`}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)}>
          <h3 className="font-semibold">Ferramenta - Espanso</h3>
          <p className="text-xs text-muted-foreground mt-1">Expansor de texto para produtividade</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Ferramenta - Espanso</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2">
            <p><strong>Espanso</strong> é um expansor de texto gratuito e de código aberto.</p>
            <p>Permite substituir abreviações por textos mais longos automaticamente.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-amber-700 border-b border-amber-200 pb-1">Como Instalar e Configurar</h4>
            <ol className="text-sm space-y-1.5 list-decimal list-inside">
              <li>Acesse <a href="https://espanso.org/install/" target="_blank" rel="noopener noreferrer" className="text-primary underline">espanso.org/install</a> e baixe a versão <strong>portable</strong></li>
              <li>Descompacte no disco <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">C:\</code></li>
              <li>Execute <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">START_ESPANSO.bat</code></li>
              <li>Marque para iniciar com o sistema</li>
              <li>Cole os arquivos <strong>.yml</strong> em <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">C:\espanso-portable\.espanso\match</code></li>
            </ol>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-semibold text-amber-800">📁 Arquivos de configuração</p>
            <p className="text-sm text-amber-700">Obtenha os arquivos <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs">.yml</code> com a Supervisão ou Ticket Manager.</p>
          </div>
        </div>
      )}
    </Card>
  );
}

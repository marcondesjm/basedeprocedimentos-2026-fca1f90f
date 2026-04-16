import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function BaseConhecimentoCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`p-4 border-l-4 border-l-blue-500 ${isOpen ? 'col-span-full' : 'hover:shadow-md cursor-pointer'}`}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)}>
          <h3 className="font-semibold">Base de Conhecimento</h3>
          <p className="text-xs text-muted-foreground mt-1">POPs e Informações Operacionais</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Base de Conhecimento</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-blue-700 border-b border-blue-200 pb-1">Procedimentos Operacionais Padrão - POP</h4>
            <p className="text-sm text-muted-foreground">Consulte a Supervisão ou Ticket Manager para acesso aos POPs atualizados.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-blue-700 border-b border-blue-200 pb-1">Informações Operacionais</h4>
            <p className="text-sm text-muted-foreground">Consulte a Supervisão ou Ticket Manager para informações atualizadas.</p>
          </div>
        </div>
      )}
    </Card>
  );
}

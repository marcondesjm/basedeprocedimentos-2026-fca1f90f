import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MilestoneCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`p-4 border-l-4 border-l-primary ${isOpen ? 'col-span-full' : 'hover:shadow-md cursor-pointer'}`}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)}>
          <h3 className="font-semibold">Procedimento Milestone</h3>
          <p className="text-xs text-muted-foreground mt-1">Impressora Milestone não funciona no Suporte Fácil</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Procedimento Milestone</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-800">Problema:</p>
            <p className="text-sm text-red-700">Impressora Milestone não funciona no Suporte Fácil – apitando.</p>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { title: "1. Preparação inicial", content: "Rode o script _basicoMicro para ajustar as rotinas de acesso remoto." },
              { title: "2. Remover dispositivos ocultos", content: "Gerenciador de Dispositivos → Mostrar dispositivos ocultos. Remova os dispositivos apagados referentes à Milestone." },
              { title: "3. Reiniciar o computador", content: "Após remover os dispositivos, reinicie o computador." },
              { title: "4. Ajustar periféricos no Suporte Fácil", content: "Suporte Fácil → Atendimento → Ajustes dos Periféricos. Deixe a Milestone desligada." },
              { title: "5. Reinstalar impressora", content: "Refaça a instalação usando o Suporte Fácil pela Instalação de Impressoras Térmicas." },
            ].map((step) => (
              <div key={step.title} className="p-3 bg-muted/50 rounded-lg">
                <p className="font-semibold text-primary">{step.title}</p>
                <p>{step.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

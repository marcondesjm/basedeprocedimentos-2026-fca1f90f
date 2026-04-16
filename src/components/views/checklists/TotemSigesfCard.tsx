import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TotemSigesfCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`p-4 border-l-4 border-l-blue-500 ${isOpen ? 'col-span-full' : 'hover:shadow-md cursor-pointer'}`}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)}>
          <h3 className="font-semibold">Para Atualizar o Totem SIGESF</h3>
          <p className="text-xs text-muted-foreground mt-1">Procedimento de atualização do SIGESF nos totens</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Para Atualizar o Totem SIGESF</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="font-medium">Caminho do atualizador:</p>
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs block mt-1">\\sac3144\Deploy\Applications\SIGESF_12_2016_V1</code>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-blue-700 border-b border-blue-200 pb-1">Procedimento Padrão</h4>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Copie <code className="font-mono text-xs">SetupSIGESFUpdateSilent.exe</code> de um deploy atualizado</li>
              <li>Execute: <code className="font-mono text-xs">taskkill -f -im javaw*</code></li>
              <li>Execute o atualizador <strong>como administrador</strong></li>
              <li>Micro será <strong>reiniciado automaticamente</strong></li>
            </ol>
          </div>
          <div className="p-3 bg-red-50 border border-red-300 rounded-lg space-y-2">
            <p className="text-sm text-red-800 font-semibold">⚠️ Atenção</p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>Afeta a operação – execute com autorização, fora do expediente</li>
              <li>Faça backup de <code className="font-mono text-xs">\sigesf\media</code> e <code className="font-mono text-xs">\sigesf\database</code></li>
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}

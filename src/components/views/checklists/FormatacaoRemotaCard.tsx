import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FormatacaoRemotaCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`p-4 border-l-4 border-l-primary ${isOpen ? 'col-span-full' : 'hover:shadow-md cursor-pointer'}`}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)}>
          <h3 className="font-semibold">Formatação Remota</h3>
          <p className="text-xs text-muted-foreground mt-1">Requisitos e procedimentos para formatação remota</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Formatação Remota</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-primary border-b pb-1">Verificar Requisitos</h4>
            <ul className="text-sm space-y-1.5 list-disc list-inside">
              <li>Micro em rede e acessível remotamente?</li>
              <li>Micro possui o recovery?</li>
              <li>Recovery acessível remotamente?</li>
              <li>Qual a versão do recovery?</li>
            </ul>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
              <p className="font-semibold text-amber-800 text-sm">Se Recovery 8 ou anterior</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-amber-900">
                <li>Só é possível formatar com <strong>deploy antigo</strong></li>
                <li>Verifique pasta <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs">\operating systems</code></li>
              </ul>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
              <p className="font-semibold text-blue-800 text-sm">Se Recovery 9 ou superior</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-blue-900">
                <li>Deploy de <strong>qualquer SE</strong> atualizado</li>
              </ul>
            </div>
          </div>
          <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-sm text-red-800 font-semibold">⚠️ Atenção</p>
            <p className="text-sm text-red-700">Deploy incompatível pode causar falha na formatação.</p>
          </div>
        </div>
      )}
    </Card>
  );
}

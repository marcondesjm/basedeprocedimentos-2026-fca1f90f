import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function AnaliseProblemasCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [analiseChecks, setAnaliseChecks] = useLocalStorage<Record<string, boolean>>("checklists-analise", {});

  const ChecklistItem = ({ itemKey, label }: { itemKey: string; label: string }) => (
    <label className="flex items-start gap-2 text-sm cursor-pointer hover:bg-muted/50 p-1.5 rounded">
      <Checkbox 
        checked={analiseChecks[itemKey] || false} 
        onCheckedChange={(checked) => setAnaliseChecks(prev => ({ ...prev, [itemKey]: !!checked }))} 
        className="mt-0.5" 
      />
      <span className={analiseChecks[itemKey] ? 'line-through text-muted-foreground' : ''}>{label}</span>
    </label>
  );

  return (
    <Card className={`p-4 border-l-4 border-l-primary ${isOpen ? 'col-span-full' : 'hover:shadow-md cursor-pointer'}`}>
      {!isOpen ? (
        <div onClick={() => setIsOpen(true)}>
          <h3 className="font-semibold">Análise de Problemas de Rede/Internet</h3>
          <p className="text-xs text-muted-foreground mt-1">Confirmar padrão e identificar escopo do problema</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Análise de Problemas de Rede/Internet</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
          </div>
          <p className="text-sm text-muted-foreground"><strong>Objetivo:</strong> Confirmar se o micro está no padrão e identificar o escopo do problema.</p>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-primary border-b pb-1">Camada Física e Transporte</h4>
            <ChecklistItem itemKey="cabo_rede" label="O cabo de rede apresenta rompimento ou danos?" />
            <ChecklistItem itemKey="continuidade_ponto" label="Teste a continuidade e sinal do ponto de rede e porta de rede" />
            <ChecklistItem itemKey="leds_porta" label="Os LEDs da porta de rede estão acesos quando o cabo está conectado?" />
            <ChecklistItem itemKey="ip_configurado" label="O IP está configurado corretamente?" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-primary border-b pb-1">Padrão de Configuração</h4>
            <ChecklistItem itemKey="acesso_vnc" label="Acesso VNC (verificar se o micro está acessível remotamente)" />
            <ChecklistItem itemKey="rede_dominio" label="Rede e domínio (verificar conflito de IP e domínio correiosnet.int)" />
            <ChecklistItem itemKey="proxy_sistema" label="Proxy do sistema" />
            <ChecklistItem itemKey="acesso_correios" label="Acesso a internet - sites Correios" />
            <ChecklistItem itemKey="acesso_terceiros" label="Acesso a internet - sites terceiros" />
            <ChecklistItem itemKey="acesso_intranet" label="Acesso a intranet - sites internos Correios" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-amber-600 border-b border-amber-200 pb-1">Avançado (caso o problema persista)</h4>
            <ChecklistItem itemKey="limpeza_cache" label="Limpeza de cache dos navegadores" />
            <ChecklistItem itemKey="teste_navegadores" label="Teste de acesso nos 3 navegadores (Edge, Chrome e Firefox)" />
            <ChecklistItem itemKey="limpeza_temp" label="Limpeza de arquivos temporários do sistema" />
            <ChecklistItem itemKey="reboot" label="Reboot do micro" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-blue-600 border-b border-blue-200 pb-1">Escopo</h4>
            <ChecklistItem itemKey="outro_perfil" label="Funciona em outro perfil?" />
            <ChecklistItem itemKey="outro_micro" label="O usuário acessa normalmente em outro micro?" />
            <ChecklistItem itemKey="outros_usuarios" label="Outros usuários estão com o mesmo problema?" />
            <ChecklistItem itemKey="site_especifico" label="É um site específico ou são vários?" />
          </div>
          <Button variant="outline" size="sm" onClick={() => setAnaliseChecks({})}>Limpar</Button>
        </div>
      )}
    </Card>
  );
}

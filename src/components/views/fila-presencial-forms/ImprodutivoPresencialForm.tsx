import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormActions } from "../fila-remota-forms/FormActions";

export function ImprodutivoPresencialForm() {
  const generatedNote = `IMPRODUTIVO\n\nEste chamado necessita de realização de contato telefônico com o usuário para confirmação dos dados do chamado.\n\nFoi realizada tentativa de contato telefônico, assim como foi encaminhado e-mail notificando que um técnico desta empresa se deslocou para atendimento da demanda presencial. Ao chegar na unidade, o usuário ou algum outro colaborador indicado não se encontrava presente ou não tinha disponibilidade para o atendimento.\n\nDesta forma, este chamado será fechado como improdutivo, e sua reabertura será considerada indevida.\n\nCaso ainda necessite do suporte técnico, solicitamos que registre um novo chamado.`;

  return (
    <div className="mt-3 space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full border-red-300 text-red-700 hover:bg-red-50">
            <AlertCircle className="w-4 h-4 mr-2" />Orientações
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="start">
          <div className="space-y-3">
            <h4 className="font-semibold text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Orientações</h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground list-disc list-inside">
              <li>Realize tentativa de contato e atendimento remoto previamente</li>
              <li><strong>O envio do e-mail é obrigatório</strong></li>
              <li>A conclusão sem e-mails gera bloqueio</li>
              <li>Em caso de dúvidas acione a <strong>Supervisão</strong> ou <strong>Ticket Manager</strong></li>
            </ul>
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-center text-sm">
              <p className="font-bold">!! Atenção !!</p>
              <p>Modo de execução: <strong>presencial</strong></p>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <FormActions 
        noteText={generatedNote} 
        onReset={() => {}} 
        copyMessage="Nota de Improdutivo - Presencial copiada!"
        buttonClass="bg-red-600 hover:bg-red-700" 
      />
    </div>
  );
}

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormActions } from "./FormActions";

export function ImprodutivoRemotoForm() {
  const generatedNote = `IMPRODUTIVO\n\nEste chamado necessita de realização de contato direto com o usuário para autorização de procedimentos.\n\nForam realizadas 3 tentativas de contato sem sucesso no intervalo de 40 minutos a 1 hora entre elas.\n\nEste chamado será fechado como improdutivo, e sua reabertura será considerada indevida.\n\nCaso ainda necessite do suporte técnico, solicitamos que registre um novo chamado.`;

  return (
    <div className="mt-3 space-y-3">
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
              <li>Realize a tentativa de contato e tentativa de atendimento remoto previamente</li>
              <li>O envio do e-mail da tentativa de contato é <strong>obrigatório</strong></li>
              <li>Utilizar o modelo de e-mail específico do PO – Improdutivo Remoto</li>
              <li><strong>Atenção !</strong> A conclusão sem o envio prévio dos e-mails gera bloqueio</li>
              <li>Em "Motivo do Status", use apenas <strong>"Utilização de procedimentos"</strong></li>
              <li>Em caso de dúvidas acione a Supervisão ou Ticket Manager</li>
            </ul>
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-center text-sm">
              <p className="font-bold">!! Atenção !!</p>
              <p>Notificar usuário com a solução realizada: <strong>SIM</strong></p>
              <p>Modo de execução: <strong>Remoto</strong></p>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <FormActions 
        noteText={generatedNote} 
        onReset={() => {}} 
        copyMessage="Nota de Improdutivo copiada!"
        buttonClass="bg-red-600 hover:bg-red-700" 
      />
    </div>
  );
}

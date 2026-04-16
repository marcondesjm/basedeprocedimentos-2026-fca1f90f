import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormActions } from "../fila-remota-forms/FormActions";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ImprodutivoOutrasPresencialForm() {
  const [nome, setNome, resetNome] = useLocalStorage("presencial-improdutivo-outras-nome", "");
  const [justificativa, setJustificativa, resetJustificativa] = useLocalStorage("presencial-improdutivo-outras-justificativa", "");

  const handleReset = () => {
    resetNome();
    resetJustificativa();
  };

  const generatedNote = `IMPRODUTIVO\n\nConforme verificado com Usuário ${nome || '___________'}, Não foi possível realizar o atendimento devido:\n\n${justificativa || '<< JUSTIFICATIVA >>'}\n\nFoi indicado outro colaborador para acompanhar o atendimento? SIM ( x )    NÃO ( x ) (Não se aplica)\n\nDesta forma, este chamado será fechado como improdutivo, e sua reabertura será considerada indevida.\n\nCaso ainda necessite do suporte técnico, solicitamos que registre um novo chamado.`;

  return (
    <div className="mt-3 space-y-2">
      <Input placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)} className="text-sm h-8" />
      <Input placeholder="Justificativa" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} className="text-sm h-8" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full border-red-300 text-red-700 hover:bg-red-50 mt-2">
            <AlertCircle className="w-4 h-4 mr-2" />Orientações
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="start">
          <div className="space-y-3">
            <h4 className="font-semibold text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Orientações</h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground list-disc list-inside">
              <li>Na Justificativa informe o motivo</li>
              <li>Nesta situação <strong>não é necessário</strong> enviar e-mails</li>
              <li>Em caso de dúvidas acione a <strong>Supervisão</strong></li>
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
        onReset={handleReset} 
        copyMessage="Nota de Improdutivo - Outras Situações (Presencial) copiada!"
        buttonClass="bg-red-600 hover:bg-red-700" 
      />
    </div>
  );
}

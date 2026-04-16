import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormActions } from "../fila-remota-forms/FormActions";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function DiagnosticoGenericoForm() {
  const [setor, setSetor, resetSetor] = useLocalStorage("presencial-diag-gen-setor", "");
  const [nome, setNome, resetNome] = useLocalStorage("presencial-diag-gen-nome", "");
  const [pib, setPib, resetPib] = useLocalStorage("presencial-diag-gen-pib", "");
  const [pibMicro, setPibMicro, resetPibMicro] = useLocalStorage("presencial-diag-gen-pib-micro", "");

  const handleReset = () => {
    resetSetor();
    resetNome();
    setPib('');
    setPibMicro('');
  };

  const generatedNote = `FAVOR DIRECIONAR AO SETOR ${setor || '__________'}\n\n==================\n\nPIB do equipamento: ${pib || ''}\n\nPIB Micro: ${pibMicro || ''}\n\n==================\n\nEM CONTATO COM O USUÁRIO ${nome || '_________________'}, FORAM REALIZADOS OS PROCEDIMENTOS DE:\n\n- PROCEDIMENTO 1\n- PROCEDIMENTO 2\n- PROCEDIMENTO 3\n\nAPÓS PROCEDIMENTOS FOI VERIFICADO QUE:\n\n< JUSTIFICATIVA >\n\nPossui procedimento no BC-Suporte? ( X ) SIM ( X ) Não\nSe sim, Nome do arquivo:_____________________\n\nATENCIOSAMENTE,\nSUPORTE TÉCNICO HEPTA`;

  return (
    <div className="mt-3 space-y-2">
      <Input placeholder="Setor direcionado" value={setor} onChange={(e) => setSetor(e.target.value)} className="text-sm h-8" />
      <Input placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)} className="text-sm h-8" />
      <Input placeholder="PIB do equipamento" value={pib} onChange={(e) => setPib(e.target.value)} className="text-sm h-8" />
      <Input placeholder="PIB Micro" value={pibMicro} onChange={(e) => setPibMicro(e.target.value)} className="text-sm h-8" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 mt-2">
            <AlertCircle className="w-4 h-4 mr-2" />Orientações
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="center">
          <div className="space-y-3">
            <h4 className="font-semibold text-amber-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Orientações</h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground list-disc list-inside">
              <li>Detalhe procedimentos e testes, anexe prints</li>
              <li><strong>Mais detalhes &gt;&gt; Bloqueado:</strong> (Sim)</li>
              <li>Ajuste a categorização operacional</li>
            </ul>
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-center text-sm">
              <p className="font-bold">marque "DIAGNÓSTICO"</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <FormActions 
        noteText={generatedNote} 
        onReset={handleReset} 
        copyMessage="Nota de Diagnóstico - Genérico copiada!" 
        buttonClass="bg-amber-600 hover:bg-amber-700"
      />
    </div>
  );
}

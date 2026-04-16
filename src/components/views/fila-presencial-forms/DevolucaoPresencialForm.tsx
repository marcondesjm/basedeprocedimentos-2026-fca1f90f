import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormActions } from "../fila-remota-forms/FormActions";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function DevolucaoPresencialForm() {
  const [pib, setPib, resetPib] = useLocalStorage("presencial-devolucao-pib", "");
  const [ip, setIp, resetIp] = useLocalStorage("presencial-devolucao-ip", "");
  const [pibMicro, setPibMicro, resetPibMicro] = useLocalStorage("presencial-devolucao-pib-micro", "");

  const handleReset = () => {
    resetPib();
    resetIp();
    resetPibMicro();
  };

  const generatedNote = `FAVOR DIRECIONAR A FILA REMOTA\n\nATENDIMENTO CONCLUIDO REMOTAMENTE\n\n===================\n\nPIB do equipamento: ${pib || ''}\n\nPIB Micro: ${pibMicro || ''}\n\nIP: ${ip || ''}\n\n===================\n\nFORAM REALIZADOS OS PROCEDIMENTOS DE:\n\n- PROCEDIMENTO_1\n- PROCEDIMENTO_2\n- PROCEDIMENTO_3\n\nAPÓS PROCEDIMENTOS FORAM REALIZADOS TESTES DE:\n\n- TESTE 1\n- TESTE 2\n- TESTE 3\n\nQUE CONFIRMARAM A SOLUÇÃO DO PROBLEMA.\n\nATENCIOSAMENTE,\nSUPORTE TÉCNICO HEPTA`;

  return (
    <div className="mt-3 space-y-2">
      <Input placeholder="PIB do equipamento" value={pib} onChange={(e) => setPib(e.target.value)} className="text-sm h-8" />
      <Input placeholder="IP do equipamento" value={ip} onChange={(e) => setIp(e.target.value)} className="text-sm h-8" />
      <Input placeholder="PIB Micro" value={pibMicro} onChange={(e) => setPibMicro(e.target.value)} className="text-sm h-8" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 mt-2">
            <AlertCircle className="w-4 h-4 mr-2" />Orientações
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="start">
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Orientações</h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground list-disc list-inside">
              <li>Caso resolvido remotamente, verifique o SLA</li>
              <li>Devolva apenas se menos de 10h de SLA</li>
              <li><strong>Mais detalhes &gt;&gt; Bloqueado:</strong> (Sim)</li>
            </ul>
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-center text-sm">
              <p className="font-bold">marque "Informações Gerais"</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <FormActions 
        noteText={generatedNote} 
        onReset={handleReset} 
        copyMessage="Nota de Devolução - Presencial copiada!"
        buttonClass="bg-blue-600 hover:bg-blue-700" 
      />
    </div>
  );
}

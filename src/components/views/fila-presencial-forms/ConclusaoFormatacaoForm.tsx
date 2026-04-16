import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormActions } from "../fila-remota-forms/FormActions";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ConclusaoFormatacaoForm() {
  const [data, setData, resetData] = useLocalStorage("presencial-formatacao-data", "");
  const [nome, setNome, resetNome] = useLocalStorage("presencial-formatacao-nome", "");
  const [pib, setPib, resetPib] = useLocalStorage("presencial-formatacao-pib", "");
  const [ip, setIp, resetIp] = useLocalStorage("presencial-formatacao-ip", "");
  const [pibMicro, setPibMicro, resetPibMicro] = useLocalStorage("presencial-formatacao-pib-micro", "");

  const handleReset = () => {
    resetData();
    resetNome();
    resetPib();
    resetIp();
    resetPibMicro();
  };

  const generatedNote = `PROCEDIMENTOS REALIZADOS DURANTE VISITA TÉCNICA NO DIA ${data || '__/__/202X'}\n\nUSUÁRIO: ${nome || '________'}\n\n===================\n\nPIB do equipamento: ${pib || ''}\n\nPIB Micro: ${pibMicro || ''}\n\nIP: ${ip || ''}\n\n===================\n\nDemais periféricos configurados\n\n===================\n\nPIB PINPAD: (Não se aplica)\n\nPIB IMPRESSORA CUPOM: (Não se aplica)\n\nPIB/IP IMPRESSORA REDE: (Não se aplica)\n\nPIB IMPRESSORA ETIQUETA: (Não se aplica)\n\n==================\n\nFORAM REALIZADOS OS PROCEDIMENTOS DE:\n\n- PROCEDIMENTO_1\n- PROCEDIMENTO_2\n- PROCEDIMENTO_3\n\nAPÓS PROCEDIMENTOS FORAM REALIZADOS TESTES, QUE CONFIRMARAM A SOLUÇÃO DO PROBLEMA\n\nATENCIOSAMENTE,\nSUPORTE TÉCNICO HEPTA`;

  return (
    <div className="mt-3 space-y-2">
      <Input placeholder="Data da visita (ex: 27/02/2026)" value={data} onChange={(e) => setData(e.target.value)} className="text-sm h-8" />
      <Input placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)} className="text-sm h-8" />
      <Input placeholder="PIB do equipamento" value={pib} onChange={(e) => setPib(e.target.value)} className="text-sm h-8" />
      <Input placeholder="IP do equipamento" value={ip} onChange={(e) => setIp(e.target.value)} className="text-sm h-8" />
      <Input placeholder="PIB Micro" value={pibMicro} onChange={(e) => setPibMicro(e.target.value)} className="text-sm h-8" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full border-primary/50 text-primary hover:bg-primary/10 mt-2">
            <AlertCircle className="w-4 h-4 mr-2" />Orientações
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="center">
          <div className="space-y-3">
            <h4 className="font-semibold text-primary flex items-center gap-2"><AlertCircle className="w-4 h-4" />Orientações</h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground list-disc list-inside">
              <li>Chamados de Formatação <strong>abrangem a configuração de periféricos</strong></li>
              <li><strong>Atenção!</strong> Softwares proprietário devem ser tratados em chamado separado</li>
              <li>Detalhe todos os procedimentos e testes realizados</li>
              <li>Em <strong>"Motivo do Status"</strong>, use apenas <strong>"Utilização de procedimentos"</strong></li>
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
        onReset={handleReset} 
        copyMessage="Nota de Conclusão - Formatação copiada!" 
      />
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, X } from "lucide-react";
import { FormActions } from "../fila-remota-forms/FormActions";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ConclusaoImpressoraPresencialForm() {
  const [data, setData, resetData] = useLocalStorage("presencial-imp-data", "");
  const [nome, setNome, resetNome] = useLocalStorage("presencial-imp-nome", "");
  const [pibImps, setPibImps, resetPibImps] = useLocalStorage<string[]>("presencial-imp-pib-imps", [""]);
  const [ipImps, setIpImps, resetIpImps] = useLocalStorage<string[]>("presencial-imp-ip-imps", [""]);
  const [setor, setSetor, resetSetor] = useLocalStorage("presencial-imp-setor", "");
  const [pibMicros, setPibMicros, resetPibMicros] = useLocalStorage<string[]>("presencial-imp-pib-micros", [""]);

  const handleReset = () => {
    resetData();
    resetNome();
    resetPibImps();
    resetIpImps();
    resetSetor();
    resetPibMicros();
  };

  const pibImpsFiltered = pibImps.filter(p => p.trim());
  const ipImpsFiltered = ipImps.filter(p => p.trim());
  const pibMicrosFiltered = pibMicros.filter(p => p.trim());

  const generatedNote = `PROCEDIMENTOS REALIZADOS DURANTE VISITA TÉCNICA NO DIA ${data || '__/__/202X'}\n\nUSUÁRIO: ${nome || '________'}\n\n=========================\n\nÉ A PRIMEIRA INSTALAÇÃO DESTA IMPRESSORA NO SETOR? SIM ( x )    NÃO ( x )\n\nPIB Impressora: ${pibImpsFiltered.join(', ')}\n\nPIB Micro: ${pibMicrosFiltered.join(', ')}\n\nIP Impressora: ${ipImpsFiltered.join(', ')}\n\n========================\n\nFORAM REALIZADOS OS PROCEDIMENTOS DE:\n\n- PROCEDIMENTO_1\n- PROCEDIMENTO_2\n- PROCEDIMENTO_3\n\nAPÓS PROCEDIMENTOS FORAM REALIZADOS TESTES (CONEXÃO E IMPRESSÃO), QUE CONFIRMARAM A SOLUÇÃO DO PROBLEMA.\n\n================\n\nMicros indicados configurados no Setor ${setor || '________'}\n\n================\n\nPIB do equipamento:\nPIB do equipamento:\nPIB do equipamento:\nPIB do equipamento:\n\n================\n\nATENCIOSAMENTE,\nSUPORTE TÉCNICO HEPTA`;

  return (
    <div className="mt-3 space-y-2">
      <Input placeholder="Data da visita" value={data} onChange={(e) => setData(e.target.value)} className="text-sm h-8" />
      <Input placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)} className="text-sm h-8" />
      
      {pibImps.map((pibVal, idx) => (
        <div key={idx} className="flex gap-1 items-center">
          <Input placeholder={`PIB Impressora ${pibImps.length > 1 ? idx + 1 : ''}`} value={pibVal} onChange={(e) => { const u = [...pibImps]; u[idx] = e.target.value; setPibImps(u); }} className="text-sm h-8" />
          {idx === pibImps.length - 1 && <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setPibImps([...pibImps, ""])}><Plus className="w-4 h-4" /></Button>}
          {pibImps.length > 1 && <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-destructive" onClick={() => setPibImps(pibImps.filter((_, i) => i !== idx))}><X className="w-3 h-3" /></Button>}
        </div>
      ))}
      
      {ipImps.map((ipVal, idx) => (
        <div key={idx} className="flex gap-1 items-center">
          <Input placeholder={`IP Impressora ${ipImps.length > 1 ? idx + 1 : ''}`} value={ipVal} onChange={(e) => { const u = [...ipImps]; u[idx] = e.target.value; setIpImps(u); }} className="text-sm h-8" />
          {idx === ipImps.length - 1 && <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setIpImps([...ipImps, ""])}><Plus className="w-4 h-4" /></Button>}
          {ipImps.length > 1 && <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-destructive" onClick={() => setIpImps(ipImps.filter((_, i) => i !== idx))}><X className="w-3 h-3" /></Button>}
        </div>
      ))}
      
      <Input placeholder="Setor" value={setor} onChange={(e) => setSetor(e.target.value)} className="text-sm h-8" />
      
      {pibMicros.map((pibVal, idx) => (
        <div key={idx} className="flex gap-1 items-center">
          <Input placeholder={`PIB Micro ${pibMicros.length > 1 ? idx + 1 : ''}`} value={pibVal} onChange={(e) => { const u = [...pibMicros]; u[idx] = e.target.value; setPibMicros(u); }} className="text-sm h-8" />
          {idx === pibMicros.length - 1 && <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setPibMicros([...pibMicros, ""])}><Plus className="w-4 h-4" /></Button>}
          {pibMicros.length > 1 && <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-destructive" onClick={() => setPibMicros(pibMicros.filter((_, i) => i !== idx))}><X className="w-3 h-3" /></Button>}
        </div>
      ))}
      
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
              <li>Para atendimento <strong>PRESENCIAL</strong>, um único chamado abrange instalação e configuração no setor</li>
              <li>Abrir tarefa no OTRS para cada micro configurado</li>
              <li>É <strong>OBRIGATÓRIO A REALIZAÇÃO DO TESTE DE IMPRESSÃO</strong></li>
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
        copyMessage="Nota de Conclusão - Impressora Presencial copiada!" 
      />
    </div>
  );
}

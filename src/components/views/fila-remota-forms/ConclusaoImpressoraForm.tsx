import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, X } from "lucide-react";
import { FormActions } from "./FormActions";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ConclusaoImpressoraForm() {
  const [nome, setNome, resetNome] = useLocalStorage("remoto-impressora-nome", "");
  const [pibImps, setPibImps, resetPibImps] = useLocalStorage<string[]>("remoto-impressora-pib-imps", [""]);
  const [ipImps, setIpImps, resetIpImps] = useLocalStorage<string[]>("remoto-impressora-ip-imps", [""]);
  const [pibMicros, setPibMicros, resetPibMicros] = useLocalStorage<string[]>("remoto-impressora-pib-micros", [""]);

  const handleReset = () => {
    resetNome();
    resetPibImps();
    resetIpImps();
    resetPibMicros();
  };

  const pibImpsFiltered = pibImps.filter(p => p.trim());
  const pibImpText = pibImpsFiltered.length > 0 ? pibImpsFiltered.join(', ') : '';
  const ipImpsFiltered = ipImps.filter(p => p.trim());
  const ipImpText = ipImpsFiltered.length > 0 ? ipImpsFiltered.join(', ') : '';
  const pibMicrosFiltered = pibMicros.filter(p => p.trim());
  const pibMicroText = pibMicrosFiltered.length > 0 ? pibMicrosFiltered.join(', ') : '';

  const generatedNote = `EM CONTATO COM O USUÁRIO, ${nome || '________'} FOI VERIFICADO QUE:\n\n=========================\n\nA IMPRESSORA JÁ ESTÁ CONFIGURADA EM REDE? SIM ( x )    NÃO ( x )\n\nPIB Impressora: ${pibImpText}\n\nIP Impressora: ${ipImpText}\n\nPIB Micro: ${pibMicroText}\n\n========================\n\nFOI REALIZADO OS PROCEDIMENTOS DE:\n\n- PROCEDIMENTO_1\n- PROCEDIMENTO_2\n- PROCEDIMENTO_3\n\nAPÓS PROCEDIMENTOS, EM CONTATO COM O USUARIO ${nome || '________'} FORAM REALIZADOS TESTES DE CONEXÃO E IMPRESSÃO, QUE CONFIRMARAM A SOLUÇÃO DO PROBLEMA.\n\nATENCIOSAMENTE,\nSUPORTE TÉCNICO HEPTA`;

  return (
    <div className="mt-3 space-y-2">
      <Input placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)} className="text-sm h-8" />
      
      {pibImps.map((pibVal, idx) => (
        <div key={idx} className="flex gap-1 items-center">
          <Input placeholder={`PIB Impressora ${pibImps.length > 1 ? idx + 1 : ''}`} value={pibVal} onChange={(e) => { const u = [...pibImps]; u[idx] = e.target.value; setPibImps(u); }} className="text-sm h-8" />
          {idx === pibImps.length - 1 && <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setPibImps([...pibImps, ""])}><Plus className="w-4 h-4" /></Button>}
          {pibImps.length > 1 && <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-destructive hover:text-destructive" onClick={() => setPibImps(pibImps.filter((_, i) => i !== idx))}><X className="w-3 h-3" /></Button>}
        </div>
      ))}
      
      {ipImps.map((ipVal, idx) => (
        <div key={idx} className="flex gap-1 items-center">
          <Input placeholder={`IP Impressora ${ipImps.length > 1 ? idx + 1 : ''}`} value={ipVal} onChange={(e) => { const u = [...ipImps]; u[idx] = e.target.value; setIpImps(u); }} className="text-sm h-8" />
          {idx === ipImps.length - 1 && <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setIpImps([...ipImps, ""])}><Plus className="w-4 h-4" /></Button>}
          {ipImps.length > 1 && <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-destructive hover:text-destructive" onClick={() => setIpImps(ipImps.filter((_, i) => i !== idx))}><X className="w-3 h-3" /></Button>}
        </div>
      ))}
      
      {pibMicros.map((pibVal, idx) => (
        <div key={idx} className="flex gap-1 items-center">
          <Input placeholder={`PIB Micro ${pibMicros.length > 1 ? idx + 1 : ''}`} value={pibVal} onChange={(e) => { const u = [...pibMicros]; u[idx] = e.target.value; setPibMicros(u); }} className="text-sm h-8" />
          {idx === pibMicros.length - 1 && <Button type="button" variant="outline" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => setPibMicros([...pibMicros, ""])}><Plus className="w-4 h-4" /></Button>}
          {pibMicros.length > 1 && <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0 text-destructive hover:text-destructive" onClick={() => setPibMicros(pibMicros.filter((_, i) => i !== idx))}><X className="w-3 h-3" /></Button>}
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
              <li>Para o atendimento <strong>REMOTO</strong>, um único chamado abrange a instalação do equipamento NOVO e a configuração de todos os micros <strong>NO SETOR</strong></li>
              <li>Abrir tarefa no OTRS para cada micro configurado</li>
              <li>Detalhe todos os procedimentos e testes realizados</li>
              <li>Anexe quaisquer print/foto em nota normal, <strong>ANTES</strong> de salvar a conclusão</li>
              <li>Em <strong>"Motivo do Status"</strong>, use apenas <strong>"Utilização de procedimentos"</strong></li>
              <li>Registre todas as PIB dos micros configurados <strong>NO SETOR</strong></li>
              <li>É <strong>OBRIGATÓRIO A REALIZAÇÃO DO TESTE DE IMPRESSÃO</strong></li>
              <li>Ao capturar o chamado, ajuste a categorização em <strong>"Categorização"</strong> &gt;&gt; <strong>"Categorização Operacional"</strong></li>
              <li>Em caso de dúvidas acione a <strong>Supervisão</strong> ou <strong>Ticket Manager</strong></li>
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
        onReset={handleReset} 
        copyMessage="Nota de Conclusão - Impressora copiada!" 
      />
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { FormActions } from "../fila-remota-forms/FormActions";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function DiagnosticoSigesfForm() {
  const [direcionar, setDirecionar, resetDirecionar] = useLocalStorage("presencial-sigesf-direcionar", "");
  const [data, setData, resetData] = useLocalStorage("presencial-sigesf-data", "");
  const [nome, setNome, resetNome] = useLocalStorage("presencial-sigesf-nome", "");
  const [modelo, setModelo, resetModelo] = useLocalStorage("presencial-sigesf-modelo", "");
  const [pib, setPib, resetPib] = useLocalStorage("presencial-sigesf-pib", "");
  const [ip, setIp, resetIp] = useLocalStorage("presencial-sigesf-ip", "");
  const [pibMicro, setPibMicro, resetPibMicro] = useLocalStorage("presencial-sigesf-pib-micro", "");

  const handleReset = () => {
    resetDirecionar();
    resetData();
    resetNome();
    resetModelo();
    resetPib();
    resetIp();
    resetPibMicro();
  };

  const generatedNote = `FAVOR DIRECIONAR A ${direcionar || '________'}\n\nDIAGNÓSTICO PRESENCIAL\n\nPIB Micro: ${pibMicro || ''}\n\nPROCEDIMENTOS REALIZADOS DURANTE VISITA TÉCNICA NO DIA ${data || '__/__/202X'}\n\nUSUÁRIO: ${nome || '________'}\n\nFOI REALIZADO OS PROCEDIMENTOS DE:\n\nVerificação de Hardware\n\nCabos de energia Funcionais? SIM ( x )    NÃO ( x )\nO modelo é um Totem ou MiniPC? ( x )Totem ou ( x )MiniPC\nEstabilizador\\nobreak Funcionando? SIM ( x )    NÃO ( x )\nFonte Ligando? SIM ( x )    NÃO ( x )\nPlaca mãe funcionando? SIM ( x )    NÃO ( x )\nVentoinhas funcionais? SIM ( x )    NÃO ( x )\nPossui placa de vídeo? SIM ( x )    NÃO ( x )\nse não, Entrada HDMI funcional na placa mãe? SIM ( x )    NÃO ( x )\nImpressora externa? SIM ( x )    NÃO ( x )\nse sim, modelo da impressora externa: __________\nPainel (TV) liga? SIM ( x )    NÃO ( x )\nUsa adaptador HDMI ou cabo HDMI completo? Adaptador ( x ) Cabo Direto ( x )\nMonitor TouchScreen funcional? SIM ( x )    NÃO ( x )\nEntradas USB funcionais? SIM ( x )    NÃO ( x )\nTeste de integridade no cabo e ponto de rede normal? SIM ( x )    NÃO ( x )\n\nVerificação de software\n\nBoot normal? __________\nWindows 7 ou 10? __________\nAutologon normal?__________\nSigesf Atualizado? __________\nEmissor e Painel na configuração padrão?__________\nEmissor apresenta erro ou falha?__________\nPainel apresenta erro ou falha?__________\nImpressora genérica SIGESF configurada e funcionando?__________\nConfiguração do Emissor para impressora interna ou externa (SIGESF ou EscPos) realizado?__________\nImpressora Externa na porta COM2 ?__________\n\nScripts executados\n\nSigesf_Ajusta_Variaveis ?_________\nSigesfAjustes (somente caso autologon não funcione)_________\n\nAPÓS PROCEDIMENTOS FOI VERIFICADO QUE:\n\n< JUSTIFICATIVA >\n\n===================\nEquipamento indicado pelo Usuário\n===================\n\nMODELO: ${modelo || ''}\nPIB do equipamento: ${pib || ''}\nIP: ${ip || ''}\n\n===================\n\nATENCIOSAMENTE,\nSUPORTE TÉCNICO HEPTA`;

  return (
    <div className="mt-3 space-y-2">
      <Input placeholder="Direcionar a..." value={direcionar} onChange={(e) => setDirecionar(e.target.value)} className="text-sm h-8" />
      <Input placeholder="Data da visita" value={data} onChange={(e) => setData(e.target.value)} className="text-sm h-8" />
      <Input placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)} className="text-sm h-8" />
      <Input placeholder="Modelo do equipamento" value={modelo} onChange={(e) => setModelo(e.target.value)} className="text-sm h-8" />
      <Input placeholder="PIB do equipamento" value={pib} onChange={(e) => setPib(e.target.value)} className="text-sm h-8" />
      <Input placeholder="IP do equipamento" value={ip} onChange={(e) => setIp(e.target.value)} className="text-sm h-8" />
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
        copyMessage="Nota de Diagnóstico - Sigesf copiada!"
        buttonClass="bg-amber-600 hover:bg-amber-700" 
      />
    </div>
  );
}

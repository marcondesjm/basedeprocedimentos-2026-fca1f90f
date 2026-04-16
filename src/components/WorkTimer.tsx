import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Clock, Plus } from "lucide-react";
import { useWorkTimer } from "@/hooks/useWorkTimer";
import { TimerCard } from "./timer/TimerCard";

export const WorkTimer = () => {
  const {
    workOrders,
    newWO,
    setNewWO,
    addWorkOrder,
    removeWorkOrder,
    completeWorkOrder,
    toggleTimer,
    silenceAlarm,
    addNotaReset,
    getElapsed,
    getTimeRemaining,
    getProgress,
    formatTime,
  } = useWorkTimer();

  const downloadImage = (imageData: string, woNumber: string, imageIndex: number) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `WO_${woNumber}_imagem_${imageIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagem baixada!");
  };

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-base md:text-lg">Timer de Ordens de Serviço</h3>
        </div>

        {/* Adicionar nova WO */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-w-0">
              <span className="pl-3 text-xs sm:text-sm font-semibold text-muted-foreground select-none whitespace-nowrap">WO00000</span>
              <input
                placeholder="00000"
                value={newWO}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "" && /[^0-9]/.test(val.slice(-1))) {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.value = 400;
                    osc.type = "square";
                    gain.gain.setValueAtTime(0.2, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.3);
                    toast.error("⚠️ Apenas números são permitidos!", {
                      description: "O campo de WO aceita somente números. Letras e caracteres especiais não são válidos.",
                      duration: 4000,
                    });
                    return;
                  }
                  setNewWO(val.replace(/\D/g, '').replace(/^0+/, ''));
                }}
                onKeyDown={(e) => e.key === "Enter" && addWorkOrder()}
                inputMode="numeric"
                pattern="[0-9]*"
                className="flex-1 h-10 bg-transparent px-2 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-w-0"
              />
            </div>
            <Button onClick={addWorkOrder} className="w-full sm:w-auto shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Lista de WOs */}
        {workOrders.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-muted-foreground">
            <Clock className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">Nenhuma ordem de serviço adicionada</p>
            <p className="text-xs mt-1">Adicione WOs para iniciar a contagem</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {workOrders.map((wo) => (
              <TimerCard
                key={wo.id}
                wo={wo}
                removeWorkOrder={removeWorkOrder}
                completeWorkOrder={completeWorkOrder}
                toggleTimer={toggleTimer}
                silenceAlarm={silenceAlarm}
                addNotaReset={addNotaReset}
                getElapsed={getElapsed}
                getTimeRemaining={getTimeRemaining}
                getProgress={getProgress}
                formatTime={formatTime}
                downloadImage={downloadImage}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

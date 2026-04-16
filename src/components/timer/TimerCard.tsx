import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trash2, CheckCircle, Play, RotateCcw, AlertCircle } from "lucide-react";
import { WorkOrder } from "@/hooks/useWorkTimer";

interface TimerCardProps {
  wo: WorkOrder;
  removeWorkOrder: (id: string) => void;
  completeWorkOrder: (id: string) => void;
  toggleTimer: (id: string) => void;
  silenceAlarm: (id: string) => void;
  addNotaReset: (id: string) => void;
  getElapsed: (wo: WorkOrder) => number;
  getTimeRemaining: (wo: WorkOrder) => number;
  getProgress: (wo: WorkOrder) => number;
  formatTime: (seconds: number) => string;
  downloadImage: (imageData: string, woNumber: string, imageIndex: number) => void;
}

export function TimerCard({
  wo,
  removeWorkOrder,
  completeWorkOrder,
  toggleTimer,
  silenceAlarm,
  addNotaReset,
  getElapsed,
  getTimeRemaining,
  getProgress,
  formatTime,
  downloadImage
}: TimerCardProps) {
  const timeRemaining = getTimeRemaining(wo);
  
  return (
    <Card className="p-3 md:p-4 bg-background/50">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Badge variant={wo.hasFinished ? "destructive" : wo.isRunning ? "default" : "secondary"} className="text-[10px] break-all whitespace-normal leading-tight">
              WO00000{wo.number}
            </Badge>
            {wo.hasFinished && (
              <CheckCircle className="w-4 h-4 text-destructive shrink-0" />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => removeWorkOrder(wo.id)}
          >
            <Trash2 className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="text-center">
          <div
            className={`text-2xl md:text-3xl font-bold tabular-nums ${
              wo.hasFinished
                ? "text-destructive animate-pulse"
                : timeRemaining <= 300
                ? "text-orange-500"
                : "text-primary"
            }`}
          >
            {formatTime(getElapsed(wo))}
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {wo.hasFinished
              ? "⏰ Insira uma nota no Remedy!"
              : timeRemaining <= 300
              ? "⚠️ Últimos 5 minutos!"
              : wo.isRunning
              ? "Em andamento"
              : "Pausado"}
          </p>
        </div>

        <Progress value={getProgress(wo)} className="h-2" />

        {/* Histórico de notas */}
        {wo.noteEntries.length > 0 && (
          <div className="space-y-1 p-2 bg-muted/50 rounded-md border border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Notas adicionadas</p>
            {wo.noteEntries.map((note, idx) => (
              <div key={idx} className="flex justify-between text-xs text-foreground">
                <span className="text-muted-foreground">Nota {idx + 1}</span>
                <span className="font-mono font-medium">{formatTime(note.elapsedAtNote)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-1 mt-1 flex justify-between text-xs font-bold text-primary">
              <span>Tempo total</span>
              <span className="font-mono">{formatTime(Math.floor((Date.now() - wo.createdAt) / 1000))}</span>
            </div>
          </div>
        )}
        
        {wo.images && wo.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {wo.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`WO ${wo.number} - Imagem ${idx + 1}`}
                className="w-full h-16 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => downloadImage(img, wo.number, idx)}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {wo.hasFinished ? (
            <>
              <Button
                onClick={() => silenceAlarm(wo.id)}
                className="w-full h-9 text-xs md:text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/40 animate-pulse"
              >
                <AlertCircle className="w-4 h-4 mr-1 shrink-0" />
                Silenciar
              </Button>
              <Button
                onClick={() => completeWorkOrder(wo.id)}
                className="w-full h-9 text-xs md:text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/40"
              >
                <CheckCircle className="w-4 h-4 mr-1 shrink-0" />
                Salvar
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              {!wo.isRunning ? (
                <Button
                  onClick={() => toggleTimer(wo.id)}
                  className="flex-1 h-9 text-sm font-bold shadow-md bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/40"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Iniciar
                </Button>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    onClick={() => addNotaReset(wo.id)}
                    className="w-full h-9 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/40"
                  >
                    <RotateCcw className="w-4 h-4 mr-1 shrink-0" />
                    ADD Nota
                  </Button>
                  <Button
                    onClick={() => completeWorkOrder(wo.id)}
                    className="w-full h-9 text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/40"
                  >
                    <CheckCircle className="w-4 h-4 mr-1 shrink-0" />
                    Concluir
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {timeRemaining <= 300 && timeRemaining > 0 && !wo.hasFinished && (
          <div className="flex items-center gap-2 p-2 md:p-3 bg-orange-500/10 border border-orange-500/20 rounded text-xs md:text-sm">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <p className="text-orange-700 dark:text-orange-300 font-medium">
              Prepare uma nova nota!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

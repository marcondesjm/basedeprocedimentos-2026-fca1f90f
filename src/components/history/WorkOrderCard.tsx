import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Image as ImageIcon, Trash2, ChevronDown, ChevronUp, Download, Archive, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CompletedWO } from "@/hooks/useWorkOrderHistory";

interface WorkOrderCardProps {
  wo: CompletedWO;
  dateKey: string;
  isArchive: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onRestore: (dateKey: string, id: string) => void;
  onArchive: (dateKey: string, id: string) => void;
  onDelete: (dateKey: string, id: string, isArchive: boolean) => void;
  onDownloadImage: (imageData: string, woNumber: string, imageIndex: number) => void;
}

export function WorkOrderCard({
  wo,
  dateKey,
  isArchive,
  isExpanded,
  onToggleExpand,
  onRestore,
  onArchive,
  onDelete,
  onDownloadImage
}: WorkOrderCardProps) {
  const completedDate = new Date(wo.completed_at);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="font-mono">
              WO00000{wo.wo_number}
            </Badge>
            {wo.started_at && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(wo.started_at), "HH:mm")}
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {format(completedDate, "HH:mm")}
            </div>
            <Badge variant="secondary">
              {formatDuration(wo.total_duration)}
            </Badge>
            {wo.note_entries && wo.note_entries.length > 0 && (
              <Badge variant="outline" className="gap-1 text-amber-600 border-amber-500/30">
                {wo.note_entries.length} {wo.note_entries.length === 1 ? 'nota' : 'notas'}
              </Badge>
            )}
            {wo.images && wo.images.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <ImageIcon className="w-3 h-3" />
                {wo.images.length}
              </Badge>
            )}
          </div>

          {isExpanded && (
            <div className="pt-2 space-y-3 border-t">
              {wo.note_entries && wo.note_entries.length > 0 && (
                <div className="space-y-1 p-2 bg-muted/50 rounded-md border border-border">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Notas adicionadas</p>
                  {wo.note_entries.map((note, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-foreground">
                      <span className="text-muted-foreground">Nota {idx + 1}</span>
                      <span className="font-mono font-medium">{formatDuration(note.elapsedAtNote)}</span>
                    </div>
                  ))}
                </div>
              )}

              {wo.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">Observações:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {wo.notes}
                  </p>
                </div>
              )}

              {wo.images && wo.images.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Imagens:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {wo.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary cursor-pointer transition-colors"
                        onClick={() => onDownloadImage(img, wo.wo_number, idx)}
                      >
                        <img
                          src={img}
                          alt={`WO ${wo.wo_number} - Imagem ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center">
                          <Download className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-1">
          {((wo.notes && wo.notes.length > 0) || (wo.images && wo.images.length > 0) || (wo.note_entries && wo.note_entries.length > 0)) && (
            <Button
              onClick={() => onToggleExpand(wo.id)}
              size="sm"
              variant="ghost"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
          {isArchive ? (
            <Button
              onClick={() => onRestore(dateKey, wo.id)}
              size="sm"
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/10"
              title="Restaurar ao histórico"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => onArchive(dateKey, wo.id)}
              size="sm"
              variant="ghost"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              title="Arquivar"
            >
              <Archive className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={() => onDelete(dateKey, wo.id, isArchive)}
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

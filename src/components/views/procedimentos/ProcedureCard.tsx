import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, Tag, ChevronDown } from "lucide-react";
import { Procedure, FILA_REMOTA_CATEGORIES, FILA_PRESENCIAL_CATEGORIES } from "@/types/procedure";

interface ProcedureCardProps {
  procedure: Procedure;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
  onMove: (id: string, cat: string) => void;
}

export function ProcedureCard({
  procedure,
  isOpen,
  onToggle,
  onOpen,
  onMove
}: ProcedureCardProps) {
  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onToggle(procedure.id)}
      >
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
        <FileText className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{procedure.title}</p>
          <p className="text-xs text-muted-foreground truncate">{procedure.description}</p>
        </div>
        <Badge variant="secondary" className="text-xs shrink-0">{procedure.category}</Badge>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t space-y-3">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-foreground whitespace-pre-wrap">{procedure.solution}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(procedure.createdAt).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-1"><span>•</span>{procedure.createdBy}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4" />
              {procedure.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button size="sm" className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-semibold" onClick={(e) => {
              e.stopPropagation();
              onOpen(procedure.id);
            }}>
              <FileText className="w-3 h-3 mr-1" />Abrir
            </Button>
            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
              <Select
                value={procedure.filaRemotaCategory || procedure.filaPresencialCategory || "none"}
                onValueChange={(value) => onMove(procedure.id, value === "none" ? "" : value)}
              >
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Mover para..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem fila</SelectItem>
                  <SelectItem disabled value="__header_remota__" className="font-bold text-xs text-muted-foreground">── Fila Remota ──</SelectItem>
                  {FILA_REMOTA_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                  <SelectItem disabled value="__header_presencial__" className="font-bold text-xs text-muted-foreground">── Fila Presencial ──</SelectItem>
                  {FILA_PRESENCIAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, RotateCcw, MessageSquare } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface FormActionsProps {
  noteText: string;
  onReset: () => void;
  copyMessage: string;
  buttonClass?: string;
}

export function FormActions({ noteText, onReset, copyMessage, buttonClass = "bg-primary hover:bg-primary/90" }: FormActionsProps) {
  const [editedNote, setEditedNote] = useState(noteText);
  const [open, setOpen] = useState(false);

  // Update edited note when noteText changes
  // We use this so they can edit the preview
  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setEditedNote(noteText);
    }
  };

  const handleCopy = () => {
    const textToCopy = open ? editedNote : noteText;
    navigator.clipboard.writeText(textToCopy);
    toast.success(copyMessage);
    setOpen(false);
  };

  return (
    <div className="flex gap-2 w-full mt-2">
      <Button 
        variant="outline" 
        size="icon"
        className="w-10 h-10 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted" 
        onClick={(e) => {
          e.preventDefault();
          onReset();
          toast.success("Rascunho limpo!");
        }}
        title="Limpar formulário"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>

      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="w-10 h-10 shrink-0 border-primary/20 text-primary hover:bg-primary/10" title="Ver Preview">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-4" align="center">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Preview da Nota
            </h4>
            <Textarea
              value={editedNote}
              onChange={(e) => setEditedNote(e.target.value)}
              className="min-h-[250px] text-xs font-mono resize-none focus-visible:ring-1"
            />
            <Button size="sm" className="w-full" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar e Fechar
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button size="sm" className={`flex-1 h-10 ${buttonClass}`} onClick={(e) => {
        e.preventDefault();
        handleCopy();
      }}>
        <Copy className="w-4 h-4 mr-2" />Copiar
      </Button>
    </div>
  );
}

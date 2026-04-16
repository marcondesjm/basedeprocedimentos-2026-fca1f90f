import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteType, CATEGORIES } from "@/types/procedure";

interface NewProcedureFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newProcedure: any;
  setNewProcedure: (proc: any) => void;
  handleCreateProcedure: (e: React.FormEvent) => void;
}

export function NewProcedureForm({
  isOpen,
  onOpenChange,
  newProcedure,
  setNewProcedure,
  handleCreateProcedure
}: NewProcedureFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[85vh] overflow-y-auto p-4 sm:p-6" aria-describedby="new-procedure-description">
        <DialogHeader>
          <DialogTitle>Novo Procedimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateProcedure} className="space-y-4 mt-4">
          <p id="new-procedure-description" className="sr-only">Formulário para cadastro de novo procedimento técnico</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" required value={newProcedure.title} onChange={(e) => setNewProcedure({ ...newProcedure, title: e.target.value })} placeholder="Título do procedimento" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={newProcedure.category} onValueChange={(value) => setNewProcedure({ ...newProcedure, category: value })}>
                <SelectTrigger id="category"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="noteType">Tipo de Nota *</Label>
            <Select value={newProcedure.noteType} onValueChange={(value: NoteType) => setNewProcedure({ ...newProcedure, noteType: value })}>
              <SelectTrigger id="noteType"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="procedimento">Procedimento (Conclusão)</SelectItem>
                <SelectItem value="diagnostico">Diagnóstico (Devolução)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newProcedure.noteType === "diagnostico" && (
            <div className="space-y-2">
              <Label htmlFor="setorDirecionado">Setor Direcionado</Label>
              <Input id="setorDirecionado" value={newProcedure.setorDirecionado} onChange={(e) => setNewProcedure({ ...newProcedure, setorDirecionado: e.target.value })} placeholder="Setor para direcionar" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea id="description" required value={newProcedure.description} onChange={(e) => setNewProcedure({ ...newProcedure, description: e.target.value })} placeholder="Descreva o contexto do problema..." rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solução Aplicada *</Label>
            <Textarea id="solution" required value={newProcedure.solution} onChange={(e) => setNewProcedure({ ...newProcedure, solution: e.target.value })} placeholder="Descreva os passos realizados e a solução aplicada..." rows={5} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" value={newProcedure.tags} onChange={(e) => setNewProcedure({ ...newProcedure, tags: e.target.value })} placeholder="Separe por vírgula: PDF, Software, Deploy" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pibEquipamento">PIB Equipamento</Label>
            <Input id="pibEquipamento" value={newProcedure.pibEquipamento} onChange={(e) => setNewProcedure({ ...newProcedure, pibEquipamento: e.target.value })} placeholder="Digite o PIB do equipamento" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usuarioAtendido">Usuário Atendido</Label>
            <Input id="usuarioAtendido" value={newProcedure.usuarioAtendido} onChange={(e) => setNewProcedure({ ...newProcedure, usuarioAtendido: e.target.value })} placeholder="Digite o nome do usuário atendido" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workOrder">WO (Work Order)</Label>
            <Input id="workOrder" value={newProcedure.workOrder} onChange={(e) => setNewProcedure({ ...newProcedure, workOrder: e.target.value })} placeholder="Digite o número da WO" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="createdBy">Técnico Responsável</Label>
            <Input id="createdBy" value="SUPORTE TÉCNICO HEPTA" disabled className="bg-muted" />
          </div>

          {newProcedure.noteType === "diagnostico" && (
            <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800">Campos de Diagnóstico</h4>
              <div className="space-y-2">
                <Label htmlFor="justificativa" className="text-amber-800">Justificativa *</Label>
                <Textarea id="justificativa" required={newProcedure.noteType === "diagnostico"} value={newProcedure.justificativa} onChange={(e) => setNewProcedure({ ...newProcedure, justificativa: e.target.value })} placeholder="Após procedimentos foi verificado que..." rows={3} className="border-amber-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-amber-800">Possui procedimento no BC-Suporte?</Label>
                <Select value={newProcedure.possuiProcedimentoBC} onValueChange={(value: "sim" | "nao" | "") => setNewProcedure({ ...newProcedure, possuiProcedimentoBC: value })}>
                  <SelectTrigger className="border-amber-300"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">SIM</SelectItem>
                    <SelectItem value="nao">NÃO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newProcedure.possuiProcedimentoBC === "sim" && (
                <div className="space-y-2">
                  <Label htmlFor="nomeArquivoBC" className="text-amber-800">Nome do Arquivo BC</Label>
                  <Input id="nomeArquivoBC" value={newProcedure.nomeArquivoBC} onChange={(e) => setNewProcedure({ ...newProcedure, nomeArquivoBC: e.target.value })} placeholder="Nome do arquivo no BC-Suporte" className="border-amber-300" />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

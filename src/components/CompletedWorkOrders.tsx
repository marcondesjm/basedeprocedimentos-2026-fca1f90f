import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Calendar, Archive, Search, Download, Upload } from "lucide-react";
import { useWorkOrderHistory, HistoryByDate } from "@/hooks/useWorkOrderHistory";
import { WorkOrderList } from "./history/WorkOrderList";

export const CompletedWorkOrders = () => {
  const {
    historyByDate,
    archivedByDate,
    loading,
    archiveOrder,
    archiveDay,
    restoreDay,
    restoreOrder,
    deleteOrder,
    exportBackup,
    importBackup
  } = useWorkOrderHistory();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [showArchive, setShowArchive] = useState(false);
  const [archiveSearch, setArchiveSearch] = useState("");

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedOrders(newExpanded);
  };

  const downloadImage = (imageData: string, woNumber: string, imageIndex: number) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `WO_${woNumber}_imagem_${imageIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagem baixada!");
  };

  const getFilteredArchive = () => {
    if (!archiveSearch.trim()) return archivedByDate;
    const search = archiveSearch.toLowerCase();
    const filtered: HistoryByDate = {};
    Object.entries(archivedByDate).forEach(([dateKey, orders]) => {
      const matched = orders.filter(wo =>
        wo.wo_number.toLowerCase().includes(search) ||
        wo.notes?.toLowerCase().includes(search)
      );
      if (matched.length > 0) filtered[dateKey] = matched;
    });
    return filtered;
  };

  const archiveCount = Object.values(archivedByDate).reduce((sum, arr) => sum + arr.length, 0);

  if (loading) {
    return (
      <Card className="p-4 md:p-6">
        <div className="text-center text-muted-foreground">Carregando histórico...</div>
      </Card>
    );
  }

  const allDates = Object.keys(historyByDate).sort((a, b) => b.localeCompare(a));
  const filteredArchive = getFilteredArchive();
  const archiveDates = Object.keys(filteredArchive).sort((a, b) => b.localeCompare(a));

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Histórico de Chamados</h2>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setShowArchive(!showArchive)}
              size="sm"
              variant={showArchive ? "default" : "outline"}
              className="gap-2"
            >
              <Archive className="w-4 h-4" />
              Arquivo {archiveCount > 0 && `(${archiveCount})`}
            </Button>
            <Button
              onClick={exportBackup}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Backup
            </Button>
            <label>
              <input
                type="file"
                accept=".json"
                onChange={importBackup}
                className="hidden"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  input?.click();
                }}
              >
                <Upload className="w-4 h-4" />
                Importar Backup
              </Button>
            </label>
          </div>
        </div>

        {showArchive ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar no arquivo (WO ou observações)..."
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            {archiveDates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Archive className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>{archiveSearch ? "Nenhum resultado encontrado" : "Nenhum chamado arquivado"}</p>
              </div>
            ) : (
              <WorkOrderList
                dates={archiveDates}
                data={filteredArchive}
                isArchive={true}
                expandedOrders={expandedOrders}
                onToggleExpand={toggleExpand}
                onRestoreOrder={restoreOrder}
                onRestoreDay={restoreDay}
                onArchiveOrder={archiveOrder}
                onArchiveDay={archiveDay}
                onDeleteOrder={deleteOrder}
                onDownloadImage={downloadImage}
              />
            )}
          </div>
        ) : (
          <>
            {allDates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>Nenhum chamado concluído ainda</p>
              </div>
            ) : (
              <WorkOrderList
                dates={allDates}
                data={historyByDate}
                isArchive={false}
                expandedOrders={expandedOrders}
                onToggleExpand={toggleExpand}
                onRestoreOrder={restoreOrder}
                onRestoreDay={restoreDay}
                onArchiveOrder={archiveOrder}
                onArchiveDay={archiveDay}
                onDeleteOrder={deleteOrder}
                onDownloadImage={downloadImage}
              />
            )}
          </>
        )}
      </div>
    </Card>
  );
};

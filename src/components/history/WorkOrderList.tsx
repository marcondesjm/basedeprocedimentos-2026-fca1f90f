import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, ChevronUp, Archive, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { HistoryByDate } from "@/hooks/useWorkOrderHistory";
import { WorkOrderCard } from "./WorkOrderCard";

interface WorkOrderListProps {
  dates: string[];
  data: HistoryByDate;
  isArchive: boolean;
  expandedOrders: Set<string>;
  onToggleExpand: (id: string) => void;
  onRestoreOrder: (dateKey: string, id: string) => void;
  onRestoreDay: (dateKey: string) => void;
  onArchiveOrder: (dateKey: string, id: string) => void;
  onArchiveDay: (dateKey: string) => void;
  onDeleteOrder: (dateKey: string, id: string, isArchive: boolean) => void;
  onDownloadImage: (imageData: string, woNumber: string, imageIndex: number) => void;
}

export function WorkOrderList({
  dates,
  data,
  isArchive,
  expandedOrders,
  onToggleExpand,
  onRestoreOrder,
  onRestoreDay,
  onArchiveOrder,
  onArchiveDay,
  onDeleteOrder,
  onDownloadImage
}: WorkOrderListProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const toggleDay = (dateKey: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDays(newExpanded);
  };

  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  // Group dates by month
  const monthGroups: { [monthKey: string]: string[] } = {};
  dates.forEach((dateKey) => {
    const monthKey = dateKey.substring(0, 7); // yyyy-MM
    if (!monthGroups[monthKey]) monthGroups[monthKey] = [];
    monthGroups[monthKey].push(dateKey);
  });

  const sortedMonths = Object.keys(monthGroups).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-8">
      {sortedMonths.map((monthKey) => {
        const monthDates = monthGroups[monthKey];
        const monthDate = new Date(monthKey + '-15');
        const totalMonthOrders = monthDates.reduce((sum, dk) => sum + (data[dk]?.length || 0), 0);

        return (
          <div key={monthKey} className="space-y-4">
            <div
              className="flex items-center gap-2 pb-2 border-b-2 border-primary/30 cursor-pointer select-none"
              onClick={() => toggleMonth(monthKey)}
            >
              {expandedMonths.has(monthKey) ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg capitalize">
                {format(monthDate, "MMMM 'de' yyyy", { locale: ptBR })}
              </h3>
              <Badge variant="default" className="ml-auto">
                {totalMonthOrders} {totalMonthOrders === 1 ? 'chamado' : 'chamados'}
              </Badge>
            </div>

            {expandedMonths.has(monthKey) && (
              <div className="space-y-5 pl-2">
                {monthDates.map((dateKey) => {
                  const orders = data[dateKey];
                  const dateObj = new Date(dateKey + 'T12:00:00');

                  return (
                    <div key={dateKey} className="space-y-3">
                      <div
                        className="flex items-center gap-2 pb-1 border-b border-border/50 cursor-pointer select-none"
                        onClick={() => toggleDay(dateKey)}
                      >
                        {expandedDays.has(dateKey) ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-semibold text-base">
                          {format(dateObj, "dd 'de' MMMM", { locale: ptBR })}
                        </h4>
                        <div className="flex items-center gap-2 ml-auto">
                          {isArchive ? (
                            <Button
                              onClick={(e) => { e.stopPropagation(); onRestoreDay(dateKey); }}
                              size="sm"
                              variant="outline"
                              className="text-xs h-7 gap-1"
                              title="Restaurar dia inteiro"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Restaurar dia
                            </Button>
                          ) : (
                            <Button
                              onClick={(e) => { e.stopPropagation(); onArchiveDay(dateKey); }}
                              size="sm"
                              variant="outline"
                              className="text-xs h-7 gap-1"
                              title="Arquivar dia inteiro"
                            >
                              <Archive className="w-3 h-3" />
                              Arquivar dia
                            </Button>
                          )}
                          <Badge variant="secondary">
                            {orders.length} {orders.length === 1 ? 'chamado' : 'chamados'}
                          </Badge>
                        </div>
                      </div>

                      {expandedDays.has(dateKey) && (
                        <div className="space-y-2 pl-4">
                          {orders.map((wo) => (
                            <WorkOrderCard
                              key={wo.id}
                              wo={wo}
                              dateKey={dateKey}
                              isArchive={isArchive}
                              isExpanded={expandedOrders.has(wo.id)}
                              onToggleExpand={onToggleExpand}
                              onRestore={onRestoreOrder}
                              onArchive={onArchiveOrder}
                              onDelete={onDeleteOrder}
                              onDownloadImage={onDownloadImage}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

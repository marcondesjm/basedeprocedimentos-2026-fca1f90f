import { Card } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { AnaliseProblemasCard } from "./checklists/AnaliseProblemasCard";
import { MilestoneCard } from "./checklists/MilestoneCard";
import { FormatacaoRemotaCard } from "./checklists/FormatacaoRemotaCard";
import { EspansoCard } from "./checklists/EspansoCard";
import { AtualizacaoFerramentaCard } from "./checklists/AtualizacaoFerramentaCard";
import { PreparacaoFerramentaCard } from "./checklists/PreparacaoFerramentaCard";
import { TotemSigesfCard } from "./checklists/TotemSigesfCard";
import { BaseConhecimentoCard } from "./checklists/BaseConhecimentoCard";

export const ChecklistsView = () => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">Checklists</h2>
        </div>
        <p className="text-muted-foreground">Checklists de verificação para procedimentos padronizados.</p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnaliseProblemasCard />
          <MilestoneCard />
          <FormatacaoRemotaCard />
          <EspansoCard />
          <AtualizacaoFerramentaCard />
          <PreparacaoFerramentaCard />
          <TotemSigesfCard />
          <BaseConhecimentoCard />
        </div>
      </div>
    </Card>
  );
};

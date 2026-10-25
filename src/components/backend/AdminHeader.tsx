import React from "react";
import {
  BarChart3,
  Package,
  Users,
  Layers,
  Settings2,
  Boxes,
  ExternalLink,
  Store,
  RefreshCw
} from "lucide-react";
import StoreLogo from "../common/StoreLogo";

export type AdminTab = "relatorios" | "pedidos" | "clientes" | "produtos" | "infraestrutura" | "apps";

interface AdminHeaderProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onSwitchToFrontend: () => void;
  onResetData: () => void;
  totalOrders: number;
  totalRevenue: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onSelectTab,
  onSwitchToFrontend,
  onResetData,
  totalOrders,
  totalRevenue
}) => {
  const tabs = [
    { id: "relatorios" as const, label: "Análises & Relatórios", icon: BarChart3 },
    { id: "pedidos" as const, label: "Gestão de Pedidos", icon: Package },
    { id: "clientes" as const, label: "Clientes (CRM)", icon: Users },
    { id: "produtos" as const, label: "Catálogo & Estoque", icon: Layers },
    { id: "infraestrutura" as const, label: "Infraestrutura Técnica", icon: Settings2 },
    { id: "apps" as const, label: "Ecossistema de Apps", icon: Boxes }
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-2xs">
      {/* Top Meta Bar */}
      <div className="bg-[#3A3A30] text-stone-200 text-xs py-2 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-[#C05B33] text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Painel do Lojista
          </span>
          <span className="hidden sm:inline text-stone-300 font-sans text-xs">
            Central de Operações • E-Commerce Teríus
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-3 text-stone-300">
            <span>Faturamento Total: <strong className="text-white">R$ {totalRevenue.toFixed(2).replace(".", ",")}</strong></span>
            <span>•</span>
            <span>Pedidos: <strong className="text-white">{totalOrders}</strong></span>
          </div>

          <button
            onClick={onSwitchToFrontend}
            className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white px-3 py-1 rounded-lg font-sans font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Visualizar Loja Virtual (Front-End)</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Admin Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center justify-between">
          <StoreLogo size="sm" />
          <button
            onClick={onResetData}
            className="md:hidden p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 cursor-pointer"
            title="Restaurar dados padrão"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Modular Tabs Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#5A5A40] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={onResetData}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl text-xs font-medium cursor-pointer transition-colors ml-2"
            title="Restaurar dados simulados padrão"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="font-mono">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

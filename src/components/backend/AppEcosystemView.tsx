import React from "react";
import {
  Boxes,
  Star,
  MessageCircle,
  Mail,
  Truck,
  Search,
  CheckCircle,
  Plus,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { AppPlugin } from "../../types/store";

interface AppEcosystemViewProps {
  apps: AppPlugin[];
  onToggleApp: (appId: string) => void;
}

export const AppEcosystemView: React.FC<AppEcosystemViewProps> = ({
  apps,
  onToggleApp
}) => {
  const getAppIcon = (category: AppPlugin["category"]) => {
    switch (category) {
      case "Avaliações":
        return Star;
      case "Recuperação de Vendas":
        return MessageCircle;
      case "Marketing":
        return Mail;
      case "Logística":
        return Truck;
      case "SEO":
        return Search;
      default:
        return Boxes;
    }
  };

  const installedCount = apps.filter((a) => a.installed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#C05B33] font-bold block">
            Pilar 4 • Modularidade & Extensões
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Ecossistema de Aplicativos (Apps)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Adicione módulos extras para personalizar o negócio: avaliações de clientes, recuperação de carrinhos abandonados, automação de e-mail e logística.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono">
            <span className="text-stone-400">Instalados: </span>
            <strong className="text-emerald-700">{installedCount} módulos ativos</strong>
          </div>
        </div>
      </div>

      {/* Grid of Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {apps.map((app) => {
          const Icon = getAppIcon(app.category);
          return (
            <div
              key={app.id}
              className={`bg-white rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                app.installed
                  ? "border-[#5A5A40]/30 shadow-2xs"
                  : "border-stone-200 opacity-80"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-2xl bg-stone-100 text-[#5A5A40]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {app.badge && (
                      <span className="bg-[#C05B33]/10 text-[#C05B33] text-[10px] font-bold font-mono px-2 py-0.5 rounded-md uppercase">
                        {app.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400 font-mono">
                      v{app.version}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-stone-900 text-sm mb-1">{app.name}</h3>
                <span className="text-[10px] uppercase font-mono text-[#5A5A40] block mb-2 font-semibold">
                  Categoria: {app.category}
                </span>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {app.description}
                </p>

                {app.installed && (
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 text-[11px] text-emerald-800 font-medium mb-4">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{app.activeStatusText}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => onToggleApp(app.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    app.installed
                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      : "bg-[#5A5A40] text-white hover:bg-[#43432e]"
                  }`}
                >
                  {app.installed ? "Desinstalar Módulo" : "Instalar e Ativar"}
                </button>

                {app.installed && (
                  <button
                    onClick={() => alert(`Painel de configuração do módulo ${app.name} aberto.`)}
                    className="text-xs text-stone-500 hover:text-stone-900 underline cursor-pointer"
                  >
                    Configurar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppEcosystemView;

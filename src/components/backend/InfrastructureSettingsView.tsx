import React, { useState } from "react";
import {
  CreditCard,
  Share2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Shield,
  RefreshCw,
  Sliders,
  DollarSign,
  Globe,
  Instagram,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { PaymentGatewayConfig, SalesChannelConfig } from "../../types/store";
import StatusBadge from "../common/StatusBadge";

interface InfrastructureSettingsViewProps {
  gateways: PaymentGatewayConfig[];
  channels: SalesChannelConfig[];
  onToggleGateway: (gatewayId: string) => void;
  onToggleChannel: (channelId: string) => void;
}

export const InfrastructureSettingsView: React.FC<InfrastructureSettingsViewProps> = ({
  gateways,
  channels,
  onToggleGateway,
  onToggleChannel
}) => {
  const [activeTab, setActiveTab] = useState<"gateways" | "canais" | "sistema">("gateways");
  const [isSyncingChannels, setIsSyncingChannels] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const handleSyncNow = () => {
    setIsSyncingChannels(true);
    setTimeout(() => {
      setIsSyncingChannels(false);
      setStatusNotification("Estoque centralizado sincronizado com sucesso em todos os canais conectados!");
      setTimeout(() => setStatusNotification(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#C05B33] font-bold block">
            Pilar 3 • Base Tecnológica
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Infraestrutura Técnica & Configuração
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Conecte provedores de pagamento homologados (Google Pay Nativo e Cartão Visa Direct) e centralize seus canais de distribuição.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab("gateways")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "gateways" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-600"
            }`}
          >
            Provedores de Pagamento
          </button>
          <button
            onClick={() => setActiveTab("canais")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "canais" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-600"
            }`}
          >
            Canais de Venda Multicanal
          </button>
        </div>
      </div>

      {statusNotification && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* 1. GATEWAYS DE PAGAMENTO */}
      {activeTab === "gateways" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Proteção Antifraude & Split de Pagamentos
                </h4>
                <p className="text-xs text-stone-500">
                  Processamento direto com menores taxas de intermediação e compensação instantânea via Google Pay e cartões Visa.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Gateway Nativo Ativo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gateways.map((gw) => (
              <div
                key={gw.id}
                className={`p-5 rounded-3xl border transition-all bg-white flex flex-col justify-between ${
                  gw.enabled
                    ? "border-[#5A5A40]/30 shadow-2xs"
                    : "border-stone-200 opacity-75"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-stone-100 rounded-xl text-stone-700">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{gw.name}</h4>
                        <span className="text-[10px] font-mono text-stone-400 block">
                          Provedor: {gw.provider} • {gw.environment}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleGateway(gw.id)}
                      className="cursor-pointer text-stone-700 hover:text-stone-900 transition-colors"
                      title={gw.enabled ? "Desativar gateway" : "Ativar gateway"}
                    >
                      {gw.enabled ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* Fees info */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 mb-3 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Taxa Transação:</span>
                      <strong className="text-stone-800">{gw.feePercentage}% + R$ {gw.fixedFee.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Status Operação:</span>
                      <strong className={gw.enabled ? "text-emerald-700" : "text-stone-500"}>
                        {gw.enabled ? "Em Produção" : "Desativado"}
                      </strong>
                    </div>
                  </div>

                  {/* Accepted methods */}
                  <div>
                    <span className="text-[10px] uppercase font-mono text-stone-400 block mb-1">
                      Métodos Habilitados:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {gw.acceptedMethods.map((m, idx) => (
                        <span
                          key={idx}
                          className="bg-stone-100 text-stone-700 text-[10px] px-2 py-0.5 rounded-md font-mono"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-mono text-[11px]">
                    Token de API configurado
                  </span>
                  <button
                    onClick={() => alert(`Configurações de chaves e webhooks para ${gw.name} atualizadas.`)}
                    className="text-[#5A5A40] hover:underline font-semibold cursor-pointer"
                  >
                    Editar Credenciais
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CANAIS DE VENDA MULTICANAL */}
      {activeTab === "canais" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                Centralização de Estoque Multicanal
              </h4>
              <p className="text-xs text-stone-500">
                Uma única fonte de verdade: quando um item é vendido no Instagram ou na Loja Web, o estoque baixa automaticamente em todas as redes.
              </p>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncingChannels}
              className="px-4 py-2 bg-[#5A5A40] hover:bg-[#43432e] text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingChannels ? "animate-spin" : ""}`} />
              <span>Sincronizar Catálogos Agora</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-stone-100 text-[#5A5A40] rounded-xl">
                        {ch.id.includes("instagram") ? (
                          <Instagram className="w-5 h-5" />
                        ) : ch.id.includes("web") ? (
                          <Globe className="w-5 h-5" />
                        ) : (
                          <Share2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{ch.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StatusBadge status={ch.status} />
                          <span className="text-[10px] font-mono text-stone-400">
                            {ch.syncFrequency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleChannel(ch.id)}
                      className="cursor-pointer text-stone-700 hover:text-stone-900 transition-colors"
                      title={ch.enabled ? "Desativar canal" : "Ativar canal"}
                    >
                      {ch.enabled ? (
                        <ToggleRight className="w-8 h-8 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-stone-400" />
                      )}
                    </button>
                  </div>

                  {/* Channel stats */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 grid grid-cols-2 gap-2 text-xs font-mono my-3">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Produtos Sincronizados:</span>
                      <strong className="text-stone-800">{ch.syncedProducts} itens ativos</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Faturamento Canal:</span>
                      <strong className="text-stone-800">
                        R$ {ch.totalSalesChannel.toFixed(2).replace(".", ",")}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-mono text-[11px]">
                    Pixel e Feed de Produtos integrados
                  </span>
                  <button
                    onClick={() => {
                      setStatusNotification(`Configurações de sincronização para ${ch.name} validadas com sucesso.`);
                      setTimeout(() => setStatusNotification(null), 3000);
                    }}
                    className="text-[#5A5A40] hover:underline font-semibold cursor-pointer"
                  >
                    Gerenciar Feed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfrastructureSettingsView;

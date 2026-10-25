import React, { useState } from "react";
import {
  Instagram,
  MessageCircle,
  Share2,
  ExternalLink,
  Check,
  Copy,
  Radio,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Heart
} from "lucide-react";
import { SocialConnector, Product } from "../../types/store";

interface SocialConnectorsSectionProps {
  connectors: SocialConnector[];
  products: Product[];
  onOpenProductQuickView?: (product: Product) => void;
  onSyncConnector?: (connectorId: string) => void;
}

export const SocialConnectorsSection: React.FC<SocialConnectorsSectionProps> = ({
  connectors,
  products,
  onOpenProductQuickView,
  onSyncConnector
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"instagram" | "whatsapp" | "todos">("instagram");

  const instagramConnector = connectors.find((c) => c.platform === "Instagram");
  const whatsappConnector = connectors.find((c) => c.platform === "WhatsApp");

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin || "https://terius-on.com");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTriggerSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      onSyncConnector?.(id);
      setSyncingId(null);
    }, 1000);
  };

  const handleOpenWhatsAppChat = () => {
    const text = encodeURIComponent(
      "Olá! Gostaria de atendimento exclusivo na Teríus on para conhecer as coleções e formas de pagamento com Google Pay e Visa."
    );
    window.open(`https://wa.me/351963067989?text=${text}`, "_blank");
  };

  return (
    <section id="conectores-sociais" className="py-16 md:py-20 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-xs font-mono text-[#5A5A40] shadow-2xs mb-3">
              <Radio className="w-3.5 h-3.5 text-[#C05B33] animate-pulse" />
              <span className="font-semibold">Canais Oficiais & Social Commerce</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Conectores com as Redes Sociais
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Integração ativa entre nosso catálogo, vitrines dinâmicas e comunidades no Instagram, WhatsApp, TikTok e YouTube.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Link Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-stone-500" />
                  <span>Compartilhar Loja</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenWhatsAppChat}
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Direto</span>
            </button>
          </div>
        </div>

        {/* Channels Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-10">
          {connectors.map((c) => {
            const isInstagram = c.platform === "Instagram";
            const isWhatsApp = c.platform === "WhatsApp";
            const isSyncing = syncingId === c.id;

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs flex flex-col justify-between hover:border-stone-300 transition-all hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isInstagram
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : isWhatsApp
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-stone-100 text-[#5A5A40] border border-stone-200"
                      }`}
                    >
                      {isInstagram ? (
                        <Instagram className="w-5 h-5" />
                      ) : isWhatsApp ? (
                        <MessageCircle className="w-5 h-5" />
                      ) : (
                        <Radio className="w-5 h-5" />
                      )}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {c.status}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 text-base">{c.platform}</h3>
                  <p className="text-xs font-mono text-stone-500 mt-0.5">{c.handle}</p>

                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-1 text-xs text-stone-600">
                    <p className="font-medium text-stone-700">{c.followersOrReach}</p>
                    <p className="text-[11px] text-stone-400">
                      Sincronizado: <span className="font-mono text-stone-500">{c.lastSync}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                  <a
                    href={c.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 text-center bg-stone-50 hover:bg-[#5A5A40] hover:text-white text-stone-700 rounded-lg text-xs font-semibold transition-all border border-stone-200 flex items-center justify-center gap-1"
                  >
                    <span>Acessar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleTriggerSync(c.id)}
                    disabled={isSyncing}
                    title="Forçar Sincronização de Catálogo"
                    className="p-1.5 bg-stone-50 hover:bg-stone-200 text-stone-600 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#C05B33]" : ""}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Instagram Feed with Tagged Products */}
        {instagramConnector?.recentPosts && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-rose-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg">
                    Feed Oficial @terius.on
                  </h3>
                  <p className="text-xs text-stone-500">
                    Clique em qualquer foto para ver o produto marcado e comprar diretamente.
                  </p>
                </div>
              </div>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C05B33] hover:underline"
              >
                <span>Seguir no Instagram</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {instagramConnector.recentPosts.map((post) => {
                const matchedProduct = products.find((p) => p.name === post.taggedProduct);

                return (
                  <div
                    key={post.id}
                    className="group relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 flex flex-col justify-between"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Overlay On Hover */}
                      <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        {matchedProduct && onOpenProductQuickView && (
                          <button
                            onClick={() => onOpenProductQuickView(matchedProduct)}
                            className="px-3.5 py-2 bg-white text-stone-900 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer hover:bg-stone-100 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#C05B33]" />
                            <span>Comprar Item</span>
                          </button>
                        )}
                      </div>

                      {/* Tag Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono rounded-md flex items-center gap-1">
                          <ShoppingBag className="w-2.5 h-2.5 text-[#C05B33]" />
                          <span>Produto Marcado</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white flex flex-col justify-between flex-1">
                      <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                        {post.title}
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        <span className="font-semibold text-stone-800 truncate max-w-[140px]">
                          {post.taggedProduct}
                        </span>
                        <span className="flex items-center gap-1 text-rose-600 font-mono">
                          <Heart className="w-3 h-3 fill-rose-600" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WhatsApp Fast Channel Consultation Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#205238] to-[#2D5A43] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <MessageCircle className="w-7 h-7 text-[#25D366] fill-[#25D366]" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                Canal VIP de Atendimento
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                Precisa de ajuda ou deseja comprar pelo WhatsApp?
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-xl">
                Nossos consultores tiram dúvidas sobre tamanhos, personalização e geram links diretos de pagamento via Google Pay ou Cartão Visa com 1 clique.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenWhatsAppChat}
            className="px-6 py-3.5 bg-white text-[#205238] hover:bg-stone-100 font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-[#205238]" />
            <span>Falar com Consultor</span>
          </button>
        </div>
      </div>
    </section>
  );
};
export default SocialConnectorsSection;

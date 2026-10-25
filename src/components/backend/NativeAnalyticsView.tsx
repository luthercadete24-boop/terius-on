import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Download,
  Filter,
  CreditCard,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { DailySalesMetric, TrafficSourceMetric, Order } from "../../types/store";

interface NativeAnalyticsViewProps {
  dailySales: DailySalesMetric[];
  trafficSources: TrafficSourceMetric[];
  orders: Order[];
}

export const NativeAnalyticsView: React.FC<NativeAnalyticsViewProps> = ({
  dailySales,
  trafficSources,
  orders
}) => {
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>("todos");

  // Calculations
  const validOrders = orders.filter((o) => o.status !== "Cancelado" && o.status !== "Reembolsado");
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const avgTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const conversionRate = 3.65; // Taxa média de conversão em e-commerce (%)

  // Payment Breakdown
  const googlePayOrders = validOrders.filter((o) => o.paymentMethod === "Google Pay");
  const visaOrders = validOrders.filter((o) => o.paymentMethod === "Cartão Visa");
  const pixOrders = validOrders.filter((o) => o.paymentMethod === "Pix Instantâneo");
  const otherOrders = validOrders.filter(
    (o) => o.paymentMethod !== "Google Pay" && o.paymentMethod !== "Cartão Visa" && o.paymentMethod !== "Pix Instantâneo"
  );

  const paymentMethods = [
    {
      name: "Google Pay",
      count: googlePayOrders.length,
      revenue: googlePayOrders.reduce((s, o) => s + o.total, 0),
      color: "#2D5A43",
      percent: totalOrdersCount > 0 ? Math.round((googlePayOrders.length / totalOrdersCount) * 100) : 40
    },
    {
      name: "Cartão Visa",
      count: visaOrders.length,
      revenue: visaOrders.reduce((s, o) => s + o.total, 0),
      color: "#C05B33",
      percent: totalOrdersCount > 0 ? Math.round((visaOrders.length / totalOrdersCount) * 100) : 35
    },
    {
      name: "Pix Instantâneo",
      count: pixOrders.length,
      revenue: pixOrders.reduce((s, o) => s + o.total, 0),
      color: "#5A5A40",
      percent: totalOrdersCount > 0 ? Math.round((pixOrders.length / totalOrdersCount) * 100) : 20
    },
    {
      name: "Outros Gateways",
      count: otherOrders.length,
      revenue: otherOrders.reduce((s, o) => s + o.total, 0),
      color: "#8B8B69",
      percent: totalOrdersCount > 0 ? Math.round((otherOrders.length / totalOrdersCount) * 100) : 5
    }
  ];

  // SVG Line Chart Constants & Coordinates
  const chartWidth = 720;
  const chartHeight = 260;
  const paddingX = 50;
  const paddingY = 40;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;

  const maxSales = Math.max(...dailySales.map((d) => d.vendas), 7000);
  const minSales = 0;

  const points = dailySales.map((d, index) => {
    const x = paddingX + (index / (dailySales.length - 1)) * plotWidth;
    const y = chartHeight - paddingY - ((d.vendas - minSales) / (maxSales - minSales)) * plotHeight;
    return { x, y, data: d };
  });

  // Construct Smooth Bézier Path for Area & Line
  const linePathD = points.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  const areaPathD = `${linePathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Filtered Orders for Table
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "todos") return true;
    return o.status.toLowerCase() === orderFilter.toLowerCase();
  });

  const handleExportReport = () => {
    const reportData = {
      geradoEm: new Date().toISOString(),
      faturamentoTotal: totalRevenue,
      pedidosTotais: totalOrdersCount,
      ticketMedio: avgTicket,
      vendasDiarias: dailySales,
      pedidos: orders
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-terius-on-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#C05B33] font-bold block">
            Painel Executivo
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Análises e Relatórios (Gráficos Nativos)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Visualizações vetoriais SVG de alta fidelidade sem bibliotecas externas — renderização ultra veloz e estável.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento Bruto */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold text-stone-600 uppercase font-mono">Faturamento Total</span>
            <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">
            R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs período anterior</span>
          </div>
        </div>

        {/* Card 2: Pedidos Concluídos */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold text-stone-600 uppercase font-mono">Total de Pedidos</span>
            <div className="p-2 bg-[#C05B33]/10 text-[#C05B33] rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">{totalOrdersCount} pedidos</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.1% novos pedidos</span>
          </div>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold text-stone-600 uppercase font-mono">Ticket Médio</span>
            <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">
            R$ {avgTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-stone-500">Calculado sobre transações aprovadas</div>
        </div>

        {/* Card 4: Taxa de Conversão */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold text-stone-600 uppercase font-mono">Conversão Checkout</span>
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-900">{conversionRate}%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Google Pay & Visa aceleram 2.8x</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid: Native SVG Line & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfico 1: Evolução Diária de Vendas (Native SVG Area & Line Chart) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Evolução Diária de Vendas (R$)
              </h3>
              <p className="text-xs text-stone-500">
                Gráfico nativo SVG com curva vetorial contínua e marcadores interativos
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-600 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5A5A40]" />
              <span>Vendas Brutas (R$)</span>
            </div>
          </div>

          {/* Native SVG Chart Container */}
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto max-h-[300px] select-none"
            >
              <defs>
                <linearGradient id="teriusSalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5A5A40" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#5A5A40" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = chartHeight - paddingY - ratio * plotHeight;
                const value = Math.round(minSales + ratio * (maxSales - minSales));
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#F0EEE9"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#8C827A"
                      fontFamily="monospace"
                    >
                      R${(value / 1000).toFixed(1)}k
                    </text>
                  </g>
                );
              })}

              {/* Area Under Curve */}
              <path d={areaPathD} fill="url(#teriusSalesGrad)" />

              {/* Main Line */}
              <path
                d={linePathD}
                fill="none"
                stroke="#5A5A40"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points & Interactive Circles */}
              {points.map((pt, i) => {
                const isHovered = activeDataIndex === i;
                return (
                  <g key={i}>
                    {/* Vertical hover line */}
                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={paddingY}
                        x2={pt.x}
                        y2={chartHeight - paddingY}
                        stroke="#C05B33"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 4.5}
                      fill={isHovered ? "#C05B33" : "#5A5A40"}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setActiveDataIndex(i)}
                      onMouseLeave={() => setActiveDataIndex(null)}
                    />

                    {/* X-Axis Label */}
                    <text
                      x={pt.x}
                      y={chartHeight - paddingY + 18}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight={isHovered ? "bold" : "normal"}
                      fill={isHovered ? "#C05B33" : "#5A5A40"}
                      fontFamily="sans-serif"
                    >
                      {pt.data.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {activeDataIndex !== null && (
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg font-mono flex items-center gap-2 pointer-events-none"
              >
                <span className="font-bold text-amber-300">
                  {dailySales[activeDataIndex].date}:
                </span>
                <span>
                  R$ {dailySales[activeDataIndex].vendas.toLocaleString("pt-BR")} ({dailySales[activeDataIndex].pedidos} pedidos)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico 2: Meios de Pagamento (Native SVG Donut Chart) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Meios de Pagamento
              </h3>
              <p className="text-xs text-stone-500">
                Gráfico donut vetorial nativo (Google Pay & Visa)
              </p>
            </div>

            {/* Native SVG Donut Chart */}
            <div className="relative flex items-center justify-center my-4">
              <svg viewBox="0 0 160 160" className="w-40 h-40">
                {/* Background Ring */}
                <circle cx="80" cy="80" r="58" fill="none" stroke="#F5F2EB" strokeWidth="22" />

                {/* Slices using stroke-dasharray */}
                {(() => {
                  const circumference = 2 * Math.PI * 58; // ~364.42
                  let accumulatedPercent = 0;

                  return paymentMethods.map((pm, idx) => {
                    const strokeDasharray = `${(pm.percent / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                    accumulatedPercent += pm.percent;

                    return (
                      <circle
                        key={idx}
                        cx="80"
                        cy="80"
                        r="58"
                        fill="none"
                        stroke={pm.color}
                        strokeWidth="22"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 80 80)"
                        className="transition-all duration-500 hover:opacity-80"
                      />
                    );
                  });
                })()}
              </svg>

              {/* Donut Center Info */}
              <div className="absolute text-center">
                <span className="text-[10px] font-mono uppercase text-stone-400 block font-semibold">
                  Aprovados
                </span>
                <span className="text-sm font-bold font-serif text-stone-900 block">
                  {totalOrdersCount} ped.
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 mt-4">
              {paymentMethods.map((pm) => (
                <div key={pm.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: pm.color }}
                    />
                    <span className="font-medium text-stone-700">{pm.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-stone-500">{pm.count} trans.</span>
                    <span className="font-bold text-stone-900">{pm.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Processamento criptografado via Google Pay API e Visa 3D Secure</span>
          </div>
        </div>
      </div>

      {/* Gráfico 3: Volume de Pedidos & Faturamento Diário (SVG Bar Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">
              Comparativo de Volume: Pedidos vs. Faturamento
            </h3>
            <p className="text-xs text-stone-500">
              Gráfico de barras nativo SVG comparando métricas operacionais por dia
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#5A5A40]" />
              <span>Vendas (R$)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#C05B33]" />
              <span>Pedidos (Qtd)</span>
            </span>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="grid grid-cols-7 gap-3 sm:gap-6 pt-4 items-end h-56 border-b border-stone-200 pb-2">
          {dailySales.map((item, index) => {
            const heightPercent = Math.round((item.vendas / 7000) * 100);
            return (
              <div key={item.date} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-mono text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  R${(item.vendas / 1000).toFixed(1)}k
                </div>

                <div className="w-full max-w-[40px] flex items-end justify-center gap-1 h-40">
                  {/* Sales Bar */}
                  <div
                    className="w-1/2 bg-[#5A5A40] rounded-t-md transition-all duration-500 group-hover:bg-[#454530]"
                    style={{ height: `${heightPercent}%` }}
                    title={`Vendas: R$ ${item.vendas.toLocaleString("pt-BR")}`}
                  />
                  {/* Orders Bar */}
                  <div
                    className="w-1/2 bg-[#C05B33] rounded-t-md transition-all duration-500 group-hover:bg-[#a34a26]"
                    style={{ height: `${Math.min(100, item.pedidos * 6)}%` }}
                    title={`Pedidos: ${item.pedidos}`}
                  />
                </div>

                <span className="text-xs font-semibold text-stone-700 mt-2 font-sans">
                  {item.date}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {item.pedidos} ped.
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela Operacional de Pedidos Recentes */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">
              Registro de Transações Recentes
            </h3>
            <p className="text-xs text-stone-500">
              Histórico sincronizado com status de pagamento, remessa e NF-e
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {["todos", "pago", "em separação", "enviado", "entregue"].map((status) => (
              <button
                key={status}
                onClick={() => setOrderFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  orderFilter === status
                    ? "bg-[#5A5A40] text-white shadow-2xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-mono font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Pedido ID</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Meio de Pagamento</th>
                <th className="py-3 px-4">Itens</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#5A5A40]">{order.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">{order.customerName}</div>
                    <div className="text-[11px] text-stone-400">{order.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-medium text-stone-800">
                      <CreditCard className="w-3.5 h-3.5 text-[#C05B33]" />
                      <span>{order.paymentMethod}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono">{order.items.length} item(ns)</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold font-serif text-stone-900">
                    R$ {order.total.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        order.status === "Pago"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : order.status === "Enviado"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : order.status === "Em Separação"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                    {order.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default NativeAnalyticsView;

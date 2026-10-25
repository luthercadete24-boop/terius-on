import React from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Users,
  Compass,
  ArrowUpRight,
  Filter
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { DailySalesMetric, TrafficSourceMetric, Order } from "../../types/store";

interface AnalyticsViewProps {
  dailySales: DailySalesMetric[];
  trafficSources: TrafficSourceMetric[];
  orders: Order[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  dailySales,
  trafficSources,
  orders
}) => {
  // Calculations
  const totalSalesRevenue = orders
    .filter((o) => o.status !== "Cancelado" && o.status !== "Reembolsado")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrdersCount = orders.length;
  const avgTicket = totalOrdersCount > 0 ? totalSalesRevenue / totalOrdersCount : 0;
  const conversionRate = 3.42; // Realistic e-commerce conversion rate (%)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#C05B33] font-bold block">
            Painel de Desempenho
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Análises e Relatórios Operacionais
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Métricas em tempo real de faturamento, volume de transações e comportamento de aquisição de tráfego.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-stone-100 rounded-xl text-xs font-mono text-stone-600 border border-stone-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dados Sincronizados</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento Bruto */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold text-stone-600 uppercase font-mono">Volume de Vendas</span>
            <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-stone-900">
              R$ {totalSalesRevenue.toFixed(2).replace(".", ",")}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs semana anterior</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pedidos Concluídos */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold text-stone-600 uppercase font-mono">Total de Pedidos</span>
            <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-stone-900">
              {totalOrdersCount} pedidos
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>98% processados sem pendências</span>
            </div>
          </div>
        </div>

        {/* Card 3: Taxa de Conversão */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold text-stone-600 uppercase font-mono">Taxa de Conversão</span>
            <div className="p-2 bg-[#C05B33]/10 text-[#C05B33] rounded-xl">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-stone-900">
              {conversionRate.toFixed(2)}%
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-500 font-mono mt-1">
              <span>Média de mercado: 1.8% a 2.5%</span>
            </div>
          </div>
        </div>

        {/* Card 4: Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold text-stone-600 uppercase font-mono">Valor Médio do Pedido</span>
            <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-stone-900">
              R$ {avgTicket.toFixed(2).replace(".", ",")}
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-500 font-mono mt-1">
              <span>Ticket Médio otimizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Evolução das Vendas Diárias (Área) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Evolução Diária de Faturamento (R$)
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Receita bruta consolidada por dia da semana
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#5A5A40] bg-[#5A5A40]/10 px-2.5 py-1 rounded-lg">
              Últimos 7 dias
            </span>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5A5A40" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E0" vertical={false} />
                <XAxis dataKey="date" stroke="#727268" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#727268"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `R$${val}`}
                />
                <Tooltip
                  formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, "Faturamento"]}
                  labelFormatter={(lbl) => `Dia: ${lbl}`}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E6E6E0",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="#5A5A40"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Origem do Tráfego dos Visitantes (Pie/Rosca) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="pb-2 border-b border-stone-100">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Origem do Tráfego
            </h3>
            <p className="text-xs text-stone-400 font-mono">
              Canais de atração de visitantes
            </p>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Parcela de Tráfego"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E6E6E0",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Clean Legend */}
          <div className="space-y-1.5 pt-1 border-t border-stone-100">
            {trafficSources.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-stone-700 font-medium truncate max-w-[150px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-stone-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3: Volume de Pedidos Diários e Funil de Vendas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pedidos por dia (BarChart) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Volume de Pedidos Feitos
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Quantidade de compras finalizadas por dia
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#C05B33] bg-[#C05B33]/10 px-2.5 py-1 rounded-lg">
              Semanal
            </span>
          </div>

          <div className="h-[220px] w-full pt-2">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailySales} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E0" vertical={false} />
                <XAxis dataKey="date" stroke="#727268" fontSize={11} tickLine={false} />
                <YAxis stroke="#727268" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} pedidos`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E6E6E0",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="pedidos" fill="#C05B33" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funil de Conversão e Retenção */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="pb-2 border-b border-stone-100">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Funil de Conversão do E-Commerce
            </h3>
            <p className="text-xs text-stone-400 font-mono">
              Eficiência das etapas da jornada do consumidor
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>1. Sessões / Visitantes Únicos</span>
                <span className="font-mono">14.280 visitas (100%)</span>
              </div>
              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#5A5A40] h-full rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>2. Visualização de Produto</span>
                <span className="font-mono">8.420 visitantes (58.9%)</span>
              </div>
              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#5A5A40]/80 h-full rounded-full" style={{ width: "58.9%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>3. Adição ao Carrinho</span>
                <span className="font-mono">1.840 adições (12.8%)</span>
              </div>
              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#C05B33] h-full rounded-full" style={{ width: "12.8%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>4. Início de Checkout</span>
                <span className="font-mono">720 checkouts (5.0%)</span>
              </div>
              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#C05B33]/80 h-full rounded-full" style={{ width: "5.0%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-900 mb-1">
                <span>5. Vendas Concluídas & Pagas</span>
                <span className="font-mono text-emerald-700">489 compras pagas ({conversionRate}%)</span>
              </div>
              <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: "3.4%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;

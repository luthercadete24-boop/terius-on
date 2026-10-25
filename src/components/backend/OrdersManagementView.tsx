import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  FileText,
  RotateCcw,
  CheckCircle,
  Truck,
  Eye,
  X,
  Printer,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Order, OrderStatus } from "../../types/store";
import StatusBadge from "../common/StatusBadge";

interface OrdersManagementViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onProcessRefund: (orderId: string) => void;
}

export const OrdersManagementView: React.FC<OrdersManagementViewProps> = ({
  orders,
  onUpdateStatus,
  onProcessRefund
}) => {
  const [search, setSearch] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("todos");
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [nfeOrder, setNfeOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === "todos" || order.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const allStatuses: OrderStatus[] = [
    "Pendente",
    "Pago",
    "Em Separação",
    "Enviado",
    "Entregue",
    "Reembolsado",
    "Cancelado"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Search Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#C05B33] font-bold block">
            Operações em Tempo Real
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Gestão Centralizada de Pedidos
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Acompanhe compras, emita notas fiscais (NF-e), atualize rastreamento e processe reembolsos com 1 clique.
          </p>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono">
            <span className="text-stone-400">Total: </span>
            <strong className="text-stone-900">{orders.length} pedidos</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col md:flex-row gap-3 items-center justify-between shadow-2xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ID (PED-...), cliente ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#5A5A40]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedStatusFilter("todos")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              selectedStatusFilter === "todos"
                ? "bg-[#5A5A40] text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Todos ({orders.length})
          </button>
          {["Pago", "Em Separação", "Enviado", "Entregue", "Reembolsado"].map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedStatusFilter === st
                    ? "bg-[#5A5A40] text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-mono uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-4 font-semibold">ID / Data</th>
                <th className="py-3.5 px-4 font-semibold">Cliente</th>
                <th className="py-3.5 px-4 font-semibold">Itens</th>
                <th className="py-3.5 px-4 font-semibold">Total (R$)</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Pagamento & Canal</th>
                <th className="py-3.5 px-4 font-semibold text-right">Ações Operacionais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 font-mono">
                    Nenhum pedido encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-stone-900">{order.id}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{order.createdAt}</div>
                    </td>

                    {/* Cliente */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{order.customerName}</div>
                      <div className="text-[11px] text-stone-400 font-mono truncate max-w-[160px]">
                        {order.customerEmail}
                      </div>
                    </td>

                    {/* Itens */}
                    <td className="py-3.5 px-4">
                      <div className="text-stone-800">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="truncate max-w-[180px]">
                            <span className="font-mono font-bold">{it.quantity}x</span> {it.productName}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </td>

                    {/* Status with Change Selector */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="text-[11px] font-mono bg-stone-50 border border-stone-200 rounded-md py-0.5 px-1 text-stone-600 focus:outline-none cursor-pointer"
                        >
                          {allStatuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Pagamento & Canal */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800">{order.paymentMethod}</div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        Canal: {order.salesChannel}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ver Detalhes */}
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="Ver Detalhes do Pedido"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Emitir Nota Fiscal */}
                        <button
                          onClick={() => setNfeOrder(order)}
                          className="p-1.5 text-[#5A5A40] hover:bg-[#5A5A40]/10 rounded-lg transition-colors cursor-pointer"
                          title="Emitir / Visualizar Nota Fiscal (NF-e)"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Reembolso */}
                        {order.status !== "Reembolsado" && order.status !== "Cancelado" && (
                          <button
                            onClick={() => onProcessRefund(order.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Processar Reembolso & Restaurar Estoque"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Detalhes do Pedido */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-stone-200 relative animate-scale space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-[#C05B33]">
                  Detalhes da Compra
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Pedido {viewingOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status and tracking code */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-stone-400 block">Status Operacional</span>
                <StatusBadge status={viewingOrder.status} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-stone-400 block">Código de Rastreio</span>
                <span className="font-mono font-bold text-xs text-stone-800">
                  {viewingOrder.trackingCode}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 uppercase font-mono text-[11px]">
                Dados do Destinatário
              </h4>
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                <div><strong>Nome:</strong> {viewingOrder.customerName}</div>
                <div><strong>E-mail:</strong> {viewingOrder.customerEmail}</div>
                <div><strong>Telefone:</strong> {viewingOrder.customerPhone}</div>
                <div>
                  <strong>Endereço:</strong> {viewingOrder.shippingAddress.street}, {viewingOrder.shippingAddress.number} - {viewingOrder.shippingAddress.neighborhood}, {viewingOrder.shippingAddress.city}/{viewingOrder.shippingAddress.state} (CEP: {viewingOrder.shippingAddress.zipCode})
                </div>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 uppercase font-mono text-[11px]">
                Itens Comprados
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {viewingOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.productName}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                      />
                      <div>
                        <div className="font-semibold text-stone-900">{it.productName}</div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          {it.quantity} un. x R$ {it.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-stone-800">
                      R$ {(it.quantity * it.price).toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono space-y-1">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal:</span>
                <span>R$ {viewingOrder.subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Frete:</span>
                <span>R$ {viewingOrder.shipping.toFixed(2).replace(".", ",")}</span>
              </div>
              {viewingOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Desconto:</span>
                  <span>- R$ {viewingOrder.discount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-200">
                <span>Total:</span>
                <span>R$ {viewingOrder.total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Emissão e Visualização de Nota Fiscal (NF-e DANFE) */}
      {nfeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-stone-200 relative animate-scale space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5A5A40]" />
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Documento Auxiliar da Nota Fiscal Eletrônica (DANFE)
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">
                    {nfeOrder.nfeNumber} • Série 1 • Protocolo Autorizado pela SEFAZ
                  </span>
                </div>
              </div>
              <button
                onClick={() => setNfeOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* DANFE Header Box */}
            <div className="border border-stone-300 p-4 rounded-xl space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-200">
                <div>
                  <strong className="text-stone-900 block text-sm">TERÍUS COMÉRCIO VAREJISTA LTDA</strong>
                  <span className="text-stone-500 text-[11px] block">CNPJ: 45.123.890/0001-20 • IE: 112.983.472.110</span>
                  <span className="text-stone-500 text-[11px]">Rua dos Pinheiros, 800 - São Paulo, SP</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 text-[10px] block">CHAVE DE ACESSO:</span>
                  <span className="font-bold text-[11px] text-stone-800 break-all">
                    3526 1045 1238 9000 0120 5500 1000 0049 2110 9382 7114
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                    AUTORIZADA EM PRODUÇÃO
                  </span>
                </div>
              </div>

              {/* Destinatário */}
              <div className="pb-3 border-b border-stone-200">
                <div className="text-stone-500 font-semibold mb-1">DESTINATÁRIO / REMETENTE:</div>
                <div className="text-stone-900">
                  <strong>{nfeOrder.customerName}</strong> ({nfeOrder.customerEmail})
                </div>
                <div className="text-stone-600 text-[11px]">
                  {nfeOrder.shippingAddress.street}, {nfeOrder.shippingAddress.number} - {nfeOrder.shippingAddress.neighborhood}, {nfeOrder.shippingAddress.city}/{nfeOrder.shippingAddress.state} - CEP: {nfeOrder.shippingAddress.zipCode}
                </div>
              </div>

              {/* Produtos */}
              <div>
                <div className="text-stone-500 font-semibold mb-2">DADOS DOS PRODUTOS / SERVIÇOS:</div>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400">
                      <th>DESCRIÇÃO</th>
                      <th>QTD</th>
                      <th>VALOR UNIT.</th>
                      <th className="text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {nfeOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-1.5">{it.productName}</td>
                        <td className="py-1.5">{it.quantity}</td>
                        <td className="py-1.5">R$ {it.price.toFixed(2)}</td>
                        <td className="py-1.5 text-right font-bold">
                          R$ {(it.quantity * it.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cálculo do Imposto */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-200 bg-stone-50 p-2 rounded-lg text-[10px]">
                <div>
                  <span className="text-stone-400 block">BASE CÁLC. ICMS:</span>
                  <strong className="text-stone-800">R$ {nfeOrder.subtotal.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block">VALOR DO ICMS (18%):</span>
                  <strong className="text-stone-800">R$ {(nfeOrder.subtotal * 0.18).toFixed(2)}</strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block">VALOR TOTAL NOTA:</span>
                  <strong className="text-stone-900 text-xs">R$ {nfeOrder.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-stone-500">
                Documento emitido eletronicamente e enviado ao cliente.
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Comando de impressão do DANFE enviado com sucesso!")}
                  className="px-4 py-2 bg-[#5A5A40] hover:bg-[#43432e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir DANFE</span>
                </button>
                <button
                  onClick={() => setNfeOrder(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagementView;

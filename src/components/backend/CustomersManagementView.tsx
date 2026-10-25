import React, { useState } from "react";
import { Users, Search, Phone, Mail, MapPin, ShoppingBag, Eye, X, Star } from "lucide-react";
import { Customer, Order } from "../../types/store";
import StatusBadge from "../common/StatusBadge";

interface CustomersManagementViewProps {
  customers: Customer[];
  orders: Order[];
}

export const CustomersManagementView: React.FC<CustomersManagementViewProps> = ({
  customers,
  orders
}) => {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("todas");
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());

    const matchesTag = selectedTag === "todas" || c.tag === selectedTag;

    return matchesSearch && matchesTag;
  });

  // Calculate customer metrics
  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgLtv = customers.length > 0 ? totalSpentAll / customers.length : 0;
  const vipCount = customers.filter((c) => c.tag === "VIP").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#C05B33] font-bold block">
            Base Cadastral & Relacionamento
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Clientes e Histórico de Compras (CRM)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Armazenamento centralizado de contatos, frequência de pedidos, valor total investido (LTV) e segmentação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono">
            <span className="text-stone-400">Total de Clientes: </span>
            <strong className="text-stone-900">{customers.length} cadastrados</strong>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 font-mono uppercase block">Total em Compras (LTV Acumulado)</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            R$ {totalSpentAll.toFixed(2).replace(".", ",")}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 font-mono uppercase block">Valor Médio por Cliente (LTV)</span>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            R$ {avgLtv.toFixed(2).replace(".", ",")}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-400 font-mono uppercase block">Clientes VIP & Recorrentes</span>
          <div className="text-xl font-bold font-mono text-[#5A5A40] mt-1">
            {vipCount} clientes de alta fidelidade
          </div>
        </div>
      </div>

      {/* Search & Tag filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#5A5A40]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["todas", "VIP", "Recorrente", "Novo Cliente"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedTag === tag
                  ? "bg-[#5A5A40] text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tag === "todas" ? "Todas as Categorias" : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-mono uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-4 font-semibold">Cliente</th>
                <th className="py-3.5 px-4 font-semibold">Contato</th>
                <th className="py-3.5 px-4 font-semibold">Localização</th>
                <th className="py-3.5 px-4 font-semibold">Pedidos</th>
                <th className="py-3.5 px-4 font-semibold">Total Investido (LTV)</th>
                <th className="py-3.5 px-4 font-semibold">Classificação</th>
                <th className="py-3.5 px-4 font-semibold text-right">Histórico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 font-mono">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{cust.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        Última compra: {cust.lastOrderDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-stone-800">{cust.email}</div>
                      <div className="text-stone-400 text-[11px]">{cust.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      {cust.city}, {cust.state}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                      {cust.ordersCount} compras
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      R$ {cust.totalSpent.toFixed(2).replace(".", ",")}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={cust.tag} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveCustomer(cust)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-[#5A5A40] hover:text-white rounded-lg text-stone-700 text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Compras</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer/Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-stone-200 relative animate-scale space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-[#C05B33]">
                  Ficha do Cliente
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {activeCustomer.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveCustomer(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile info */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-stone-400">E-mail:</span>
                <strong className="text-stone-800">{activeCustomer.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Telefone:</span>
                <strong className="text-stone-800">{activeCustomer.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Cidade:</span>
                <strong className="text-stone-800">{activeCustomer.city} - {activeCustomer.state}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Perfil:</span>
                <StatusBadge status={activeCustomer.tag} />
              </div>
            </div>

            {/* Orders for this customer */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase font-mono text-stone-900">
                Histórico de Pedidos Vinculados
              </h4>
              {orders
                .filter((o) => o.customerEmail.toLowerCase() === activeCustomer.email.toLowerCase())
                .map((o) => (
                  <div key={o.id} className="p-3 rounded-xl border border-stone-200 bg-white flex justify-between items-center text-xs">
                    <div>
                      <div className="font-mono font-bold text-stone-900">{o.id}</div>
                      <div className="text-[10px] text-stone-400">{o.createdAt} • {o.items.length} itens</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-stone-900">R$ {o.total.toFixed(2)}</div>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCustomer(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManagementView;

import React from "react";
import { OrderStatus } from "../../types/store";

interface StatusBadgeProps {
  status: OrderStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let styleClasses = "bg-stone-100 text-stone-700 border-stone-200";
  let dotColor = "bg-stone-400";

  switch (status) {
    case "Pago":
      styleClasses = "bg-emerald-50 text-emerald-800 border-emerald-200";
      dotColor = "bg-emerald-500";
      break;
    case "Em Separação":
      styleClasses = "bg-amber-50 text-amber-800 border-amber-200";
      dotColor = "bg-amber-500";
      break;
    case "Enviado":
      styleClasses = "bg-sky-50 text-sky-800 border-sky-200";
      dotColor = "bg-sky-500";
      break;
    case "Entregue":
      styleClasses = "bg-[#5A5A40]/10 text-[#5A5A40] border-[#5A5A40]/25 font-semibold";
      dotColor = "bg-[#5A5A40]";
      break;
    case "Pendente":
      styleClasses = "bg-stone-100 text-stone-600 border-stone-300";
      dotColor = "bg-stone-400";
      break;
    case "Reembolsado":
      styleClasses = "bg-purple-50 text-purple-700 border-purple-200";
      dotColor = "bg-purple-500";
      break;
    case "Cancelado":
      styleClasses = "bg-rose-50 text-rose-700 border-rose-200";
      dotColor = "bg-rose-500";
      break;
    case "VIP":
      styleClasses = "bg-amber-100/70 text-amber-900 border-amber-300 font-bold";
      dotColor = "bg-amber-600";
      break;
    case "Recorrente":
      styleClasses = "bg-blue-50 text-blue-800 border-blue-200";
      dotColor = "bg-blue-500";
      break;
    case "Novo Cliente":
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      dotColor = "bg-emerald-500";
      break;
    case "Conectado":
      styleClasses = "bg-emerald-50 text-emerald-800 border-emerald-200";
      dotColor = "bg-emerald-500";
      break;
    case "Desativado":
      styleClasses = "bg-stone-100 text-stone-500 border-stone-200";
      dotColor = "bg-stone-400";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shadow-2xs whitespace-nowrap ${styleClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;

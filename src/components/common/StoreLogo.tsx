import React from "react";
import { ShoppingBag } from "lucide-react";

interface StoreLogoProps {
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

export const StoreLogo: React.FC<StoreLogoProps> = ({
  showTagline = true,
  size = "md",
  inverted = false
}) => {
  const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-5 h-5";
  const boxSize = size === "sm" ? "p-1.5" : size === "lg" ? "p-3" : "p-2";
  const titleSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${boxSize} rounded-xl transition-all shadow-xs ${
          inverted
            ? "bg-white text-[#5A5A40]"
            : "bg-[#5A5A40] text-stone-100"
        }`}
      >
        <ShoppingBag className={iconSize} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-serif font-bold tracking-tight ${titleSize} ${inverted ? "text-white" : "text-stone-900"}`}>
            Teríus
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-[#C05B33]/15 text-[#C05B33] font-mono">
            E-Commerce
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] font-mono mt-0.5 tracking-wider ${inverted ? "text-stone-300" : "text-stone-400"}`}>
            Design • Vestuário • Lifestyle
          </span>
        )}
      </div>
    </div>
  );
};

export default StoreLogo;

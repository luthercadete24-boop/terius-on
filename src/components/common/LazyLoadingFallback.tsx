import React from "react";

interface LazyLoadingFallbackProps {
  title: string;
}

export function LazyLoadingFallback({ title }: LazyLoadingFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-8 h-8 border-2 border-natural-primary/20 border-t-natural-primary rounded-full animate-spin mb-3" />
      <span className="text-xs font-serif font-bold italic text-natural-primary">{title}</span>
      <span className="text-[10px] text-stone-400 font-mono mt-1">Carregando sob demanda...</span>
    </div>
  );
}

export default LazyLoadingFallback;

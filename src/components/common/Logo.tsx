import React from "react";
import appLogo from "../../assets/images/app_logo_1787088683579.jpg";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export default function Logo({
  size = "md",
  showText = false,
  subtitle = "Portal de Inteligência Linguística",
  className = ""
}: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20"
  };

  const roundedClasses = {
    sm: "rounded-xl",
    md: "rounded-2xl",
    lg: "rounded-3xl",
    xl: "rounded-[28px]"
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} ${roundedClasses[size]} overflow-hidden border border-stone-200/80 shadow-xs bg-natural-primary/5 flex items-center justify-center shrink-0`}
      >
        <img
          src={appLogo}
          alt="Teríus on Logotipo"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          decoding="async"
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <h1
            className={`font-serif font-bold text-natural-primary tracking-tight leading-none ${titleSizes[size]}`}
          >
            Teríus on
          </h1>
          {subtitle && (
            <span className="text-[9px] font-mono tracking-widest text-[#8C8C70] uppercase font-bold mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

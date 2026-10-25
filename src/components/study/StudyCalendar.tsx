import React, { useState } from "react";
import { Calendar, Clock, CheckCircle, Plus, Trash2, Save, Sparkles, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CalendarioEstudos, Idioma } from "../../types";
import { isPortalOnline, queueOfflineAction } from "../../offlineStorage";

interface StudyCalendarProps {
  id_usuario: number;
  currentIdioma: Idioma;
  calendarEntries: CalendarioEstudos[];
  onCalendarUpdated: () => void;
}

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];

const METAS_MINUTOS = [15, 30, 45, 60, 90, 120];

export default function StudyCalendar({
  id_usuario,
  currentIdioma,
  calendarEntries,
  onCalendarUpdated
}: StudyCalendarProps) {
  const [selectedDia, setSelectedDia] = useState<number | null>(null);
  const [horaEstudo, setHoraEstudo] = useState("19:00");
  const [minutosMeta, setMinutosMeta] = useState(30);
  const [saving, setSaving] = useState(false);

  // Helper to find entry for a specific day and current language
  const findEntryForDay = (dia: number) => {
    return calendarEntries.find(
      (c) => c.dia_semana === dia && c.id_idioma === currentIdioma.id_idioma
    );
  };

  const handleSelectDay = (dia: number) => {
    const entry = findEntryForDay(dia);
    setSelectedDia(dia);
    if (entry) {
      setHoraEstudo(entry.hora_estudo ? entry.hora_estudo.substring(0, 5) : "19:00");
      setMinutosMeta(entry.minutos_meta);
    } else {
      setHoraEstudo("19:00");
      setMinutosMeta(30);
    }
  };

  const handleSave = async () => {
    if (selectedDia === null) return;
    setSaving(true);

    const payload = {
      id_usuario,
      id_idioma: currentIdioma.id_idioma,
      dia_semana: selectedDia,
      hora_estudo: horaEstudo,
      minutos_meta: minutosMeta
    };

    if (!isPortalOnline()) {
      queueOfflineAction("salvar_agenda", payload);
      onCalendarUpdated();
      setSelectedDia(null);
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/calendario/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar agenda");
      }

      onCalendarUpdated();
      setSelectedDia(null);
    } catch (err) {
      console.warn("Falha de rede ao salvar agenda. Gravando offline...", err);
      queueOfflineAction("salvar_agenda", payload);
      onCalendarUpdated();
      setSelectedDia(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dia: number) => {
    setSaving(true);
    const payload = {
      id_usuario,
      id_idioma: currentIdioma.id_idioma,
      dia_semana: dia
    };

    if (!isPortalOnline()) {
      queueOfflineAction("deletar_agenda", payload);
      onCalendarUpdated();
      setSelectedDia(null);
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/calendario/deletar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Erro ao remover agenda");
      }

      onCalendarUpdated();
      setSelectedDia(null);
    } catch (err) {
      console.warn("Falha de rede ao remover agenda. Gravando ação offline...", err);
      queueOfflineAction("deletar_agenda", payload);
      onCalendarUpdated();
      setSelectedDia(null);
    } finally {
      setSaving(false);
    }
  };

  const activeDaysCount = calendarEntries.filter(
    (c) => c.id_idioma === currentIdioma.id_idioma
  ).length;

  const totalWeeklyMinutes = calendarEntries
    .filter((c) => c.id_idioma === currentIdioma.id_idioma)
    .reduce((acc, curr) => acc + curr.minutos_meta, 0);

  return (
    <div className="bg-natural-card rounded-[32px] p-6 shadow-sm border border-stone-200 glow-indigo" id="study-calendar-root">
      <div className="flex items-center justify-between mb-4 border-b border-stone-150 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-natural-primary/10 text-natural-primary rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif italic font-bold text-natural-primary text-base">
              Agenda de Estudos
            </h3>
            <p className="text-xs text-stone-500">
              Planeje sua semana para {currentIdioma.nome_idioma}
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] text-stone-400 uppercase font-bold tracking-tight">
          <div>{activeDaysCount}/7 dias</div>
          <div className="text-natural-accent font-serif font-bold text-xs mt-0.5">{totalWeeklyMinutes} min/sem</div>
        </div>
      </div>

      {/* Week days visual grid with Natural Tones clay/moss layout */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {DIAS_SEMANA.map((diaStr, idx) => {
          const entry = findEntryForDay(idx);
          const isSelected = selectedDia === idx;
          const isToday = new Date().getDay() === idx;

          return (
            <button
              key={idx}
              onClick={() => handleSelectDay(idx)}
              className={`p-1.5 py-2.5 rounded-xl flex flex-col items-center justify-center border transition-all relative ${
                entry
                  ? "bg-natural-accent/10 border-natural-accent/30 text-natural-accent"
                  : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-100/50"
              } ${isSelected ? "ring-2 ring-natural-accent bg-[#C05B33]/15 border-transparent" : ""}`}
              title={`${diaStr}${entry ? ` às ${entry.hora_estudo.substring(0, 5)}` : " (Livre)"}`}
              type="button"
              id={`calendar-day-btn-${idx}`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider mb-1.5">
                {diaStr.substring(0, 3)}
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isToday
                    ? "bg-natural-accent text-white shadow-sm"
                    : entry
                    ? "bg-[#C05B33]/10 text-natural-accent"
                    : "bg-white border border-stone-200 text-stone-600"
                }`}
              >
                {entry ? (
                  <CheckCircle className="w-3.5 h-3.5 text-natural-accent" />
                ) : (
                  idx + 1
                )}
              </div>
              {entry && (
                <span className="text-[8px] font-mono mt-1 font-bold">
                  {entry.hora_estudo.substring(0, 5)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scheduled study planner popup helper */}
      <AnimatePresence mode="wait">
        {selectedDia !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mt-3"
            id="day-editor-popup"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-natural-primary flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {DIAS_SEMANA[selectedDia]}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDia(null)}
                className="text-[10px] text-stone-400 hover:text-stone-700 font-bold uppercase tracking-widest pointer-events-auto cursor-pointer"
              >
                Voltar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-1">
                  Horário de Estudo
                </label>
                <input
                  type="time"
                  value={horaEstudo}
                  onChange={(e) => setHoraEstudo(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-stone-200 text-stone-800 focus:outline-none focus:border-natural-primary"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-1">
                  Meta Diária
                </label>
                <select
                  value={minutosMeta}
                  onChange={(e) => setMinutosMeta(parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-stone-200 text-stone-800 focus:outline-none focus:border-natural-primary"
                >
                  {METAS_MINUTOS.map((m) => (
                    <option key={m} value={m}>
                      {m} minutos
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 px-3 flex items-center justify-center gap-1 bg-[#5A5A40] hover:bg-[#484832] text-white rounded-xl text-xs uppercase tracking-widest font-bold cursor-pointer"
                id="save-day-btn"
              >
                <Save className="w-3 h-3" />
                <span>Salvar Meta</span>
              </button>

              {findEntryForDay(selectedDia) && (
                <button
                  type="button"
                  onClick={() => handleDelete(selectedDia)}
                  disabled={saving}
                  className="p-2 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                  title="Apagar meta deste dia"
                  id="delete-day-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedDia === null && activeDaysCount === 0 && (
        <div className="text-center p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <Clock className="w-5 h-5 mx-auto text-stone-400 mb-1 animate-pulse" />
          <p className="text-[11px] text-stone-500 leading-relaxed italic">
            Nenhuma meta configurada. Toque em um dia da semana para agendar seus estudos!
          </p>
        </div>
      )}
    </div>
  );
}

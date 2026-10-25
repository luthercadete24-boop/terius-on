import { useState, useEffect, useCallback, useMemo } from "react";
import { Idioma, Nivel, ProgressoUsuario, Licao, Vocabulario, Gramatica, CalendarioEstudos } from "../types";
import { studyService, StudyDataResponse } from "../services/studyService";

export function useStudyData(userId: number | null) {
  const [loading, setLoading] = useState(false);
  const [idiomas, setIdiomas] = useState<Idioma[]>([]);
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [progresso, setProgresso] = useState<ProgressoUsuario[]>([]);
  const [calendario, setCalendario] = useState<CalendarioEstudos[]>([]);

  const [selectedIdioma, setSelectedIdioma] = useState<Idioma | null>(null);
  const [selectedNivel, setSelectedNivel] = useState<Nivel | null>(null);
  const [licoes, setLicoes] = useState<Licao[]>([]);
  const [selectedLicao, setSelectedLicao] = useState<Licao | null>(null);

  const [vocabulary, setVocabulary] = useState<Vocabulario[]>([]);
  const [grammar, setGrammar] = useState<Gramatica | null>(null);
  const [showExam, setShowExam] = useState(false);

  // Helper to determine the best active level for a language
  const pickActiveLevel = useCallback(
    (idioma: Idioma, allNiveis: Nivel[], allProgresso: ProgressoUsuario[]): Nivel | null => {
      const levelsForLang = allNiveis
        .filter((n) => n.id_idioma === idioma.id_idioma)
        .sort((a, b) => a.ordem_nivel - b.ordem_nivel);

      if (levelsForLang.length === 0) return null;

      const unlocked = levelsForLang.filter((n) => {
        const p = allProgresso.find((pr) => pr.id_nivel === n.id_nivel);
        return p && !p.bloqueado;
      });

      return unlocked[unlocked.length - 1] || levelsForLang[0];
    },
    []
  );

  const applyStudyData = useCallback(
    (data: StudyDataResponse) => {
      setIdiomas(data.idiomas || []);
      setNiveis(data.niveis || []);
      setProgresso(data.progresso || []);
      setCalendario(data.calendario || []);

      if (data.idiomas && data.idiomas.length > 0) {
        setSelectedIdioma((prevIdioma) => {
          const current = prevIdioma || data.idiomas[0];
          setSelectedNivel((prevNivel) => {
            if (prevNivel && prevNivel.id_idioma === current.id_idioma) {
              return prevNivel;
            }
            return pickActiveLevel(current, data.niveis || [], data.progresso || []);
          });
          return current;
        });
      }
    },
    [pickActiveLevel]
  );

  const fetchStudyData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await studyService.getStudyData(userId);
      applyStudyData(data);
    } catch (e) {
      console.error("Erro ao carregar dados do usuário:", e);
    } finally {
      setLoading(false);
    }
  }, [userId, applyStudyData]);

  // Initial load when userId changes
  useEffect(() => {
    if (userId) {
      fetchStudyData();
    } else {
      setIdiomas([]);
      setNiveis([]);
      setProgresso([]);
      setCalendario([]);
      setSelectedIdioma(null);
      setSelectedNivel(null);
      setLicoes([]);
      setSelectedLicao(null);
      setVocabulary([]);
      setGrammar(null);
      setShowExam(false);
    }
  }, [userId, fetchStudyData]);

  // Handle switching language
  const selectLanguage = useCallback(
    (idioma: Idioma) => {
      setSelectedIdioma(idioma);
      setShowExam(false);
      setSelectedLicao(null);
      setLicoes([]);
      setVocabulary([]);
      setGrammar(null);

      const nextLevel = pickActiveLevel(idioma, niveis, progresso);
      setSelectedNivel(nextLevel);
    },
    [niveis, progresso, pickActiveLevel]
  );

  // Fetch lessons when selected level changes
  useEffect(() => {
    if (!selectedNivel) {
      setLicoes([]);
      setSelectedLicao(null);
      return;
    }

    let isMounted = true;
    studyService
      .getLessons(selectedNivel.id_nivel)
      .then((data) => {
        if (!isMounted) return;
        setLicoes(data);
        if (data.length > 0) {
          setSelectedLicao(data[0]);
        } else {
          setSelectedLicao(null);
          setVocabulary([]);
          setGrammar(null);
        }
      })
      .catch((err) => {
        console.warn("Erro ao buscar lições do nível:", err);
      });

    setShowExam(false);

    return () => {
      isMounted = false;
    };
  }, [selectedNivel]);

  // Fetch lesson content (vocabulary, grammar) when active lesson changes
  useEffect(() => {
    if (!selectedLicao) {
      setVocabulary([]);
      setGrammar(null);
      return;
    }

    let isMounted = true;
    studyService
      .getLessonContent(selectedLicao.id_licao)
      .then((data) => {
        if (!isMounted) return;
        setVocabulary(data.vocabularios || []);
        setGrammar(data.gramatica || null);
      })
      .catch((err) => {
        console.warn("Erro ao carregar conteúdo da lição:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLicao]);

  const refreshData = useCallback(async () => {
    if (!userId) return;
    await fetchStudyData();
    if (selectedNivel) {
      try {
        const freshLessons = await studyService.getLessons(selectedNivel.id_nivel);
        setLicoes(freshLessons);
      } catch (err) {
        console.warn("Erro ao atualizar lições:", err);
      }
    }
  }, [userId, fetchStudyData, selectedNivel]);

  // Computed metrics
  const completedLevelsCount = useMemo(
    () => progresso.filter((p) => p.concluido).length,
    [progresso]
  );

  const progressPercent = useMemo(
    () => (progresso.length > 0 ? Math.round((completedLevelsCount / progresso.length) * 100) : 0),
    [completedLevelsCount, progresso.length]
  );

  const activeLevelProg = useMemo(
    () => (selectedNivel ? progresso.find((p) => p.id_nivel === selectedNivel.id_nivel) || null : null),
    [selectedNivel, progresso]
  );

  return {
    loading,
    idiomas,
    niveis,
    progresso,
    calendario,
    selectedIdioma,
    selectedNivel,
    setSelectedNivel,
    licoes,
    selectedLicao,
    setSelectedLicao,
    vocabulary,
    grammar,
    showExam,
    setShowExam,
    selectLanguage,
    refreshData,
    completedLevelsCount,
    progressPercent,
    activeLevelProg
  };
}

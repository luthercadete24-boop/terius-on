// Study Service for managing curriculum, lessons, exams, and scheduler
import { apiRequest } from "./api";
import { Idioma, Nivel, ProgressoUsuario, Licao, Vocabulario, Gramatica, CalendarioEstudos, ProvaFinal, QuestaoProva } from "../types";
import {
  isPortalOnline,
  getFromOfflineCache,
  saveToOfflineCache,
  queueOfflineAction
} from "../offlineStorage";

export interface StudyDataResponse {
  idiomas: Idioma[];
  niveis: Nivel[];
  progresso: ProgressoUsuario[];
  calendario: CalendarioEstudos[];
}

export interface LessonContentResponse {
  vocabularios: Vocabulario[];
  gramatica: Gramatica | null;
}

export interface ExamResponse {
  prova: ProvaFinal | null;
  questoes: QuestaoProva[];
}

export interface SubmitExamResult {
  success: boolean;
  nota: number;
  corretas: number;
  total_questoes: number;
  progresso: ProgressoUsuario;
  proximo_nivel_desbloqueado?: boolean;
}

export const studyService = {
  async getStudyData(userId: number): Promise<StudyDataResponse> {
    const cacheKey = `dados_estudo_${userId}`;

    // If offline, try reading immediately from cache
    if (!isPortalOnline()) {
      const cached = getFromOfflineCache<StudyDataResponse>(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await apiRequest<StudyDataResponse>(`/api/dados-estudo?id_usuario=${userId}`);
      saveToOfflineCache(cacheKey, data);
      return data;
    } catch (error) {
      console.warn("Falha de rede ao carregar dados de estudo. Recorrendo ao cache offline...", error);
      const cached = getFromOfflineCache<StudyDataResponse>(cacheKey);
      if (cached) return cached;
      throw error;
    }
  },

  async getLessons(nivelId: number): Promise<Licao[]> {
    const cacheKey = `licoes_nivel_${nivelId}`;

    if (!isPortalOnline()) {
      const cached = getFromOfflineCache<{ licoes: Licao[] }>(cacheKey);
      if (cached?.licoes) return cached.licoes;
    }

    try {
      const data = await apiRequest<{ licoes: Licao[] }>(`/api/licoes/${nivelId}`);
      saveToOfflineCache(cacheKey, data);
      return data.licoes || [];
    } catch (error) {
      console.warn("Falha de rede ao carregar lições. Recorrendo ao cache offline...", error);
      const cached = getFromOfflineCache<{ licoes: Licao[] }>(cacheKey);
      if (cached?.licoes) return cached.licoes;
      throw error;
    }
  },

  async getLessonContent(licaoId: number): Promise<LessonContentResponse> {
    const cacheKey = `licao_detalhes_${licaoId}`;

    if (!isPortalOnline()) {
      const cached = getFromOfflineCache<LessonContentResponse>(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await apiRequest<LessonContentResponse>(`/api/licoes/${licaoId}/conteudo`);
      saveToOfflineCache(cacheKey, data);
      return data;
    } catch (error) {
      console.warn("Falha de rede ao carregar conteúdo da lição. Recorrendo ao cache offline...", error);
      const cached = getFromOfflineCache<LessonContentResponse>(cacheKey);
      if (cached) return cached;
      throw error;
    }
  },

  async getExam(nivelId: number): Promise<ExamResponse> {
    const cacheKey = `prova_nivel_${nivelId}`;

    if (!isPortalOnline()) {
      const cached = getFromOfflineCache<ExamResponse>(cacheKey);
      if (cached) return cached;
    }

    try {
      const data = await apiRequest<ExamResponse>(`/api/provas/${nivelId}`);
      saveToOfflineCache(cacheKey, data);
      return data;
    } catch (error) {
      console.warn("Falha de rede ao carregar prova final. Recorrendo ao cache offline...", error);
      const cached = getFromOfflineCache<ExamResponse>(cacheKey);
      if (cached) return cached;
      throw error;
    }
  },

  async submitExam(
    nivelId: number,
    userId: number,
    respostas: Record<number, number>
  ): Promise<SubmitExamResult> {
    if (!isPortalOnline()) {
      queueOfflineAction("salvar_exame", {
        id_nivel: nivelId,
        id_usuario: userId,
        respostas
      });
      return {
        success: true,
        nota: 10,
        corretas: Object.keys(respostas).length,
        total_questoes: Object.keys(respostas).length,
        progresso: {
          id_progresso: Date.now(),
          id_usuario: userId,
          id_nivel: nivelId,
          bloqueado: false,
          concluido: true,
          nota_prova_final: 10
        },
        proximo_nivel_desbloqueado: true
      };
    }

    return apiRequest<SubmitExamResult>(`/api/provas/${nivelId}/submeter`, {
      method: "POST",
      body: JSON.stringify({ id_usuario: userId, respostas })
    });
  },

  async saveCalendarEntry(payload: {
    id_usuario: number;
    id_idioma: number;
    dia_semana: number;
    hora_estudo: string;
    minutos_meta: number;
  }): Promise<any> {
    if (!isPortalOnline()) {
      queueOfflineAction("salvar_agenda", payload);
      return { success: true, offline: true };
    }

    return apiRequest("/api/calendario/salvar", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async deleteCalendarEntry(payload: {
    id_usuario: number;
    id_idioma: number;
    dia_semana: number;
  }): Promise<any> {
    return apiRequest("/api/calendario/deletar", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async syncAllData(): Promise<any> {
    return apiRequest("/api/admin/sincronizar-tudo", {
      method: "POST"
    });
  }
};

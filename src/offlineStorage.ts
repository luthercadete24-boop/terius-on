// Offline Storage, Cache Manager, and Queue Synchronizer for LingoProgress

export interface OfflineAction {
  id: string;
  type: "salvar_exame" | "salvar_agenda" | "deletar_agenda" | "concluir_licao";
  payload: any;
  timestamp: string;
}

export interface OfflineStorageStats {
  hasStudyData: boolean;
  savedLanguagesCount: number;
  savedLevelsCount: number;
  savedLessonsCount: number;
  savedDetailedLessonsCount: number;
  savedDictionaryCount: number;
  pendingQueueCount: number;
  storageUsageKB: number;
}

const STORAGE_PREFIX = "lingoprogress_offline_";
const QUEUE_KEY = "lingoprogress_offline_sync_queue";
const MANUAL_OFFLINE_KEY = "lingoprogress_manual_offline_mode";

// Check if manually forced offline
export function isManualOfflineMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MANUAL_OFFLINE_KEY) === "true";
}

export function setManualOfflineMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MANUAL_OFFLINE_KEY, enabled ? "true" : "false");
  window.dispatchEvent(new Event("lingoprogress_offline_status_change"));
}

// Check effective online status
export function isPortalOnline(): boolean {
  if (typeof window === "undefined") return true;
  if (isManualOfflineMode()) return false;
  return navigator.onLine;
}

// Subscribe to online/offline network changes
export function subscribeToOnlineStatus(callback: (online: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStatusChange = () => {
    callback(isPortalOnline());
  };

  window.addEventListener("online", handleStatusChange);
  window.addEventListener("offline", handleStatusChange);
  window.addEventListener("lingoprogress_offline_status_change", handleStatusChange);

  return () => {
    window.removeEventListener("online", handleStatusChange);
    window.removeEventListener("offline", handleStatusChange);
    window.removeEventListener("lingoprogress_offline_status_change", handleStatusChange);
  };
}

// Generic local cache helper
export function saveToOfflineCache(key: string, data: any): void {
  try {
    const fullKey = STORAGE_PREFIX + key;
    localStorage.setItem(fullKey, JSON.stringify({
      data,
      savedAt: new Date().toISOString()
    }));
  } catch (err) {
    console.warn("Falha ao salvar no cache offline:", err);
  }
}

export function getFromOfflineCache<T = any>(key: string, defaultVal: T | null = null): T | null {
  try {
    const fullKey = STORAGE_PREFIX + key;
    const item = localStorage.getItem(fullKey);
    if (!item) return defaultVal;
    const parsed = JSON.parse(item);
    return parsed.data !== undefined ? parsed.data : parsed;
  } catch (err) {
    console.warn("Falha ao recuperar do cache offline:", err);
    return defaultVal;
  }
}

// Queue offline actions (such as exam completion or schedule updates)
export function queueOfflineAction(type: OfflineAction["type"], payload: any): OfflineAction {
  const queue = getOfflineQueue();
  const newAction: OfflineAction = {
    id: "action_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    type,
    payload,
    timestamp: new Date().toISOString()
  };
  queue.push(newAction);
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error("Erro ao salvar fila offline:", e);
  }
  return newAction;
}

export function getOfflineQueue(): OfflineAction[] {
  try {
    const item = localStorage.getItem(QUEUE_KEY);
    if (!item) return [];
    return JSON.parse(item) || [];
  } catch (err) {
    return [];
  }
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
}

// Synchronize all pending offline mutations to the backend
export async function syncPendingOfflineActions(): Promise<{ synced: number; failed: number }> {
  if (!isPortalOnline()) {
    return { synced: 0, failed: 0 };
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { synced: 0, failed: 0 };
  }

  let synced = 0;
  let failed = 0;
  const remainingQueue: OfflineAction[] = [];

  for (const action of queue) {
    try {
      if (action.type === "salvar_exame") {
        const res = await fetch(`/api/provas/${action.payload.id_nivel}/submeter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: action.payload.id_usuario,
            respostas: action.payload.respostas
          })
        });
        if (res.ok) {
          synced++;
        } else {
          remainingQueue.push(action);
          failed++;
        }
      } else if (action.type === "salvar_agenda") {
        const res = await fetch("/api/calendario/salvar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.payload)
        });
        if (res.ok) {
          synced++;
        } else {
          remainingQueue.push(action);
          failed++;
        }
      } else if (action.type === "deletar_agenda") {
        const res = await fetch("/api/calendario/deletar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.payload)
        });
        if (res.ok) {
          synced++;
        } else {
          remainingQueue.push(action);
          failed++;
        }
      } else {
        synced++;
      }
    } catch (e) {
      remainingQueue.push(action);
      failed++;
    }
  }

  try {
    if (remainingQueue.length > 0) {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
    } else {
      localStorage.removeItem(QUEUE_KEY);
    }
  } catch (e) {
    console.error(e);
  }

  return { synced, failed };
}

// Download entire course catalogue (all 8 languages, 24 levels, 240 lessons, dictionary) for 100% offline study
export async function downloadEntireCourseOffline(
  userId: number,
  onProgress?: (progress: number, message: string) => void
): Promise<{ success: boolean; lessonsDownloaded: number; error?: string }> {
  try {
    onProgress?.(5, "Carregando catálogo de idiomas e níveis...");

    // 1. Fetch study data (Idiomas, Níveis, Progresso, Calendário)
    const studyRes = await fetch(`/api/dados-estudo?id_usuario=${userId}`);
    if (!studyRes.ok) throw new Error("Erro ao carregar dados do usuário");
    const studyData = await studyRes.json();
    saveToOfflineCache("dados_estudo_" + userId, studyData);
    saveToOfflineCache("catalogo_geral", {
      idiomas: studyData.idiomas,
      niveis: studyData.niveis
    });

    const niveis = studyData.niveis || [];
    const totalNiveis = niveis.length;
    let lessonsDownloaded = 0;

    // 2. Fetch and cache all lessons for each level
    for (let i = 0; i < totalNiveis; i++) {
      const nivel = niveis[i];
      const percent = Math.round(10 + (i / totalNiveis) * 50);
      onProgress?.(percent, `Baixando lições de ${nivel.nivel_atual} (Nível ${i + 1}/${totalNiveis})...`);

      try {
        const licoesRes = await fetch(`/api/licoes/${nivel.id_nivel}`);
        if (licoesRes.ok) {
          const licoesData = await licoesRes.json();
          saveToOfflineCache(`licoes_nivel_${nivel.id_nivel}`, licoesData);
          
          // Also fetch each individual lesson details (explanations, vocabularies, grammars)
          const licoesList = licoesData.licoes || [];
          for (const licao of licoesList) {
            try {
              const detailRes = await fetch(`/api/licoes/${licao.id_licao}/conteudo`);
              if (detailRes.ok) {
                const detailData = await detailRes.json();
                saveToOfflineCache(`licao_detalhes_${licao.id_licao}`, detailData);
                lessonsDownloaded++;
              }
            } catch (err) {
              // continue
            }
          }
        }
      } catch (err) {
        console.warn(`Erro ao baixar lições do nível ${nivel.id_nivel}:`, err);
      }

      // Also fetch final exam for this level
      try {
        const examRes = await fetch(`/api/provas/${nivel.id_nivel}`);
        if (examRes.ok) {
          const examData = await examRes.json();
          saveToOfflineCache(`prova_final_nivel_${nivel.id_nivel}`, examData);
        }
      } catch (err) {
        // continue
      }
    }

    // 3. Fetch dictionary dataset
    onProgress?.(80, "Baixando vocabulário completo do dicionário...");
    try {
      const dictRes = await fetch("/api/dicionario/busca?q=&idioma=Todos");
      if (dictRes.ok) {
        const dictData = await dictRes.json();
        saveToOfflineCache("dicionario_completo", dictData.results || []);
      }
    } catch (err) {
      console.warn("Erro ao baixar dicionário:", err);
    }

    onProgress?.(100, "Download offline concluído com sucesso!");
    return { success: true, lessonsDownloaded };
  } catch (err: any) {
    console.error("Falha no download offline:", err);
    return { success: false, lessonsDownloaded: 0, error: err.message };
  }
}

// Calculate current offline storage stats
export function getOfflineStorageStats(): OfflineStorageStats {
  if (typeof window === "undefined") {
    return {
      hasStudyData: false,
      savedLanguagesCount: 0,
      savedLevelsCount: 0,
      savedLessonsCount: 0,
      savedDetailedLessonsCount: 0,
      savedDictionaryCount: 0,
      pendingQueueCount: 0,
      storageUsageKB: 0
    };
  }

  let totalBytes = 0;
  let savedLessonsCount = 0;
  let savedDetailedLessonsCount = 0;
  let savedLanguagesCount = 0;
  let savedLevelsCount = 0;
  let savedDictionaryCount = 0;
  let hasStudyData = false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key) || "";
    totalBytes += key.length + value.length;

    if (key.startsWith(STORAGE_PREFIX + "dados_estudo_")) {
      hasStudyData = true;
      try {
        const parsed = JSON.parse(value)?.data;
        if (parsed?.idiomas) savedLanguagesCount = parsed.idiomas.length;
        if (parsed?.niveis) savedLevelsCount = parsed.niveis.length;
      } catch (e) {}
    } else if (key.startsWith(STORAGE_PREFIX + "licoes_nivel_")) {
      try {
        const parsed = JSON.parse(value)?.data;
        if (parsed?.licoes) savedLessonsCount += parsed.licoes.length;
      } catch (e) {}
    } else if (key.startsWith(STORAGE_PREFIX + "licao_detalhes_")) {
      savedDetailedLessonsCount++;
    } else if (key.startsWith(STORAGE_PREFIX + "dicionario_completo")) {
      try {
        const parsed = JSON.parse(value)?.data;
        if (Array.isArray(parsed)) savedDictionaryCount = parsed.length;
      } catch (e) {}
    }
  }

  const queue = getOfflineQueue();

  return {
    hasStudyData,
    savedLanguagesCount,
    savedLevelsCount,
    savedLessonsCount,
    savedDetailedLessonsCount,
    savedDictionaryCount,
    pendingQueueCount: queue.length,
    storageUsageKB: Math.round(totalBytes / 1024)
  };
}

// Clear all offline cached data (keeps user login credentials and user preferences)
export function clearOfflineCache(): void {
  if (typeof window === "undefined") return;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}

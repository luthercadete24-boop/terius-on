import { useState, useEffect } from "react";
import {
  isPortalOnline,
  subscribeToOnlineStatus,
  syncPendingOfflineActions
} from "../offlineStorage";

export interface SyncToast {
  message: string;
  type: "success" | "info" | "warning";
}

export function useNetworkStatus(onReconnect?: () => void) {
  const [isOnline, setIsOnline] = useState<boolean>(() => isPortalOnline());
  const [syncToast, setSyncToast] = useState<SyncToast | null>(null);

  useEffect(() => {
    let timeoutId: any = null;

    const showToast = (toast: SyncToast, duration = 4000) => {
      if (timeoutId) clearTimeout(timeoutId);
      setSyncToast(toast);
      timeoutId = setTimeout(() => {
        setSyncToast(null);
      }, duration);
    };

    const unsubscribe = subscribeToOnlineStatus(async (online) => {
      setIsOnline(online);
      if (online) {
        showToast(
          { message: "Conexão restabelecida. Sincronizando dados pendentes...", type: "info" },
          3500
        );

        const res = await syncPendingOfflineActions();
        if (res.synced > 0) {
          showToast(
            {
              message: `Sincronização concluída: ${res.synced} alteraç${res.synced > 1 ? "ões" : "ão"} enviada(s) à nuvem!`,
              type: "success"
            },
            5000
          );
        } else {
          showToast({ message: "Conectado ao servidor.", type: "success" }, 3000);
        }

        onReconnect?.();
      } else {
        showToast(
          {
            message: "Modo Offline ativado. Você pode continuar estudando suas lições baixadas normalmente.",
            type: "warning"
          },
          5000
        );
      }
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [onReconnect]);

  return { isOnline, syncToast, setSyncToast };
}

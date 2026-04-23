import { useCallback, useEffect, useState } from "react";

export type GeolocationPermission = "prompt" | "granted" | "denied";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  permission: GeolocationPermission;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = "geolocation:last";
const TTL_MS = 60 * 60 * 1000; // 1 hour

interface StoredLocation {
  lat: number;
  lng: number;
  timestamp: number;
  permission: GeolocationPermission;
}

function readStored(): StoredLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredLocation;
    if (Date.now() - parsed.timestamp > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(data: StoredLocation): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage disabled or quota — silently ignore
  }
}

function clearStored(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(() => {
    const stored = readStored();
    if (stored) {
      return {
        lat: stored.lat,
        lng: stored.lng,
        permission: stored.permission,
        loading: false,
        error: null,
      };
    }
    return {
      lat: null,
      lng: null,
      permission: "prompt",
      loading: false,
      error: null,
    };
  });

  // Permissions API — agar brauzer denied holatda bo'lsa, avvaldan bilib olamiz
  useEffect(() => {
    if (!("permissions" in navigator)) return;
    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((status) => {
        if (cancelled) return;
        if (status.state === "denied") {
          setState((s) => ({ ...s, permission: "denied" }));
          clearStored();
        } else if (status.state === "granted") {
          setState((s) => ({ ...s, permission: "granted" }));
        }
      })
      .catch(() => {
        // noop
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const request = useCallback((): Promise<{
    lat: number;
    lng: number;
  } | null> => {
    if (!("geolocation" in navigator)) {
      setState((s) => ({
        ...s,
        permission: "denied",
        error: "Geolocation not supported",
      }));
      return Promise.resolve(null);
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          writeStored({
            lat,
            lng,
            timestamp: Date.now(),
            permission: "granted",
          });
          setState({
            lat,
            lng,
            permission: "granted",
            loading: false,
            error: null,
          });
          resolve({ lat, lng });
        },
        (err) => {
          const denied = err.code === err.PERMISSION_DENIED;
          clearStored();
          setState((s) => ({
            ...s,
            permission: denied ? "denied" : s.permission,
            loading: false,
            error: err.message,
          }));
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: TTL_MS,
        },
      );
    });
  }, []);

  const clear = useCallback(() => {
    clearStored();
    setState({
      lat: null,
      lng: null,
      permission: "prompt",
      loading: false,
      error: null,
    });
  }, []);

  return { ...state, request, clear };
}

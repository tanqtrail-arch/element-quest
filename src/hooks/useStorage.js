import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "eq_save_v2";

function getStorage() {
  try {
    if (window.storage) return window.storage;
  } catch {
    // ignore
  }
  // Fallback to localStorage
  return {
    get: (key) => {
      const v = localStorage.getItem(key);
      return v ? { value: v } : null;
    },
    set: (key, value) => localStorage.setItem(key, value),
  };
}

const defaultState = {
  clearedStages: [],
  perfectStages: [],
  stageScores: {},
  bestScores: {},
  discovered: [],
};

export function useGameStorage() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storage = getStorage();
        const r = await storage.get(STORAGE_KEY);
        if (r) setData(JSON.parse(r.value));
        else setData(defaultState);
      } catch {
        setData(defaultState);
      }
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (newData) => {
    setData(newData);
    try {
      const storage = getStorage();
      if (newData) await storage.set(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // ignore
    }
  }, []);

  const reset = useCallback(async () => {
    await save(defaultState);
  }, [save]);

  return { data, loaded, save, reset };
}

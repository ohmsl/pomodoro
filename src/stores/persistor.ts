// persistor.ts
import { load } from "@tauri-apps/plugin-store";
import { StateCreator, StoreApi } from "zustand";

interface PersistOptions<T extends object> {
  name: string;
  version?: number;
  merge?: (persistedState: Partial<T>, currentState: T) => T;
  migrate?: (persistedState: any, version: number) => T;
  onRehydrate?: (state: T, api: StoreApi<T>) => void;
}

export const createPersistMiddleware = <T extends object>(
  config: StateCreator<T>,
  options: PersistOptions<T>
): StateCreator<T> => {
  return (set, get, api) => {
    const { name, version, migrate, merge, onRehydrate } = options;

    const setState: typeof set = (partial, replace) => {
      set(partial as any, replace as any);

      // save the new state to storage
      (async () => {
        try {
          const store = await load("store.json", {
            autoSave: true,
            defaults: {},
          });
          const stateToSave = { ...get(), _persistVersion: version };
          store.set(name, stateToSave);
          await store.save();
        } catch (err) {
          console.error("Failed to save state:", err);
        }
      })();
    };

    // initialise the store with default values
    const initialState = config(setState, get, api);

    // load persisted state and merge it
    (async () => {
      try {
        const store = await load("store.json", {
          autoSave: true,
          defaults: {},
        });
        const persistedState = (await store.get(name)) as any;

        if (persistedState) {
          const persistedVersion = persistedState._persistVersion || 0;
          let state: T;

          if (version !== persistedVersion) {
            if (migrate) {
              // migrate the persisted state to the new version
              state = migrate(persistedState, persistedVersion);
            } else {
              // ff no migrate function is provided, use initial state
              console.warn(
                `Persisted state version (${persistedVersion}) does not match current version (${version}), and no migrate function was provided. Using initial state.`
              );
              state = initialState;
            }
          } else {
            // versions match, use the persisted state
            state = persistedState;
          }

          delete (state as any)._persistVersion;

          const newState = merge
            ? merge(state as Partial<T>, initialState)
            : { ...initialState, ...state };

          set(newState, true);

          if (onRehydrate) {
            onRehydrate(newState as T, api);
          }
        }
      } catch (err) {
        console.error("Failed to load persisted state:", err);
      }
    })();

    return initialState;
  };
};

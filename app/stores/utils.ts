import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage"

export const createPersistedStore = <T extends object,>({ name, state }: { name: string, state: StateCreator<T> }) => create(
  persist<T>(
    state,
    {
      name,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (tohidrateState) => {
        const retrieveDefaultValue = async () => {
          try {
            const defaultValue = await AsyncStorage.getItem(name);
            tohidrateState = JSON.parse(defaultValue);
          } catch (e) {
            __DEV__ && console.error(e);
          }
        }

        retrieveDefaultValue();
      }
    }
  )
)

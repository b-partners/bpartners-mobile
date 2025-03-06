import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateCreator, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const createPersistedStore = <T extends object>({ name, state }: { name: string; state: StateCreator<T> }) =>
  create(
    persist<T>(state, {
      name,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: _toHidrateState => {
        const retrieveDefaultValue = async () => {
          try {
            const defaultValue = await AsyncStorage.getItem(name);
            _toHidrateState = JSON.parse(defaultValue);
          } catch (e) {
            __DEV__ && console.error(e);
          }
        };

        retrieveDefaultValue();
      },
    })
  );

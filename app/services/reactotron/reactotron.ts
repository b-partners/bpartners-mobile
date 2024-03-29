import AsyncStorage from '@react-native-async-storage/async-storage';
import { onSnapshot } from 'mobx-state-tree';
import { Platform } from 'react-native';
import { ArgType } from 'reactotron-core-client';
import { mst } from 'reactotron-mst';

import { RootStore } from '../../models/stores/root-store/root-store';
import { goBack, navigate, resetRoot } from '../../navigators/navigation-utilities';
import { clear } from '../../utils/storage';
import { DEFAULT_REACTOTRON_CONFIG, ReactotronConfig } from './reactotron-config';
import { Tron } from './tron';

// Teach TypeScript about the bad things we want to do.
declare global {
  interface Console {
    /**
     * Hey, it's Reactotron if we're in dev, and no-ops if we're in prod.
     */
    tron: typeof Tron;
  }
}

/** Do Nothing. */
const noop = () => undefined;

// in dev, we attach Reactotron, in prod we attach a interface-compatible mock.
if (__DEV__) {
  console.tron = Tron; // attach reactotron to `__DEV__ && console.tron`
} else {
  // attach a mock so if things sneaky by our __DEV__ guards, we won't crash.
  console.tron = {
    benchmark: noop,
    clear: noop,
    close: noop,
    configure: noop,
    connect: noop,
    display: noop,
    error: noop,
    image: noop,
    log: noop,
    logImportant: noop,
    onCustomCommand: noop,
    overlay: noop,
    reportError: noop,
    send: noop,
    startTimer: noop,
    storybookSwitcher: noop,
    use: noop,
    useReactNative: noop,
    warn: noop,
  };
}

/**
 * You'll probably never use the service like this since we hang the Reactotron
 * instance off of `__DEV__ && console.tron`. This is only to be consistent with the other
 * services.
 */
export class Reactotron {
  config: ReactotronConfig;

  rootStore: any;

  /**
   * Create the Reactotron service.
   *
   * @param config the configuration
   */
  constructor(config: ReactotronConfig = DEFAULT_REACTOTRON_CONFIG) {
    // merge the passed in config with some defaults
    this.config = {
      host: 'localhost',
      useAsyncStorage: true,
      ...config,
      state: {
        initial: false,
        snapshots: false,
        ...(config && config.state),
      },
    };
  }

  /**
   * Hook into the root store for doing awesome state-related things.
   *
   * @param rootStore The root store
   */
  setRootStore(rootStore: any, initialData: any) {
    if (__DEV__) {
      rootStore = rootStore as RootStore; // typescript hack
      this.rootStore = rootStore;

      const { initial, snapshots } = this.config.state;
      const name = 'ROOT STORE';

      // logging features
      if (initial) {
        __DEV__ && console.tron.display({ name, value: initialData, preview: 'Initial State' });
      }
      // log state changes?
      if (snapshots) {
        onSnapshot(rootStore, snapshot => {
          __DEV__ && console.tron.display({ name, value: snapshot, preview: 'New State' });
        });
      }

      __DEV__ && console.tron.trackMstNode(rootStore);
    }
  }

  /**
   * Configure reactotron based on the the config settings passed in, then connect if we need to.
   */
  async setup() {
    // only run this in dev... metro bundler will ignore this block: 🎉
    if (__DEV__) {
      // configure reactotron
      Tron.configure({
        name: this.config.name || require('../../../package.json').name,
        host: this.config.host,
      });

      // hookup middleware
      if (Platform.OS !== 'web') {
        if (this.config.useAsyncStorage) {
          Tron.setAsyncStorageHandler(AsyncStorage);
        }
        Tron.useReactNative({
          asyncStorage: this.config.useAsyncStorage ? undefined : false,
        });
      }

      // ignore some chatty `mobx-state-tree` actions
      const RX = /postProcessSnapshot|@APPLY_SNAPSHOT/;

      // hookup mobx-state-tree middleware
      Tron.use(
        mst({
          filter: event => RX.test(event.name) === false,
        })
      );

      // connect to the app
      Tron.connect();

      // Register Custom Commands
      Tron.onCustomCommand({
        title: 'Reset Root Store',
        description: 'Resets the MST store',
        command: 'resetStore',
        handler: () => {
          __DEV__ && console.tron.log('resetting store');
          clear();
        },
      });

      Tron.onCustomCommand({
        title: 'Reset Navigation State',
        description: 'Resets the navigation state',
        command: 'resetNavigation',
        handler: () => {
          __DEV__ && console.tron.log('resetting navigation state');
          resetRoot({ index: 0, routes: [] });
        },
      });

      Tron.onCustomCommand({
        command: 'navigateTo',
        handler: args => {
          const { route } = args;
          if (route) {
            console.log(`Navigating to: ${route}`);
            navigate(route);
          } else {
            console.log('Could not navigate. No route provided.');
          }
        },
        title: 'Navigate To Screen',
        description: 'Navigates to a screen by name.',
        args: [
          {
            name: 'route',
            type: ArgType.String,
          },
        ],
      });

      Tron.onCustomCommand({
        title: 'Go Back',
        description: 'Goes back',
        command: 'goBack',
        handler: () => {
          __DEV__ && console.tron.log('Going back');
          goBack();
        },
      });

      // clear if we should
      if (this.config.clearOnLoad) {
        Tron.clear();
      }
    }
  }
}

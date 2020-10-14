import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import localforage from 'localforage'
import {pullAll, keys} from 'lodash'

import vuexPersistReady from '@/store/plugins/vuex-persist-ready'

import AppSession from '@/store/modules/session'
import AppModule from '@/store/modules/app'
import AppWallet from '@/store/modules/wallet'
import AppNetwork from '@/store/modules/network'
import AppBlockchain from '@/store/modules/blockchain'
import AppMarket from '@/store/modules/market'
import SmartHolderModule from '@/store/modules/smartholder'

Vue.use(Vuex);

const modules = {
  app: AppModule,
  session: AppSession,
  wallet: AppWallet,
  network: AppNetwork,
  blockchain: AppBlockchain,
  market: AppMarket,
  smartholder: SmartHolderModule,
};

// Modules that should not be persisted
const ignoreModules = [];

const vuexPersist = new VuexPersistence({
  // It is necessary to enable the strict mode to watch to mutations, such as `RESTORE_MUTATION`
  strictMode: true,
  asyncStorage: true,
  key: 'sth-wallet',
  storage: localforage,
  modules: pullAll(keys(modules), ignoreModules)
});

export default new Vuex.Store({
  modules,
  strict: true, //process.env.NODE_ENV !== 'production',
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
  },
  actions: {
    resetData() {
      return localforage.clear()
    }
  },
  plugins: [
    vuexPersist.plugin,
    vuexPersistReady
  ]
})

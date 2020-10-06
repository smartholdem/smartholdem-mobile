import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterPrefetch from 'vue-router-prefetch'
import DashboardPlugin from './plugins/dashboard-plugin';
//import VueNativeSock from 'vue-native-websocket'

//import Clipboard from 'v-clipboard'
import VueClipboard  from 'vue-clipboard2'
import App from './App.vue';
// router setup
import router from './routes/router';
import i18n from './i18n';
import './registerServiceWorker'
import store from './store'

import eventBus from '@/plugins/event-bus'
import synchronizer from './plugins/synchronizer'
import VueQrcodeReader from "vue-qrcode-reader";
import mixins from './mixins'

VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);
//Vue.use(Clipboard)

Vue.config.productionTip = false;
Vue.prototype.$eventBus = eventBus;

// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);
Vue.use(synchronizer);
Vue.use(VueQrcodeReader);

Vue.mixin(mixins);
/*
Vue.use(VueNativeSock, network.WS, {
  format: 'json',
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  //reconnectionAttempts: 100, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 6000, // (Number) how long to initially wait before attempting a new (1000)
});
 */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  i18n
});

import {coins} from '@/config'

let open;
if (process.env.IS_ELECTRON) {
  open = require('open');
}

export default {
  data() {
    return {
      coins,
    }
  },
  methods: {
    openLink(url, type = '_blank') {
      if (url) {
        if (process.env.IS_ELECTRON) {
          (async () => {
            await open(url);
          })();
        } else {
          window.open(url, type);
        }
      }
    }
  }
}

import {coins} from '@/config'

let open;
if (process.env.IS_ELECTRON) {
  open = require('open');
}

export default {
  data() {
    return {
      coins,
      mixval: {
        copied: 'Copy to clipboard'
      },
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
    },
    clipboardSuccess(value) {
      this.mixval.copied = 'Copied to clipboard';
      setTimeout(() => (this.mixval.copied = 'Copy to clipboard'), 1500);
      //console.log('success', value.text)
      // Copied to clipboard
    },
  }
}

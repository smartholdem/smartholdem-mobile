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
    async pubKeyByAddress(address) {
      return (this.$store.getters['app/accounts'][address]).pubKey || null
    },
    async addressDecrypt(address, pin) {
      const secret = await this.$store.dispatch('app/walletDecrypt', {
        address: address,
        pin: pin
      })
      return secret
    },
    notify(verticalAlign, horizontalAlign, type = 'success', msg = 'Success') {
      this.$notify({
        message: msg,
        timeout: 5000,
        icon: 'tim-icons icon-bell-55',
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: type
      });
    },
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

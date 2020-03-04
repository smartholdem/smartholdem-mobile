<template>
  <div>
    <card class="stacked-form">
      <template slot="header">
        <h3 class="card-title font-weight-bold">Create New Wallet
          <base-button @click="getNewAccount()" type="primary" round icon class="ml-2">
              <i class="fas fa-dice" style="font-size: 1.1rem;padding:0;"></i>
          </base-button>
        </h3>
      </template>

      <p class="text-primary font-weight-bold"  v-clipboard="() => account.secret"><i class="tim-icons icon-lock-circle"></i>{{$t('APP.YOUR_SECRET')}}
      <textarea rows="3" class="w-100 border-dark rounded" v-model="account.secret"></textarea>
      </p>


      <p class="text-primary font-weight-bold" v-clipboard="() => account.address">{{$t('APP.YOUR_PUB_ADDR')}}
        <base-input
          v-model="account.address"
          addon-left-icon="tim-icons icon-wallet-43"
          class="pointer"
        >
        </base-input>
      </p>

      <base-checkbox v-model="checks.lose" class="text-left">
        {{$t('APP.IF_LOSE')}}
      </base-checkbox>

      <base-button :disabled="!checks.lose || !account.address" @click="saveAccount" slot="footer" type="primary" round
                   block size="lg" class="text-uppercase">
        CREATE & SAVE WALLET
      </base-button>
    </card>

    <BotBtnWlt/>
  </div>
</template>

<script>
import {BaseCheckbox} from 'src/components'
import sth from 'sthjs'
import {entropyToMnemonic, validateMnemonic} from 'bip39'
import * as cryptoRandomString from 'crypto-random-string'
import {BaseAlert} from 'src/components'
import BotBtnWlt from '@/components/Mobile/BotBtnWlt'

export default {
  name: "WalletCreate",
  components: {
    BaseCheckbox,
    BaseAlert,
    BotBtnWlt,
  },
  data() {
    return {
      showConditions: false,
      isMobile: false,
      mobileClass: '',
      step: 1,
      checks: {
        agree: false,
        lose: false
      },
      isBip39: null,
      toolTipsContent: {
        copy: "Copy"
      },
      account: {
        address: null,
        secret: null,
        pubKey: null,
        name: 'SmartHoldem'
      },
      model: {
        pin: '',
        name: 'SmartHoldem',
        pinR: ''
      }
    }
  },
  methods: {
   getNewAccount() {
      const privateKeyHex = cryptoRandomString({length: 32})
      const mnemonic = entropyToMnemonic(privateKeyHex)
      const PUB_KEY = sth.crypto.getKeys(mnemonic).publicKey
      this.account.address = sth.crypto.getAddress(PUB_KEY)
      this.account.secret = mnemonic
      this.account.pubKey = PUB_KEY
    },
    saveAccount() {
      this.$store.dispatch('app/setAccount', {
        pin: this.$root.pin,
        address: this.account.address,
        secret: this.account.secret,
        pubKey: this.account.pubKey
      })

      this.$router.push('/wallet/')

    },
    clipboardSuccessHandler({value, event}) {
      this.toolTipsContent.copy = 'Copied to clipboard';
      setTimeout(() => (this.toolTipsContent.copy = 'Copy'), 1500);
      // Copied to clipboard
    },
    getError(fieldName) {
      return this.errors.first(fieldName)
    },
    async register() {
      let isValidForm = await this.$validator.validateAll()
      if (isValidForm) {
        const privateKeyHex = cryptoRandomString({length: 32})
        const mnemonic = entropyToMnemonic(privateKeyHex)
        const PUB_KEY = sth.crypto.getKeys(mnemonic).publicKey
        this.account.address = sth.crypto.getAddress(PUB_KEY)
        this.account.secret = mnemonic
        this.account.pubKey = PUB_KEY
      }
    }
  },
  async created() {
    this.isMobile = window.innerWidth < 720
    window.onresize = () => {
      this.isMobile = window.innerWidth < 720
    }

    if (this.isMobile) {
      this.mobileClass = 'ismobile'
    }
    this.getNewAccount()
  }
}
</script>

<style scoped>

</style>

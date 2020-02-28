<template>
  <div>
    <card class="card-white stacked-form">
      <template slot="header">
        <h2 class="card-title text-dark font-weight-bold">Create New Wallet
          <base-button @click="getNewAccount()" type="primary" round icon class="ml-2">
            <el-tooltip
              content="Generate Other Address"
              effect="light"
              :open-delay="300"
              placement="top"
            >
              <i class="fas fa-dice" style="font-size: 1.1rem;padding:0;"></i>
            </el-tooltip>
          </base-button>
        </h2>
      </template>

      <p class="text-primary font-weight-bold"  v-clipboard="() => account.secret"><i class="tim-icons icon-lock-circle"></i>{{$t('APP.YOUR_SECRET')}}</p>
      <textarea rows="3" class="w-100 border-dark rounded" v-model="account.secret"></textarea>

      <hr>
      <p class="text-primary font-weight-bold" v-clipboard="() => account.address">{{$t('APP.YOUR_PUB')}}</p>
        <base-input
          v-model="account.address"
          addon-left-icon="tim-icons icon-wallet-43"
          class="pointer"
        >
        </base-input>

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

<template>
  <div>
    <card class="card-white stacked-form">
      <template slot="header">
        <h4 class="card-title text-dark font-weight-bold">Import Wallet</h4>
      </template>

      <p class="text-black-50">{{$t('APP.ENTER_SECRET')}}</p>
      <base-input
        v-model="account.secret"
        addon-left-icon="tim-icons icon-lock-circle"
        class="pointer"
        @input="validateImportAccount()"
      >
      </base-input>
      <base-alert v-show="isBip39 === false" type="warning" class="mb-1"><i class="tim-icons icon-bell-55"></i>
        {{$t('APP.NO_BIP39')}}
      </base-alert>
      <p class="text-black-50">{{$t('APP.YOUR_PUB')}}</p>
      <el-tooltip
        :content="toolTipsContent.copy"
        effect="light"
        :open-delay="300"
        placement="top"
      >
        <base-input
          v-model="account.address"
          addon-left-icon="tim-icons icon-wallet-43"
          class="pointer"
          v-clipboard="() => account.address"
        >
        </base-input>
      </el-tooltip>

      <base-checkbox v-model="checks.lose" class="text-left">
        {{$t('APP.IF_LOSE')}}
      </base-checkbox>

      <base-button :disabled="!checks.lose || !account.address" @click="saveAccount" slot="footer" type="primary" round
                   block size="lg" class="text-uppercase">
        SAVE & CONTINUE
      </base-button>
    </card>

    <BotBtnWlt/>

  </div>
</template>

<script>
import {Modal} from '@/components'
import {BaseCheckbox} from 'src/components'
import sth from 'sthjs'
import {entropyToMnemonic, validateMnemonic} from 'bip39'
import * as cryptoRandomString from 'crypto-random-string'
import {BaseAlert} from 'src/components'
import BotBtnWlt from '@/components/Mobile/BotBtnWlt'

export default {
  name: "WalletImport",
  components: {
    BaseCheckbox,
    BaseAlert,
    Modal,
    BotBtnWlt
  },
  data() {
    return {
      delay: 500,
      validateTimer: null,
      showConditions: false,
      isMobile: false,
      mobileClass: '',
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
      },
    }
  },
  methods: {
    importAccount() {
      this.account.address = null
      this.account.secret = null
      this.account.pubKey = null
      this.isBip39 = null
    },
    getNewAccount() {
      const privateKeyHex = cryptoRandomString({length: 32})
      const mnemonic = entropyToMnemonic(privateKeyHex)
      const PUB_KEY = sth.crypto.getKeys(mnemonic).publicKey
      this.account.address = sth.crypto.getAddress(PUB_KEY)
      this.account.secret = mnemonic
      this.account.pubKey = PUB_KEY
    },
    async validateImportAccount() {
      if (this.account.secret.length > 7) {
        clearTimeout(this.validateTimer)
        this.validateTimer = setTimeout(async() => {
          const PUB_KEY = sth.crypto.getKeys(this.account.secret).publicKey
          this.account.address = sth.crypto.getAddress(PUB_KEY)
          this.isBip39 = validateMnemonic(this.account.secret)
          this.account.pubKey = PUB_KEY
        }, this.delay)
      } else {
        this.account.address = null
        this.isBip39 = null
      }
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
        // TIP use this.model to send it to api and perform register call
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
  }
}
</script>

<style scoped>

</style>

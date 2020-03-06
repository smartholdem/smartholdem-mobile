<template>
  <div>
    <card class="stacked-form">
      <div>
        <h3 class="card-title font-weight-bold">Import Wallet
          <base-button @click="show.qrLoadPriv = true" type="primary" round icon class="float-right">
            <i class="fas fa-qrcode" style="font-size: 1.3rem"></i>
          </base-button>
        </h3>
      </div>

      <div>

        <p v-show="account.label">{{account.label}}</p>
        <base-input
          :label="$t('APP.ENTER_SECRET')"
          v-model="account.secret"
          addon-left-icon="tim-icons icon-lock-circle"
          class="pointer"
          @input="validateImportAccount()"
        >
        </base-input>
        <base-alert v-show="isBip39 === false" type="danger" class="mb-1 small p-1"><i
          class="tim-icons icon-bell-55"></i>
          {{$t('APP.NO_BIP39')}}
        </base-alert>

        <base-input
          :label="$t('APP.YOUR_PUB_ADDR')"
          v-model="account.address"
          addon-left-icon="tim-icons icon-wallet-43"
          class="pointer"
          v-clipboard="() => account.address"
        >
        </base-input>

        <base-checkbox v-model="checks.lose" class="text-left">
          {{$t('APP.IF_LOSE')}}
        </base-checkbox>

        <base-button :disabled="!checks.lose || !account.address" @click="saveAccount" slot="footer" type="primary"
                     round
                     block size="lg" class="text-uppercase">
          SAVE & CONTINUE
        </base-button>
      </div>
    </card>

    <BotBtnWlt/>

    <div v-if="show.qrLoadPriv">
      <QrLoadPrivKey :show="show.qrLoadPriv" @onQrClose="show.qrLoadPriv = false"/>
    </div>

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

import QrLoadPrivKey from '@/components/Mobile/QrLoadPrivKey'

export default {
  name: "WalletImport",
  components: {
    BaseCheckbox,
    BaseAlert,
    Modal,
    BotBtnWlt,
    QrLoadPrivKey,
  },
  data() {
    return {
      show: {
        qrLoadPriv: false,
      },
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
        secondSecret: null,
        label: null,
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
        this.validateTimer = setTimeout(async () => {
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
        secondSecret: this.account.secondSecret,
        pubKey: this.account.pubKey
      })

      if (this.account.label) {
        this.$store.dispatch('wallet/setLabel', {
          address: this.account.address,
          label: this.account.label
        })
      }

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

    this.$eventBus.on('qr:importpkey', async (data) => {
      this.show.qrLoadPriv = false
      this.account.secret = data.secret || null
      this.account.secondSecret = data.secondSecret || null
      this.account.address = data.address || null
      this.account.label = data.label || null
      await this.validateImportAccount()
    })
  }
}
</script>

<style scoped>

</style>

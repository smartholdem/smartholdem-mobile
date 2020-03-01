<template>
  <div class="container">
    <div class="row">
      <div v-if="!isMobile" class="col-md-5 ml-auto">
        <div class="info-area info-horizontal mt-5">
          <div class="icon icon-warning">
            <i class="tim-icons icon-wallet-43"></i>
          </div>
          <div class="description">
            <h3 class="info-title">{{$t('APP.TITLE')}}</h3>
            <p class="description">
              {{$t('APP.BASED_STH')}}
            </p>
          </div>
        </div>
        <div class="info-area info-horizontal">
          <div class="icon icon-warning">
            <i class="tim-icons icon-lock-circle"></i>
          </div>
          <div class="description">
            <h3 class="info-title">{{$t('APP.PROTECT')}}</h3>
            <p class="description">
              {{$t('APP.PROTECT_DATA')}}
            </p>
          </div>
        </div>
        <div class="info-area info-horizontal">
          <div class="icon icon-warning">
            <i class="tim-icons icon-money-coins"></i>
          </div>
          <div class="description">
            <h3 class="info-title">Public Address</h3>
            <p class="description">
              {{$t('APP.GET_UADDR')}}
            </p>
          </div>
          <div v-if="step === 2" class="description text-center">
            <p class="text-white"> - {{$t('APP.OR')}} - </p>
            <base-button @click="importAccount" type="danger" round class="w-100 text-uppercase"><i class="tim-icons icon-cloud-upload-94"></i> {{$t('APP.IMPORT_ACCOUNT')}}</base-button>
          </div>
          <div v-if="step === 21" class="description text-center">
            <p> - {{$t('APP.OR')}} - </p>
            <base-button @click="getNewAccount" type="danger" round class="w-100 text-uppercase"><i class="tim-icons icon-single-02"></i> {{$t('APP.GET_NEW_ACC')}}</base-button>
          </div>
        </div>
      </div>

      <div v-if="isMobile" class="col-md-12 ml-auto">
        <div class="info-area">
          <div v-if="step === 2" class="description text-center">
            <base-button @click="importAccount" type="danger" class="w-100 text-uppercase"><i class="tim-icons icon-cloud-upload-94"></i> {{$t('APP.IMPORT_ACCOUNT')}}</base-button>
          </div>
          <div v-if="step === 21" class="description text-center">
            <base-button @click="getNewAccount" type="dark" class="w-100 text-uppercase"><i class="tim-icons icon-single-02"></i> {{$t('APP.GET_NEW_ACC')}}</base-button>
          </div>
        </div>
      </div>

      <div class="col-md-7 mr-auto">
        <form v-if="step === 1" @submit.prevent="register">
          <card class="card-register card-white">
            <template slot="header">
              <img class="card-img" src="img/card-primary.png" alt="register"/>
              <h4 class="card-title text-white">encryption</h4>
            </template>

            <base-input
              v-validate="'required|min:4'"
              :error="getError('pin')"
              v-model="model.pin"
              name="pin"
              type="password"
              placeholder="* Pin Code"
              addon-left-icon="tim-icons icon-lock-circle"
              class="bg-white"
              autocomplete="off"
            >
            </base-input>

            <base-input
              v-validate="'required|min:4'"
              :error="getError('pinR')"
              v-model="model.pinR"
              name="pinR"
              type="password"
              :placeholder="'* '+$t('APP.REPEAT') + ' Pin'"
              addon-left-icon="tim-icons icon-lock-circle"
              class="bg-white"
              @input="pinValidate"
              autocomplete="off"
            >
            </base-input>

            <base-checkbox
              class="text-left form-check-inline"
              style="z-index: 10000;"
              v-model="checks.agree"
            >
              {{$t('APP.AGREE1')}}
            </base-checkbox>
            <span class="text-primary pointer position-relative" @click="showConditions = true">{{$t('APP.AGREE2')}}</span>

            <base-button
              :disabled="!checks.agree"
              native-type="submit" slot="footer" type="primary" round block size="lg" class="text-uppercase">
              {{$t('APP.CONTINUE')}} <i class="tim-icons icon-double-right"></i>
            </base-button>
          </card>
        </form>

        <!-- STEP 2 -->
        <card v-if="step === 2" class="card-register card-white stacked-form">
          <template slot="header">
            <img class="card-img" src="/img/card-primary.png" alt="Card image"/>
            <h4 class="card-title">New Wallet</h4>
          </template>

          <p class="text-black-50">{{$t('APP.YOUR_PUB_ADDR')}}</p>
          <el-tooltip
            :content="toolTipsContent.copy"
            effect="light"
            :open-delay="300"
            placement="top"
          >
            <base-input
              v-model="account.address"
              readonly
              addon-left-icon="tim-icons icon-single-copy-04"
              class="pointer"
              v-clipboard="() => account.address"
              v-clipboard:success="clipboardSuccessHandler"
            >
            </base-input>
          </el-tooltip>

          <p class="text-black-50">{{$t('APP.YOUR_SECRET')}}</p>
          <el-tooltip
            :content="toolTipsContent.copy"
            effect="light"
            :open-delay="300"
            placement="top"
          >
            <base-input
              v-model="account.secret"
              readonly
              addon-left-icon="tim-icons icon-single-copy-04"
              class="pointer"
              v-clipboard="() => account.secret"
              v-clipboard:success="clipboardSuccessHandler"
            >
            </base-input>
          </el-tooltip>

          <base-checkbox class="text-left">
            {{$t('APP.I_SAVED')}}
          </base-checkbox>

          <base-checkbox v-model="checks.lose" class="text-left">
            {{$t('APP.IF_LOSE')}}
          </base-checkbox>


          <base-button :disabled="!checks.lose" @click="saveAccount" slot="footer" type="primary" round block size="lg" class="text-uppercase">
            <i class="tim-icons icon-check-2"></i> {{$t('APP.GET_STARTED')}}
          </base-button>

        </card>

        <!-- STEP 2.1 IMPORT-->
        <card v-if="step === 21" class="card-register card-white stacked-form">
          <template slot="header">
            <img class="card-img" src="img/card-primary.png" alt="Card image"/>
            <h4 class="card-title">Import</h4>
          </template>

          <p class="text-black-50">{{$t('APP.ENTER_SECRET')}}</p>
          <base-input
            v-model="account.secret"
            addon-left-icon="tim-icons icon-single-copy-04"
            class="pointer"
            @input="validateImportAccount"
          >
          </base-input>
          <base-alert v-show="isBip39 === false" type="warning" class="mb-1 small p-1"><i class="tim-icons icon-bell-55"></i> {{$t('APP.NO_BIP39')}}</base-alert>
          <p class="text-black-50">{{$t('APP.YOUR_PUB')}}</p>
          <el-tooltip
            :content="toolTipsContent.copy"
            effect="light"
            :open-delay="300"
            placement="top"
          >
            <base-input
              v-model="account.address"
              readonly
              addon-left-icon="tim-icons icon-single-copy-04"
              class="pointer"
              v-clipboard="() => account.address"
            >
            </base-input>
          </el-tooltip>

          <base-checkbox v-model="checks.lose" class="text-left">
            {{$t('APP.IF_LOSE')}}
          </base-checkbox>

          <base-button :disabled="!checks.lose || !account.address" @click="saveAccount" slot="footer" type="primary" round block size="lg" class="text-uppercase">
            <i class="tim-icons icon-check-2"></i> {{$t('APP.GET_STARTED')}}
          </base-button>
        </card>

      </div>
    </div>

    <modal
      :show.sync="showConditions"
      class="modal-conditions h-100"
      headerClasses="justify-content-center"
    >
      <h2 class="text-center">Terms and Conditions</h2>
      <div>
        <div class="card-body">
          <p>
            Technologies related to blockchain are subject to supervision and control by various regulatory bodies
            around the world.
          </p>
          <p>SmartHoldem tokens may fall under one or more requests or actions on their part, including but not limited
            to imposing restrictions on the use or possession of digital tokens such as SmartHoldem that can slow or
            limit the functionality of SmartHoldem tokens in the future.</p>
          <p>
            SmartHoldem tokens are not an investment.
          </p>
          <p>
            SmartHoldem tokens are not a “surrogate currency”.
          </p>
          <p>
            SmartHoldem tokens are not official or legally binding investment. Due to unforeseen circumstances, the
            objectives described in this document may be amended. Despite the fact that we intend to reach all the
            points described in this document, all persons and parties involved in the purchase of SmartHoldem tokens
            do this at their own risk.
          </p>
          <p>
            <span class="font-weight-bolder">The risk of using new technologies.</span><br>
            Cryptographic tokens, such as SmartHoldem, are a new and experimental technology. In addition to the
            risks mentioned in this document, there are additional risks that the SmartHoldem team can not foresee.
            These risks can materialize in other forms of risk than those specified here.
          </p>
        </div>
      </div>


      <h2 class="text-center">Disclaimer of Warranties</h2>
      <div>
        <div class="card-body">
          <p>You agree that your use or inability to use SmartHoldem cryptocoins is carried out solely at your own risk
            and</p>
          <p>you don't put any responsibility on SmartHoldem Team.</p>
          <p>You agree that your use or inability to use SmartHoldem tokens is carried out solely at your own risk
            and</p>
          <p>you don't put any responsibility on SmartHoldem Team.</p>
        </div>
      </div>

      <template slot="footer">
      </template>
    </modal>

  </div>
</template>
<script>
import {Modal} from '@/components'
import {BaseCheckbox} from 'src/components'
import sth from 'sthjs'
import {entropyToMnemonic, validateMnemonic} from 'bip39'
import * as cryptoRandomString from 'crypto-random-string'
import {BaseAlert} from 'src/components'
import CryptoJS from 'crypto-js'

export default {
  components: {
    BaseCheckbox,
    BaseAlert,
    Modal
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
    importAccount() {
      this.account.address = null
      this.account.secret = null
      this.account.pubKey = null
      this.isBip39 = null
      this.step = 21
    },
    getNewAccount() {
      this.step = 2
      const privateKeyHex = cryptoRandomString({length: 32})
      const mnemonic = entropyToMnemonic(privateKeyHex)
      const PUB_KEY = sth.crypto.getKeys(mnemonic).publicKey
      this.account.address = sth.crypto.getAddress(PUB_KEY)
      this.account.secret = mnemonic
      this.account.pubKey = PUB_KEY
    },
    async validateImportAccount() {
      if (this.account.secret.length > 7) {
        const PUB_KEY = sth.crypto.getKeys(this.account.secret).publicKey
        this.account.address = sth.crypto.getAddress(PUB_KEY)
        this.isBip39 = validateMnemonic(this.account.secret)
        this.account.pubKey = PUB_KEY
      } else {
        this.account.address = null
        this.isBip39 = null
      }
    },
    async saveAccount() {
      await this.$store.dispatch('app/setAccount', {
        pin: CryptoJS.SHA384(this.model.pin).toString(),
        name: this.model.name,
        address: this.account.address,
        secret: this.account.secret,
        pubKey: this.account.pubKey
      })

      await this.$store.dispatch('app/setSettings', {
        name: this.model.name,
        sound: true,
        partner: ''
      })

      await this.$store.dispatch('wallet/getTxsByAddress')
      this.account.secret = null
      await this.$store.dispatch('wallet/setCurrentAddress', this.account.address)
      this.$router.push('/lock/')
    },
    clipboardSuccessHandler({value, event}) {
      this.toolTipsContent.copy = 'Copied to clipboard';
      setTimeout(() => (this.toolTipsContent.copy = 'Copy'), 1500);
      // Copied to clipboard
    },
    pinValidate() {
      if (this.model.pin === this.model.pinR) {
        this.$store.dispatch('app/setPinEnc', this.model.pin)
        return true
      } else {
        return false
      }
    },
    getError(fieldName) {
      return this.errors.first(fieldName)
    },
    async register() {
      let isValidForm = await this.$validator.validateAll()
      if (isValidForm && this.pinValidate()) {
        this.step = 2
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
  computed: {

  },
  async created() {
    this.$store.dispatch('session/setAuth', false)
    this.$root.pin = null

    this.isMobile = window.innerWidth < 720
    window.onresize = () => {
      this.isMobile = window.innerWidth < 720
    }

    if (this.isMobile) {
      this.mobileClass = 'ismobile'
    }

    if (this.$store.getters['app/pinEncrypted']) {
      this.$router.push({path: '/lock'}) // enable on production
    }
  }
};
</script>
<style>
  .card.card-white .form-control[readonly] {
    background: transparent;
    cursor: copy;
  }

  .pointer:hover {
    cursor:pointer
  }
  .set-locale {
    position: absolute;
    z-index: 10000;
    color: #d153e0;
  }

  @media screen and (max-width: 700px) {
    .card-register .card-header {
      padding: 0 !important;
      height: 100px;
    }

    .card.card-register .card-img {
      width: 100%;
    }

  }

  /*
    .card-register .card-img {
      position: absolute;
      left: 0;
      top: -1%;
      width: 100%;
    }
  */
  @media (min-width: 576px) {
    .modal-conditions .modal-dialog {
      max-width: 900px;
      margin: 1.75rem auto;
    }
  }

  .register-page {
    background: #200107 url("/images/balloon.jpg") !important;
  }

  .info-title {
    color: #fff !important;
  }
</style>

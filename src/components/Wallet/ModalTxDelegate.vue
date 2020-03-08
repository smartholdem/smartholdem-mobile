<template>
  <modal
    :show.sync="showModalDelegate"
    :class="modalColor"
    :show-close="true"
    headerClasses="justify-content-center"
    type="default"
  >
    <div slot="header" class="modal-profile">
      <i class="tim-icons icon-bank"></i>
    </div>
    <div>
      <p class="text-center">Delegate Registration</p>
      <p class="text-center">REGISTRATION FEE <span class="font-weight-bolder text-danger">55 000</span> STH</p>

      <base-input
        type="text"
        placeholder="* Uniq Delegate name"
        addon-left-icon="tim-icons icon-paper"
        v-model="delegate.name"
        v-validate="'min:4|max:64'"
        maxlength="64"
        @input="validateDelegate"
      >
      </base-input>
    </div>

    <template slot="footer">
      <base-button @click="confirmAction" :disabled="!delegate.available" type="neutral info" link class="">&nbsp;
        <span>{{$t('APP.CONFIRM')}} Registration</span>
      </base-button>
      <base-button @click="$emit('onModalClose'); showModalDelegate = false" type="neutral" link class="">
        {{$t('APP.CANCEL')}}
      </base-button>
    </template>
  </modal>
</template>

<script>
import {Modal} from '@/components'
import eventBus from '@/plugins/event-bus'

export default {
  name: "ModalTxDelegate",
  components: {
    Modal,
  },
  data() {
    return {
      validateTimer: null,
      delegate: {
        name: null,
        available: false,
      },
      account: {
        secret: null,
        secondSecret: null,
      },
    }
  },
  props: {
    showModalDelegate: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: '',
    },
  },
  computed: {
    modalColor() {
      let result = 'modal-white'
      if ((this.$store.getters['app/settings']).darkMode) {
        result = 'modal-dark'
      }
      return result
    },
  },
  methods: {
    async validateDelegate() {
      this.delegate.name = this.delegate.name.replace(/[^a-z0-9]+/g, '')
      if (this.delegate.name.length > 3 && this.delegate.name.length < 65) {
        this.delegate.available = true
        clearTimeout(this.validateTimer)
        this.validateTimer = setTimeout(async () => {

        }, this.delay)
      } else {
        this.delegate.available = false
      }
    },
    async walletDecrypt(address) {
      const secret = await this.$store.dispatch('app/walletDecrypt', {
        address: address,
        pin: this.$root.pin
      })
      this.address = address
      this.account.secret = secret
      return this.account
    },
    async confirmAction() {
      const decryptData = await this.walletDecrypt(this.address)
      const response = await this.$store.dispatch('wallet/TxDelegateRegister', {
        secret: decryptData.secret,
        name: this.delegate.name,
        secondSecret: null
      })

      if (response.success === true) {
        this.notifyVue('bottom', 'right', 'success', 'Delegate ' + this.delegate.name + ' registration success')

        eventBus.emit('addtx:unconfirmed', {
          id: response.transactionIds[0],
          confirmations: 0,
          time: "wait",
          amount: '-55 000',
          senderId: this.address,
          recipientId: this.address,
          vendorField: this.delegate.name,
          type: 2,
          asset: null,
          op: "-"
        })

        setTimeout(async () => {
          await this.$store.dispatch('blockchain/getAccount', this.address)
          await this.$store.dispatch('wallet/getTxsByAddress')
          await this.$store.dispatch('wallet/getBalances')
          this.account = {
            secret: null,
            secondSecret: null,
          }
          this.delegate = {
            name: null,
            available: false,
          }
        }, 10000)

      } else {
        this.notifyVue('top', 'center', 'danger', 'Error send tx, please retry!')
      }

      this.$emit('onModalClose')
      this.showModalDelegate = false
    },
    notifyVue(verticalAlign, horizontalAlign, type = 'success', msg = 'Success') {
      this.$notify({
        message: msg,
        timeout: 10000,
        icon: 'tim-icons icon-bell-55',
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: type
      });
    },
  },
  async created() {
    this.validateTimer = null
    this.delegate = {
      name: null,
      available: false,
    }
  }
}
</script>

<style scoped>

</style>

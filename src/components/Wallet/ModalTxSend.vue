<template>
  <modal
    :show.sync="showModal"
    :class="$root.modalColor"
    :show-close="true"
    headerClasses="justify-content-center"
  >

    <div slot="header" class="modal-profile">
      <i class="tim-icons icon-spaceship"></i>
    </div>

    <p class="text-center">
      {{$t('WALLET.SEND')}} SmartHoldem [STH]
    </p>

    <div class="row">

      <div>
        <base-dropdown
          :menuOnRight="false"
          title-classes="btn btn-icon btn-fab btn-default btn-round tim-icons icon-book-bookmark btn-simple btn-warning ml-3"
        >
          <span v-if="!contactList.length" class="dropdown-item">No saved contacts</span>
          <span v-for="(item, idx) in contactList" :key="idx" :id="'ct-' + idx" class="dropdown-item"
                @click="send.address = item.address; validateAddress()">
              <span class="font-weight-bolder">{{item.label}}</span> {{item.address.substr(0,8)}}... {{item.address.substr(-9)}}
            </span>
        </base-dropdown>
      </div>

      <base-button type="warning" @click="openLayerQr" round icon simple class="float-left ml-3 p-0 m-0">
        <i class="fas fa-qrcode" style="font-size: 1.3rem"></i>
      </base-button>
    </div>

    <div v-if="!tx.id">
      <div style="height:30px; float:left; width:100%; margin-top: -25px;">
            <span v-show="!isValidAddress && send.address" class="badge badge-danger float-right"><i
              class="tim-icons icon-bell-55"></i> Address not valid</span>
        <span v-show="isValidAddress || !send.address" class="badge badge-success float-right">Fee 1 STH</span>
      </div>
      <div class="row">
        <div class="col-md-11 mr-0">
          <base-input
            :class="modalClasses.address"
            type="text"
            placeholder="Enter Recipient Address"
            addon-left-icon="tim-icons icon-single-02"
            v-model="send.address"
            @input="validateAddress"
          >
          </base-input>

        </div>


        <div class="col-md-11 mr-0">
          <base-input
            :class="modalClasses.amount"
            type="text"
            placeholder="Enter Amount STH"
            addon-left-icon="tim-icons icon-coins"
            v-model="send.amount"
            @input="validateAmount"
          >
          </base-input>
          <base-input
            type="text"
            placeholder="Memo Optional"
            addon-left-icon="tim-icons icon-paper"
            v-model="send.memo"
            v-validate="'max:64'"
            maxlength="64"
          >
          </base-input>
        </div>
      </div>
      <span>{{$t('WALLET.REMAINING')}}
        <span class="pointer font-weight-bolder" @click="send.amount = remainingBalance">
          {{remainingBalance}}
        </span> STH
      </span>
    </div>

    <div v-if="tx.id" class="w-100">
      <hr class="bg-success">

      <table class="w-100">
        <tbody>
        <tr class="border-bottom">
          <th>TX ID</th>
          <td class="text-right">{{tx.id.substr(0,10)}}...{{tx.id.substr(-10)}}</td>
        </tr>
        <tr class="border-bottom">
          <th>From</th>
          <td class="text-right">{{address.substr(0,12)}}...{{address.substr(-12)}}</td>
        </tr>
        <tr class="border-bottom">
          <th>To</th>
          <td class="text-right">{{tx.recipientId.substr(0,12)}}...{{tx.recipientId.substr(-12)}}</td>
        </tr>
        <tr class="border-bottom">
          <th>Amount</th>
          <td class="text-right">{{send.amount}} STH</td>
        </tr>
        <tr class="border-bottom">
          <th>Fee</th>
          <td class="text-right">1 STH</td>
        </tr>
        <tr class="border-bottom">
          <th>Memo</th>
          <td class="text-left">{{send.memo}}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <template slot="footer">
      <base-button class="pb-3" v-if="tx.id" @click="broadcastTx" type="neutral" link>{{$t('WALLET.SEND')}} {{send.amount * 1 + 1}} STH <i
        class="tim-icons icon-check-2"></i></base-button>
      <base-button class="pb-3" v-if="!tx.id" :disabled="!isValidAddress || remainingBalance < 0 || !send.amount" @click="prepareTx"
                   type="neutral"
                   link>{{$t('APP.CONTINUE')}} <i
        class="tim-icons icon-check-2"></i></base-button>
      <base-button
        class="pb-3"
        type="neutral"
        link
        @click="$emit('onModalClose')"
      ><i class="tim-icons icon-simple-remove"></i> {{$t('APP.CANCEL')}}
      </base-button>
    </template>
  </modal>
</template>

<script>
import {Modal} from '@/components'
import eventBus from '@/plugins/event-bus'

export default {
  name: "ModalTxSend",
  components: {
    Modal,
  },
  data() {
    return {
      qrforsend: false,
      isValidAddress: false,
      tx: {},
      account: {
        address: null,
        secret: null
      },
      send: {
        address: null,
        amount: null,
        memo: null,
      },
      modalClasses: {
        address: '',
        amount: '',
        main: ''
      },
    }
  },
  props: {
    showModal: false,
    address: {
      type: String,
    }
  },
  computed: {
    contactList() {
      const data = this.$store.getters['app/contacts']
      let keys = Object.keys(data)
      let result = []
      for (let i = 0; i < keys.length; i++) {
        result.push(data[keys[i]])
      }
      return result
    },
    walletBalance() {
      return (this.$store.getters['wallet/balances']['accounts'][this.address]) || {balance: 0}
    },
    remainingBalance() {
      const result = (this.walletBalance.balance - this.send.amount * 1).toFixed(8) * 1 - 1
      if (result < 0) {
        this.setClassAmount()
      }
      return result
    },
  },
  methods: {
    setClassAmount() {
      this.modalClasses.amount = 'has-danger'
    },
    async validateAmount() {

    },
    async broadcastTx() {
      const response = await this.$store.dispatch('wallet/broadcastTxNative', this.tx)
      if (response.success === true) {

        eventBus.emit('addtx:unconfirmed', {
          id: response.transactionIds[0],
          confirmations: 0,
          time: "wait",
          amount: '-' + this.send.amount,
          senderId: this.address,
          recipientId: this.send.address,
          vendorField: this.send.memo,
          type: 0,
          asset: null,
          op: "-"
        })

        this.notifyVue('top', 'center', 'success', 'Success send ' + this.send.amount + ' STH')

        setTimeout(async () => {
          await this.$store.dispatch('wallet/getTxsByAddress')
          this.tx = {}
          this.send = {
            address: null,
            amount: null,
            memo: null,
          }
        }, 10000)

        this.$emit('onModalClose')
        this.showModal = false
      } else {
        this.notifyVue('top', 'center', 'danger', 'Error send tx, please retry!')
      }
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
    async walletDecrypt(address) {
      const secret = await this.$store.dispatch('app/walletDecrypt', {
        address: address,
        pin: this.$root.pin
      })
      this.account.address = address
      this.account.secret = secret
      return this.account
    },
    async prepareTx() {
      if (!this.isValidAddress) {
        return
      }
      const decryptData = await this.walletDecrypt(this.address)
      if (decryptData.secret) {
        this.tx = {}
        const preparedTx = await this.$store.dispatch('wallet/prepareTxNative', {
          secret: decryptData.secret,
          secondSecret: null,
          recipient: this.send.address,
          amount: this.send.amount,
          memo: this.send.memo,
        })
        this.tx = preparedTx
        //this.modalTx = true
      } else {
        eventBus.emit('modal:unlock')
      }
    },
    async validateAddress() {
      this.isValidAddress = await this.$store.dispatch('wallet/validateAddress', this.send.address)
      let result = false
      if (this.isValidAddress) {
        this.modalClasses.address = 'has-success'
        result = true
      } else {
        this.modalClasses.address = 'has-danger'
      }
      return result
    },
    async openLayerQr() {
      eventBus.emit('layer:qrforsend')
    }
  },
  async created() {
    this.$eventBus.on('qr:forsend', async (data) => {
      this.qrforsend = false
      this.send.address = data.address
      this.send.amount = data.amount || null
      let decodeMemo = decodeURI(data.memo) || null
      this.send.memo = decodeMemo === 'null' ? '' : decodeMemo
      this.validateAddress()
    })
  }
}
</script>

<style>

  .has-success.form-group .form-control, .has-danger.form-group .form-control {
    padding-right: 5px;
    padding-left: 10px;
  }

</style>

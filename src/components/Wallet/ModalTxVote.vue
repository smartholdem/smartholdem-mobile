<template>
  <modal
    :show.sync="showModalVote"
    :class="$root.modalColor"
    :show-close="true"
    headerClasses="justify-content-center"
    type="default"
  >
    <div slot="header" v-if="voteData" class="modal-profile">
      <i v-if="voteData.voteType === '-'" class="tim-icons icon-simple-delete"></i>
      <i v-if="voteData.voteType === '+'" class="tim-icons icon-simple-add"></i>
    </div>
    <div v-if="voteData && voteData.delegate">
      <p class="text-center"><span v-if="voteData.voteType === '-' && voteData.delegate">Remove</span> Vote for <strong>{{voteData.delegate.username}}</strong>
      </p>
      <p class="text-center">VOTE FEE 1 STH</p>
      <hr>
      <p v-if="voteData.delegate">
        DELEGATE RATE {{this.voteData.delegate.rate}}
        <br>DELEGATE PRODUCTIVITY {{this.voteData.delegate.productivity}}%
      </p>
    </div>

    <template slot="footer" v-if="voteData">
      <base-button @click="confirmAction" type="neutral info" link class="pb-4">{{$t('APP.CONFIRM')}}&nbsp;
        <span v-if="voteData.voteType === '-'">Unvote</span>
        <span v-if="voteData.voteType === '+'">Add Vote</span>
      </base-button>
      <base-button @click="$emit('onModalClose')" type="neutral" link class="pb-4">
        {{$t('APP.CANCEL')}}
      </base-button>
    </template>
  </modal>
</template>

<script>
import {Modal} from '@/components'
import eventBus from '@/plugins/event-bus'

export default {
  components: {
    Modal,
  },
  props: {
    showModalVote: false,
    voteData: {},
  },
  data() {
    return {
      account: {
        secret: null,
        secondSecret: null,
      },
    }
  },
  methods: {
    async walletDecrypt(address) {
      const secret = await this.$store.dispatch('app/walletDecrypt', {
        address: address,
        pin: this.$root.pin
      })
      this.account.address = address
      this.account.secret = secret
      return this.account
    },
    async confirmAction() {
      const decryptData = await this.walletDecrypt(this.voteData.address)
      const response = await this.$store.dispatch('wallet/TxVote', {
        secret: decryptData.secret,
        vote: this.voteData.voteType + this.voteData.delegate.publicKey,
        secondSecret: null
      })

      if (response.success === true) {
        this.notifyVue('bottom', 'right', 'success', this.voteData.voteType + 'Vote Success')

        let votes = [this.voteData.voteType + this.voteData.delegate.publicKey]

        eventBus.emit('addtx:unconfirmed', {
          id: response.transactionIds[0],
          confirmations: 0,
          time: "wait",
          amount: '-1',
          senderId: this.account.address,
          recipientId: this.account.address,
          vendorField: 'send vote',
          type: 3,
          asset: votes,
          op: "-"
        })

        setTimeout(async () => {
          await this.$store.dispatch('blockchain/getAccount', this.voteData.address)
          await this.$store.dispatch('wallet/getTxsByAddress')
          await this.$store.dispatch('wallet/getBalances')
          this.account = {
            secret: null,
            secondSecret: null,
          }
        }, 10000)

      } else {
        this.notifyVue('top', 'center', 'danger', 'Error send tx, please retry!')
      }

      this.$emit('onModalClose')
      this.showModalVote = false
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
}
</script>

<style scoped>

</style>

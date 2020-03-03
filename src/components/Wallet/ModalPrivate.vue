<template>
  <!-- Show Priv key -->
  <modal
    :show.sync="showModal"
    class="modal-black"
    :show-close="true"
    headerClasses="justify-content-center"
  >

    <div slot="header" class="modal-profile">
      <i class="tim-icons icon-key-25"></i>
    </div>

    <h4 class="text-center">Private Data</h4>

    <p class="text-center text-white">For address <i class="tim-icons icon-wallet-43"></i> {{account.address}}</p>
    <p class="text-warning small text-center">!Never share your secret key with third parties. Store your passphrase
      in a secure place.</p>
    <hr class="bg-primary">
    <p class="text-white text-center">- YOUR SECRET PASSPHRASE -</p>
    <p class="text-white font-weight-light text-center" title="copy private key" v-clipboard="() => account.secret">
      <i class="tim-icons icon-single-copy-04 pointer"></i> {{account.secret}}
    </p>

    <template slot="footer">
      <div class="text-center row">
        <div class="float-left ml-5">
          <p>Private Key</p>
          <VueQrcode v-if="account.secret" class="qr-wallet" :value="account.secret" :options="{size:128}"/>
        </div>
        <div class="ml-5 float-left">
          <p>Public Address</p>
          <VueQrcode v-if="account.address" class="qr-wallet" :value="account.address" :options="{size:128}"/>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import {Modal} from '@/components'
import VueQrcode from '@/util/QRCode'

export default {
  name: "ModalPrivate",
  components: {
    Modal,
    VueQrcode
  },
  props: {
    showModal: false,
    address: null,
  },
  data() {
    return {
      account: {
        secret: null,
        address: null,
      }
    }
  },
  methods: {
    async walletDecrypt(address) {
      if (this.$root.pin) {
        const result = await this.$store.dispatch('app/walletDecrypt', {
          address: address,
          pin: this.$root.pin
        })
        this.account.address = address
        this.account.secret = result
      }
    },
  },
  async created() {
    await this.walletDecrypt(this.address)
  }
}
</script>

<style scoped>

</style>

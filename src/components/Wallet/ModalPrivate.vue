<template>
  <!-- Show Priv key -->
  <modal
    style="z-index: 10000;"
    :show.sync="showModal"
    :class="modalColor"
    :show-close="true"
    headerClasses="justify-content-center"
  >

    <div slot="header" class="title">
      <h3 class="text-center">Private Data</h3>
    </div>

    <!--<p class="text-center">For address <i class="tim-icons icon-wallet-43"></i> {{account.address}}</p>-->
    <p class="text-warning small text-center">!Never share your secret key with third parties. Store your passphrase
      in a secure place.</p>
    <hr class="bg-primary">
    <p class="text-center">- YOUR SECRET PASSPHRASE -</p>
    <p class="font-weight-light text-center" title="copy private key" v-clipboard="() => account.secret">
      <i class="tim-icons icon-single-copy-04 pointer"></i> {{account.secret}}
    </p>
    <hr class="bg-primary">
    <div class="text-center w-100 pb-3">
      <div class="">
        <p>QR Private & Public Key</p>
        <VueQrcode v-if="account.secret" class="qr-wallet" :value="qrData" :options="{size: 156}"/>
      </div>
      <!--
      <div class="float-right w-50">
        <p>Public Address</p>
        <VueQrcode v-if="account.address" class="qr-wallet" :value="account.address" :options="{size:128}"/>
      </div>
      -->
    </div>

    <template slot="footer">

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
        address: null,
        secret: null,
        secondSecret: null,
      }
    }
  },
  computed: {
    modalColor() {
      let result = 'modal-white'
      if ((this.$store.getters['app/settings']).darkMode) {
        result = 'modal-dark'
      }
      return result
    },
    qrData() {
      return JSON.stringify(
        {
          address: this.account.address,
          secret: this.account.secret || null,
          secondSecret: this.account.secondSecret || null,
          asset: 'sth'
        }
      )
    },
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

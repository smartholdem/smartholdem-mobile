<template>
  <div>

  <modal
    v-bind:show="show"
    v-bind:class="modalColor"
    :scrollToBottom="false"
    headerClasses="justify-content-center"
    type="default"
  >
    <div slot="header" class="modal-profile modal-profile-primary">
      <i class="tim-icons icon-book-bookmark"></i>
    </div>
    <p class="text-center">Add New Contact
      <span v-show="!isValidAddress && address" class="badge badge-danger">
        <i class="tim-icons icon-bell-55"></i> Address not valid
      </span>
    </p>


    <base-input
      type="text"
      placeholder="Contact Name"
      addon-left-icon="tim-icons icon-tag"
      v-model="label"
    />

    <base-input
      type="text"
      placeholder="SmartHoldem Address"
      addon-left-icon="tim-icons icon-wallet-43"
      v-model="address"
      @input="validateAddress()"
    />



    <div class="text-center">
      <base-button @click="qrRead = true" type="dark" icon class="">
        <i class="fas fa-qrcode" style="font-size:1.3rem;"></i>
      </base-button>
    </div>

    <template slot="footer">
      <base-button @click="setAction" :disabled="!isValidAddress" type="neutral info" link class="">
        {{$t('APP.CONFIRM')}}
      </base-button>
      <base-button @click="$emit('onModalClose')" type="neutral" link class="">
        {{$t('APP.CANCEL')}}
      </base-button>
    </template>
  </modal>

  <div v-if="qrRead">
    <QrReadContact :show="qrRead" @onQrClose="qrRead = false"/>
  </div>
  </div>
</template>

<script>
import {Modal} from '@/components'
import QrReadContact from '@/components/Mobile/QrReadContact'

export default {
  name: "ModalAddContact",
  components: {
    Modal,
    QrReadContact,
  },
  data() {
    return {
      label: '',
      address: '',
      isValidAddress: false,
      qrRead: false,
    }
  },
  props: {
    show: Boolean
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
    async setAction() {
      if (this.label && this.isValidAddress) {
        await this.$store.dispatch('app/setContact', {
          address: this.address,
          label: this.label,
          balance: 0,
        })
        await this.$store.dispatch('app/fetchContacts')
        this.label = ''
        this.address = ''
        this.isValidAddress = false
        this.$emit('onModalClose')
      }
    },
    async validateAddress() {
      this.isValidAddress = await this.$store.dispatch('wallet/validateAddress', this.address)
      return this.isValidAddress
    },
  },
  async created() {
    this.$eventBus.on('qr:contact', async (options) => {
      this.qrRead = false
      this.label = options.label || this.label
      this.address = options.address || ''
      await this.validateAddress()
    })
  }
}
</script>

<style scoped>

</style>

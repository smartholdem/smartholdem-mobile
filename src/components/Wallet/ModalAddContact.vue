<template>
  <modal
    :show.sync="showModal"
    class="modal-white"
    :show-close="true"
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
      placeholder="Enter Contact Name"
      addon-left-icon="tim-icons icon-tag"
      v-model="label"
    >
    </base-input>

    <base-input
      type="text"
      placeholder="Enter SmartHoldem Address"
      addon-left-icon="tim-icons icon-wallet-43"
      v-model="address"
      @input="validateAddress"
    >
    </base-input>

    <template slot="footer">
      <base-button @click="setAction" :disabled="!isValidAddress" type="neutral info" link class="">{{$t('APP.CONFIRM')}}</base-button>
      <base-button @click="$emit('onModalClose')" type="neutral" link class="">
        {{$t('APP.CANCEL')}}
      </base-button>
    </template>
  </modal>
</template>

<script>
import {Modal} from '@/components'

export default {
  name: "ModalAddContact",
  components: {
    Modal,
  },
  data() {
    return {
      address: '',
      label: '',
      isValidAddress: false
    }
  },
  props: {
    showModal: Boolean,
    default: false,
  },
  methods: {
    async setAction() {
      if (this.label.length > 0 && this.isValidAddress) {
        await this.$store.dispatch('app/setContact', {
          address: this.address,
          label: this.label,
          balance: 0,
        })
        await this.$store.dispatch('app/fetchContacts')
        this.$emit('onModalClose')
        this.showModal = false
      }
    },
    async validateAddress() {
      this.isValidAddress = await this.$store.dispatch('wallet/validateAddress', this.address)
      return this.isValidAddress
    },
  },
  async created() {
    this.label = ''
    this.address = ''
  },
}
</script>

<style scoped>

</style>

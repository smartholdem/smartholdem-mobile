<template>
  <modal
    :show="showModal"
    :class="$root.modalColor"
    :show-close="true"
    headerClasses="justify-content-center"
    type="default"
  >
    <div slot="header" class="modal-profile modal-profile-primary">
      <i class="tim-icons icon-tag"></i>
    </div>
    <p class="text-center">Set name for </p>
    <p class="small text-center">{{address}}</p>
    <base-input
      type="text"
      placeholder="Enter Wallet Name"
      v-model="label"
    >
    </base-input>
    <template slot="footer">
      <base-button @click="setLabel" type="neutral info" link class="">{{$t('APP.CONFIRM')}}</base-button>
      <base-button @click="$emit('onModalClose')" type="neutral" link class="">
        {{$t('APP.CANCEL')}}
      </base-button>
    </template>
  </modal>
</template>

<script>
import {Modal} from '@/components'
import eventBus from '@/plugins/event-bus'

export default {
  name: "ModalSetLabel",
  components: {
    Modal,
  },
  data() {
    return {
      label: null
    }
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
    },
  },
  methods: {
    async setLabel() {
      if (this.label.length > 0) {
        await this.$store.dispatch('wallet/setLabel', {
          address: this.address,
          label: this.label
        })
        eventBus.emit('label:up', this.label)
        this.label = ''
        this.$emit('onModalClose')
      }
    }
  },
}
</script>

<style scoped>

</style>

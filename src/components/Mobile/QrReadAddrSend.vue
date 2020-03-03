<template>
  <div>
    <card v-if="show" class="top-layer">
      <h4 @click="close({address: result})" class="p-3 text-uppercase w-100 text-center"><i
        class="tim-icons icon-double-left float-left pt-1"></i> <span class="text-center">Read QR for Send STH</span></h4>
      <p class="p-3">Scan the QR-code with the SmartHoldem address</p>

      <p class="text-center font-weight-bolder" v-if="result">{{result}} </p>

      <div class="text-center mt-2">
        <p class="error">{{ error }}</p>

        <p class="decode-result">Last result: <b>{{ result }}</b></p>

        <qrcode-stream @decode="onDecode" @init="onInit" />
      </div>
    </card>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {

  components: { QrcodeStream },
  props: {
    show: false,
  },

  data () {
    return {
      result: null,
      error: ''
    }
  },

  methods: {
    async close(data = {address: null}) {
      this.$emit('onQrReadClose', data)
    },
    onDecode (result) {
      this.result = result

      if (this.result) {

        this.close({address:result})
      } else {
        this.result = null
      }

    },

    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      }
    }
  }
}
</script>

<style scoped>

</style>

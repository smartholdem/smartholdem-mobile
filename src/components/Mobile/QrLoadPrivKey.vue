<template>
  <div>
    <card v-if="show" class="top-layer">
      <h4 @click="close(account)" class="p-3 text-uppercase w-100 text-center"><i
        class="tim-icons icon-double-left float-left pt-1"></i> <span class="text-center">QR for Import STH Address</span></h4>
      <p class="p-3">Scan the QR-code with SmartHoldem Private Key</p>

      <div class="text-center mt-2">
        <p class="text-danger">{{ error }}</p>
        <p class="text-danger" v-if="error">To scan the QR-code, you must enable the permission to use the camera in the application settings</p>


        <qrcode-stream @decode="onDecode" @init="onInit" />


      </div>
    </card>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import eventBus from '@/plugins/event-bus'

export default {

  components: { QrcodeStream },
  props: {
    show: false,
  },

  data () {
    return {
      result: null,
      error: '',
      account: {
        address: null,
        secret: null
      },
    }
  },

  methods: {
    async close(data = {address: null, secret: null}) {
      this.result = null
      this.account = {
        address: null,
        secret: null
      }
      eventBus.emit('qr:importpkey', data)
    },
    onDecode (result) {
      this.result = result

      if (result) {
        try {
          let dataJson = JSON.parse(result)
          this.account = {
            address: dataJson.address || null,
            secret: dataJson.secret || null
          }
        } catch(e) {

        }

        this.close(this.account)
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

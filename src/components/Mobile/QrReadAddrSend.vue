<template>
  <div>
    <card v-if="show" class="top-layer">
      <h4 @click="close({address: result})" class="p-3 text-uppercase w-100 text-center"><i
        class="tim-icons icon-double-left float-left pt-1"></i> <span class="text-center">Read QR for Send STH</span></h4>
      <p class="p-3">Scan the QR-code with the SmartHoldem address</p>

      <div class="text-center mt-2">
        <p class="text-danger">{{ error }}</p>
        <p class="text-danger" v-if="error">To scan the QR-code, you must enable the permission to use the camera in the application settings</p>


        <qrcode-stream @decode="onDecode" @init="onInit" />

        <p class="text-center font-weight-bolder mt-2" v-if="send.address">
          <span>{{send.address}}</span>
          <br><span>{{send.amount}} STH</span>
          <br><span>{{send.memo}}</span>
        </p>
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
      send: {
        address: null,
        memo: null,
        amount: null,
      }
    }
  },

  methods: {
    async close(data = {address: null, amount: null, memo: null}) {
      this.result = null
      this.send = {
        address: null,
          memo: null,
          amount: null,
      }
      eventBus.emit('qr:forsend', data)
    },
    onDecode (result) {
      this.result = result

      if (result.length) {
        try {
          let dataJson = JSON.parse(result)
          this.send = {
            address: dataJson.a || null,
            amount: dataJson.amount || null,
            memo: dataJson.vendorField || null
          }
        } catch(e) {
          const myURL = new URL(result);
          this.send = {
            address: myURL.pathname,
            amount: myURL.searchParams.get('amount') || null,
            memo: myURL.searchParams.get('vendorField') || null
          }
        }

        this.close(this.send)
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

<template>
  <div>
    <card v-if="show" class="top-layer">
      <h4 @click="close(contact)" class="p-3 text-uppercase w-100 text-center"><i
        class="tim-icons icon-double-left float-left pt-1"></i> <span class="text-center">Read QR for Send STH</span>
      </h4>
      <p class="p-3">Scan the QR-code with the SmartHoldem address</p>

      <div class="text-center mt-2">
        <p class="text-danger">{{ error }}</p>
        <p class="text-danger" v-if="error">
          To scan the QR-code, you must enable the permission to use the camera in the application settings
        </p>

        <qrcode-stream @decode="onDecode" @init="onInit"/>

        <p class="text-center font-weight-bolder mt-2" v-if="contact.address">
          <span>{{contact.address}}</span>
          <br><span>{{contact.label}}</span>
        </p>
      </div>
    </card>
  </div>
</template>

<script>
/*
document.addEventListener('deviceready', function () {

  var permissions = cordova.plugins.permissions;
  permissions.requestPermission(permissions.CAMERA, success, error);

  function error() {
    console.warn('Camera permission is not turned on');
  }

  function success(status) {
    if (!status.hasPermission) error();
  }

  //console.log('cordova.plugins.permissions is now available');
});
*/

import {QrcodeStream} from 'vue-qrcode-reader'
import eventBus from '@/plugins/event-bus'

export default {
  components: {QrcodeStream},
  props: {
    show: false,
  },
  data() {
    return {
      result: null,
      error: '',
      contact: {
        address: null,
        label: null,
      }
    }
  },
  methods: {
    async close(data = {address: null, label: null}) {
      this.result = null
      this.contact = {
        address: null,
        label: null,
      }
      eventBus.emit('qr:contact', data)
    },
    onDecode(result) {
      this.result = result

      if (this.result.length > 0) {
        try {
          let dataJson = JSON.parse(this.result)
          this.contact = {
            address: dataJson.a || null,
            label: dataJson.label || null,
          }
        } catch (e) {
          const myURL = new URL(this.result);
          this.contact = {
            address: myURL.pathname,
            label: myURL.searchParams.get('label') || null,
          }
        }

        this.close(this.contact)
      } else {
        this.result = null
      }

    },

    async onInit(promise) {
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

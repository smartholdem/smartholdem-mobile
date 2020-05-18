<template>
  <div>
    <card v-if="show" class="top-layer">
      <h4 @click="close(send)" class="p-3 text-uppercase w-100 text-center"><i
        class="tim-icons icon-double-left float-left pt-1"></i> <span class="text-center">{{$t('WALLET.SCAN_QR_SEND')}} STH</span>
      </h4>
      <p class="p-3">Scan the QR-code with the SmartHoldem address</p>

      <div class="text-center mt-2">
        <p class="text-danger">{{ error }}</p>
        <p class="text-danger" v-if="error">>{{$t('WALLET.SCAN_QR_ERR')}}</p>

        <qrcode-stream @decode="onDecode" @init="onInit"/>

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

import {QrcodeStream} from 'vue-qrcode-reader'
import eventBus from '@/plugins/event-bus'

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


export default {

  components: {QrcodeStream},
  props: {
    show: false,
  },

  data() {
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
    onDecode(result) {
      this.result = result

      if (result.length) {
        try {
          let dataJson = JSON.parse(result)
          this.send = {
            address: dataJson.a || null,
            amount: dataJson.amount || null,
            memo: dataJson.vendorField || null
          }
        } catch (e) {

          let parseResult = {
            protocol: null,
            address: null,
            amount: null,
            memo: null,
            label: null,
            asset: null
          }

          let qrString = result.split(':')

          if (qrString.length === 1) {
            parseResult.address = qrString[0]
          }

          if (qrString.length === 2) {
            parseResult.protocol = qrString[0]
            let qData = qrString[1].replace(/\&/g, '?')
            let parseParams = qData.split('?')
            if (parseParams.length > 0) {
              parseResult.address = parseParams[0]
              let params = {}
              for (let i = 1; i < parseParams.length; i++) {
                let tmpParam = parseParams[i].split('=')
                params[tmpParam[0]] = tmpParam[1]
              }
              parseResult.amount = params.amount || null
              parseResult.label = params.label || null
              parseResult.memo = params.memo || null
              parseResult.asset = params.asset || null
            }
          }

          this.send = parseResult

        }

        this.close(this.send)
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

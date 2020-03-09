<template>
  <div class="">
    <div v-if="show" class="pin-layer p-2 card">

      <span @click="closeUnlock" class="position-fixed"><i class="tim-icons icon-simple-remove"
                                                                      style="font-size: 1.4em;"></i></span>
      <h4 class="text-center">

        Enter PIN-Code

      </h4>
      <div class="p-4 mt-3 pin-content">
        <div class="float-left mb-4 w-100">
        <div class="fill-pin p-2 ml-auto mr-auto" style="width:210px;">
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 0 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 1 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 2 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 3 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 4 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 5 ? 'pin-filled' : '')"></span>
        </div>
        </div>

        <div class="float-left w-100">
        <div class="pin-buttons">
        <base-button @click="pinPress('1')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">1
        </base-button>
        <base-button @click="pinPress('2')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">2
        </base-button>
        <base-button @click="pinPress('3')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">3
        </base-button>
        <base-button @click="pinPress('4')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">4
        </base-button>
        <base-button @click="pinPress('5')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">5
        </base-button>
        <base-button @click="pinPress('6')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">6
        </base-button>
        <base-button @click="pinPress('7')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">7
        </base-button>
        <base-button @click="pinPress('8')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">8
        </base-button>
        <base-button @click="pinPress('9')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">9
        </base-button>
        <base-button @click="pinPress('0')" :type="btnType" round :simple="btnType !== 'success'" class="pin-btn font-weight-light">0
        </base-button>
        <span :disabled="pin.length < 1" @click="pinPress('del')" class="pin-btn"><i class="fas fa-backspace pt-3"></i></span>
        <!--<span class="pin-btn"><i class="tim-icons icon-check-2 pt-3"></i></span>-->
        </div>
        </div>
      </div>

      <div v-show="!isValid && pin.length > 5" class="float-left w-100 text-center mt-2 badge badge-danger">Pin-Code Not Valid</div>
    </div>
  </div>
</template>

<script>

window.addEventListener('error', function(error) {
  if (ChromeSamples && ChromeSamples.setStatus) {
    console.error(error);
    ChromeSamples.setStatus(error.message + ' (Your device may not support this feature.)');
    error.preventDefault();
  }
});

function vbr(ms = 250) {
  navigator.vibrate(ms);
}

import eventBus from '@/plugins/event-bus'

export default {
  name: "LayoutUnlock",
  props: {
    show: false,
  },
  data() {
    return {
      pin: '',
      isValid: true,
      btnType: 'default'
    }
  },
  methods: {
    async pinPress(num) {
      this.isValid = true
      if (num === 'del') {
        this.pin = this.pin.substr(0, this.pin.length - 1)
      } else if (this.pin.length < 6) {
        this.pin = this.pin + num
        await this.validatePin()
      }
    },
    async validatePin() {
      if (this.pin.length === 6 && this.$store.getters['app/pinEncrypted']) {
        vbr(0)
        let decryptPin = await this.$store.dispatch('app/validatePinCode', this.pin)
        this.isValid = true
        if (decryptPin) {
          this.$root.pin = decryptPin
          this.btnType = 'success'
          setTimeout(() => {
            this.pin = ''
            this.$router.push({path: '/wallet'})
            //this.closeUnlock()
          }, 500)
        } else {
          this.isValid = false
          vbr()
        }
      }
    },
    async closeUnlock() {
      eventBus.emit('pin:close')
      this.pin = ''
    },

  },
}
</script>

<style>
  .pin-content {
    max-width:480px;
    margin: 0 auto;
  }

  .pin-buttons {
    margin: 10px auto;
    width: 236px;
  }
</style>

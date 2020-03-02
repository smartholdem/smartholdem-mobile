<template>
  <div>
    <div v-if="show" class="pin-layer p-2">
      <span @click="closeUnlock" class="float-right"><i class="tim-icons icon-simple-remove"
                                                          style="font-size: 1.2em;"></i></span>
      <h4 class="text-center">Enter PIN-Code</h4>
      <div class="p-4 pl-5 mt-3">
        <div class="fill-pin w-100 p-2 ml-4 float-left mb-4">
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 0 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 1 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 2 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 3 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 4 ? 'pin-filled' : '')"></span>
          <span :class="'fill-pin-item ml-2 ' + (pin.length > 5 ? 'pin-filled' : '')"></span>
        </div>

        <base-button @click="pinPress('1')" type="default" round simple class="pin-btn font-weight-light">1
        </base-button>
        <base-button @click="pinPress('2')" type="default" round simple class="pin-btn font-weight-light">2
        </base-button>
        <base-button @click="pinPress('3')" type="default" round simple class="pin-btn font-weight-light">3
        </base-button>
        <base-button @click="pinPress('4')" type="default" round simple class="pin-btn font-weight-light">4
        </base-button>
        <base-button @click="pinPress('5')" type="default" round simple class="pin-btn font-weight-light">5
        </base-button>
        <base-button @click="pinPress('6')" type="default" round simple class="pin-btn font-weight-light">6
        </base-button>
        <base-button @click="pinPress('7')" type="default" round simple class="pin-btn font-weight-light">7
        </base-button>
        <base-button @click="pinPress('8')" type="default" round simple class="pin-btn font-weight-light">8
        </base-button>
        <base-button @click="pinPress('9')" type="default" round simple class="pin-btn font-weight-light">9
        </base-button>
        <base-button @click="pinPress('0')" type="default" round simple class="pin-btn font-weight-light">0
        </base-button>
        <span :disabled="pin.length < 1" @click="pinPress('del')" class="pin-btn"><i class="fas fa-backspace pt-3"></i></span>
        <!--<span class="pin-btn"><i class="tim-icons icon-check-2 pt-3"></i></span>-->

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayoutUnlock",
  props: {
    show: false,
  },
  data() {
    return {
      pin: '',
    }
  },
  methods: {
    async pinPress(num) {
      if (num === 'del') {
        this.pin = this.pin.substr(0, this.pin.length - 1)
      } else {
        this.pin = this.pin + num
        await this.validatePin()
      }
    },
    async validatePin() {
      if (this.pin.length > 3 && this.$store.getters['app/pinEncrypted']) {
        let decryptPin = await this.$store.dispatch('app/validatePinCode', this.pin)
        if (decryptPin) {
          this.$root.pin = decryptPin
          setTimeout(() => {
            this.$emit('onUnlockClose')
            this.pin = ''
            this.$router.push({path: '/wallet'})
          }, 500)
        }
      }
    },
    async closeUnlock() {
      this.$emit('onUnlockClose')
      this.pin = ''
    },

  },
}
</script>

<style scoped>

</style>

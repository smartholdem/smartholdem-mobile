<template>
  <div>
    <div class="pin-layer p-2  card" v-if="show">

      <div v-if="step === 1">
        <h4 class="text-center">{{$t('APP.COME_UP')}} PIN-Code</h4>
        <div class="p-4 pl-4 mt-3">
          <div class="fill-pin w-100 p-2 ml-4 float-left mb-4">
            <span :class="'fill-pin-item ml-2 ' + (pin.length > 0 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pin.length > 1 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pin.length > 2 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pin.length > 3 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pin.length > 4 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pin.length > 5 ? 'pin-filled' : '')"></span>
          </div>

          <div class="w-100 float-left">


              <base-button @click="pinPress('1')" class="pin-btn font-weight-light" round simple type="default">1
              </base-button>
              <base-button @click="pinPress('2')" class="pin-btn font-weight-light" round simple type="default">2
              </base-button>
              <base-button @click="pinPress('3')" class="pin-btn font-weight-light" round simple type="default">3
              </base-button>




              <base-button @click="pinPress('4')" class="pin-btn font-weight-light" round simple type="default">4
              </base-button>
              <base-button @click="pinPress('5')" class="pin-btn font-weight-light" round simple type="default">5
              </base-button>
              <base-button @click="pinPress('6')" class="pin-btn font-weight-light" round simple type="default">6
              </base-button>


            <base-button @click="pinPress('7')" class="pin-btn font-weight-light" round simple type="default">7
            </base-button>
            <base-button @click="pinPress('8')" class="pin-btn font-weight-light" round simple type="default">8
            </base-button>
            <base-button @click="pinPress('9')" class="pin-btn font-weight-light" round simple type="default">9
            </base-button>
            <base-button @click="pinPress('0')" class="pin-btn font-weight-light" round simple type="default">0
            </base-button>
            <span :disabled="pin.length < 1" class="pin-btn"><i @click="pinPress('del')"
                                                                class="fas fa-backspace pt-3"></i></span>
            <span class="pin-btn pointer" v-show="pin.length === 6"><i class="tim-icons icon-check-2 pt-3"></i></span>
          </div>
        </div>
      </div>

      <div v-if="step === 2">
        <h4 class="text-center">{{$t('APP.REPEAT')}} PIN-Code</h4>
        <div class="p-4 pl-5 mt-3">
          <div class="fill-pin w-100 p-2 ml-4 float-left mb-4">
            <span :class="'fill-pin-item ml-2 ' + (pinRepeat.length > 0 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pinRepeat.length > 1 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pinRepeat.length > 2 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pinRepeat.length > 3 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pinRepeat.length > 4 ? 'pin-filled' : '')"></span>
            <span :class="'fill-pin-item ml-2 ' + (pinRepeat.length > 5 ? 'pin-filled' : '')"></span>
          </div>

          <div class="w-100 float-left">
          <base-button @click="validateRepeatPin('1')" class="pin-btn font-weight-light" round simple type="default">1
          </base-button>
          <base-button @click="validateRepeatPin('2')" class="pin-btn font-weight-light" round simple type="default">2
          </base-button>
          <base-button @click="validateRepeatPin('3')" class="pin-btn font-weight-light" round simple type="default">3
          </base-button>
          <base-button @click="validateRepeatPin('4')" class="pin-btn font-weight-light" round simple type="default">4
          </base-button>
          <base-button @click="validateRepeatPin('5')" class="pin-btn font-weight-light" round simple type="default">5
          </base-button>
          <base-button @click="validateRepeatPin('6')" class="pin-btn font-weight-light" round simple type="default">6
          </base-button>
          <base-button @click="validateRepeatPin('7')" class="pin-btn font-weight-light" round simple type="default">7
          </base-button>
          <base-button @click="validateRepeatPin('8')" class="pin-btn font-weight-light" round simple type="default">8
          </base-button>
          <base-button @click="validateRepeatPin('9')" class="pin-btn font-weight-light" round simple type="default">9
          </base-button>
          <base-button @click="validateRepeatPin('0')" class="pin-btn font-weight-light" round simple type="default">0
          </base-button>
          <span :disabled="pinRepeat.length < 1" class="pin-btn"><i @click="validateRepeatPin('del')"
                                                                    class="fas fa-backspace pt-3"></i></span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
window.addEventListener('error', function (error) {
    if (ChromeSamples && ChromeSamples.setStatus) {
        console.error(error);
        ChromeSamples.setStatus(error.message + ' (Your device may not support this feature.)');
        error.preventDefault();
    }
});

function vbr() {
    navigator.vibrate(250);
}

export default {
    name: "LayoutEncrypt",
    props: {
        show: false,
    },
    data() {
        return {
            step: 1,
            pin: '',
            pinRepeat: ''
        }
    },
    methods: {
        async pinPress(num) {
            if (num === 'del') {
                this.pin = this.pin.substr(0, this.pin.length - 1)
            } else if (this.pin.length < 6) {
                this.pin = this.pin + num
            }

            if (this.pin.length === 6) {
                this.step = 2
            }
        },
        async validateRepeatPin(num) {
            if (num === 'del') {
                this.pinRepeat = this.pinRepeat.substr(0, this.pinRepeat.length - 1)
            } else if (this.pinRepeat.length < 6) {
                this.pinRepeat = this.pinRepeat + num
            }

            if (this.pinRepeat.length === 6) {
                if (this.pin === this.pinRepeat) {
                    this.$root.pin = await this.$store.dispatch('app/setPinEnc', this.pin)
                    this.pin = ''
                    this.$router.push({path: '/wallet'})
                    return true
                } else {
                    vbr()
                    return false
                }
            }
        },
    },
}
</script>

<style scoped>

</style>

<template>
  <div>
    <div class="p-0 m-0 w-100 position-fixed card h-100" style="border-radius: 0;">
      <div class="text-center h-100 mt-5">
        <img class="" src="images/sth80.png"/>
        <h2 class="text-uppercase mt-3 font-weight-bold">
          SmartHoldem
          <br/>{{$t('WALLET.WALLET')}}
        </h2>
        <p>{{$t('APP.WELCOME')}}</p>

        <div class="text-center w-100 m-auto pt-3">
          <base-button v-if="!PinEncrypted" @click="showEncrypt = true" type="primary" round class="text-uppercase">
            Create Profile
          </base-button>
          <base-button v-if="PinEncrypted" @click="showUnlock = true" type="primary" round class="text-uppercase">
            {{$t('APP.OPEN_WALLET')}}
          </base-button>
          <div v-if="PinEncrypted">
            <p class="mt-4">- {{$t('APP.OR')}} -</p>
            <base-button @click="showReset = true" type="danger"
                         link
                         class="text-uppercase mt-3 btn-sm"><i class="tim-icons icon-simple-remove"></i> {{$t('SET.CLEAR')}}
            </base-button>
          </div>

        </div>
      </div>
    </div>

    <div v-if="showUnlock">
      <LayoutUnlock :show="showUnlock"/>
    </div>

    <div v-if="showEncrypt">
      <LayoutEncrypt :show="showEncrypt"/>
    </div>

    <div v-if="showReset">
      <ResetAll :modalReset="showReset" @onResetCancel="showReset = false"/>
    </div>

  </div>
</template>

<script>
import LayoutUnlock from '@/components/Mobile/LayoutUnlock'
import LayoutEncrypt from '@/components/Mobile/LayoutEncrypt'
import ResetAll from '@/components/Wallet/ResetAll'

export default {
  name: "Welcome",
  components: {
    LayoutUnlock,
    LayoutEncrypt,
    ResetAll,
  },
  data() {
    return {
      showUnlock: false,
      showEncrypt: false,
      showReset: false,
    }
  },
  computed: {
    PinEncrypted() {
      return this.$store.getters['app/pinEncrypted']
    }
  },
  methods: {},
  async created() {
    this.$root.pin = null
    this.$root.pinEnc = this.PinEncrypted
    this.$store.dispatch('session/setAuth', false)
    this.$eventBus.on('pin:close', async () => {
      this.showUnlock = false
      this.showEncrypt = false
    })
  }
}
</script>

<style>
  .full-page > .content {
    padding: 0;
    margin: 0;
  }
</style>

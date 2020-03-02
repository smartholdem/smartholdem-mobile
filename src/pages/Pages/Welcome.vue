<template>
  <div>
    <div class="p-0 m-0 w-100 position-fixed card h-100" style="border-radius: 0;">
      <div class="text-center h-100 mt-5">
        <img class="" src="images/sth80.png"/>
        <h2 class="text-uppercase mt-3 font-weight-bold">
          SmartHoldem
          <br/>WALLET
        </h2>
        <p>Welcome to the Smartholdem Platform</p>

        <div class="text-center w-100 m-auto pt-3">
          <base-button v-if="!$root.pinEnc" @click="showEncrypt = true" type="primary" round class="text-uppercase">Create Profile</base-button>
          <base-button v-if="$root.pinEnc" @click="showUnlock = true" type="primary" round class="text-uppercase">Open My Wallet</base-button>

          <div v-if="$root.pinEnc">
          <p class="mt-4">- OR -</p>
          <base-button @click="showReset = true" type="danger"
                       link
                       class="text-uppercase mt-3 btn-sm"><i class="tim-icons icon-simple-remove"></i> Delete All Data</base-button>
          </div>

        </div>
      </div>
    </div>

    <LayoutUnlock :show="showUnlock"/>
    <LayoutEncrypt :show="showEncrypt"/>

    <ResetAll :modalReset="showReset" @onResetCancel="showReset = false"/>

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
  data () {
    return {
      showUnlock: false,
      showEncrypt: false,
      showReset: false,
    }
  },
  methods: {

  },
  async created() {
    this.$root.pin = null
    this.$root.pinEnc = this.$store.getters['app/pinEncrypted']
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

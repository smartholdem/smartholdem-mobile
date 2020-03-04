<template>
  <div>
    <base-button type="primary" @click="showActions = !showActions" round icon :simple="showActions" class="position-fixed"
                 style="right:10px;bottom: 10px;height:3rem; width:3rem;z-index:1000;">
      <i class="tim-icons icon-sound-wave" style="font-size:1.6rem;padding:0;"></i>
    </base-button>

    <base-button v-if="$route.name === 'Address'" @click="showTabAddress(0); showActions = false" type="default"
                 :simple="showActions" class="position-fixed" icon
                 :round = "activeTab !== 0"
                 style="left:10px;bottom: 10px;height:40px; width:40px;z-index:1000;">
      <i class="tim-icons icon-wallet-43" style="font-size: 1.1rem; padding:0;"></i>
    </base-button>

    <base-button v-if="$route.name === 'Address'" @click="showTabAddress(2); showActions = false" type="default" :simple="showActions" class="position-fixed"
                 icon
                 :round = "activeTab !== 2"
                 style="left:70px;bottom: 10px;height:40px; width:40px;z-index:1000;">
      <i class="tim-icons icon-coins" style="font-size: 1.1rem; padding:0;"></i>
    </base-button>

    <div @click="showActions = false" v-if="showActions" class="row h-100 w-100 position-fixed"
         style="top:0;background: #2125294a;">
      <div class="w-100 position-absolute bg-dark col-md-12 pt-4" style="bottom:0px;padding-bottom:80px;">

        <base-button v-show="$route.path !== '/wallet'" @click="openRouter('/wallet')" type="primary" round simple class="ml-2 text-uppercase w-100 font-weight-bolder" style="">
          <i class="tim-icons icon-wallet-43 pb-1 mr-2"></i>List All Wallets
        </base-button>

        <base-button v-show="$route.path !== '/wallet-create'" @click="openRouter('/wallet-create')" type="primary" round simple class="ml-2 text-uppercase w-100 font-weight-bolder" style="">
          <i class="tim-icons icon-credit-card pb-1 mr-2" style="font-size: 1rem;"></i> Create New Wallet
        </base-button>

        <base-button v-show="$route.path !== '/wallet-import'" @click="openRouter('/wallet-import')" type="primary" round simple class="ml-2 text-uppercase w-100 font-weight-bolder" style="">
          <i class="tim-icons icon-refresh-01 pb-1 mr-2"></i>Import Wallet
        </base-button>



      </div>
    </div>
  </div>
</template>

<script>

import eventBus from '@/plugins/event-bus'

export default {
  name: "BotBtnWlt",
  data() {
    return {
      activeTab: 0,
      showActions: false,
    }
  },
  methods: {
    async showTabAddress(idx) {
      this.activeTab = idx
      eventBus.emit('address:tab', idx)
    },
    openRouter(url){
      if (!this.$root.pin) {
        eventBus.emit('modal:unlock')
      } else {
        this.$router.push({path: url})
      }
      this.showActions = false
    }
  },
  async created() {
    //console.log(this.$route.name)
  }
}
</script>

<style scoped>

</style>

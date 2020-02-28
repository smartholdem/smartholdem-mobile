<template>
    <div>
      <base-button type="primary" @click="showActions = !showActions" round icon class="position-absolute" style="right:10px;bottom: 10px;height:3rem; width:3rem;">
        <i class="tim-icons icon-sound-wave" style="font-size:1.6rem;padding:0;"></i>
      </base-button>

      <div @click="showActions = false" v-if="showActions" class="row h-100 w-100 position-absolute" style="top:0;background: #2125294a;">
        <div class="w-100 position-absolute bg-dark p-3" style="bottom:0;">
          <router-link class="w-100 font-weight-bolder text-uppercase" to="/wallet-create"><i class="tim-icons icon-credit-card pb-1 mr-2"></i>Create New Wallet</router-link>
          <hr>
          <router-link class="w-100 font-weight-bolder text-uppercase" to="/wallet-import"><i class="tim-icons icon-refresh-01 pb-1 mr-2"></i>Import Wallet</router-link>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    name: "BotBtnWlt",
  data() {
    return {
      showActions: false,
      tableData: []
    };
  },
}
</script>

<style scoped>

</style>

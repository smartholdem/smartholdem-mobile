<template>
  <div>
    <modal
      :show.sync="modalReset"
      class="modal-warning"
      :show-close="true"
      headerClasses="justify-content-center"
    >
      <div slot="header" class="modal-profile">
        <i class="tim-icons icon-alert-circle-exc"></i>
      </div>
      <h4 class="text-center">{{$t('APP.SURE')}}</h4>
      <p>{{$t('APP.ALL_DATA_RESET')}}</p>
      <template slot="footer">
        <base-button @click="onResetData" type="neutral" link>{{$t('APP.CONFIRM')}}</base-button>
        <base-button
          type="neutral"
          link
          @click="onResetCancel"
        >{{$t('APP.CANCEL')}}
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
  import {Modal} from '@/components'

  export default {
    components: {
      Modal
    },
    name: "ResetAll",
    props: {
      modalReset: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      onResetCancel (value) {
        this.$emit('onResetCancel', value)
      },
      onResetData() {
        this.$store.dispatch('wallet/walletReset')
        this.$store.dispatch('app/appReset')
        this.$store.dispatch('session/setAuth', false)
        this.$store.dispatch('resetData')
        //this.$router.push({path: '/'})
        this.$router.push({path: '/'})
        location.reload()
        // this.electron_reload()
      }
    },
  }
</script>

<style scoped>

</style>

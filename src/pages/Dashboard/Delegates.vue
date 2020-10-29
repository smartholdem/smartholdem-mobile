<template>
  <div class="row">
    <div :class.sync="'layer-head'+ ' ' + $root.modalColor">
      <router-link class="back-wallet pl-4 pr-5" to="/wallet"><i class="tim-icons icon-minimal-left"></i></router-link>
      <span>{{$t('PG.DELEGATES')}}</span>
    </div>

    <div class="layer-content w-100">
      <table class="table w-100">
        <tbody>
        <tr :key="idx" class="pointer" v-for="(item, idx) in Delegates.list">
          <td class="pl-3">
            {{item.rate}}
          </td>
          <td>
            {{item.username}}
          </td>
          <td>
            {{item.approval}}%
          </td>
        </tr>
        </tbody>
      </table>

      <h3 class="text-center">Standby Delegates</h3>
      <table class="table w-100">
        <tbody>
        <tr :key="idx" class="pointer" v-for="(item, idx) in standbyDelegates.list">
          <td class="pl-3">
            {{item.rate}}
          </td>
          <td>
            {{item.username}}
          </td>
          <td>
            {{item.approval}}%
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>

export default {
    name: "Delegates",
    computed: {
        Delegates() {
            let result = {
                count: 0,
                list: [],
            };
            const data = this.$store.getters['blockchain/delegates'];
            result.count = data.count;
            result.list = data.list;
            return result
        },
        standbyDelegates() {
            let result = {
                count: 0,
                list: [],
            };
            const data = this.$store.getters['blockchain/standbyDelegates'];
            result.count = data.count;
            result.list = data.list;
            return result
        },
    },
    async created() {
        await this.$store.dispatch('blockchain/fetchDelegates', 0);
        await this.$store.dispatch('blockchain/fetchDelegatesStandby', 64);
    }
}
</script>

<style scoped>

  .delegate-table td {
    padding: 5px;
  }

  .delegate-table tr {
    border-bottom: solid 1px #2f253575
  }
</style>

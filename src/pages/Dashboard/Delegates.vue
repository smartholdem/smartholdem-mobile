<template>
  <div>
    <h4>Delegates</h4>
    <table class="table w-100">
      <tbody>
      <tr v-for="(item, idx) in Delegates.list" :key="idx" class="pointer">
        <td>
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
</template>

<script>

export default {
  name: "Delegates",
  computed: {
    Delegates() {
      let result = {
        count: 0,
        list: [],
      }
      const data = this.$store.getters['blockchain/delegates']
      result.count = data.count
      result.list = data.list
      return result
    },
  },
  async created() {
    await this.$store.dispatch('blockchain/fetchDelegates')
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

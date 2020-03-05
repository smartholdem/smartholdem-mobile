<template>
  <div>
    <h4>Delegates</h4>
    <table class="delegate-table w-100">
      <tr v-for="(item, idx) in Delegates.list" :key="idx" class="">
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
    </table>

  </div>
</template>

<script>

export default {
  name: "Delegates",
  components: {
  //  Delegates,
  },
  computed: {
    Delegates() {
      let result = {
        count: 0,
        list: [],
      }
      const data = this.$store.getters['blockchain/delegates']
      console.log(data)
      result.count = data.count
      result.list = data.list
      return result
    },
  },
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

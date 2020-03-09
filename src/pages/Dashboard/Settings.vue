<template>
  <div class="row">
    <div :class.sync="'layer-head'+ ' ' + $root.modalColor">
      <router-link to="/wallet" class="back-wallet pl-4 pr-5"><i class="tim-icons icon-minimal-left"></i></router-link>
      <span>Settings</span>
    </div>

    <div class="layer-content w-100">
      <table class="table table-settings w-100">
        <tbody>
        <tr>
          <td><i class="tim-icons tim-icons-lg icon-world"></i></td>
          <td>Language</td>
          <td class="text-right">
            <base-dropdown
              menu-on-right=""
              tag="div"
              title-classes="btn btn-link"
              title="English"
            >
              <span slot="title">
                English <i class="tim-icons icon-minimal-down pb-1 pl-1"></i>
              </span>
              <span class="dropdown-item"> English</span>
              <span class="dropdown-item"> Russian</span>
            </base-dropdown>
          </td>
        </tr>

        <tr>
          <td><i class="tim-icons tim-icons-lg icon-money-coins"></i></td>
          <td>Currency</td>
          <td class="text-right">
            <base-dropdown
              menu-on-right=""
              tag="div"
              title-classes="btn btn-link"
              title="English"
            >
               <span slot="title">
                BTC <i class="tim-icons icon-minimal-down pb-1 pl-1"></i>
              </span>
              <span class="dropdown-item"> BTC</span>
              <span class="dropdown-item"> USD</span>
              <span class="dropdown-item"> RUB</span>
              <span class="dropdown-item"> CNY</span>
            </base-dropdown>
          </td>
        </tr>

        <tr>
          <td><i class="tim-icons tim-icons-lg icon-trash-simple"></i></td>
          <td>Reset All Data</td>
          <td class="text-right">
            <i class="tim-icons icon-triangle-right-17 pb-1 pl-1"></i>
          </td>
        </tr>

        <tr>
          <td><i class="tim-icons tim-icons-lg icon-alert-circle-exc"></i></td>
          <td>Version</td>
          <td class="text-right">
            1.0.0
          </td>
        </tr>

        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
export default {
  name: "Settings"
}
</script>

<style scoped>
  .table-settings td {
    padding-left: 15px;
  }

  .table-settings tr {
    border-bottom: solid 1px #2f253575
  }
</style>

<template>
  <div>
    <card v-if="show" class="top-layer">
      <h4 @click="close" class="p-3 text-uppercase w-100 text-center"><i class="tim-icons icon-double-left float-left pt-1"></i> <span class="text-center">Select Contact</span></h4>



      <card card-body-classes="table-full-width" style="margin-bottom: 0px;">


        <!-- tx desktop -->
        <el-table :data="contactList" stripe>

          <el-table-column
            className=""
            min-width="50"
            label="Name"
            property="label"
            sortable
          >
            <div class="" slot-scope="{ row }">
              <span class="font-weight-bolder">{{ row.label}}</span>
              <br>
              <span class="text-info font-weight-normal pointer"
                    @click="setContact(row.address)"
              >{{ row.address}}</span>

            </div>
          </el-table-column>

        </el-table>

      </card>


    </card>
  </div>
</template>

<script>
import {Table, TableColumn} from 'element-ui'

export default {
  name: "SelectContact",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  props: {
    show: false,
  },
  computed: {
    contactList() {
      const data = this.$store.getters['app/contacts']
      let keys = Object.keys(data)
      let result = []
      for (let i = 0; i < keys.length; i++) {
        result.push(data[keys[i]])
      }
      return result
    },
  },
  methods: {
    async setContact(address) {
      this.$emit('contact:select', address)
      this.$emit('onLayerClose')
    },
    async close() {
      this.$emit('onLayerClose')
    },
  },
  async created() {
    await this.$store.dispatch('app/fetchContacts')
  },
}
</script>

<style>
  .top-layer {
    position: fixed;
    z-index: 10000;
    top: 0;
    left: 0;
    /*background: #fff;*/
    height: 100vh;
    width: 100%;
    border-radius:0;
  }

</style>

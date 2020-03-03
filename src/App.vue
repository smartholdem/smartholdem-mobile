<template>
  <router-view></router-view>
</template>

<script>
export default {
  methods: {
    initializeLayout() {
      if (!this.$rtl.isRTL) {
        // Just make sure rtl css is off when we are not on rtl
        this.$rtl.disableRTL();
      }
    },
  },
  mounted() {
    this.initializeLayout();
  },
  async created() {
    this.$root.modal = {
      label: false
    }

    this.$root.isMobile = window.innerWidth < 800
    this.$root.height = window.innerHeight;

    this.$store._vm.$on('vuex-persist:ready', async () => {
      let locale = await this.$store.getters['app/language']
      if (locale) {
        this.$i18n.locale = locale
      }
      this.$synchronizer.defineAll()
      this.$synchronizer.ready()
    })
  },
};
</script>

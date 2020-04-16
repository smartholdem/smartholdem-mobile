<template>
  <router-view></router-view>
</template>

<script>
export default {
  methods: {
    getBroLang: function () {
      return navigator.language;
    },
    initializeLayout() {
      if (!this.$rtl.isRTL) {
        // Just make sure rtl css is off when we are not on rtl
        this.$rtl.disableRTL();
      }
    },
    async modalColor() {
      let result = 'modal-white'
      let docClasses = document.body.classList;
      if ((this.$store.getters['app/settings']).darkMode) {
        result = 'modal-dark'
        docClasses.remove('white-content');
      } else {
        docClasses.add('white-content');
      }
      return result
    },
  },
  mounted() {
    this.initializeLayout();
  },
  async created() {

    const browserLang = this.getBroLang()

    switch (browserLang) {
      case 'ru-RU':
        this.$i18n.locale = 'ru'
        break

      default:
        this.$i18n.locale = 'en'
        break
    }

    this.$root.modalColor = 'modal-white'
    this.$root.isMobile = window.innerWidth < 800
    this.$root.height = window.innerHeight;

    this.$store._vm.$on('vuex-persist:ready', async () => {
      this.$root.modalColor = await this.modalColor()
      let locale = await this.$store.getters['app/language']
      if (locale) {
        this.$i18n.locale = locale
      }

      const settings = this.$store.getters['app/settings']
      let docClasses = document.body.classList;
      if (settings.darkMode) {
        docClasses.remove('white-content');
      } else {
        docClasses.add('white-content');
      }

      this.$synchronizer.defineAll()
      this.$synchronizer.ready()
    })


  },
};
</script>

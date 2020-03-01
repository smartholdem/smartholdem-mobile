<template>
  <div>
    <div class="avatar-icon" v-html='avatarIcon'></div>
  </div>
</template>

<script>
  import jdenticon from 'jdenticon';

  jdenticon.config = {
    backColor: "#fff",
    saturation: {
      color: 0.5,
      grayscale: 0.5,
    },
    padding: 0.1
  };

  export default {
    name: "Avatar",
    props: {
      name: {
        default: 'Guest',
        type: String,
      },
      size: {
        type: Number,
        default: 120
      }
    },
    computed: {
      avatarIcon: function () {
        let avName = 'Guest';
        if (this.name) {
          avName = this.name;
        }
        return jdenticon.toSvg(avName, this.size);
      }
    }
  }
</script>

<style scoped>

</style>

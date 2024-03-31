<template>
  <button @click="goBack" class="btn btn-secondary">
    <slot>Back</slot>
  </button>
</template>

<script>
export default {
  name: 'BackButton',
  methods: {
    goBack() {
      this.$router.go(-1); // Go back to the previous page
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 10px 15px;
  cursor: pointer;
}
</style>

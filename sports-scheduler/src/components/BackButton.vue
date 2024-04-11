<template>
  <button @click="goBack" class="btn btn-secondary">
    <slot>← Go back</slot>
  </button>
</template>

<script>
export default {
  name: 'BackButton',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.btn {
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 1.5rem;
}
</style>

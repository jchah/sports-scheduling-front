<!-- Doesn't work on some of the forms, -->
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

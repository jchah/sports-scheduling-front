<template>
  <footer class="site-footer bg-dark text-white py-3">
    <div class="container">
      <p class="mb-0">&copy; {{ currentYear }} Sportz Plannerrz. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
}
</script>

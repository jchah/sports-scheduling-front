<template>
  <footer className="site-footer bg-dark text-white py-4">
    <div className="container">
      <p className="mb-0">&copy; {{ currentYear }} My Sports Scheduler. All rights reserved.</p>
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

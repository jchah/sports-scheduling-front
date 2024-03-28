<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" :class="{ 'active': $route.path === '/' }" to="/">Sports Scheduler</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" :class="{ 'active': $route.path === '/' }">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item" :class="{ 'active': $route.path === '/events' }">
            <router-link class="nav-link" to="/events">Events</router-link>
          </li>
          <li class="nav-item" :class="{ 'active': $route.path === '/leagues' }">
            <router-link class="nav-link" to="/leagues">Leagues</router-link>
          </li>
        </ul>
        <!-- Conditional rendering for login/logout -->
        <ul class="navbar-nav">
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item" v-else>
            <button class="btn btn-outline-success" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isLoggedIn: false, // This would likely be derived from auth state
    };
  },
  methods: {
    logout() {
      // Implement logout logic here
      console.log('Logging out...');
      // You'll typically want to update your auth state and possibly redirect
    },
  },
};
</script>

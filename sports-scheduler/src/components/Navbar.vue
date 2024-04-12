<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand" exact-active-class="active">Sports Scheduler</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" exact-active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/events/pg/1" class="nav-link" exact-active-class="active">Events</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/leagues/pg/1" class="nav-link" exact-active-class="active">Leagues</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reminder" class="nav-link" exact-active-class="active">Reminders</router-link>
          </li>
        </ul>
        <!-- Conditional rendering for login/logout -->
        <ul class="navbar-nav">
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link to="/login" class="nav-link" exact-active-class="active">Login</router-link>
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
  name: 'AppNavbar',
  data() {
    return {
      isLoggedIn: false,
    };
  },
  methods: {
    logout() {
      console.log('Logging out...');
    },
  },
};
</script>

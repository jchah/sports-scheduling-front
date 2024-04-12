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
        <ul class="navbar-nav ml-auto">
          <li v-if="isLoggedIn" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Logged in as: {{ username }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">Role: {{ role }}</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
            </ul>
          </li>
          <li v-else class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { EventBus } from '@/eventBus';
export default {
  name: 'AppNavbar',
  data() {
    return {
      username: localStorage.getItem('username'),
      role: localStorage.getItem('userRole'),
      isLoggedIn: !!localStorage.getItem('authToken'),
    };
  },
  created() {
    EventBus.$on('auth-change', this.updateAuthStatus);
  },
  unmounted() {
    EventBus.$off('auth-change', this.updateAuthStatus);
  },
  methods: {
    updateAuthStatus() {
      this.username = localStorage.getItem('username');
      this.role = localStorage.getItem('userRole');
      this.isLoggedIn = !!localStorage.getItem('authToken');
      console.log('Auth status updated:', this.isLoggedIn);
    },
    logout() {
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      EventBus.$emit('auth-change');
      this.$router.push('/login');
    }
  },
  watch: {
    '$route'() {
      this.username = localStorage.getItem('username');
      this.role = localStorage.getItem('userRole');
    }
  }
};
</script>

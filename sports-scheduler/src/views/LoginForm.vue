<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center">Login</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control" id="username" v-model="credentials.username" @input="checkInput" required>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" class="form-control" id="password" v-model="credentials.password" required>
              </div>

              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-success">Login</button>
                <button type="button" class="btn btn-secondary" @click="navigateToCreateAccount">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from "@/eventBus.js";

export default {
  name: 'LoginForm',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      errorMessage: ''
    };
  },

  methods: {
    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&]/g;
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        this.event[event.target.id.slice(5).toLowerCase()] = filteredText;
      }
    },
    navigateToCreateAccount() {
      this.$router.push({ name: 'AccountForm' });
      },
    async login() {
      try {
        console.log('Logging in with:', this.credentials);
        const response = await this.authenticate(this.credentials);
        console.log("Data received from server:", response);
        let data = response.data;
        let user = data.user;
        let role = data.role;

        console.log(role);
        localStorage.setItem('username', user);
        localStorage.setItem('role', role);
        localStorage.setItem('authToken', 'your_token_here');

        EventBus.$emit('auth-change');
        this.$router.push('/');
      } catch (e) {
        this.errorMessage = "Couldn't log in! Check your info and try again.";
      }
      },
    async authenticate(credentials) {
      try {
        const response = await fetch('https://sports-scheduling-f7o5.onrender.com/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        return await response.json() ;
      } catch (error) {
        console.error('Login API error:', error);
        return null;
      }
    }
  },
}
</script>

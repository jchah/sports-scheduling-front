<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="credentials.username" required>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="credentials.password" required>
      </div>

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async login() {
      // Here you would handle the login logic, including form validation
      // and making an API call to authenticate the user.
      console.log('Logging in with:', this.credentials);

      try {
        // Replace with actual API call
        const response = await this.authenticate(this.credentials);
        if (response.ok) {
          // Handle successful authentication
          this.$emit('login-success', response.data);
          // Redirect to dashboard or previous page
          this.$router.replace({ name: 'AdminDashboard' });
        } else {
          // Handle errors or unsuccessful authentication
          console.error('Login failed:', response.error);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },
    authenticate(credentials) {
      // This method should be replaced with an actual HTTP request to your backend.
      // The following line is just a placeholder for demonstration purposes.
      return new Promise((resolve) => setTimeout(() => resolve({ ok: true, data: { user: 'Admin' } }), 1000));
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>

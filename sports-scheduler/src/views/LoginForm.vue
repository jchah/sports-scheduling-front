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
                <input type="text" class="form-control" id="username" v-model="credentials.username" required>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" class="form-control" id="password" v-model="credentials.password" required>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-success">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
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

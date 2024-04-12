<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center">Create Account</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="createAccount">
              <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" class="form-control" id="username" v-model="account.username" required>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" class="form-control" id="password" v-model="account.password" required>
              </div>

              <div class="mb-3">
                <label for="role" class="form-label">Role:</label>
                <select class="form-control" id="role" v-model="account.role" required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Create Account</button>
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
  name: 'AccountForm',
  data() {
    return {
      account: {
        username: '',
        password: '',
        role: 'user'
      }
    };
  },
  methods: {
    async createAccount() {
      try {
        const response = await fetch('http://localhost:3000/create-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.account)
        });
        if (response.ok) {
          alert('Account created successfully!');
          this.$router.push('/login');
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to create account.');
      }
    }
  }
};
</script>

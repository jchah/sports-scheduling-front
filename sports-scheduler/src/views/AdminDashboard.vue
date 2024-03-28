<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <div class="dashboard-sections">
      <div class="section event-management">
        <h2>Event Management</h2>
        <p>Overview of events. <router-link to="/events">Manage Events</router-link></p>
      </div>
      <div class="section league-management">
        <h2>League Management</h2>
        <p>Overview of leagues. <router-link to="/leagues">Manage Leagues</router-link></p>
      </div>
      <div class="section user-administration">
        <h2>User Administration</h2>
        <p>Manage user accounts and permissions.</p>
      </div>
      <!-- Add more sections as needed -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  // If you have authentication, you might want to check here if the user is an admin
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.dashboard-sections .section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

h2 {
  margin-top: 0;
}
</style>

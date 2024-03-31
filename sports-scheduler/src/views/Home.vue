<template>
  <div class="container py-5">
    <div class="row mb-4">
      <div class="col-lg-8 mx-auto text-center">
        <h1>Welcome to My Sports Scheduler!</h1>
        <p class="lead">This is your go-to app for managing and scheduling sports events.</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <h2 class="mb-3">Features:</h2>
        <div class="row">
          <!-- Feature 1 -->
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">View Upcoming Events</h5>
                <p class="card-text">Stay updated with the latest sports events around you.</p>
              </div>
            </div>
          </div>
          <!-- Feature 2 -->
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Manage Leagues and Teams</h5>
                <p class="card-text">Organize and manage leagues, teams, and their schedules efficiently.</p>
              </div>
            </div>
          </div>
          <!-- Feature 3 -->
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Set Reminders</h5>
                <p class="card-text">Never miss an event with personalized reminders for your favorite sports events.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-lg-12 text-center">
        <h2 class="mb-4">Quick Links:</h2>
        <router-link to="/events" class="btn btn-primary m-2">View Events</router-link>
        <router-link to="/leagues" class="btn btn-primary m-2">View Leagues</router-link>
        <!-- Add more links as necessary -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHome',
  // You might add a script section if there's dynamic data or methods to include
}
</script>

<style scoped>
/* Custom styles can be added here if needed, but Bootstrap's classes handle most layout and design */
</style>

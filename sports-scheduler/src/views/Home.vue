<template>
  <div class="container py-5">
    <div class="row mb-4">
      <div class="col-lg-8 mx-auto text-center">
        <h1 class="display-4 font-weight-bold text-primary">Welcome to Sportz Plannerrz!</h1>
        <p class="lead text-secondary">This is your go-to app for managing and scheduling sports events.</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <h2 class="mb-3 text-success">Features:</h2>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-primary">
              <div class="card-header bg-primary text-white">
                View Upcoming Events
              </div>
              <div class="card-body">
                <p class="card-text">Stay updated with the latest sports events around you.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-info">
              <div class="card-header bg-info text-white">
                Manage Leagues and Teams
              </div>
              <div class="card-body">
                <p class="card-text">Never miss an event with personalized reminders for your favorite sports events.</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100 border-warning">
              <div class="card-header bg-warning text-dark">
                Set Reminders
              </div>
              <div class="card-body">
                <p class="card-text">Organize and manage leagues, teams, and their schedules efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="text-center">
        <h2 class="mb-4 text-danger">Quick Links:</h2>
          <router-link to="/events/pg/1" class="btn btn-primary m-2 btn-lg">View Events</router-link>
          <router-link to="/leagues/pg/2" class="btn btn-primary m-2 btn-lg">View Leagues</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHome',
}
</script>

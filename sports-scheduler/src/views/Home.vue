<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-lg-8 mx-auto text-center">
        <h1 class="display-5 font-weight-bold text-primary">Welcome to Sportz Plannerrz!</h1>
        <p class="lead text-secondary mb-lg-5">This is your go-to app for managing and scheduling sports events.</p>
      </div>
    </div>
      <div class="col-lg-12 ">
        <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4">
            <router-link to="events/pg/1" class="card h-100 border-primary text-decoration-none">
              <img src="../img/img3.jpg" class="card-img-top" alt="Upcoming Events" style="width: 100%; height: 15.625rem;">
              <div class="card-header bg-primary text-white">
                View Upcoming Events
              </div>
              <div class="card-body">
                <p class="card-text">Stay updated with the latest sports events around you.</p>
              </div>
            </router-link>
          </div>
          <div class="col-md-4 mb-4">
            <router-link to="leagues/pg/1" class="card h-100 border-info text-decoration-none">
              <img src="../img/img1.jpg" class="card-img-top" alt="Manage Teams" style="width: 100%; height: 15.625rem;">
              <div class="card-header bg-info text-white">
                Manage Leagues and Teams
              </div>
              <div class="card-body">
                <p class="card-text">Organize and manage leagues, teams, and their schedules efficiently.</p>
              </div>
            </router-link>
          </div>
          <router-link to="reminder" class="col-md-4 mb-4 text-decoration-none">
            <div class="card h-100 border-warning">
              <img src="../img/calendar.jpg" class="card-img-top" alt="Set Reminders" style="width: 100%; height: 15.625rem;">
              <div class="card-header bg-warning text-dark">
                Set Reminders
              </div>
              <div class="card-body">
                <p class="card-text">Never miss an event with personalized reminders for your favorite sports events.</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'AppHome',
}
</script>

<style>
.container {
  justify-content: center;
  align-content: center;
}
</style>
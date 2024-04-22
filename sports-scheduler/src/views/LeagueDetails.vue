<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h2>{{ formTitle }}</h2>
          </div>
          <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="leagueName" class="form-label">League Name (max 40 chars):</label>
                <input type="text" class="form-control" id="leagueName" v-model="league.name" @input="checkInput" maxlength="40" required :disabled="!admin">
              </div>
              <div class="mb-3">
                <label for="leagueSport" class="form-label">Sport:</label>
                <select id="leagueSport" class="form-select" v-model="league.sport" required :disabled="!admin">
                  <option disabled value="">Please select one</option>
                  <option value="American Football">American Football</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Baseball">Baseball</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Bowling">Bowling</option>
                  <option value="Boxing">Boxing</option>
                  <option value="Chess">Chess</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Equestrian">Equestrian</option>
                  <option value="Golf">Golf</option>
                  <option value="Gymnastics">Gymnastics</option>
                  <option value="Hockey">Hockey</option>
                  <option value="Martial Arts">Martial Arts</option>
                  <option value="Rugby">Rugby</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Table Tennis">Table Tennis</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Track and Field">Track and Field</option>
                  <option value="Volleyball">Volleyball</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="leagueDivision" class="form-label">Division:</label>
                <select id="leagueDivision" class="form-select" v-model="league.division" required :disabled="!admin">
                  <option value="">Select Division</option>
                  <option value="1">D1</option>
                  <option value="2">D2</option>
                  <option value="3">D3</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

              <div class="d-flex justify-content-between">
                <button type="submit" :class="{'btn-success': admin, 'btn-secondary': !admin }" :disabled="!admin" class="btn">Update League</button>
                <button @click="this.$router.push('pg/' + this.currentPage)" class="btn btn-secondary">
                  ← Go back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-light">
            <h3>Upcoming Events</h3>
          </div>
          <div class="card-body overflow-auto" style="max-height: 350px;">
            <b v-if="upcomingEvents.length === 0">
              No upcoming events. Check back later!
            </b>
            <ul class="list-unstyled">
              <li v-for="(event, index) in upcomingEvents" :key="index">
                {{ new Date(event.startTime).toLocaleDateString() }} - {{ event.title }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'LeagueDetails',
  data() {
    return {
      currentPage: this.$route.query.currentPage || '',
      formTitle: 'League Details',
      league: {
        name: '',
        sport: '',
        division: ''
      },
      upcomingEvents: [],
      leagues: [],
      admin: false,
      successMessage: '',
      errorMessage: '',
      loading: false
    };
  },

  methods: {
    checkPermissions() {
      this.admin = localStorage.getItem('role') === 'admin';
    },

    async submitForm() {
      this.loading = true;
      await this.fetchLeagues();
      const leagueData = {
        ...this.league,
      };

      for (let i = 0; i < this.leagues.length; i++) {
        if (this.leagues[i].name === this.league.name) {
          this.errorMessage = 'Name ' + this.league.name + ' already exists!';
          this.loading = false;
          return;
        }
      }

      try {
        await axios.put(`https://sports-scheduling-f7o5.onrender.com/leagues/${this.$route.params.id}`, leagueData);
        this.successMessage = 'League updated successfully';
      } catch (error) {
        console.error('Failed to update league:', error);
        this.errorMessage = 'Failed to update league';
      } finally {
        this.loading = false;
      }
    },
    async fetchLeagues() {
      try {
        const response = await axios.get('https://sports-scheduling-f7o5.onrender.com/leagues');
        this.leagues = response.data;
      } catch (error) {
        console.error('Failed to fetch leagues:', error);
      }
    },
    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&-]/g;
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        this.league[event.target.id.slice(6).toLowerCase()] = filteredText;
      }
    },
    async fetchLeagueDetails() {
      this.loading = true;
      try {
        const response = await axios.get(`https://sports-scheduling-f7o5.onrender.com/leagues/${this.$route.params.id}`);
        this.league = response.data;
        await this.fetchEvents();
      } catch (error) {
        console.error('Failed to fetch league details:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchEvents() {
      try {
        const response = await axios.get(`https://sports-scheduling-f7o5.onrender.com/events`);
        const events = response.data;
        this.upcomingEvents = events.filter((event) => event.league === this.league.name);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    },
  },
  created() {
    this.checkPermissions();
    this.fetchLeagueDetails();
  }
}
</script>

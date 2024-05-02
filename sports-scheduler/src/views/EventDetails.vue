<template>
  <div class="container mt-4">
    <div class="event-form bg-light p-4 shadow rounded" style="max-width: 500px; margin: auto;">
      <h2 class="text-center mb-4 bg-primary text-white p-2 rounded">{{ formTitle }}</h2>

      <div v-if="loading" class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>

      <form v-else @submit.prevent="submitForm">

        <div class="form-group mb-3">
          <label for="eventTitle" class="form-label">Event Title (max 40 chars):</label>
          <input type="text" class="form-control" id="eventTitle" v-model="event.title" @input="checkInput" maxlength="40" required :disabled="!admin">
        </div>

        <div class="form-group mb-3">
          <label for="eventDescription" class="form-label">Description (max 300 chars):</label>
          <textarea class="form-control" id="eventDescription" v-model="event.description" @input="checkInput" maxlength="300" required :disabled="!admin"></textarea>
        </div>

        <div class="form-group mb-3">
          <label for="eventStartTime" class="form-label">Start Time:</label>
          <input type="datetime-local" class="form-control" id="eventStartTime" v-model="event.startTime" required :disabled="!admin">
        </div>

        <div class="form-group mb-3">
          <label for="eventEndTime" class="form-label">End Time:</label>
          <input type="datetime-local" class="form-control" id="eventEndTime" v-model="event.endTime" required :disabled="!admin">
        </div>

        <div class="form-group mb-3">
          <label for="eventLocation" class="form-label">Location (max 100 chars):</label>
          <input type="text" class="form-control" id="eventLocation" v-model="event.location" @input="checkInput" maxlength="100" required :disabled="!admin">
        </div>

        <div class="form-group mb-4">
          <label for="eventLeague" class="form-label">League:</label>
          <select id="eventLeague" class="form-select" v-model="event.league" :disabled="!admin" @change="updateAvailableTeams">
            <option disabled value="">Select a League</option>
            <option v-for="league in leagues" :key="league._id" :value="league.name">
              {{ league.name }}
            </option>
          </select>
        </div>

        <div class="form-group mb-4">
          <label for="firstTeam" class="form-label">Team 1:</label>
          <select id="firstTeam" class="form-select" v-model="event.teams[0]" :disabled="!admin || !event.league">
            <option disabled value="">Select a Team</option>
            <option v-for="team in availableTeams" :key="team._id" :value="team.name">
              {{ team.name }}
            </option>
          </select>
        </div>

        <div class="form-group mb-4">
          <label class="form-label">Team 2:</label>
          <select class="form-select" v-model="event.teams[1]" id="secondTeam" :disabled="!admin || !event.league">
            <option disabled value="">Select a Team</option>
            <option v-for="team in availableTeams" :key="team._id" :value="team.name">
              {{ team.name }}
            </option>
          </select>
        </div>

        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <div class="d-flex justify-content-between">
          <div v-if="admin">
          <button type="submit" class="btn btn-success">Update Event</button>
          </div>
          <button @click="this.$router.push(`/events/pg/${this.currentPage}`)" class="btn btn-secondary">
            ← Go back
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EventDetails',
  data() {
    return {
      loading: true,
      currentPage: this.$route.query.currentPage || '',
      formTitle: 'Event Details',
      event: {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        teams: [],
        league: '',
      },
      leagues: [],
      teams: [],
      admin: false,
      successMessage: '',
      errorMessage: '',
      availableTeams: [],
    };
  },
  methods: {
    checkPermissions() {
      this.admin = localStorage.getItem('role') === 'admin';
    },

    async submitForm() {
      const eventData = {
        title: this.event.title,
        description: this.event.description,
        location: this.event.location,
        startTime: this.event.startTime,
        endTime: this.event.endTime,
        league: this.event.league,
        teams: this.event.teams,
      };

      try {
        await axios.put(`https://sports-scheduling-f7o5.onrender.com/events/${this.$route.params.id}`, eventData);
        this.successMessage = 'Event updated successfully';
      } catch (error) {
        console.error('Error updating event:', error);
        this.errorMessage = 'Error updating event.';
      }
    },

    async updateAvailableTeams() {
      const selectedLeague = this.leagues.find(l => l.name === this.event.league);

      if (selectedLeague) {
        this.availableTeams = this.teams.filter(team => team.sport === selectedLeague.sport);
      } else {
        this.availableTeams = [];
      }
    },

    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&-]/g;
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        this.event[event.target.id.slice(5).toLowerCase()] = filteredText;
      }
    },

    async fetchEventDetails() {
      try {
        const response = await axios.get(`https://sports-scheduling-f7o5.onrender.com/events/${this.$route.params.id}`);
        const eventData = response.data;

        this.event = {
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          startTime: this.formatDateTimeLocal(eventData.startTime),
          endTime: this.formatDateTimeLocal(eventData.endTime),
          teams: eventData.teams || [],
          league: eventData.league,
        };

        await this.updateAvailableTeams();
      } catch (error) {
        console.error('Failed to fetch event details:', error);
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

    async fetchTeams() {
      try {
        const response = await axios.get('https://sports-scheduling-f7o5.onrender.com/teams');
        this.teams = response.data;
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    },

    formatDateTimeLocal(dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toISOString().slice(0, 16);
    },
  },

  async created() {
    this.checkPermissions();

    try {
      await this.fetchLeagues();
      await this.fetchTeams();
      await this.fetchEventDetails();
    } catch (error) {
      console.error('Error during initialization:', error);
    }

    this.loading = false;
  },
};
</script>

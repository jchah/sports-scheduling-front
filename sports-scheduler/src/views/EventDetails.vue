<template>
  <div class="container mt-5">
    <div class="event-form bg-light p-4 shadow rounded" style="max-width: 500px; margin: auto;">
      <h2 class="text-center mb-4 bg-primary text-white p-2 rounded">{{ formTitle }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group mb-3">
          <label for="eventTitle" class="form-label">Event Title (max 50 chars):</label>
          <input type="text" class="form-control" id="eventTitle" v-model="event.title" @input="checkInput" maxlength="50" required :disabled="!admin">
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
          <label for="eventTeams" class="form-label">Teams (comma-separated, max 200 chars):</label>
          <input type="text" class="form-control" id="eventTeams" v-model="event.teams" @input="checkInput" maxlength="200" required :disabled="!admin">
        </div>
        <div class="form-group mb-4">
          <label for="eventLeague" class="form-label">League:</label>
          <select id="eventLeague" class="form-select" v-model="event.league" :disabled="!admin">
            <option disabled value="">Select a League</option>
            <option v-for="league in leagues" :key="league._id" :value="league.name">
              {{ league.name }}
            </option>
          </select>
        </div>

        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <div class="d-flex justify-content-between">
          <button type="submit" :class="{'btn-success': admin, 'btn-secondary': !admin }" :disabled="!admin" class="btn">Update Event</button>
          <button @click="this.$router.push('pg/' + this.currentPage)" class="btn btn-secondary">
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
      currentPage: this.$route.query.currentPage || '',
      formTitle: 'Event Details',
      event: {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        teams: '',
        league: ''
      },
      leagues: [],
      admin: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    checkPermissions() {
      this.admin = localStorage.getItem('role') === 'admin';
    },
    submitForm() {
      this.successMessage = '';
      this.errorMessage = '';
      const eventData = {
        ...this.event,
        teams: this.event.teams.split(',').map(team => team.trim()) // Convert string to array
      };

      axios.put(`http://localhost:3000/events/${this.$route.params.id}`, eventData)
          .then(() => {
            this.successMessage = 'Event updated successfully';
          })
          .catch(error => {
            console.error('Error updating event:', error);
            this.errorMessage = 'Error updating event.';
          });
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
    formatDateTimeLocal(dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toISOString().slice(0, 16);
    },
    fetchEventDetails() {
      axios.get(`http://localhost:3000/events/${this.$route.params.id}`)
          .then(response => {
            const eventData = response.data;
            this.event = {
              ...eventData,
              startTime: this.formatDateTimeLocal(eventData.startTime),
              endTime: this.formatDateTimeLocal(eventData.endTime),
              teams: eventData.teams.join(', ') // Convert array to string
            };
          })
          .catch(error => {
            console.error('Failed to fetch event details:', error);
          });
    },
    fetchLeagues() {
      axios.get('http://localhost:3000/leagues')
          .then(response => {
            this.leagues = response.data;
          })
          .catch(error => {
            console.error('Failed to fetch leagues:', error);
          });
    },
  },
  created() {
    this.checkPermissions();
    this.fetchLeagues();
    this.fetchEventDetails();
  }
}
</script>

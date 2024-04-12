<template>
  <div class="container mt-4">
    <div class="card w-100" style="max-width: 500px; margin: auto;">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">{{ formTitle }}</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="eventTitle" class="form-label">Event Title (max 20 chars):</label>
            <input type="text" class="form-control" id="eventTitle" v-model="event.title" @input="checkInput" maxlength="20" required>
          </div>
          <div class="mb-3">
            <label for="eventDescription" class="form-label">Description (max 300 chars):</label>
            <textarea class="form-control" id="eventDescription" v-model="event.description" @input="checkInput" maxlength="300" required></textarea>
          </div>
          <div class="mb-3">
            <label for="eventStartTime" class="form-label">Start Time:</label>
            <input type="datetime-local" class="form-control" id="eventStartTime" v-model="event.startTime" required>
          </div>
          <div class="mb-3">
            <label for="eventEndTime" class="form-label">End Time:</label>
            <input type="datetime-local" class="form-control" id="eventEndTime" v-model="event.endTime" required>
          </div>
          <div class="mb-3">
            <label for="eventLocation" class="form-label">Location (max 40 chars):</label>
            <input type="text" class="form-control" id="eventLocation" v-model="event.location" @input="checkInput" maxlength="40" required>
          </div>
          <div class="mb-3">
            <label for="eventTeams" class="form-label">Teams (comma-separated, max 80 chars):</label>
            <input type="text" class="form-control" id="eventTeams" v-model="event.teams" @input="checkInput" maxlength="80" required>
          </div>
          <div class="mb-4">
            <label for="eventLeague" class="form-label">League:</label>
            <select id="eventLeague" class="form-select" v-model="event.league">
              <option disabled value="">Select a League</option>
              <option v-for="league in leagues" :key="league._id" :value="league.name">
                {{ league.name }}
              </option>
            </select>
          </div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success">Update Event</button>
            <BackButton/>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BackButton from '@/components/BackButton.vue';

export default {
  name: 'EventForm',
  components: {BackButton},
  data() {
    return {
      formTitle: 'Add New Event',
      event: {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        teams: '',
        league: ''
      },
      leagues: []
    };
  },
  created() {
    this.fetchLeagues();
  },
  methods: {
    fetchLeagues() {
      axios.get('http://localhost:3000/leagues')
          .then(response => {
            this.leagues = response.data;
          })
          .catch(error => {
            console.error('Error fetching leagues:', error);
          });
    },
    submitForm() {
      const eventData = {
        ...this.event,
        teams: this.event.teams.split(',').map(team => team.trim())
      };

      axios.post('http://localhost:3000/events', eventData)
          .then(() => {
            alert('Event added successfully');
            this.clearForm();
          })
          .catch(error => {
            console.error('Error adding event:', error);
          });
    },
    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&]/g;
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        this.event[event.target.id.slice(5).toLowerCase()] = filteredText;
      }
    },
    clearForm() {
      this.event = {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        teams: '',
        league: ''
      };
    }
  }
}
</script>

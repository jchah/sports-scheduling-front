<template>
  <div class="event-form">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="eventTitle">Event Title (max 50 chars):</label>
        <input type="text" id="eventTitle" v-model="event.title" @input="checkInput" maxlength=50 required>
      </div>
      <div class="form-group">
        <label for="eventDescription">Description (max 300 chars):</label>
        <textarea id="eventDescription" v-model="event.description" @input="checkInput" maxlength=300 required></textarea>
      </div>
      <div class="form-group">
        <label for="eventStartTime">Start Time:</label>
        <input type="datetime-local" id="eventStartTime" v-model="event.startTime" required>
      </div>
      <div class="form-group">
        <label for="eventEndTime">End Time:</label>
        <input type="datetime-local" id="eventEndTime" v-model="event.endTime" required>
      </div>
      <div class="form-group">
        <label for="eventLocation">Location (max 100 chars):</label>
        <input type="text" id="eventLocation" v-model="event.location" @input="checkInput" maxlength=100 required>
      </div>
      <div class="form-group">
        <label for="eventTeams">Teams (comma-separated, max 200 chars):</label>
        <input type="text" id="eventTeams" v-model="event.teams" @input="checkInput" maxlength=200 required>
      </div>
      <div class="form-group">
        <label for="eventLeague">League:</label>
        <select id="eventLeague" v-model="event.league" class="form-select">
          <option disabled value="">Select a League</option>
          <option v-for="league in leagues" :key="league._id" :value="league.name">
            {{ league.name }}
          </option>
        </select>
      </div>
      <div class="btn-container">
        <button type="submit" class="btn btn-success mt">Update Event</button>
        <button @click="this.$router.push('pg/' + this.currentPage)" class="btn btn-secondary back">
          <slot>← Go back</slot>
        </button>
      </div>
    </form>
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
      leagues: []
    };
  },
  methods: {
    submitForm() {
      const eventData = {
        ...this.event,
        teams: this.event.teams.split(',').map(team => team.trim()) // Convert string to array
      };

      axios.put(`http://localhost:3000/events/${this.$route.params.id}`, eventData)
          .then(() => {
            alert('Event updated successfully');
          })
          .catch(error => {
            console.error('Error updating event:', error);
          });
    },
    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&-]/g;
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        this.event[event.target.id.slice(5).toLowerCase()] = filteredText; // Adjusted slice index
      }
    },
    formatDateTimeLocal(dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toISOString().slice(0, 16); // This will give the format `YYYY-MM-DDThh:mm`
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
            console.error('Error fetching event details:', error);
          });
    },
    fetchLeagues() {
      axios.get('http://localhost:3000/leagues')
          .then(response => {
            this.leagues = response.data;
          })
          .catch(error => {
            console.error('Error fetching leagues:', error);
          });
    },
  },
  created() {
    this.fetchLeagues();
    this.fetchEventDetails();
  }
}
</script>

<style>
.btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-form {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  margin-bottom: 5px;
  display: block;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group textarea {
  height: 100px;
}

button[type="submit"] {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .event-form {
    width: 90%;
    margin: 10px auto;
    padding: 15px;
  }
}
</style>

<template>
  <div class="event-form">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="eventTitle">Event Title (max 20 chars):</label>
        <input type="text" id="eventTitle" v-model="event.title" @input="checkInput" maxlength=20 required>
      </div>
      <div class="form-group">
        <label for="eventDescription">Description: (max 300 chars)</label>
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
        <label for="eventLocation">Location: (max 40 chars)</label>
        <input type="text" id="eventLocation" v-model="event.location" @input="checkInput" maxlength=40 required>
      </div>
      <div class="form-group">
        <label for="eventTeams">Teams (comma-separated, max 80 chars):</label>
        <input type="text" id="eventTeams" v-model="event.teams" @input="checkInput" maxlength=80 required>
      </div>
      <div class="form-group">
        <label for="eventLeague">League:</label>
        <select id="eventLeague" v-model="event.league">
          <option disabled value="">Select a League</option>
          <option v-for="league in leagues" :key="league._id" :value="league.name">
            {{ league.name }}
          </option>
        </select>
      </div>
      <div class="btn-container">
        <button type="submit" class="btn btn-success mt">Add Event</button>
        <BackButton/>
      </div>
    </form>
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

<style>

.btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-form {
  max-width: 500px;
  margin: 10px auto 20px;
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

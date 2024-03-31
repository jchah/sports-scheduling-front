<template>
  <BackButton/>
  <div class="event-form">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="eventTitle">Event Title:</label>
        <input type="text" id="eventTitle" v-model="event.title" required>
      </div>
      <div class="form-group">
        <label for="eventDescription">Description:</label>
        <textarea id="eventDescription" v-model="event.description" required></textarea>
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
        <label for="eventLocation">Location:</label>
        <input type="text" id="eventLocation" v-model="event.location" required>
      </div>
      <div class="form-group">
        <label for="eventTeams">Teams (comma-separated):</label>
        <input type="text" id="eventTeams" v-model="event.teams" required>
      </div>
      <div class="form-group">
        <label for="eventLeague">League:</label>
        <input type="text" id="eventLeague" v-model="event.league" required>
      </div>
      <button type="submit" class="btn btn-success">Add Event</button>
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
        teams: '', // Need to split this into an array before submission
        league: ''
      }
    };
  },
  methods: {
    submitForm() {
      // Transform teams from comma-separated string to array
      const eventData = {
        ...this.event,
        teams: this.event.teams.split(',').map(team => team.trim()) // Ensure teams are trimmed
      };

      axios.post('https://sports-scheduling-yzsb.onrender.com/events', eventData)
          .then(response => {
            // Handle success, such as showing a success message or redirecting
            console.log('Event added successfully:', response.data);
            this.clearForm();
          })
          .catch(error => {
            // Handle error, such as showing an error message
            console.error('Error adding event:', error);
          });
    },
    clearForm() {
      this.event = {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        teams: '', // If this is a comma-separated string in your form
        league: ''
      };
    }
  }
}
</script>

<style>
.event-form {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px; /* Creates consistent spacing between form elements */
}

.form-group label {
  margin-bottom: 5px; /* Spacing between label and input */
  display: block; /* Ensures label takes up its own line */
  font-weight: bold; /* Makes label text bold */
}

.form-group input,
.form-group textarea {
  width: 100%; /* Ensures full width */
  padding: 8px;
  margin-bottom: 10px; /* Spacing after each input */
  border: 1px solid #ccc; /* Subtle border */
  border-radius: 4px; /* Rounded corners */
}

.form-group textarea {
  height: 100px; /* Sets a minimum height for text area */
}

button[type="submit"] {
  padding: 10px 15px;
  background-color: #4CAF50; /* A green color for the submit button */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* Smooth background color transition on hover */
}

button[type="submit"]:hover {
  background-color: #45a049; /* Darker shade on hover */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .event-form {
    width: 90%;
    margin: 10px auto;
    padding: 15px;
  }
}

</style>


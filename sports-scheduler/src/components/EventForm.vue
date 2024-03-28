<template>
  <div class="event-form">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="eventName">Event Name:</label>
        <input type="text" id="eventName" v-model="event.name" required>
      </div>
      <div class="form-group">
        <label for="eventDate">Date:</label>
        <input type="date" id="eventDate" v-model="event.date" required>
      </div>
      <div class="form-group">
        <label for="eventTime">Time:</label>
        <input type="time" id="eventTime" v-model="event.time" required>
      </div>
      <div class="form-group">
        <label for="eventLocation">Location:</label>
        <input type="text" id="eventLocation" v-model="event.location" required>
      </div>
      <!-- Include additional fields as necessary -->
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EventForm',
  data() {
    return {
      formTitle: 'Add New Event',
      event: {
        name: '',
        date: '',
        time: '',
        location: ''
        // Add more fields as per your requirements
      }
    };
  },
  methods: {
    submitForm() {
      // Handle the form submission, possibly sending data to a backend server
      // This can include form validation and POST/PUT request to the server
      console.log('Event Data:', this.event);
      // After submission, you may want to clear the form or provide feedback to the user
    }
  },
  props: {
    // You can pass existing event data as a prop if this form is also used for editing
  }
}
</script>

<style scoped>
.event-form {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
}

.form-group input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
}

button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>

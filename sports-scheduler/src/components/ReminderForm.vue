<template>
  <div class="reminder-form">
    <h2>Set Reminder</h2>
    <form @submit.prevent="setReminder">
      <div class="form-group">
        <label for="eventSelect">Select Event:</label>
        <select id="eventSelect" v-model="reminder.eventId" required>
          <option disabled value="">Please select one</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="reminderDate">Reminder Date:</label>
        <input type="date" id="reminderDate" v-model="reminder.date" required>
      </div>
      <div class="form-group">
        <label for="reminderTime">Reminder Time:</label>
        <input type="time" id="reminderTime" v-model="reminder.time" required>
      </div>
      <div class="form-group">
        <label for="reminderMessage">Message (Optional):</label>
        <textarea id="reminderMessage" v-model="reminder.message"></textarea>
      </div>
      <button type="submit">Set Reminder</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ReminderForm',
  data() {
    return {
      reminder: {
        eventId: '',
        date: '',
        time: '',
        message: ''
      },
      events: [
        // Placeholder for event data
        { id: 1, name: 'Event 1' },
        { id: 2, name: 'Event 2' }
        // More events...
      ]
    };
  },
  methods: {
    setReminder() {
      // Logic to handle reminder setting
      // This could involve saving the reminder to a backend server or local storage
      console.log('Setting reminder:', this.reminder);
      // Provide feedback to the user, such as a success message
      // Should probably have some place to find reminders
    }
  }
}
</script>

<style scoped>
.reminder-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  display: block;
  padding: 10px 15px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  width: 100%;
}
</style>

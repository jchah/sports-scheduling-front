<template>
  <div class="reminder-form container mt-5">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        <div class="card shadow border-dark">
          <div class="card-body">
            <h2 class="card-title text-center display-6 fw-bold fst-italic">Set Reminder for Event</h2>
            <form @submit.prevent="setReminder">
              <div class="mb-3">
                <label for="eventSelect" class="form-label">Select Event:</label>
                <select class="form-select" id="eventSelect" v-model="reminder.eventId" required>
                  <option disabled value="">Please select an event</option>
                  <option v-for="event in this.events" :key="event._id" :value="event._id">
                    {{ event.title }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label for="reminderDate" class="form-label">Reminder Date:</label>
                <input type="datetime-local" class="form-control" id="reminderDate" v-model="reminder.reminderDate" required>
              </div>

              <div class="mb-3">
                <label for="emailTo" class="form-label">Recipient Email:</label>
                <input type="email" class="form-control" id="emailTo" v-model="reminder.emailTo" required placeholder="Enter recipient's email">
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Set Reminder</button>
              </div>

              <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'ReminderForm',
  data() {
    return {
      reminder: {
        eventId: '',
        reminderDate: '',
        emailTo: '',
      },
      events: [],
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async setReminder() {
      const selectedEvent = this.events.find(event => event._id === this.reminder.eventId);
      const reminderDate = new Date(this.reminder.reminderDate).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      const emailData = {
        to: this.reminder.emailTo,
        subject: `Reminder for ${selectedEvent.title}`,
        body: `Don't forget about the event "${selectedEvent.title}" on ${reminderDate}.`,
        sendAt: this.reminder.reminderDate,
      };

      console.log('Sending email data to backend:', emailData);

      try {
        const response = await axios.post('https://sports-scheduling-f7o5.onrender.com/schedule-email', emailData);
        if (response.status === 200) {
          this.successMessage = 'Reminder email scheduled successfully!';
        } else {
          console.error('Failed to schedule reminder email:', response);
          this.errorMessage = 'Failed to schedule reminder email.'
        }
      } catch (error) {
        console.error('Failed to schedule reminder email:', error);
        this.errorMessage = 'Failed to schedule reminder email.'
      }

      this.reminder = {
        eventId: '',
        reminderDate: '',
        emailTo: '',
      };
    },
    async fetchEvents() {
      await axios.get(`https://sports-scheduling-f7o5.onrender.com/events/`)
          .then(response => {
            this.events = response.data;
          })
          .catch(error => {
            console.error('Error fetching events:', error);
          });
    }
  },
  created() {
    this.fetchEvents();
  }
}
</script>

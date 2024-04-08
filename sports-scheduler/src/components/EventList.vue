<template>
  <div class="container mt-4">
    <button @click="openForm()" class="btn btn-success btn-lg">Add Event</button>
    <h2>Upcoming Events</h2>
    <div v-if="events.length">
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Event Title</th>
          <th scope="col">Start Time</th>
          <th scope="col">End Time</th>
          <th scope="col">Location</th>
          <th scope="col">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="event in events" :key="event._id">
          <td>{{ event.title }}</td>
          <td>{{ new Date(event.startTime).toLocaleString() }}</td>
          <td>{{ new Date(event.endTime).toLocaleString() }}</td>
          <td>{{ event.location }}</td>
          <td>
            <button @click="viewDetails(event._id)" class="btn btn-primary btn-sm">View</button>
            <button @click="deleteEvent(event._id)" class="btn btn-danger btn-sm">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No events to display. Check back later!</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'EventList',
  data() {
    return {
      events: []
    };
  },
  created() {
    this.fetchEvents();
  },
  methods: {
    fetchEvents() {
      axios.get('http://localhost:3000/events')
          .then(response => {
            this.events = response.data;
            console.log('Events fetched:', this.events); // For debugging
          })
          .catch(error => {
            console.error('Error fetching events:', error);
          });
    },
    deleteEvent(eventId) {
      // Confirm with the user before deletion
      if (confirm('Are you sure you want to delete this event?')) {
        // Call your backend API to delete the event
        axios.delete(`http://localhost:3000/events/${eventId}`)
            .then(() => {
              // Clear event immediately
              this.events = this.events.filter(event => event._id !== eventId);
            })
            .catch(error => {
              console.error('Error deleting event:', error);
            });
      }
    },
    viewDetails(id) {
      this.$router.push({ name: 'EventDetails', params: { id } });
    },
    openForm() {
      this.$router.push({ name: 'NewEvent'});
    }
  }
}
</script>

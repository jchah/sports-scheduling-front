<template>
  <div class="event-detail-view" v-if="event">
    <h2>{{ event.name }}</h2>
    <p><strong>Date:</strong> {{ event.date }}</p>
    <p><strong>Time:</strong> {{ event.time }}</p>
    <p><strong>Location:</strong> {{ event.location }}</p>
    <p><strong>Description:</strong> {{ event.description }}</p>
    <!-- Additional details can go here -->
    <button @click="goBack">Go Back</button>
  </div>
  <div v-else>
    <p>Loading event details...</p>
  </div>
</template>

<script>
export default {
  name: 'EventDetailView',
  data() {
    return {
      event: null // Placeholder for event data
    };
  },
  mounted() {
    this.fetchEventData();
  },
  methods: {
    fetchEventData() {
      // Logic to fetch event details from an API or store
      // For example, using this.$route.params.id to get event ID from the URL
      const eventId = this.$route.params.id;
      console.log('Fetching data for event:', eventId);
      // This is where you'd make an API call to fetch the event data
      // Simulating fetched data for demonstration
      this.event = {
        id: eventId,
        name: 'Sample Event',
        date: '2024-04-30',
        time: '14:00',
        location: 'Central Park',
        description: 'This is a sample event for demonstration purposes.'
      };
    },
    goBack() {
      this.$router.go(-1); // Go back to the previous page
    }
  }
}
</script>

<style scoped>
.event-detail-view {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>

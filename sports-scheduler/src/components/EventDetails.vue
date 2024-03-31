<template>
  <div class="event-details" v-if="event">
    <BackButton/>
    <h2>{{ event.title }}</h2>
    <p><strong>Location:</strong> {{ event.location }}</p>
    <p><strong>Description:</strong> {{event.description}}</p>
    <p><strong>Date:</strong> {{ new Date(event.startTime).toLocaleDateString() }}</p>
    <p><strong>Time:</strong> {{ new Date(event.startTime).toLocaleTimeString() }}</p>
    <div id="map" class="map-container"></div>
    <p><strong>Teams Involved:</strong> {{ event.teams.join(', ') }}</p>
    <p><strong>League:</strong> {{ event.league }}</p>
    <button @click="setReminder(event)">Set Reminder</button>
  </div>
  <div v-else>
    Loading event details...
  </div>
</template>

<script>
import axios from 'axios';
import BackButton from '@/components/BackButton.vue';

export default {
  name: 'EventDetails',
  components: {
    BackButton
  },
  props: {
    id: String
  },
  data() {
    return {
      event: null
    };
  },
  created() {
    this.fetchEventDetails();
  },
  methods: {
    fetchEventDetails() {
      const eventId = this.id || this.$route.params.id;
      axios.get(`https://sports-scheduling-yzsb.onrender.com/events/${eventId}`)
          .then(response => {
            this.event = response.data;
          })
          .catch(error => {
            console.error('Error fetching event details:', error);
          });
    },
    setReminder(event) {
      alert(`Reminder set for ${event.title}!`);
    },
    initMap() {
      // Initialize Google Maps
    }
  },
  mounted() {
    this.fetchEventDetails();
    this.$nextTick(() => {
      this.initMap();
    });
  }
};
</script>

<style scoped>
.event-details {
  /* ... */
}

.map-container {
  /* ... */
}
</style>

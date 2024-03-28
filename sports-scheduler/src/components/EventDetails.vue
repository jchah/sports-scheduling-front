<template>
  <div class="event-details">
    <h2>{{ event.name }}</h2>
    <p><strong>Date:</strong> {{ event.date }}</p>
    <p><strong>Time:</strong> {{ event.time }}</p>
    <p><strong>Location:</strong> {{ event.location }}</p>
    <div id="map" class="map-container"></div>
    <p><strong>Teams Involved:</strong> {{ event.teams.join(', ') }}</p>
    <p><strong>Details:</strong> {{ event.details }}</p>
    <button @click="setReminder(event)">Set Reminder</button>
  </div>
</template>

<script>
export default {
  name: 'EventDetails',
  props: {
    eventId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      event: null
    };
  },
  methods: {
    fetchEventDetails() {
      // Placeholder for an API call to fetch event details
      // this.event = fetch(`/api/events/${this.eventId}`).then(response => response.json());
    },
    setReminder(event) {
      // Placeholder for functionality to set a reminder for the event
      alert(`Reminder set for ${event.name}!`);
    },
    initMap() {
      // Initialize Google Maps
      // This would actually use the Google Maps API to render a map
      // with the location of the event.
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
  margin: auto;
  width: 80%;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.map-container {
  height: 300px;
  margin-top: 20px;
}
</style>

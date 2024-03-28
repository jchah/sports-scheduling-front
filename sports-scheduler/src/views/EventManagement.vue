<template>
  <div class="event-management">
    <h1>Event Management</h1>
    <button @click="navigateToNewEvent">Create New Event</button>
    <div class="event-list">
      <h2>Existing Events</h2>
      <ul>
        <li v-for="event in events" :key="event.id">
          {{ event.name }} - {{ event.date }}
          <button @click="editEvent(event.id)">Edit</button>
          <button @click="deleteEvent(event.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventManagement',
  data() {
    return {
      // Placeholder for events data, would be fetched from a backend in a real app
      events: [
        { id: 1, name: 'Basketball Tournament', date: '2024-05-15' },
        { id: 2, name: 'Soccer Match', date: '2024-06-20' },
        // Additional event objects...
      ]
    };
  },
  methods: {
    navigateToNewEvent() {
      // Navigate to the EventForm component to create a new event
      this.$router.push({ name: 'NewEvent' });
    },
    editEvent(id) {
      // Navigate to the EventForm component with the ID parameter to edit an existing event
      this.$router.push({ name: 'EditEvent', params: { id } });
    },
    deleteEvent(id) {
      // Implement deletion logic here, likely involving a confirmation dialog and an API call
      console.log(`Request to delete event with ID: ${id}`);
      // After deletion, remove the event from the 'events' array or refetch the event list
    }
  }
}
</script>

<style scoped>
.event-management {
  padding: 20px;
}

.event-list ul {
  list-style-type: none;
  padding: 0;
}

.event-list li {
  margin-bottom: 10px;
}

button {
  margin-left: 10px;
}
</style>

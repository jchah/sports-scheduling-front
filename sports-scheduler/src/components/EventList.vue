<template>
  <div class="container mt-4">
    <h2>Upcoming Events</h2>
    <table class="table">
      <thead>
      <tr>
        <th scope="col">Event Name</th>
        <th scope="col">Date</th>
        <th scope="col">Time</th>
        <th scope="col">Location</th>
        <th scope="col">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="event in events" :key="event.id">
        <td>{{ event.name }}</td>
        <td>{{ event.date }}</td>
        <td>{{ event.time }}</td>
        <td>{{ event.location }}</td>
        <td>
          <button @click="viewDetails(event.id)" class="btn btn-primary btn-sm">View</button>
          <button @click="editEvent(event.id)" class="btn btn-warning btn-sm">Edit</button>
          <button @click="deleteEvent(event.id)" class="btn btn-danger btn-sm">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'EventList',
  data() {
    return {
      // This would normally be fetched from an API
      events: [
        // Sample data - you would fetch this from your backend
        { id: 1, name: 'Basketball Game', date: '2024-04-05', time: '18:00', location: 'Gym A' },
        // Add more event objects...
      ]
    };
  },
  methods: {
    viewDetails(id) {
      // Logic to view event details
      this.$router.push({ name: 'EventDetailView', params: { id: id } });
    },
    editEvent(id) {
      // Logic to edit an event
      // For example, could navigate to EventForm component with event data
      this.$router.push({ name: 'EventForm', params: { id: id } });
    },
    deleteEvent(id) {
      // Logic to delete an event, typically would make an API call to delete
      console.log('Deleting event with id:', id);
      // Here you would have some confirmation and then perform the deletion
    }
  }
}
</script>

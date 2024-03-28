<template>
  <div class="league-management">
    <h1>League Management</h1>
    <button @click="navigateToNewLeague">Create New League</button>
    <div class="league-list">
      <h2>Existing Leagues</h2>
      <ul>
        <li v-for="league in leagues" :key="league.id">
          {{ league.name }} - Division: {{ league.division }}
          <button @click="editLeague(league.id)">Edit</button>
          <button @click="deleteLeague(league.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeagueManagement',
  data() {
    return {
      // Placeholder for league data, which would typically be fetched from a backend
      leagues: [
        { id: 1, name: 'Premier League', division: 'First' },
        { id: 2, name: 'Championship', division: 'Second' },
        // More league objects...
      ]
    };
  },
  methods: {
    navigateToNewLeague() {
      // Navigate to the LeagueForm component for creating a new league
      this.$router.push({ name: 'NewLeague' });
    },
    editLeague(id) {
      // Navigate to the LeagueForm component with the league ID to edit
      this.$router.push({ name: 'EditLeague', params: { id } });
    },
    deleteLeague(id) {
      // Implement deletion logic, possibly with a confirmation dialog
      console.log(`Request to delete league with ID: ${id}`);
      // After deletion, you might need to remove the league from the 'leagues' array or re-fetch the list
    }
  }
}
</script>

<style scoped>
.league-management {
  padding: 20px;
}

.league-list ul {
  list-style-type: none;
  padding: 0;
}

.league-list li {
  margin-bottom: 10px;
}

button {
  margin-left: 10px;
}
</style>

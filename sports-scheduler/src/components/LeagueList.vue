<template>
  <div class="container mt-4">
    <h2>Leagues</h2>
    <ul class="list-group">
      <li v-for="league in leagues" :key="league.id" class="list-group-item d-flex justify-content-between align-items-center">
        <span>{{ league.name }} (Division: {{ league.division }})</span>
        <div>
          <button @click="editLeague(league)" class="btn btn-warning btn-sm">Edit</button>
          <button @click="deleteLeague(league.id)" class="btn btn-danger btn-sm">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LeagueList',
  data() {
    return {
      // This would be fetched from the API
      leagues: [
        { id: 1, name: 'Premier League', division: 'First' },
        // ... other leagues
      ]
    };
  },
  methods: {
    editLeague(league) {
      // Route to the LeagueForm.vue component with the league data for editing
      this.$router.push({ name: 'LeagueForm', params: { league: league } });
    },
    deleteLeague(id) {
      // Call to API to delete a league, then remove it from the list
      console.log('Deleting league with id:', id);
      // Here you might show a confirmation dialog before deleting
    }
  }
}
</script>

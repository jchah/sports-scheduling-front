<template>
  <div class="league-form">
    <h2>Add New League</h2>
    <form @submit.prevent="submitLeague">
      <div class="form-group">
        <label for="leagueName">League Name:</label>
        <input type="text" id="leagueName" v-model="league.name" required>
      </div>
      <div class="form-group">
        <label for="leagueSport">Sport:</label>
        <input type="text" id="leagueSport" v-model="league.sport" required>
      </div>
      <div class="form-group">
        <label for="leagueTeams">Teams (comma-separated):</label>
        <input type="text" id="leagueTeams" v-model="teamNames" placeholder="Team A, Team B, Team C">
      </div>
      <button type="submit" class="btn btn-success">Add League</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LeagueForm',
  data() {
    return {
      league: {
        name: '',
        sport: '',
      },
      teamNames: ''
    };
  },
  methods: {
    submitLeague() {
      const payload = {
        ...this.league,
        teams: this.teamNames.split(',').map(team => team.trim()) // Convert string to array
      };

      axios.post('https://sports-scheduling-yzsb.onrender.com/leagues', payload)
          .then(response => {
            alert('League added successfully');
            this.$emit('league-added', response.data);
            this.league = { name: '', sport: '' }; // Reset form
            this.teamNames = '';
          })
          .catch(error => {
            console.error('Error adding league:', error);
            alert('Failed to add league');
          });
    }
  }
}
</script>

<style scoped>

</style>

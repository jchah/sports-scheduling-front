<template>
  <BackButton />
  <div class="league-form">
    <h2>{{ formTitle }}</h2>
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
        <label for="leagueDivision">Division:</label>
        <input type="text" id="leagueDivision" v-model="league.division" required>
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
import BackButton from '@/components/BackButton.vue';

export default {
  name: 'LeagueForm',
  components: {BackButton},
  data() {
    return {
      formTitle: 'Add New League',
      league: {
        name: '',
        sport: '',
        division: '',
      },
      teamNames: ''
    };
  },
  methods: {
    submitLeague() {
      const payload = {
        ...this.league,
        teams: this.teamNames.split(',').map(team => team.trim())
      };

      axios.post('http://localhost:3000/leagues', payload)
          .then(response => {
            console.log('League added successfully:', response.data);
            this.clearForm(); // Clear form after submission
          })
          .catch(error => {
            console.error('Error adding league:', error);
            alert('Failed to add league');
          });
    },
    clearForm() {
      this.league = { name: '', sport: '', division: '' }; // Reset form fields
      this.teamNames = '';
    }
  }
}
</script>

<style>
.league-form {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group label {
  margin-bottom: 5px;
  display: block;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group textarea {
  height: 100px;
}

button[type="submit"] {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .league-form {
    width: 90%;
    margin: 10px auto;
    padding: 15px;
  }
}

</style>
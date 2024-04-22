<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 bg-light p-4 shadow rounded" style="max-width: 500px; margin: auto;">
        <h2 class="text-center mb-4 bg-primary text-white p-2 rounded">Team Details</h2>
        <div v-if="loading" class="d-flex justify-content-center align-items-center my-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="form-group mb-3">
          <label for="teamName" class="form-label">Team Name:</label>
          <input type="text" class="form-control" id="teamName" v-model="team.name" maxlength="40" :disabled="!admin">
        </div>
        <div class="form-group mb-3">
          <label for="teamSport" class="form-label">Sport:</label>
          <select id="teamSport" class="form-select" v-model="team.sport" required :disabled="!admin">
            <option disabled value="">Please select one</option>
            <option value="American Football">American Football</option>
            <option value="Badminton">Badminton</option>
            <option value="Baseball">Baseball</option>
            <option value="Basketball">Basketball</option>
            <option value="Bowling">Bowling</option>
            <option value="Boxing">Boxing</option>
            <option value="Chess">Chess</option>
            <option value="Cricket">Cricket</option>
            <option value="Cycling">Cycling</option>
            <option value="Equestrian">Equestrian</option>
            <option value="Golf">Golf</option>
            <option value="Gymnastics">Gymnastics</option>
            <option value="Hockey">Hockey</option>
            <option value="Martial Arts">Martial Arts</option>
            <option value="Rugby">Rugby</option>
            <option value="Soccer">Soccer</option>
            <option value="Swimming">Swimming</option>
            <option value="Table Tennis">Table Tennis</option>
            <option value="Tennis">Tennis</option>
            <option value="Track and Field">Track and Field</option>
            <option value="Volleyball">Volleyball</option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label for="teamPlayers" class="form-label">Players (comma-separated):</label>
          <input type="text" class="form-control" id="teamPlayers" v-model="team.players" @input="checkInput" maxlength="200" :disabled="!admin">
        </div>

        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <div class="d-flex justify-content-between">
          <button @click="updateTeam" :class="{'btn-success': admin, 'btn-secondary': !admin}" :disabled="!admin" class="btn">Update Team</button>
          <button @click="goBack" class="btn btn-secondary">← Go back</button>
        </div>
      </div>

      <div class="col-md-6">
        <div class="bg-light p-4 shadow rounded" style="max-width: 500px; margin: auto;">
          <h2 class="text-center mb-4 bg-primary text-white p-2 rounded">Players</h2>
          <div style="overflow-y: auto; max-height: 300px;"> <!-- Overflow setting for players list -->
            <ul class="list-group">
              <li v-for="player in team.players.split(',')" :key="player.trim()" class="list-group-item">
                {{ player.trim() }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TeamDetails',
  data() {
    return {
      team: {
        name: '',
        sport: '',
        players: ''
      },
      admin: false,
      successMessage: '',
      errorMessage: '',
      loading: false
    };
  },
  methods: {
    checkPermissions() {
      this.admin = localStorage.getItem('role') === 'admin';
    },
    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&-]/g; // Allow certain special characters
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        const fieldName = event.target.id.slice(4).toLowerCase(); // Get field name from ID
        this.team[fieldName] = filteredText;
      }
    },
    async fetchTeamDetails() {
      this.loading = true;
      try {
        const response = await axios.get(`https://sports-scheduling-f7o5.onrender.com/teams/${this.$route.params.id}`);
        this.team = {
          name: response.data.name,
          sport: response.data.sport,
          players: response.data.players.join(', '),
        };
      } catch (error) {
        console.error('Failed to fetch team details:', error);
        this.errorMessage = 'Failed to fetch team details.';
      } finally {
        this.loading = false;
      }
    },
    async updateTeam() {
      this.loading = true;  // Set loading to true
      try {
        const teamData = {
          ...this.team,
          players: this.team.players.split(',').map((player) => player.trim()),  // Convert string to array
        };
        await axios.put(`https://sports-scheduling-f7o5.onrender.com/teams/${this.$route.params.id}`, teamData);
        this.successMessage = 'Team updated successfully';
      } catch (error) {
        console.error('Error updating team:', error);
        this.errorMessage = 'Failed to update team.';
      } finally {
        this.loading = false;  // Reset loading state
      }
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    this.checkPermissions();
    this.fetchTeamDetails();
  }
}
</script>

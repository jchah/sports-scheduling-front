<template>
  <div class="container mt-4">
    <div class="card w-100" style="max-width: 500px; margin: auto;">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">{{ formTitle }}</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label for="teamName" class="form-label">Team Name (max 40 chars):</label>
            <input type="text" class="form-control" id="teamName" v-model="team.name" @input="checkInput" maxlength="40" required>
          </div>
          <div class="mb-3">
            <label for="teamSport" class="form-label">Sport:</label>
            <select id="teamSport" class="form-select" v-model="team.sport" required>
              <option disabled value="">Select a Sport</option>
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
          <div class="mb-3">
            <label for="teamPlayers" class="form-label">Players (comma-separated, max 100 chars):</label>
            <input type="text" class="form-control" id="teamPlayers" v-model="team.players" @input="checkInput" maxlength="100" required>
          </div>

          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success">Add Team</button>
            <BackButton/>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BackButton from '@/components/BackButton.vue';

export default {
  name: 'TeamForm',
  components: { BackButton },
  data() {
    return {
      formTitle: 'Add New Team',
      team: {
        name: '',
        sport: '',
        players: ''
      },
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    submitForm() {
      const teamData = {
        name: this.team.name,
        sport: this.team.sport,
        players: this.team.players.split(',').map(player => player.trim())
      };

      axios.post('https://sports-scheduling-f7o5.onrender.com/teams', teamData)
          .then(() => {
            this.successMessage = 'Team added successfully';
            this.clearForm();
          })
          .catch(error => {
            console.error('Failed to add team:', error);
            this.errorMessage = 'Failed to add team.';
          });
    },
    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&]/g;
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        const fieldName = event.target.id.slice(4).toLowerCase();
        this.team[fieldName] = filteredText;
      }
    },
    clearForm() {
      this.team = {
        name: '',
        sport: '',
        players: ''
      };
    }
  }
}
</script>

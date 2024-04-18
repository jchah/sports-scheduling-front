<template>
  <div class="container mt-4">
    <div class="card" style="max-width: 500px; margin: auto;">
      <div class="card-header bg-primary text-white">
        <h2>{{ formTitle }}</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitLeague">
          <div class="mb-3">
            <label for="leagueName" class="form-label">League Name (max 40 chars):</label>
            <input type="text" class="form-control" id="leagueName" v-model="league.name" @input="checkInput" maxlength="40" required>
          </div>
          <div class="mb-3">
            <label for="leagueSport" class="form-label">Sport:</label>
            <select id="leagueSport" class="form-select" v-model="league.sport" required>
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
          <div class="mb-3">
            <label for="leagueDivision" class="form-label">Division:</label>
            <select id="leagueDivision" class="form-select" v-model="league.division" required>
              <option disabled value="">Please select one</option>
              <option value="1">D1</option>
              <option value="2">D2</option>
              <option value="3">D3</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success">Add League</button>
            <BackButton />
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
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async submitLeague() {
      await this.fetchLeagues();
      const payload = {
        ...this.league
      };

      console.log("Payload: " + JSON.stringify(payload));

      for (let i = 0; i < this.leagues.length; i++) {
        if (this.leagues[i].name === this.league.name) {
          this.errorMessage = "Name " + this.league.name + " already exists!";
          return;
        }
      }

      axios.post('https://sports-scheduling-f7o5.onrender.com/leagues', payload)
          .then(response => {
            this.successMessage = 'League added successfully';
            console.log('League added successfully:', response.data);
            this.clearForm();
          })
          .catch(error => {
            console.error('Failed to add league:', error);
            this.errorMessage = 'Failed to add league';
          });
    },
    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&-]/g;
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        this.league[event.target.id.slice(6).toLowerCase()] = filteredText;
      }
    },
    clearForm() {
      this.league = { name: '', sport: '', division: '' };
    },
    fetchLeagues() {
      return axios.get('https://sports-scheduling-f7o5.onrender.com/leagues')
          .then(response => {
            this.leagues = response.data;
          })
          .catch(error => {
            console.error('Failed to fetch leagues:', error);
          });
    }
  }
}
</script>

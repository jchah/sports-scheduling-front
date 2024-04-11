<template>
  <div class="league-form">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="submitLeague">
      <div class="form-group">
        <label for="leagueName">League Name (max 20 chars):</label>
        <input type="text" id="leagueName" v-model="league.name" @input="checkInput" maxlength=20 required>
      </div>
      <div class="form-group">
        <label for="leagueSport">Sport:</label>
        <select id="leagueSport" v-model="league.sport" required>
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
      <div class="form-group">
        <label for="leagueDivision">Division:</label>
        <select id="leagueDivision" v-model="league.division" required>
          <option disabled value="">Please select one</option>
          <option value="1">D1</option>
          <option value="2">D2</option>
          <option value="3">D3</option>
          <option value="N/A">N/A</option>
        </select>
      </div>
      <div class="form-group">
        <label for="leagueTeams">Teams (comma-separated, max 300 chars):</label>
        <input type="text" id="leagueTeams" v-model="teamNames" placeholder="Team A, Team B, Team C"
               @input="checkInput" maxlength="300">
      </div>
      <div class="btn-container">
        <button type="submit" class="btn btn-success mt">Add Event</button>
        <BackButton/>
      </div>
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
        teams: [],
        division: '',
      },
      teamNames: '',
      leagues: [],
    };
  },
  methods: {
    async submitLeague() {
      await this.fetchLeagues();
      const payload = {
        ...this.league,
        teams: this.teamNames.split(',').map(team => team.trim())
      };

      console.log("Payload: " + payload);

      for (let i = 0; i < this.leagues.length; i++) {
        if (this.leagues[i].name === this.league.name) {
          alert("Name " + this.league.name + " already exists!")
          return;
        }
      }

      axios.post('http://localhost:3000/leagues', payload)
          .then(response => {
            alert('League added successfully');
            console.log('League added successfully:', response.data);
            this.clearForm();
          })
          .catch(error => {
            console.error('Error adding league:', error);
            alert('Failed to add league');
          });
    },
    checkInput(event) {
      const originalText = event.target.value;
      const regex = /[^a-zA-Z0-9\s.,?!@$&-]/g;
      const filteredText = originalText.replace(regex, '');
      event.target.value = filteredText;

      if (originalText !== filteredText) {
        if(event.target.id === 'leagueTeams') {
          this.teamNames = filteredText;
        } else {
          this.league[event.target.id.slice(6).toLowerCase()] = filteredText;
        }
      }
    },
    clearForm() {
      this.league = { name: '', sport: '', division: '' }; // Reset form fields
      this.teamNames = '';
    },
    fetchLeagues() {
      return axios.get('http://localhost:3000/leagues')
          .then(response => {
            this.leagues = response.data;
          })
          .catch(error => {
            console.error('Error fetching leagues:', error);
          });
    }
  }
}
</script>

<style>
.btn-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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
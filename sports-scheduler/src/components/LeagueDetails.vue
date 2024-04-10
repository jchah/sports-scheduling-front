<template>
  <BackButton/>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="league-form">
          <h2>{{ formTitle }}</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="leagueName">League Name (max 20 chars):</label>
              <input type="text" id="leagueName" v-model="league.name" @input="checkInput" maxlength=20 required>
            </div>
            <div class="form-group">
              <label for="leagueSport">Sport:</label>
              <select id="leagueSport" v-model="league.sport" required>
                <option disabled value="">Please select one</option>
                <option value="Soccer">Soccer</option>
                <option value="Basketball">Basketball</option>
                <option value="Baseball">Baseball</option>
                <option value="Football">Football</option>
              </select>
            </div>
            <div class="form-group">
              <label for="leagueTeams">Teams (comma-separated, max 100 chars):</label>
              <input type="text" id="leagueTeams" v-model="league.teams" @input="checkInput" maxlength=100>
            </div>
            <div class="form-group">
              <label for="leagueDivision">Division:</label>
              <select id="leagueDivision" v-model="league.division" required>
                <option value="">Select Division</option>
                <option value="1">D1</option>
                <option value="2">D2</option>
                <option value="3">D3</option>
              </select>
            </div>
            <button type="submit" class="btn btn-success mt">Update League</button>
          </form>
        </div>
      </div>
      <div class="col-md-6">
        <div class="upcoming-events">
          <h3>Upcoming Events</h3>
          <ul>
            <li v-for="(event, index) in upcomingEvents" :key="index">
              {{ new Date(event.startTime).toLocaleDateString() }} - {{ event.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import BackButton from '@/components/BackButton.vue';

export default {
  name: 'LeagueDetails',
  components: {BackButton},
  data() {
    return {
      formTitle: 'League Details',
      league: {
        name: '',
        sport: '',
        teams: [],
        division: ''
      },
      upcomingEvents: []
    };
  },

  methods: {
    submitForm() {
      const leagueData = {
        ...this.league,
        teams: this.league.teams.map(team => team.trim())
      };

      axios.put(`http://localhost:3000/leagues/${this.$route.params.id}`, leagueData)
          .then(response => {
            console.log('League updated successfully:', response.data);
          })
          .catch(error => {
            console.error('Error updating league:', error);
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
    async fetchLeagueDetails() {
      axios.get(`http://localhost:3000/leagues/${this.$route.params.id}`)
          .then(response => {
            this.league = response.data;
            this.fetchEvents();
          })
          .catch(error => {
            console.error('Error fetching league details:', error);
          });
    },
    async fetchEvents() {
      axios.get(`http://localhost:3000/events/`)
          .then(response => {
            const events = response.data;
            console.log(response.data)
            for (let i = 0; i < events.length; i++) {
              if (events[i].league === this.league.name) {
                this.upcomingEvents.push(events[i]);
              }
            }
          })
          .catch(error => {
            console.error('Error fetching events:', error);
          });
    }
  },
  created() {
    this.fetchLeagueDetails();
  }
}
</script>

<style>

.mt {
  margin-top: 1.5rem;
}
@media (min-width: 1024px) {
  .league-form, .upcoming-events {
    flex-basis: calc(50% - 10px);
  }
}

.league-form, .upcoming-events{
  max-width: 500px;
  max-height: 500px;
  margin: 20px auto;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upcoming-events {
  overflow-y: auto;
}

</style>

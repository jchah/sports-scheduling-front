<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h2>{{ formTitle }}</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="leagueName" class="form-label">League Name (max 20 chars):</label>
                <input type="text" class="form-control" id="leagueName" v-model="league.name" @input="checkInput" maxlength="20" required>
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
                <label for="leagueTeams" class="form-label">Teams (comma-separated, max 300 chars):</label>
                <input type="text" class="form-control" id="leagueTeams" v-model="league.teams" @input="checkInput" maxlength="300">
              </div>
              <div class="mb-3">
                <label for="leagueDivision" class="form-label">Division:</label>
                <select id="leagueDivision" class="form-select" v-model="league.division" required>
                  <option value="">Select Division</option>
                  <option value="1">D1</option>
                  <option value="2">D2</option>
                  <option value="3">D3</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>
              <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-success">Update League</button>
                <button @click="this.$router.push('pg/' + this.currentPage)" class="btn btn-secondary">
                  ← Go back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-light">
            <h3>Upcoming Events</h3>
          </div>
          <div class="card-body overflow-auto" style="max-height: 300px;">
            <b v-if="upcomingEvents.length === 0">
              No upcoming events. Check back later!
            </b>
            <ul class="list-unstyled">
              <li v-for="(event, index) in upcomingEvents" :key="index">
                {{ new Date(event.startTime).toLocaleDateString() }} - {{ event.title }}
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
  name: 'LeagueDetails',
  data() {
    return {
      currentPage: this.$route.query.currentPage || '',
      formTitle: 'League Details',
      league: {
        name: '',
        sport: '',
        teams: [],
        division: ''
      },
      upcomingEvents: [],
      leagues: []
    };
  },

  methods: {
    async updateEventNames() {
      const updatePromises = this.upcomingEvents.map(event => {
        const updatedEvent = { ...event, league: this.league.name };

        // Use PUT or PATCH if updating
        return axios.put(`http://localhost:3000/events/${event._id}`, updatedEvent)
            .then(response => {
              console.log(`Updated event ${event._id}:`, response.data);
            })
            .catch(error => {
              console.error(`Error updating event ${event._id}:`, error);
            });
      });

      try {
        await Promise.all(updatePromises);
        console.log("All event names updated");
      } catch (error) {
        console.error("Error updating event names:", error);
      }
    },

    async submitForm() {
      await this.fetchLeagues();
      const leagueData = {
        ...this.league,
        teams: this.league.teams.map(team => team.trim())
      };
      for (let i = 0; i < this.leagues.length; i++) {
        if(this.leagues[i].name === this.league.name) {
          alert("Name " + this.league.name + " already exists!");
          return;
        }
      }
      await axios.put(`http://localhost:3000/leagues/${this.$route.params.id}`, leagueData)
          .then(response => {
            alert('League updated successfully');
            console.log('League updated successfully:', response.data);
          })
          .catch(error => {
            console.error('Error updating league:', error);
          });
      this.updateEventNames();
    },
    fetchLeagues() {
      return axios.get('http://localhost:3000/leagues')
          .then(response => {
            this.leagues = response.data;
          })
          .catch(error => {
            console.error('Error fetching leagues:', error);
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

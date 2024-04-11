<template>
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
              <label for="leagueTeams">Teams (comma-separated, max 300 chars):</label>
              <input type="text" id="leagueTeams" v-model="league.teams" @input="checkInput" maxlength=300>
            </div>
            <div class="form-group">
              <label for="leagueDivision">Division:</label>
              <select id="leagueDivision" v-model="league.division" required>
                <option value="">Select Division</option>
                <option value="1">D1</option>
                <option value="2">D2</option>
                <option value="3">D3</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div class="btn-container">
              <button type="submit" class="btn btn-success mt">Update League</button>
              <button @click="this.$router.push('pg/' + this.currentPage)" class="btn btn-secondary back">
                <slot>← Go back</slot>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-md-6">
        <div class="upcoming-events">
          <h3>Upcoming Events</h3>
          <b v-if="upcomingEvents.length === 0">
            No upcoming events. Check back later!
          </b>
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

<style>
.back {
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 1.5rem;
}

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

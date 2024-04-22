<template>
  <div class="container mt-4">
    <div class="card w-100" style="max-width: 500px; margin: auto;">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">{{ formTitle }}</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">

          <div class="mb-3">
            <label for="eventTitle" class="form-label">Event Title:</label>
            <input type="text" class="form-control" id="eventTitle" v-model="event.title" required maxlength="40">
          </div>

          <div class="mb-3">
            <label for="eventDescription" class="form-label">Description:</label>
            <textarea class="form-control" id="eventDescription" v-model="event.description" required maxlength="300"></textarea>
          </div>

          <div class="mb-3">
            <label for="eventStartTime" class="form-label">Start Time:</label>
            <input type="datetime-local" class="form-control" id="eventStartTime" v-model="event.startTime" required>
          </div>

          <div class="mb-3">
            <label for="eventEndTime" class="form-label">End Time:</label>
            <input type="datetime-local" class="form-control" id="eventEndTime" v-model="event.endTime" required>
          </div>

          <div class="mb-3">
            <label for="eventLocation" class="form-label">Location:</label>
            <input type="text" class="form-control" id="eventLocation" v-model="event.location" required maxlength="40">
          </div>

          <div class="mb-4">
            <label for="eventLeague" class="form-label">League:</label>
            <select id="eventLeague" class="form-select" v-model="event.league" @change="onLeagueChange">
              <option disabled value="">Select a League</option>
              <option v-for="league in leagues" :key="league._id" :value="league.name">
                {{ league.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label for="firstTeam" class="form-label">First Team:</label>
            <select
                id="firstTeam"
                class="form-select"
                v-model="event.teams[0]"
                :disabled="!event.league"
            >
              <option disabled value="">Select a Team</option>
              <option v-for="team in availableTeams" :key="team._id" :value="team.name">
                {{ team.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label for="secondTeam" class="form-label">Second Team:</label>
            <select
                id="secondTeam"
                class="form-select"
                v-model="event.teams[1]"
                :disabled="!event.league"
            >
              <option disabled value="">Select a Team</option>
              <option v-for="team in availableTeams" :key="team._id" :value="team.name">
                {{ team.name }}
              </option>
            </select>
          </div>

          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success">Add Event</button>
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
  name: 'EventForm',
  components: { BackButton },
  data() {
    return {
      formTitle: 'Add New Event',
      event: {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        teams: [],
        league: '',
      },
      leagues: [],
      teams: [],
      availableTeams: [],
      successMessage: '',
      errorMessage: ''
    };
  },
  created() {
    this.fetchLeagues();
    this.fetchTeams();
  },
  methods: {
    fetchLeagues() {
      axios.get('https://sports-scheduling-f7o5.onrender.com/leagues')
          .then(response => {
            this.leagues = response.data;
          })
          .catch(error => {
            console.error('Failed to fetch leagues:', error);
          });
    },
    fetchTeams() {
      axios.get('https://sports-scheduling-f7o5.onrender.com/teams')
          .then(response => {
            this.teams = response.data;
          })
          .catch(error => {
            console.error('Failed to fetch teams:', error);
          });
    },
    onLeagueChange() {
      console.log("LEAGUE CHANGE")
      const selectedLeagueName = this.event.league;
      if (selectedLeagueName) {
        const selectedLeague = this.leagues.find(league => league.name === selectedLeagueName);

        this.availableTeams = this.teams.filter(team => team.sport === selectedLeague.sport);
      } else {
        this.availableTeams = [];
      }
    },
    submitForm() {
      const eventTeams = this.event.teams.map(team => (typeof team === 'object' ? team.name : team));

      const eventData = {
        title: this.event.title,
        location: this.event.location,
        description: this.event.description,
        startTime: this.event.startTime,
        endTime: this.event.endTime,
        league: this.event.league,
        teams: eventTeams,
      };

      console.log(eventData);

      axios.post('https://sports-scheduling-f7o5.onrender.com/events', eventData)
          .then(() => {
            this.successMessage = 'Event added successfully';
            this.clearForm();
          })
          .catch(error => {
            console.error('Failed to add event:', error);
            this.errorMessage = 'Failed to add event.';
          });
    },
    clearForm() {
      this.event = {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        teams: [],
        league: '',
      };
      this.availableTeams = [];
    },
  },
};
</script>

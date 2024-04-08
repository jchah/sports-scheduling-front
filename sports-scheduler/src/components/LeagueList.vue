<template>
  <div class="container mt-4">
    <LeagueForm @league-added="handleLeagueAdded" />
    <h2>Leagues</h2>
    <ul class="list-group">
      <li v-for="league in leagues" :key="league._id" class="list-group-item d-flex justify-content-between align-items-center">
        <span>{{ league.name }} (Division: {{ league.division }})</span>
        <div>
          <button @click="editLeague(league)" class="btn btn-warning btn-sm">Edit</button>
          <button @click="deleteLeague(league._id)" class="btn btn-danger btn-sm">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import LeagueForm from "@/components/LeagueForm.vue";

export default {
  name: 'LeagueList',
  components: {LeagueForm},
  data() {
    return {
      leagues: []
    };
  },
  created() {
    this.fetchLeagues();
  },
  methods: {
    handleLeagueAdded(newLeague) {
      this.leagues.push(newLeague);
    },
    fetchLeagues() {
      axios.get('http://localhost:3000/leagues')
          .then(response => {
            this.leagues = response.data;
            console.log(this.leagues)
          })
          .catch(error => {
            console.error('Error fetching leagues:', error);
          });
    },
    editLeague(league) {
      this.$router.push({ name: 'LeagueForm', params: { leagueData: league } });
    },
    deleteLeague(id) {
      if (confirm('Are you sure you want to delete this league?')) {
        axios.delete(`http://localhost:3000/leagues/${id}`)
            .then(() => {
              this.leagues = this.leagues.filter(league => league._id !== id);
              alert("League successfully deleted");
            })
            .catch(error => {
              console.error('Error deleting league:', error);
            })
      }
    }
  }
}
</script>
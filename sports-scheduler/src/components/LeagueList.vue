<template>
  <div class="container mt-4">
    <div class="controls-container">
      <button @click="openForm()" class="btn btn-success btn-lg">Add League</button>
      <div class="sort-controls">
        <select v-model="sortKey">
          <option value="">Select Sort Option</option>
          <option value="name">Name</option>
          <option value="division">Division</option>
        </select>
        <select v-model="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <input type="text" v-model="filterByLeagueName" placeholder="Filter by League Name">
      </div>
    </div>
    <h2>Leagues</h2>
    <ul class="list-group">
      <li v-for="league in paginatedLeagues" :key="league._id" class="list-group-item d-flex justify-content-between align-items-center">
        <span>{{ league.name }} (Division: {{ league.division }})</span>
        <div>
          <button @click="editLeague(league)" class="btn btn-warning btn-sm">Edit</button>
          <button @click="deleteLeague(league._id)" class="btn btn-danger btn-sm">Delete</button>
        </div>
      </li>
    </ul>
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'LeagueList',
  data() {
    return {
      leagues: [],
      currentPage: 1,
      leaguesPerPage: 8,
      sortKey: this.$route.query.sortKey || '',
      sortOrder: this.$route.query.sortOrder || 'asc',
      filterByLeagueName: '',
    };
  },
  watch: {
    sortKey(newVal) {
      this.updateSortQuery(newVal, this.sortOrder);
    },
    sortOrder(newVal) {
      this.updateSortQuery(this.sortKey, newVal);
    },
    filterByLeagueName() {
      this.currentPage = 1;
    }
  },
  computed: {
    sortedLeagues() {
      return [...this.leagues]
          .filter(league => {
            return !(this.filterByLeagueName && league.name !== this.filterByLeagueName);
          })
          .sort((a, b) => {
            let modifier = 1;
            if (this.sortOrder === 'desc') modifier = -1;
            switch (this.sortKey) {
              case 'name':
                return a.name.localeCompare(b.name) * modifier;
              case 'division':
                return a.division.localeCompare(b.division) * modifier;
              default:
                return 0;
            }
          });
      },
    paginatedLeagues() {
      const start = (this.currentPage - 1) * this.leaguesPerPage;
      const end = start + this.leaguesPerPage;
      return this.sortedLeagues.slice(start, end);
      },
    totalPages() {
      return Math.ceil(this.sortedLeagues.length / this.leaguesPerPage);
    }
    },
  created() {
    this.fetchLeagues();
    },
  methods: {
    updateSortQuery(sortKey, sortOrder) {
      this.$router.push({ path: this.$route.path, query: { ...this.$route.query, sortKey, sortOrder } });
    },
    fetchLeagues() {
      axios.get('http://localhost:3000/leagues')
          .then(response => {
            this.leagues = response.data;
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
            });
      }
    },
    openForm() {
      this.$router.push({ name: 'NewLeague' });
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    }
  }
}
</script>


<style>
.controls-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}

.sort-controls select, .sort-controls input {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .controls-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .sort-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>

<template>
  <div class="container mt-4">
    <div class="controls-container">
      <div class="sort-controls">
        <select v-model="sortKey">
          <option value="">Select Sort Option</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="division">Division</option>
        </select>
        <select v-model="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <select v-model="filterBySport">
          <option value="">Select Sport</option>
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
        </select>
        <input type="text" v-model="filterByName" placeholder="Filter by League Name">
        <button @click="openForm()" class="btn btn-success btn-lg ml1">Add League</button>
      </div>
    </div>
    <h2>Leagues</h2>
    <div v-if="paginatedLeagues.length">
      <div class="table-responsive">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">League Name</th>
            <th scope="col">Division</th>
            <th scope="col">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="league in paginatedLeagues" :key="league._id">
            <td>{{ league.name }}</td>
            <td>{{ league.division }}</td>
            <td>
              <button @click="viewLeagueDetails(league._id)" class="btn btn-primary btn-sm">View</button>
              <button @click="deleteLeague(league._id)" class="btn btn-danger btn-sm">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation">
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
    <div v-else>
      <p>No leagues to display. Check back later!</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LeagueList',
  data() {
    return {
      leagues: [],
      currentPage: 1,
      leaguesPerPage: 9,
      sortKey: this.$route.query.sortKey || '',
      sortOrder: this.$route.query.sortOrder || 'asc',
      filterByName: '',
      filterBySport: '',
    };
  },
  watch: {
    '$route'(to) {
      if (to.params.page) {
        const newPage = Math.max(1, Math.min(parseInt(to.params.page, 10), this.totalPages));
        if (newPage !== this.currentPage) {
          this.currentPage = newPage;
          this.fetchLeagues();
        }
      }
    },
    sortKey(newVal) {
      this.updateSortQuery(newVal, this.sortOrder);
    },
    sortOrder(newVal) {
      this.updateSortQuery(this.sortKey, newVal);
    },
    filterByName() {
      this.currentPage = 1;
    }
  },
  computed: {
    sortedLeagues() {
      return this.leagues
          .filter(league => !this.filterByName || league.name.toLowerCase().includes(this.filterByName.toLowerCase()))
          .filter(league => !this.filterBySport || league.sport === this.filterBySport)
          .sort((a, b) => {
            let modifier = 1;
            if (this.sortOrder === 'desc') modifier = -1;
            switch (this.sortKey) {
              case 'alphabetical':
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
    const page = parseInt(this.$route.params.page, 10) || 1;
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.fetchLeagues();
  },
  methods: {
    updateSortQuery(sortKey, sortOrder) {
      this.$router.push({ query: { ...this.$route.query, sortKey, sortOrder } });
    },
    fetchLeagues() {
      axios.get('http://localhost:3000/leagues')
          .then(response => {
            this.leagues = response.data;
            this.updatePageOnFetch();
          })
          .catch(error => {
            console.error('Error fetching leagues:', error);
          });
    },
    updatePageOnFetch() {
      const pageFromUrl = parseInt(this.$route.params.page, 10);
      const page = isNaN(pageFromUrl) ? 1 : pageFromUrl;
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
      if (this.currentPage !== pageFromUrl) {
        this.$router.replace({ name: 'LeagueList', params: { page: this.currentPage } });
      }
    },
    deleteLeague(id) {
      if (confirm('Are you sure you want to delete this league?')) {
        axios.delete(`http://localhost:3000/leagues/${id}`)
            .then(() => {
              this.leagues = this.leagues.filter(league => league._id !== id);
            })
            .catch(error => {
              console.error('Error deleting league:', error);
            });
      }
    },
    viewLeagueDetails(id) {
      this.$router.push({ name: 'LeagueDetails', params: { id } });
    },
    openForm() {
      this.$router.push({ name: 'NewLeague' });
    },
    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
      this.$router.push({ name: 'LeagueList', params: { page: this.currentPage } });
    }
  }
}
</script>

<style>

.ml1 {
  margin-left: 1rem;
}
@media (max-width: 768px) {
  .controls-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .sort-controls {
    display: flex;
    flex-wrap: wrap;
  }

  .sort-controls select, .sort-controls input {
    margin-bottom: 10px;
  }
}

.table td {
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>

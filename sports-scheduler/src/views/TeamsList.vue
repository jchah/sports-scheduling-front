<template>
  <div class="container mt-4">
    <h2 class="text-center display-4 fw-bold fst-italic">Teams</h2>
    <div class="card p-3 mt-4">
      <div class="row">
        <div class="col-lg-2 col-md-4 mb-2">
          <select class="form-select border-dark" v-model="sortKey" aria-label="Sort by">
            <option value="">Select Sort Option</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
        <div class="col-lg-2 col-md-4 mb-2">
          <select class="form-select border-dark" v-model="sortOrder" aria-label="Order by">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div class="col-lg-2 col-md-4 mb-2">
          <select class="form-select border-dark" v-model="filterBySport" aria-label="Filter by Sport">
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
        <div class="col-lg-2 col-md-4 mb-2">
          <input type="text" class="form-control border-dark" v-model="filterByName" placeholder="Filter by Team Name" aria-label="Filter by Team Name">
        </div>
        <div class="col-lg-2 col-md-4 mb-2">
          <input type="text" class="form-control border-dark" v-model="filterByPlayer" placeholder="Show Player A, Player B" aria-label="Filter by Team Name">
        </div>
        <div class="col-lg-2 col-md-4 mb-2" v-if="admin">
          <button @click="openForm()" :class="{ 'btn-success': admin}" class="btn border-dark">Add Team</button>
        </div>
      </div>
      </div>

      <div v-if="paginatedTeams.length">
        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead class="table-light">
            <tr>
              <th scope="col">Team Name</th>
              <th scope="col">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="team in paginatedTeams" :key="team._id">
              <td>{{ team.name }}</td>
              <td class="text-center align-middle">
                <div class="btn-group btn-group-sm" role="group" aria-label="Team Actions">
                  <button @click="viewTeamDetails(team._id)" class="btn btn-primary btn-sm">View Details</button>
                  <div v-if="admin">
                    <button @click="deleteTeam(team._id)" class="btn btn-danger btn-sm">Delete Team</button>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <nav aria-label="Page navigation" class="d-flex justify-content-between align-items-center m-0">
          <ul class="pagination m-0 p-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link border-dark" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
              <a class="page-link border-dark" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link border-dark" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
          <div class="input-group ml-auto w-auto mb-0">
            <input type="number" class="form-control border-dark" v-model.number="jumpToPage" @keyup.enter="goToPage" placeholder="Page" min="1" :max="totalPages">
            <button class="btn btn-primary" type="button" @click="goToPage">Go</button>
          </div>
        </nav>

      </div>
    <div v-else>
      <b>No teams to display. Check back later!</b>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TeamsList',
  data() {
    return {
      jumpToPage: null,
      teams: [],
      currentPage: 1,
      teamsPerPage: 8,
      sortKey: this.$route.query.sortKey || '',
      sortOrder: this.$route.query.sortOrder || 'asc',
      filterByName: '',
      filterBySport: '',
      filterByPlayer: '',
      admin: false,
    };
  },
  watch: {
    '$route'(to) {
      if (to.params.page) {
        const newPage = Math.max(1, Math.min(parseInt(to.params.page, 10), this.totalPages));
        if (newPage !== this.currentPage) {
          this.currentPage = newPage;
          this.fetchTeams();
        }
      }
    },
    sortKey() {
      this.updateQueryParams();  // Update query when sortKey changes
    },
    sortOrder() {
      this.updateQueryParams();  // Update query when sortOrder changes
    },
    filterBySport() {
      this.updateQueryParams();  // Update query when filterBySport changes
    },
    filterByName() {
      this.updateQueryParams();  // Update query when filterByName changes
    },
    filterByPlayer() {
      this.updateQueryParams();  // Update query when filterByPlayer changes
    },
  },
  computed: {
    sortedTeams() {
      return this.teams
          .filter((team) => !this.filterByName || team.name.toLowerCase().includes(this.filterByName.toLowerCase()))
          .filter((team) => !this.filterBySport || team.sport === this.filterBySport)
          .filter(team => {
            if (!this.filterByPlayer) return true;
            const inputTeams = this.filterByPlayer.split(',').map(team => team.trim().toLowerCase());
            return inputTeams.every(inputPlayer=>
                team.players.some(player => player.toLowerCase().includes(inputPlayer))
            );
          })
          .sort((a, b) => {
            let modifier = 1;
            if (this.sortOrder === 'desc') modifier = -1;
            switch (this.sortKey) {
              case 'alphabetical':
                return a.name.localeCompare(b.name) * modifier;
              default:
                return 0;
            }
          });
    },
    paginatedTeams() {
      const start = (this.currentPage - 1) * this.teamsPerPage;
      const end = start + this.teamsPerPage;
      return this.sortedTeams.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedTeams.length / this.teamsPerPage);
    },
  },
  created() {
    this.checkPermissions();
    const page = parseInt(this.$route.params.page, 10) || 1;
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.fetchTeams();
  },
  methods: {
    updateQueryParams() {
      this.$router.push({
        query: {
          sortKey: this.sortKey,
          sortOrder: this.sortOrder,
          filterBySport: this.filterBySport,
          filterByName: this.filterByName,
          filterByPlayer: this.filterByPlayer,
        },
      });
    },
    checkPermissions() {
      this.admin = localStorage.getItem('role') === 'admin';
    },
    goToPage() {
      const pageNumber = Math.max(1, Math.min(this.totalPages, Number(this.jumpToPage)));
      if (!isNaN(pageNumber) && pageNumber !== this.currentPage) {
        this.changePage(pageNumber);
        this.jumpToPage = null;
      }
    },
    fetchTeams() {
      axios.get('https://sports-scheduling-f7o5.onrender.com/teams')
          .then((response) => {
            this.teams = response.data;
            this.updatePageOnFetch();
          })
          .catch((error) => {
            console.error('Failed to fetch teams:', error);
          });
    },
    updatePageOnFetch() {
      const pageFromUrl = parseInt(this.$route.params.page, 10);
      const page = isNaN(pageFromUrl) ? 1 : pageFromUrl;
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
      if (this.currentPage !== pageFromUrl) {
        this.$router.replace({ name: 'TeamsList', params: { page: this.currentPage } });
      }
    },
    async deleteTeam(id, name) {
      if (confirm('Are you sure you want to delete this team?')) {
        await axios.get('https://sports-scheduling-f7o5.onrender.com/events')
            .then((response) => {
              const allEvents = response.data;
              const eventsToUpdate = allEvents.filter((event) => event.team === name);
              const updatePromises = eventsToUpdate.map((event) => {
                const updatedEvent = { ...event, team: '' };
                return axios.put(`https://sports-scheduling-f7o5.onrender.com/events/${event._id}`, updatedEvent);
              });
              return Promise.all(updatePromises);
            })
            .then(() => {
              return axios.delete(`https://sports-scheduling-f7o5.onrender.com/teams/${id}`);
            })
            .then(() => {
              this.teams = this.teams.filter((team) => team._id !== id);
            })
            .catch((error) => {
              console.error('Failed to update events or delete team:', error);
            });
      }
    },
    viewTeamDetails(id) {
      this.$router.push({
        name: 'TeamDetails',
        params: { id },
        query: { currentPage: this.currentPage },
      });
    },
    openForm() {
      this.$router.push({ name: 'NewTeam' });
    },
    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
      this.$router.push({ name: 'TeamsList', params: { page: this.currentPage } });
    },
  },
};
</script>

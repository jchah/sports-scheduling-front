<template>
  <div class="container mt-4">
    <h2 class="text-center display-4 fw-bold fst-italic">Upcoming Events</h2>
    <div class="card p-3 mt-4">
      <div class="row">
        <div class="col-lg-2 col-md-4 mb-2">
          <select class="form-select border-dark" v-model="sortKey" aria-label="Sort by">
            <option value="">Select Sort Option</option>
            <option value="date">Date</option>
            <option value="league">League</option>
            <option value="alphabet">Alphabetical</option>
          </select>
        </div>
        <div class="col-lg-2 col-md-4 mb-2">
          <select class="form-select border-dark" v-model="sortOrder" aria-label="Order by">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div class="col-lg-2 col-md-4 mb-2">
          <input type="text" class="form-control border-dark" v-model="filterByLeague" placeholder="Filter by League" aria-label="Filter by League">
        </div>
        <div class="col-lg-2 col-md-4 mb-2">
          <input type="text" class="form-control border-dark" v-model="filterByTitle" placeholder="Filter by Title" aria-label="Filter by Title">
        </div>
        <div class="col-lg-2 col-md-4 mb-2">
          <input type="text" class="form-control border-dark" v-model="filterByTeam" placeholder="Show Team A, Team B" aria-label="Filter by Team">
        </div>
        <div class="col-lg-2 col-md-4 mb-2" v-if="admin">
          <button @click="openForm()" :class="{ 'btn-success': admin }" class="btn border-dark">Add Event</button>
        </div>
      </div>
    </div>
    <div v-if="paginatedEvents.length">
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead class="table-light">
          <tr>
            <th scope="col">Event Title</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
            <th scope="col">Location</th>
            <th scope="col">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="event in paginatedEvents" :key="event._id">
            <td>{{ event.title }}</td>
            <td>{{ new Date(event.startTime).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</td>
            <td>{{ new Date(event.endTime).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</td>
            <td>
              <a href="#" @click="toggleMap(event)">{{ event.location }}</a>
              <div v-if="event.showMap">
                <iframe
                    width="100%"
                    height="200"
                    style="border:0"
                    referrerpolicy="no-referrer-when-downgrade"
                    :src="`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(event.location)}`"
                    allowfullscreen>
                </iframe>
              </div>
            </td>
            <td class="text-center align-middle">
              <div class="btn-group btn-group-sm" role="group" aria-label="Event Actions">
                <button @click="viewDetails(event._id)" class="btn btn-primary btn-sm">View Details</button>
                <div v-if="admin">
                  <button @click="deleteEvent(event._id)" class="btn btn-danger btn-sm">Delete Event</button>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation" class="d-flex justify-content-between align-items-center">
        <ul class="pagination">
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


        <div class="ml-3">
          <div class="input-group input-group mb-3">
            <input type="number" class="form-control border-dark" v-model.number="jumpToPage" @keyup.enter="goToPage" placeholder="Page" min="1" :max="totalPages">
            <button class="btn btn-primary" type="button" @click="goToPage">Go</button>
          </div>
        </div>
      </nav>
    </div>
    <div v-else>
      <b>No events to display. Check back later!</b>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'EventList',
  data() {
    return {
      jumpToPage: null,
      events: [],
      currentPage: 1,
      eventsPerPage: 8,
      sortKey: this.$route.query.sortKey || '',
      sortOrder: this.$route.query.sortOrder || 'asc',
      filterByLeague: this.$route.query.filterByLeague || '',
      filterByTitle: this.$route.query.filterByTitle || '',
      filterByTeam: this.$route.query.filterByTeam || '',
      apiKey: 'AIzaSyC1J8rbjY3B-Y-dzoWU7jl6hAW4jAh-yRk',
      admin: false
    };
  },
  watch: {
    '$route'(to) {
      if (to.params.page) {
        const newPage = Math.max(1, Math.min(parseInt(to.params.page, 10), this.totalPages));
        if (newPage !== this.currentPage) {
          this.currentPage = newPage;
          this.fetchEvents();
        }
      }
    },
    filterByLeague() {
      this.currentPage = 1;
      this.updateQueryParams();
    },
    filterByTitle() {
      this.currentPage = 1;
      this.updateQueryParams();
    },
    filterByTeam() {
      this.currentPage = 1;
      this.updateQueryParams();
    },
    sortKey() {
      this.updateQueryParams();
    },
    sortOrder() {
      this.updateQueryParams();
    },
  },
  computed: {
    sortedEvents() {
      return this.events
          .filter(event => !this.filterByTitle || event.title.toLowerCase().includes(this.filterByTitle.toLowerCase()))
          .filter(event => !this.filterByLeague || event.league.toLowerCase().includes(this.filterByLeague.toLowerCase()))
          .filter(event => {
            if (!this.filterByTeam) return true;
            const inputTeams = this.filterByTeam.split(',').map(team => team.trim().toLowerCase());
            return inputTeams.every(inputTeam =>
                event.teams.some(team => team.toLowerCase().includes(inputTeam))
            );
          })
          .sort((a, b) => {
            let modifier = 1;
            if (this.sortOrder === 'desc') modifier = -1;
            switch (this.sortKey) {
              case 'date':
                return (new Date(a.startTime) - new Date(b.startTime)) * modifier;
              case 'league':
                return (a.league.localeCompare(b.league)) * modifier;
              case 'alphabet':
                return a.title.localeCompare(b.title) * modifier;
              default:
                return 0;
            }
          });
    },
    paginatedEvents() {
      const start = (this.currentPage - 1) * this.eventsPerPage;
      const end = start + this.eventsPerPage;
      return this.sortedEvents.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedEvents.length / this.eventsPerPage);
    }
  },
  created() {
    this.checkPermissions();
    const page = parseInt(this.$route.params.page, 10) || 1;
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.fetchEvents();
  },
  methods: {
    updateQueryParams() {
      this.$router.push({
        query: {
          sortKey: this.sortKey,
          sortOrder: this.sortOrder,
          filterByLeague: this.filterByLeague,
          filterByTitle: this.filterByTitle,
          filterByTeam: this.filterByTeam,
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
    fetchEvents() {
      axios.get('https://sports-scheduling-f7o5.onrender.com/events')
          .then(response => {
            this.events = response.data.map(event => ({
              ...event,
              showMap: false
            }));
            this.updatePageOnFetch();
          })
          .catch(error => {
            console.error('Failed to fetch events:', error);
          });
    },
    updatePageOnFetch() {
      const pageFromUrl = parseInt(this.$route.params.page, 10);
      const page = isNaN(pageFromUrl) ? 1 : pageFromUrl;
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
      if (this.currentPage !== pageFromUrl) {
        this.$router.replace({ name: 'EventList', params: { page: this.currentPage } });
      }
    },
    deleteEvent(eventId) {
      if (confirm('Are you sure you want to delete this event?')) {
        axios.delete(`https://sports-scheduling-f7o5.onrender.com/events/${eventId}`)
            .then(() => {
              this.events = this.events.filter(event => event._id !== eventId);
            })
            .catch(error => {
              console.error('Failed to delete event:', error);
            });
      }
    },
    viewDetails(id) {
      this.$router.push({ name: 'EventDetails', params: { id }, query: {currentPage: this.currentPage}});
    },
    openForm() {
      this.$router.push({ name: 'NewEvent' });
    },
    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
      this.$router.push({ name: 'EventList', params: { page: this.currentPage } });
    },
    toggleMap(event) {
      event.showMap = !event.showMap;
    }
  }
}
</script>

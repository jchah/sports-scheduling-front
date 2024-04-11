<template>
  <div class="container mt-4">
    <div class="row mb-3 align-items-center">
      <div class="col-auto">
        <select class="form-select form-select" v-model="sortKey">
          <option value="">Select Sort Option</option>
          <option value="date">Date</option>
          <option value="league">League</option>
          <option value="alphabet">Alphabetical</option>
        </select>
      </div>
      <div class="col-auto">
        <select class="form-select form-select" v-model="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div class="col-auto">
        <input type="text" class="form-control form-control" v-model="filterByLeague" placeholder="Filter by League">
      </div>
      <div class="col-auto">
        <input type="text" class="form-control form-control" v-model="filterByTitle" placeholder="Filter by Title">
      </div>
      <div class="col-auto">
        <button @click="openForm()" class="btn btn-success btn">Add Event</button>
      </div>
    </div>

    <h2>Upcoming Events</h2>
    <div v-if="paginatedEvents.length">
      <div class="table-responsive">
        <table class="table">
          <thead>
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
            <td>{{ new Date(event.startTime).toLocaleString() }}</td>
            <td>{{ new Date(event.endTime).toLocaleString() }}</td>
            <td>{{ event.location }}</td>
            <td>
              <button @click="viewDetails(event._id)" class="btn btn-primary btn-sm">View</button>
              <button @click="deleteEvent(event._id)" class="btn btn-danger btn-sm">Delete</button>
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
          <li class="page-item ml1">
            <div class="input-group">
              <input type="number" class="form-control form-control-sm" v-model.number="jumpToPage" @keyup.enter="goToPage" placeholder="Page" min="1" :max="totalPages">
              <div class="input-group-append">
                <button class="btn btn-primary" type="button" @click="goToPage">Go</button>
              </div>
            </div>
          </li>
        </ul>
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
      filterByLeague: '',
      filterByTitle: '',
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
    sortKey(newVal) {
      this.updateSortQuery(newVal, this.sortOrder);
    },
    sortOrder(newVal) {
      this.updateSortQuery(this.sortKey, newVal);
    },
    filterByLeague() {
      this.currentPage = 1;
    },
    filterByTitle() {
      this.currentPage = 1;
    }
  },
  computed: {
    sortedEvents() {
      return this.events
          .filter(event => {
            return !(this.filterByTitle && event.title !== this.filterByTitle);
          })
          .filter(event => {
            return !(this.filterByLeague && event.league !== this.filterByLeague);
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
    const page = parseInt(this.$route.params.page, 10) || 1;
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.fetchEvents();
  },
  methods: {
    goToPage() {
      const pageNumber = Math.max(1, Math.min(this.totalPages, Number(this.jumpToPage)));

      if (!isNaN(pageNumber) && pageNumber !== this.currentPage) {
        this.changePage(pageNumber);
        this.jumpToPage = null;
      }
    },
    updateSortQuery(sortKey, sortOrder) {
      this.$router.push({ query: { ...this.$route.query, sortKey, sortOrder } });
    },
    fetchEvents() {
      axios.get('http://localhost:3000/events')
          .then(response => {
            this.events = response.data;
            this.updatePageOnFetch();
          })
          .catch(error => {
            console.error('Error fetching events:', error);
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
        axios.delete(`http://localhost:3000/events/${eventId}`)
            .then(() => {
              this.events = this.events.filter(event => event._id !== eventId);
            })
            .catch(error => {
              console.error('Error deleting event:', error);
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
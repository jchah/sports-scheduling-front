<template>
  <div class="container mt-4">
    <div class="controls-container">
      <button @click="openForm()" class="btn btn-success btn-lg">Add Event</button>
      <div class="sort-controls">
        <select v-model="sortKey">
          <option value="">Select Sort Option</option>
          <option value="date">Date</option>
          <option value="league">League</option>
          <option value="alphabet">Alphabetical</option>
        </select>
        <select v-model="sortOrder">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>


        <input type="text" v-model="filterByLeague" placeholder="Filter by League">
        <input type="text" v-model="filterByTitle" placeholder="Filter by Title">
      </div>
    </div>
    <h2>Upcoming Events</h2>
    <div v-if="paginatedEvents.length">
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
      <!-- Pagination Controls -->
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
      <p>No events to display. Check back later!</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EventList',
  data() {
    return {
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
    this.fetchEvents();
  },
  methods: {
    updateSortQuery(sortKey, sortOrder) {
      this.$router.push({ query: { ...this.$route.query, sortKey, sortOrder } });
    },
    fetchEvents() {
      axios.get('http://localhost:3000/events')
          .then(response => {
            this.events = response.data;
          })
          .catch(error => {
            console.error('Error fetching events:', error);
          });
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
      this.$router.push({ name: 'EventDetails', params: { id } });
    },
    openForm() {
      this.$router.push({ name: 'NewEvent' });
    },
    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    }
  }
}
</script>

<style>
/* Apply a consistent class for both selects and inputs */
.form-control {
  height: 38px; /* Match height of inputs */
  padding: 6px 12px; /* Match padding of inputs */
  border: 1px solid #ccc; /* Match border of inputs */
  border-radius: 4px; /* Match border-radius of inputs */
  font-size: 16px; /* Optional: Adjust the font size as needed */
}

/* Apply the .form-control class to selects in your component */
.sort-controls select {
  margin-right: 5px; /* Maintain spacing between controls */
}

/* Remove default margins from selects if they are inheriting any styles from other CSS */
.sort-controls select {
  margin: 0; /* Remove default margins if present */
}

@media (max-width: 768px) {
  .sort-controls select, .sort-controls input {
    margin-bottom: 10px; /* Space between controls when stacked */
    width: 100%; /* Controls should expand to the full width */
  }
}


.controls-container {
  display: flex;
  align-items: center;
  gap: 10px;
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
  }

  .sort-controls select, .sort-controls input {
    margin-bottom: 10px;
  }
}
</style>

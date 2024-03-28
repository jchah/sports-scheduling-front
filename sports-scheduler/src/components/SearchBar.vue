<template>
  <div class="search-bar">
    <input
        type="text"
        v-model="searchQuery"
        @input="updateQuery"
        placeholder="Search..."
        aria-label="Search"
    >
    <button @click="submitSearch">Search</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    updateQuery() {
      // This method is triggered on every input, you can implement debouncing if necessary
      this.$emit('update:query', this.searchQuery);
    },
    submitSearch() {
      // This method could be used to trigger a search, possibly navigating to a search results page or filtering a list
      console.log('Searching for:', this.searchQuery);
      this.$emit('submit', this.searchQuery);
    }
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>

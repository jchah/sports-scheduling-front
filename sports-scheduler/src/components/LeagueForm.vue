<template>
  <div class="league-form">
    <h2>{{ isEdit ? 'Edit League' : 'Create League' }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="leagueName">League Name:</label>
        <input type="text" id="leagueName" v-model="league.name" required>
      </div>
      <div class="form-group">
        <label for="leagueDivision">Division:</label>
        <input type="text" id="leagueDivision" v-model="league.division" required>
      </div>
      <!-- Add more input fields as required -->
      <button type="submit">{{ isEdit ? 'Update' : 'Create' }}</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LeagueForm',
  props: {
    existingLeague: Object, // For editing an existing league
  },
  data() {
    return {
      league: {
        name: '',
        division: ''
        // Initialize other league properties here
      },
      isEdit: false
    };
  },
  created() {
    if (this.existingLeague) {
      this.league = { ...this.existingLeague };
      this.isEdit = true;
    }
  },
  methods: {
    submitForm() {
      // Perform form submission to create or update the league
      // This could involve making an API call to backend
      console.log(this.isEdit ? 'Updating league...' : 'Creating league...', this.league);
      // Handle the promise and provide user feedback
    }
  }
}
</script>

<style scoped>
.league-form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #ececec;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #5cb85c;
  color: white;
  cursor: pointer;
}
</style>

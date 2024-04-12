import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import EventList from '@/views/EventList.vue';
import LeagueList from '@/views/LeagueList.vue';
import EventForm from '@/views/EventForm.vue';
import LeagueForm from '@/views/LeagueForm.vue';
import EventDetails from '@/views/EventDetails.vue';
import LoginForm from "@/views/LoginForm.vue";
import LeagueDetails from "@/views/LeagueDetails.vue";
import ReminderForm from "@/views/ReminderForm.vue";

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/events/new',
    name: 'NewEvent',
    component: EventForm
  },
  {
    path: '/events/:id',
    name: 'EventDetails',
    component: EventDetails,
    props: true
  },
  {
    path: '/leagues/pg/:page',
    name: 'LeagueList',
    component: LeagueList
  },
  {
    path: '/leagues/new',
    name: 'NewLeague',
    component: LeagueForm
  },
  {
    path: '/leagues/:id',
    name: 'LeagueDetails',
    component: LeagueDetails,
    props: true
  },
  {
    path: '/events/pg/:page',
    name: 'EventList',
    component: EventList
  },
  {
    path: '/login',
    name: 'LoginForm',
    component: LoginForm
  },
  {
    path: '/reminder',
    name: 'ReminderForm',
    component: ReminderForm
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

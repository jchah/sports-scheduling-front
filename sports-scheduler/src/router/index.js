import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/views/Home.vue';
import EventList from '@/components/EventList.vue';
import LeagueList from '@/components/LeagueList.vue';
import EventForm from '@/components/EventForm.vue';
import LeagueForm from '@/components/LeagueForm.vue';
import EventDetails from '@/components/EventDetails.vue';
import LoginForm from "@/components/LoginForm.vue";
import LeagueDetails from "@/components/LeagueDetails.vue";

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

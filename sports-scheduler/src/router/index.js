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
import AccountForm from '@/views/AccountForm.vue';
import TeamsList from "@/views/TeamsList.vue";
import TeamForm from "@/views/TeamForm.vue";
import TeamDetails from "@/views/TeamDetails.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/events/new',
    name: 'NewEvent',
    component: EventForm,
    beforeEnter: (to, from, next) => {
      if (!(localStorage.getItem('role') === 'admin')) {
        alert('You do not have permission to add new events.');
        next(false);
      } else {
        next();
      }
    }
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
    component: LeagueForm,
    beforeEnter: (to, from, next) => {
      if (!(localStorage.getItem('role') === 'admin')) {
        alert('You do not have permission to add new events.');
        next(false);
      } else {
        next();
      }
    }
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
  },
  {
    path: '/create-account',
    name: 'AccountForm',
    component: AccountForm
  },
  {
    path: '/teams/pg/:page',
    name: 'TeamsList',
    component: TeamsList
  },
  {
    path: '/teams/new',
    name: 'NewTeam',
    component: TeamForm,
    beforeEnter: (to, from, next) => {
      if (!(localStorage.getItem('role') === 'admin')) {
        alert('You do not have permission to add new events.');
        next(false);
      } else {
        next();
      }
    }
  },
  {
    path: '/teams/:id',
    name: 'TeamDetails',
    component: TeamDetails,
    props: true
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
//
// // Navigation Guard
// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/create-account'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('authToken');
//
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;

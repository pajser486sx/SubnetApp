import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import UserView from "../views/UserView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
     {
      path: "/user",
      name: "user",
      component: UserView,
      meta: {requiresAuth: true},
  },
  ]
});

router.beforeEach((to) => {
  const token = localStorage.getItem("subnetToken");
  if (to.meta.requiresAuth && !token) {
    return "/login";
  }
});

export default router;
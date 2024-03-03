import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../views/SignIn.vue") },
    { path: "/register", component: () => import("../views/Register.vue") },
    {
      path: "/dashboard",
      // Make sure this path correctly points to where Dashboard.vue is located
      component: () => import("../views/Dashboard.vue"),
    },
  ],
});

export default router;

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "financeiro",
            component: () => import("../views/FinanceiroView.vue"),
        },
    ],
});

export default router;

import MainLayout from "../layouts/MainLayout.vue";

export const routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                component: () => import("../pages/LoginPage.vue"),
            },
        ],
    },
]
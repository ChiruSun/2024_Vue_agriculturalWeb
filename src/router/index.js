import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'vagetable',
      component: () => import('../views/VagetableView.vue')
    },
    {
      path: '/fruit',
      component: () => import('../views/FruitView.vue')
    },
    {
      path: '/flower',
      component: () => import('../views/FlowerView.vue')
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router

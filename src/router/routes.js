
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/home' },
      { path: '/home', 
        component: () => import('pages/Home/Home.vue'),
        children: [
          { 
            path: '/home/child',
            component: () => import('pages/Home/Child.vue'),
            children: [
              {
                path: '/home/child/grandchild',
                component: () => import('pages/Home/GrandChild.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/home/:catchAll(.*)*',
        component: () => import('pages/Home/Home.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Home/Home.vue')
  }
]

export default routes

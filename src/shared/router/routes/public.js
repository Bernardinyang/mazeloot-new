export const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/shared/views/public/Home.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/shared/views/public/About.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/shared/views/public/Products.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora',
    name: 'memora',
    component: () => import('@/shared/views/public/Memora.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('@/shared/views/public/Pricing.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/shared/views/public/ContactUs.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/shared/views/public/Faq.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/waitlist',
    name: 'waitlist',
    component: () => import('@/shared/views/public/Waitlist.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/early-access',
    name: 'early-access',
    component: () => import('@/shared/views/public/EarlyAccess.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/founders',
    name: 'founders-pricing',
    component: () => import('@/shared/views/public/FoundersPricing.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/build-your-own',
    name: 'build-your-own',
    component: () => import('@/shared/views/public/BuildYourOwn.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/subscription/success',
    name: 'subscription-success',
    component: () => import('@/shared/views/public/SubscriptionSuccess.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/shared/views/public/PrivacyPolicy.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/shared/views/public/TermsOfService.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/newsletter/unsubscribe/:token',
    name: 'newsletter-unsubscribe',
    component: () => import('@/shared/views/public/NewsletterUnsubscribe.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/shared/views/NotFound.vue'),
  },
]

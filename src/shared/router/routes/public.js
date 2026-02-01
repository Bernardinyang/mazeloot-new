import Home from '@/shared/views/public/Home.vue'
import About from '@/shared/views/public/About.vue'
import Products from '@/shared/views/public/Products.vue'
import Pricing from '@/shared/views/public/Pricing.vue'
import ContactUs from '@/shared/views/public/ContactUs.vue'
import Waitlist from '@/shared/views/public/Waitlist.vue'
import EarlyAccess from '@/shared/views/public/EarlyAccess.vue'
import FoundersPricing from '@/shared/views/public/FoundersPricing.vue'
import BuildYourOwn from '@/shared/views/public/BuildYourOwn.vue'
import SubscriptionSuccess from '@/shared/views/public/SubscriptionSuccess.vue'

export const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/products',
    name: 'products',
    component: Products,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: Pricing,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactUs,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/waitlist',
    name: 'waitlist',
    component: Waitlist,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/early-access',
    name: 'early-access',
    component: EarlyAccess,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/founders',
    name: 'founders-pricing',
    component: FoundersPricing,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/build-your-own',
    name: 'build-your-own',
    component: BuildYourOwn,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/subscription/success',
    name: 'subscription-success',
    component: SubscriptionSuccess,
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

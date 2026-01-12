const Overview = () => import('@/domains/memora/views/user/Overview.vue')
const GettingStarted = () => import('@/domains/memora/views/user/GettingStarted.vue')
const ProductSelection = () => import('@/domains/memora/views/user/onboarding/ProductSelection.vue')
const Setup = () => import('@/domains/memora/views/user/onboarding/Setup.vue')
const MemoraOnboarding = () => import('@/domains/memora/views/user/onboarding/memora/Onboarding.vue')

export const userRoutes = [
  {
    path: '/overview',
    name: 'overview',
    component: Overview,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/onboarding/products',
    name: 'productSelection',
    component: ProductSelection,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/onboarding/setup',
    name: 'setup',
    component: Setup,
    meta: {
      requiresAuth: true,
    },
  },
  // Dynamic product onboarding route - format: /{productSlug}/onboarding
  {
    path: '/:productSlug/onboarding',
    name: 'productOnboarding',
    component: () => import('@/domains/memora/views/user/onboarding/ProductOnboardingWrapper.vue'),
    meta: {
      requiresAuth: true,
      isNewUserFlow: true,
    },
  },
]

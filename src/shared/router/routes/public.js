const defaultDesc = 'Professional gallery and client proofing platform for creatives. Share collections, get approvals, and deliver with your brand.'

export const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/shared/views/public/Home.vue'),
    meta: { requiresAuth: false, title: 'Mazeloot - Professional Gallery & Client Proofing Platform for Creatives', description: defaultDesc },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/shared/views/public/About.vue'),
    meta: { requiresAuth: false, title: 'About Us | Mazeloot', description: 'Learn about Mazeloot and our mission to help creatives share and deliver work beautifully.' },
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/shared/views/public/Products.vue'),
    meta: { requiresAuth: false, title: 'Products | Mazeloot', description: defaultDesc },
  },
  {
    path: '/memora',
    name: 'memora',
    component: () => import('@/shared/views/public/Memora.vue'),
    meta: { requiresAuth: false, title: 'Memora - Client Galleries & Proofing | Mazeloot', description: defaultDesc },
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('@/shared/views/public/Pricing.vue'),
    meta: { requiresAuth: false, title: 'Pricing | Mazeloot', description: defaultDesc },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/shared/views/public/ContactUs.vue'),
    meta: { requiresAuth: false, title: 'Contact Us | Mazeloot', description: 'Get in touch with the Mazeloot team.' },
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/shared/views/public/Faq.vue'),
    meta: { requiresAuth: false, title: 'FAQ | Mazeloot', description: 'Frequently asked questions about Mazeloot.' },
  },
  {
    path: '/waitlist',
    name: 'waitlist',
    component: () => import('@/shared/views/public/Waitlist.vue'),
    meta: { requiresAuth: false, title: 'Join the Waitlist | Mazeloot', description: defaultDesc },
  },
  {
    path: '/early-access',
    name: 'early-access',
    component: () => import('@/shared/views/public/EarlyAccess.vue'),
    meta: { requiresAuth: false, title: 'Early Access | Mazeloot', description: defaultDesc },
  },
  {
    path: '/founders',
    name: 'founders-pricing',
    component: () => import('@/shared/views/public/FoundersPricing.vue'),
    meta: { requiresAuth: false, title: 'Founders Pricing | Mazeloot', description: defaultDesc },
  },
  {
    path: '/build-your-own',
    name: 'build-your-own',
    component: () => import('@/shared/views/public/BuildYourOwn.vue'),
    meta: { requiresAuth: false, title: 'Build Your Own | Mazeloot', description: defaultDesc },
  },
  {
    path: '/subscription/success',
    name: 'subscription-success',
    component: () => import('@/shared/views/public/SubscriptionSuccess.vue'),
    meta: { requiresAuth: false, title: 'Subscription Success | Mazeloot', description: 'Your subscription is active.' },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/shared/views/public/PrivacyPolicy.vue'),
    meta: { requiresAuth: false, title: 'Privacy Policy | Mazeloot', description: 'Mazeloot privacy policy.' },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/shared/views/public/TermsOfService.vue'),
    meta: { requiresAuth: false, title: 'Terms of Service | Mazeloot', description: 'Mazeloot terms of service.' },
  },
  {
    path: '/newsletter/unsubscribe/:token',
    name: 'newsletter-unsubscribe',
    component: () => import('@/shared/views/public/NewsletterUnsubscribe.vue'),
    meta: { requiresAuth: false, title: 'Unsubscribe | Mazeloot', description: 'Manage your newsletter subscription.' },
  },
  {
    path: '/ref/:code',
    name: 'referralLanding',
    component: () => import('@/shared/views/public/RefLanding.vue'),
    meta: { requiresAuth: false, title: 'Referral | Mazeloot', description: defaultDesc },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/shared/views/NotFound.vue'),
    meta: { title: 'Page Not Found | Mazeloot', description: 'The page you are looking for could not be found.' },
  },
]

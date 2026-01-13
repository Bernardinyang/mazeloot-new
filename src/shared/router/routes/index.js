import { publicRoutes } from './public'
import { guestRoutes } from './guest'
import { userRoutes } from './user'
import { memoraRoutes } from '@/domains/memora/router/memora'
import { memoraPublicRoutes } from '@/domains/memora/router/memoraPublic'

export const routes = [
  ...publicRoutes,
  ...memoraPublicRoutes,
  ...guestRoutes,
  ...userRoutes,
  ...memoraRoutes,
]

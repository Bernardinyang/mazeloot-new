import { publicRoutes } from './public'
import { guestRoutes } from './guest'
import { userRoutes } from './user'
import { knowledgeBaseRoutes } from './knowledgebase'
import { memoraRoutes } from '@/domains/memora/router/memora'
import { memoraPublicRoutes } from '@/domains/memora/router/memoraPublic'
import { adminRoutes } from '@/admin/router/admin'

export const routes = [
  ...publicRoutes,
  ...memoraPublicRoutes,
  ...guestRoutes,
  ...userRoutes,
  ...knowledgeBaseRoutes,
  ...memoraRoutes,
  ...adminRoutes,
]

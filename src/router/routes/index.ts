import { publicRoutes } from './public'
import { guestRoutes } from './guest'
import { userRoutes } from './user'
import { memoraRoutes } from './memora'

export const routes = [...publicRoutes, ...guestRoutes, ...userRoutes, ...memoraRoutes]

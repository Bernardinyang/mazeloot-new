<template>
  <div :class="['min-h-screen', theme.bgPage, theme.transitionColors]">
    <!-- Header -->
    <header
      :class="[
        'sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md',
        theme.borderPrimary,
        theme.bgHeader,
        theme.transition,
      ]"
    >
      <!-- Left -->
      <MazelootLogo :show-text="true" size="md" />

      <!-- Right -->
      <div class="flex items-center gap-2">
        <!-- App Switcher -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              :class="[theme.textPrimary, theme.bgButtonHover, theme.transition]"
              size="icon"
              variant="ghost"
            >
              <Grid3x3 class="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            :class="['w-56', theme.bgDropdown, theme.borderSecondary]"
            align="end"
          >
            <DropdownMenuLabel :class="theme.textPrimary">Switch App</DropdownMenuLabel>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem
              v-for="product in mazelootProducts"
              :key="product.id"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click="handleAppSwitch(product)"
            >
              <AppIcon :custom-type="product.customType" class="mr-2" size="sm" />
              <span>{{ product.displayName }}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Quick Actions (Plus) -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              :class="[theme.textPrimary, theme.bgButtonHover, theme.transition]"
              size="icon"
              variant="ghost"
            >
              <Plus class="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            :class="['w-56', theme.bgDropdown, theme.borderSecondary]"
            align="end"
          >
            <DropdownMenuLabel :class="theme.textPrimary">Create New</DropdownMenuLabel>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Mail class="mr-2 h-4 w-4 text-blue-400" />
              <span>Email message</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Calendar class="mr-2 h-4 w-4 text-blue-400" />
              <span>Calendar event</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <StickyNote class="mr-2 h-4 w-4 text-yellow-400" />
              <span>Note</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <ListTodo class="mr-2 h-4 w-4 text-blue-400" />
              <span>Reminder</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <FileEdit class="mr-2 h-4 w-4 text-orange-400" />
              <span>Pages document</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <FileSpreadsheet class="mr-2 h-4 w-4 text-green-400" />
              <span>Numbers spreadsheet</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Presentation class="mr-2 h-4 w-4 text-blue-400" />
              <span>Keynote presentation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- Notifications -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'relative']"
              size="icon"
              variant="ghost"
            >
              <Bell class="h-5 w-5" />
              <span
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
              ></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            :class="['w-80', theme.bgDropdown, theme.borderSecondary]"
            align="end"
          >
            <DropdownMenuLabel :class="theme.textPrimary">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <div class="max-h-96 overflow-y-auto">
              <div
                v-if="notifications.length === 0"
                :class="['p-4 text-center text-sm', theme.textSecondary]"
              >
                No notifications
              </div>
              <DropdownMenuItem
                v-for="notification in notifications"
                :key="notification.id"
                :class="[
                  theme.textPrimary,
                  theme.bgButtonHover,
                  'cursor-pointer flex flex-col items-start p-3',
                ]"
              >
                <div class="flex items-start gap-2 w-full">
                  <component
                    :is="notification.icon"
                    :class="notification.iconColor"
                    class="h-4 w-4 mt-0.5 shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium">{{ notification.title }}</p>
                    <p :class="['text-xs mt-0.5', theme.textSecondary]">
                      {{ notification.message }}
                    </p>
                    <p :class="['text-xs mt-1', theme.textTertiary]">{{ notification.time }}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- User Menu -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <div class="transition-transform duration-300 hover:scale-110 cursor-pointer">
              <AvatarDisplay :avatar="userData.avatar" :name="userData.name" size="md" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            :class="['w-64', theme.bgDropdown, theme.borderSecondary]"
            align="end"
          >
            <DropdownMenuLabel :class="theme.textPrimary">
              <div class="flex flex-col gap-1">
                <span class="font-semibold">{{ userData.name }}</span>
                <span :class="['text-xs font-normal', theme.textSecondary]">{{
                  userData.email
                }}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Settings class="mr-2 h-4 w-4" />
              <span>Mazeloot Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <UserIcon class="mr-2 h-4 w-4" />
              <span>Manage Account</span>
              <ChevronRight class="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem
              class="text-red-500 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/20 cursor-pointer focus:bg-red-500/20 dark:focus:bg-red-500/20"
              @click="handleSignOut"
            >
              <LogOut class="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-6 pb-8 pt-6">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <!-- User Profile Widget -->
        <UserProfileCard
          :avatar="userData.avatar"
          :email="userData.email"
          :loading="isLoading"
          :name="userData.name"
          @logout="handleSignOut"
          @view-profile="handleViewProfile"
        />

        <!-- App Launcher Card -->
        <ListItemCard
          :loading="isLoadingApps"
          :show-footer="false"
          animation-class="animate-in fade-in slide-in-from-bottom-8 duration-700"
          description="Switch between Mazeloot products"
          title="Mazeloot Products"
        >
          <template #loading>
            <div class="animate-pulse">
              <div :class="['h-6 w-32 rounded mb-4', theme.bgSkeleton]"></div>
              <div class="grid grid-cols-4 gap-6">
                <div v-for="i in 12" :key="i" class="flex flex-col items-center gap-2">
                  <div :class="['h-16 w-16 rounded-xl', theme.bgSkeleton]"></div>
                  <div :class="['h-4 w-12 rounded', theme.bgSkeleton]"></div>
                </div>
              </div>
            </div>
          </template>
          <div class="grid grid-cols-4 gap-6">
            <div
              v-for="product in mazelootProducts"
              :key="product.id"
              :class="[
                'flex flex-col items-center gap-2 cursor-pointer hover:opacity-90 active:scale-95',
                theme.transition,
                theme.hoverScaleLarge,
              ]"
              @click="handleProductClick(product)"
            >
              <div
                :class="[
                  'rounded-xl flex items-center justify-center relative overflow-hidden',
                  'bg-gradient-to-br from-gray-900/50 to-gray-800/50 dark:from-gray-800/50 dark:to-gray-900/50 light:from-gray-50 light:to-white',
                  'border border-gray-700/30 dark:border-gray-700/30 light:border-gray-200/50',
                  'shadow-sm dark:shadow-md dark:shadow-black/20 light:shadow-sm',
                  'hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/30 light:hover:shadow-md',
                  'transition-all duration-300',
                  'h-16 w-16',
                ]"
              >
                <AppIcon :custom-type="product.customType" />
              </div>
              <span :class="['text-xs text-center font-medium mt-1', theme.textPrimary]">{{
                product.displayName
              }}</span>
            </div>
          </div>
        </ListItemCard>

        <!-- Storage Space Section -->
        <ListItemCard
          :loading="isLoadingStorage"
          :show-footer="false"
          animation-class="animate-in fade-in slide-in-from-bottom-8 duration-700"
          description="Manage your cloud storage space"
          title="Storage"
        >
          <template #loading>
            <div class="animate-pulse space-y-4">
              <div :class="['h-8 w-24 rounded', theme.bgSkeleton]"></div>
              <div :class="['h-4 w-48 rounded', theme.bgSkeleton]"></div>
              <div :class="['h-20 rounded-lg', theme.bgSkeleton]"></div>
            </div>
          </template>
          <div class="space-y-4">
            <!-- Storage Info -->
            <div class="flex items-center justify-between">
              <div>
                <h3 :class="['text-2xl font-bold mb-1', theme.textPrimary]">
                  {{ formatBytes(usedStorage) }} / {{ formatBytes(totalStorage) }}
                </h3>
                <p :class="['text-sm', theme.textSecondary]">
                  {{ formatBytes(freeStorage) }} free • {{ formatBytes(usedStorage) }} used
                </p>
              </div>
            </div>

            <!-- Storage Slider -->
            <div class="space-y-2">
              <div :class="theme.textSecondary" class="flex items-center justify-between text-xs">
                <span>Storage Usage</span>
                <span>{{ storagePercentage }}%</span>
              </div>
              <div
                :class="[
                  'h-3 rounded-full overflow-hidden relative',
                  theme.bgCard,
                  theme.borderPrimary,
                ]"
              >
                <div
                  :class="[
                    'h-full rounded-full transition-all duration-500 ease-out',
                    storagePercentage >= 90
                      ? 'bg-red-500'
                      : storagePercentage >= 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500',
                  ]"
                  :style="{ width: `${storagePercentage}%` }"
                ></div>
              </div>
            </div>

            <!-- Warning/Upgrade Message -->
            <div
              v-if="storagePercentage >= 80"
              :class="[
                'rounded-lg p-4 flex items-start gap-3 transition-all duration-300',
                storagePercentage >= 90
                  ? 'bg-red-500/20 dark:bg-red-500/20 light:bg-red-50 border border-red-500/30 dark:border-red-500/30 light:border-red-200'
                  : 'bg-yellow-500/20 dark:bg-yellow-500/20 light:bg-yellow-50 border border-yellow-500/30 dark:border-yellow-500/30 light:border-yellow-200',
              ]"
            >
              <AlertCircle
                :class="[
                  'h-5 w-5 shrink-0 mt-0.5',
                  storagePercentage >= 90
                    ? 'text-red-400 dark:text-red-400 light:text-red-600 animate-pulse'
                    : 'text-yellow-400 dark:text-yellow-400 light:text-yellow-600',
                ]"
              />
              <div class="flex-1">
                <p
                  :class="[
                    'text-sm font-medium',
                    storagePercentage >= 90
                      ? 'text-red-200 dark:text-red-200 light:text-red-800'
                      : 'text-yellow-200 dark:text-yellow-200 light:text-yellow-800',
                  ]"
                >
                  {{
                    storagePercentage >= 90
                      ? 'Storage Space is Full. Upgrade to Premium to make sure your data keeps syncing to the cloud.'
                      : 'Storage space is running low. Consider upgrading to Premium for more space.'
                  }}
                </p>
                <Button
                  :class="[
                    'mt-2 transition-all duration-300 hover:scale-110 active:scale-95',
                    storagePercentage >= 90
                      ? 'bg-red-500/20 dark:bg-red-500/20 light:bg-red-100 border-red-500/30 dark:border-red-500/30 light:border-red-300 text-red-200 dark:text-red-200 light:text-red-800 hover:bg-red-500/30 dark:hover:bg-red-500/30 light:hover:bg-red-200'
                      : 'bg-yellow-500/20 dark:bg-yellow-500/20 light:bg-yellow-100 border-yellow-500/30 dark:border-yellow-500/30 light:border-yellow-300 text-yellow-200 dark:text-yellow-200 light:text-yellow-800 hover:bg-yellow-500/30 dark:hover:bg-yellow-500/30 light:hover:bg-yellow-200',
                  ]"
                  size="sm"
                  variant="outline"
                >
                  Upgrade for ₦900.00/month
                </Button>
              </div>
            </div>
          </div>
        </ListItemCard>

        <!-- Recent Collections Widget -->
        <DashboardCard
          :loading="isLoadingCollections"
          animation-class="animate-in fade-in slide-in-from-right-4"
          col-span="lg:col-span-2"
          description="Your latest photo collections and galleries"
          title="Recent Collections"
        >
          <template #loading>
            <div class="animate-pulse space-y-4">
              <div v-for="i in 3" :key="i" class="flex items-center gap-4">
                <div :class="['h-16 w-16 rounded-lg', theme.bgSkeleton]"></div>
                <div class="flex-1 space-y-2">
                  <div :class="['h-4 w-32 rounded', theme.bgSkeleton]"></div>
                  <div :class="['h-3 w-48 rounded', theme.bgSkeleton]"></div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="recentCollections.length === 0">
            <EmptyState action-label="Create Collection" message="No collections yet" />
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(collection, index) in recentCollections.slice(0, 3)"
              :key="collection.id"
              :class="[
                'group relative flex items-center gap-4 p-3 rounded-lg cursor-pointer',
                'transition-all duration-300 ease-out',
                'hover:scale-[1.01] active:scale-[0.99]',
                theme.bgCard,
                theme.borderCard,
                'border hover:border-opacity-100',
                'hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-black/20',
              ]"
              :style="{ animationDelay: `${index * 100}ms` }"
              @click="navigateTo({ name: 'collectionPhotos', params: { uuid: collection.id } })"
            >
              <!-- Hover effect background -->
              <div
                :class="[
                  'absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  'bg-gradient-to-r from-white/5 via-transparent to-transparent dark:from-white/5',
                ]"
              ></div>

              <!-- Thumbnail -->
              <div class="relative shrink-0 z-10">
                <div
                  :class="[
                    'rounded-lg overflow-hidden ring-2 ring-transparent group-hover:ring-opacity-50 transition-all duration-300',
                    'group-hover:ring-gray-400/30 dark:group-hover:ring-gray-500/30',
                  ]"
                >
                  <ThumbnailImage
                    :alt="collection.name || collection.title || ''"
                    :fallback-text="collection.name || collection.title || ''"
                    :src="collection.thumbnail || collection.previewImages?.[0] || ''"
                    size="md"
                  />
                </div>
                <!-- Overlay on hover -->
                <div
                  class="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                ></div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0 z-10">
                <div class="flex items-start justify-between gap-3 mb-1.5">
                  <div class="flex-1 min-w-0">
                    <h3
                      :class="[
                        'text-sm font-semibold truncate mb-0.5 group-hover:text-opacity-90 transition-opacity',
                        theme.textPrimary,
                      ]"
                    >
                      {{ collection.name || collection.title }}
                    </h3>
                    <div :class="['flex items-center gap-2 text-xs', theme.textSecondary]">
                      <span class="font-medium">{{ collection.itemCount || 0 }} items</span>
                      <span class="opacity-40">•</span>
                      <span class="opacity-70">
                        {{
                          formatDate(
                            collection.updatedAt || collection.createdAt || collection.date || ''
                          )
                        }}
                      </span>
                    </div>
                  </div>
                  <StatusBadge :status="collection.status || 'active'" />
                </div>
              </div>

              <!-- Arrow indicator -->
              <div
                :class="[
                  'opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0',
                  theme.textSecondary,
                ]"
              >
                <ChevronRight class="h-4 w-4" />
              </div>
            </div>
          </div>
          <template #footer>
            <Button
              :class="['w-full', theme.textSecondary, theme.bgButtonHover]"
              size="sm"
              variant="ghost"
              @click="handleViewAllCollections"
            >
              View All Collections
            </Button>
          </template>
        </DashboardCard>

        <!-- Recent Orders Widget -->
        <ListItemCard
          :loading="isLoadingOrders"
          :show-footer="true"
          description="Your latest purchases and transactions"
          footer-label="View All Orders"
          title="Recent Orders"
          @footer-click="handleViewAllOrders"
        >
          <template #loading>
            <div class="animate-pulse space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-3">
                <div :class="['h-10 w-10 rounded-lg', theme.bgSkeleton]"></div>
                <div class="flex-1 space-y-2">
                  <div :class="['h-4 w-32 rounded', theme.bgSkeleton]"></div>
                  <div :class="['h-3 w-48 rounded', theme.bgSkeleton]"></div>
                  <div class="flex items-center justify-between mt-1">
                    <div :class="['h-3 w-16 rounded', theme.bgSkeleton]"></div>
                    <div :class="['h-5 w-16 rounded', theme.bgSkeleton]"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="recentOrders.length === 0" class="text-center py-8">
            <EmptyState message="No orders yet" />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(order, index) in recentOrders.slice(0, 3)"
              :key="order.id"
              :class="[theme.listItem]"
              :style="{ animationDelay: `${index * 50}ms` }"
              class="flex gap-3 flex-wrap"
              @click="handleOrderClick(order)"
            >
              <div
                v-if="order.iconBg"
                :class="[
                  order.iconBg,
                  'flex items-center justify-center p-2 rounded-lg shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                ]"
              >
                <component :is="order.icon" class="h-4 w-4 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-medium truncate', theme.textPrimary]">
                  {{ order.product }}
                </p>
                <p :class="['text-xs', theme.textSecondary]">
                  {{ order.orderId }} • {{ order.time }}
                </p>
                <div class="flex items-center justify-between mt-1">
                  <span :class="['text-sm font-semibold', theme.textPrimary]">{{
                    order.price
                  }}</span>
                  <StatusBadge :status="order.status" />
                </div>
              </div>
            </div>
          </div>
        </ListItemCard>

        <!-- Wishlist Widget -->
        <ListItemCard
          :loading="isLoadingWishlist"
          :show-footer="true"
          description="Items you want to purchase later"
          footer-label="View All Wishlist Items"
          title="Wishlist"
          @footer-click="handleViewAllWishlist"
        >
          <template #loading>
            <div class="animate-pulse space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-2">
                <div :class="['h-12 w-12 rounded-lg', theme.bgSkeleton]"></div>
                <div class="flex-1 space-y-2">
                  <div :class="['h-4 w-32 rounded', theme.bgSkeleton]"></div>
                  <div :class="['h-3 w-24 rounded', theme.bgSkeleton]"></div>
                  <div :class="['h-5 w-16 rounded', theme.bgSkeleton]"></div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="wishlist.length === 0" class="text-center py-8">
            <EmptyState message="Your wishlist is empty" />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(item, index) in wishlist.slice(0, 3)"
              :key="item.id"
              :class="[theme.listItem, 'p-2']"
              :style="{ animationDelay: `${index * 50}ms` }"
              class="flex gap-3 flex-wrap"
              @click="handleWishlistItemClick(item)"
            >
              <div
                :class="[
                  'flex items-center justify-center p-3 rounded-lg shrink-0 group-hover:scale-110 group-hover:rotate-3',
                  theme.bgCard,
                  theme.transition,
                  'group-hover:opacity-80',
                ]"
              >
                <component :is="item.icon" :class="['h-4 w-4', theme.textPrimary]" />
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-medium truncate', theme.textPrimary]">{{ item.name }}</p>
                <p :class="['text-xs', theme.textSecondary]">{{ item.type }}</p>
                <div class="mt-1">
                  <StatusBadge :status="item.status" />
                </div>
              </div>
            </div>
          </div>
        </ListItemCard>

        <!-- Recent Posts Widget -->
        <ListItemCard
          :loading="isLoadingPosts"
          :show-footer="true"
          animation-class="animate-in fade-in slide-in-from-left-4"
          description="Your latest blog posts and articles"
          footer-label="View All Posts"
          title="Recent Posts"
          @footer-click="handleViewAllPosts"
        >
          <template #loading>
            <div class="animate-pulse space-y-3">
              <div
                v-for="i in 3"
                :key="i"
                :class="theme.borderPrimary"
                class="flex flex-col gap-2 pb-3 border-b last:border-0 last:pb-0"
              >
                <div :class="['h-4 w-full rounded', theme.bgSkeleton]"></div>
                <div :class="['h-3 w-2/3 rounded', theme.bgSkeleton]"></div>
                <div :class="['h-5 w-20 rounded', theme.bgSkeleton]"></div>
              </div>
            </div>
          </template>
          <div v-if="recentPosts.length === 0" class="text-center py-8">
            <EmptyState message="No posts yet" />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(post, index) in recentPosts.slice(0, 3)"
              :key="post.id"
              :class="[
                theme.listItem,
                'flex flex-col gap-1 pb-3 border-b',
                theme.borderPrimary,
                'last:border-0 last:pb-0',
              ]"
              :style="{ animationDelay: `${index * 50}ms` }"
              @click="handlePostClick(post)"
            >
              <p :class="['text-sm font-medium truncate', theme.textPrimary]">{{ post.title }}</p>
              <p :class="['text-xs', theme.textSecondary]">{{ post.source }} • {{ post.date }}</p>
              <div class="mt-1">
                <StatusBadge :status="post.status" />
              </div>
            </div>
          </div>
        </ListItemCard>

        <!-- Products Widget -->
        <ListItemCard
          :loading="isLoadingProducts"
          :show-footer="true"
          animation-class="animate-in fade-in slide-in-from-right-4"
          description="Your available products and services"
          footer-label="Manage Products"
          title="Products"
          @footer-click="handleManageProducts"
        >
          <template #loading>
            <div class="animate-pulse space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-2">
                <div :class="['h-12 w-12 rounded-lg', theme.bgSkeleton]"></div>
                <div class="flex-1 space-y-2">
                  <div :class="['h-4 w-32 rounded', theme.bgSkeleton]"></div>
                  <div :class="['h-3 w-40 rounded', theme.bgSkeleton]"></div>
                  <div :class="['h-5 w-16 rounded', theme.bgSkeleton]"></div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="products.length === 0" class="text-center py-8">
            <EmptyState message="No products yet" />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(product, index) in products.slice(0, 3)"
              :key="product.id"
              :class="[theme.listItem, 'p-2']"
              :style="{ animationDelay: `${index * 50}ms` }"
              class="flex gap-3 flex-wrap"
              @click="handleServiceProductClick(product)"
            >
              <ThumbnailImage
                :alt="product.name"
                :src="product.thumbnail"
                fallback-text="IMG"
                size="sm"
              />
              <div class="flex-1 min-w-0">
                <p :class="['text-sm font-medium truncate', theme.textPrimary]">
                  {{ product.name }}
                </p>
                <p :class="['text-xs', theme.textSecondary]">
                  {{ product.type }} • {{ product.price }}
                </p>
                <div class="mt-1">
                  <StatusBadge :status="product.status" />
                </div>
              </div>
            </div>
          </div>
        </ListItemCard>
      </div>
    </main>

    <!-- Footer -->
    <footer :class="['backdrop-blur-md mt-8', theme.borderPrimary, 'border-t', theme.bgFooter]">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <MazelootLogo :show-text="true" size="sm" />
            <span :class="['text-xs', theme.textTertiary]">© 2024</span>
          </div>
          <div
            :class="[
              'flex items-center gap-6 text-sm',
              theme.textSecondary,
              theme.transitionColors,
            ]"
          >
            <a class="hover:opacity-100 opacity-70" href="#">Privacy</a>
            <a class="hover:opacity-100 opacity-70" href="#">Terms</a>
            <a class="hover:opacity-100 opacity-70" href="#">Support</a>
            <a class="hover:opacity-100 opacity-70" href="#">About</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  AlertCircle,
  Bell,
  Calendar,
  ChevronRight,
  FileEdit,
  FileSpreadsheet,
  Grid3x3,
  ListTodo,
  LogOut,
  Mail,
  Plus,
  Presentation,
  Settings,
  ShoppingCart,
  StickyNote,
  Zap,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import AvatarDisplay from '@/components/atoms/AvatarDisplay.vue'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import UserProfileCard from '@/components/organisms/UserProfileCard.vue'
import DashboardCard from '@/components/organisms/DashboardCard.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import ListItemCard from '@/components/molecules/ListItemCard.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu/index'
import { useNavigation } from '@/composables/useNavigation'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useLogout } from '@/composables/useLogout'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useLoadingStates } from '@/composables/useLoadingStates'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import ThumbnailImage from '@/components/atoms/ThumbnailImage.vue'
import { MAZELOOT_PRODUCTS } from '@/constants/products'
import { useGalleryStore } from '@/stores/gallery'
import MazelootLogo from '@/components/atoms/MazelootLogo.vue'

const { navigateTo } = useNavigation()
useThemeStore() // Initialize theme store for reactivity
const theme = useThemeClasses()

// Loading states - consolidated
// Start with loading=true to show skeleton loaders initially
const loadingKeys = [
  'user',
  'collections',
  'orders',
  'wishlist',
  'posts',
  'products',
  'apps',
  'storage',
]
const { states: loadingStates, setAllLoading } = useLoadingStates(loadingKeys, true)
// Vue templates automatically unwrap refs, so we can use them directly
const isLoading = loadingStates.user
const isLoadingCollections = loadingStates.collections
const isLoadingOrders = loadingStates.orders
const isLoadingWishlist = loadingStates.wishlist
const isLoadingPosts = loadingStates.posts
const isLoadingProducts = loadingStates.products
const isLoadingApps = loadingStates.apps
const isLoadingStorage = loadingStates.storage

// Notifications
const notifications = ref([
  {
    id: 'notif-1',
    title: 'Welcome back',
    message: 'Your recent uploads are ready.',
    time: 'Just now',
    icon: Mail,
    iconColor: 'text-blue-500',
  },
  {
    id: 'notif-2',
    title: 'Reminder',
    message: 'You have items waiting to be organized.',
    time: '2h ago',
    icon: Bell,
    iconColor: 'text-yellow-400',
  },
])

const { logout } = useLogout()

const handleSignOut = async () => {
  await logout()
}

const handleViewProfile = () => {}

const handleViewAllOrders = () => {}

const handleOrderClick = _order => {}

const handleViewAllWishlist = () => {}

const handleWishlistItemClick = _item => {}

const handleViewAllPosts = () => {}

const handlePostClick = _post => {}

const handleManageProducts = () => {}

const handleServiceProductClick = _product => {}

// Mazeloot Products
const mazelootProducts = MAZELOOT_PRODUCTS

const handleAppSwitch = product => {
  if (product.route) {
    navigateTo(product.route)
  } else if (product.url) {
    navigateTo({ path: product.url })
  }
}

const handleProductClick = product => {
  handleAppSwitch(product)
}

// const handleAppClick = (_app) => {
//   // TODO
// }

const userStore = useUserStore()
const galleryStore = useGalleryStore()

// User data - use logged-in user from store, fallback to default if not available
const userData = computed(() => {
  if (userStore.user) {
    return {
      name: userStore.user.name || 'User',
      email: userStore.user.email || '',
      avatar:
        userStore.user.avatar ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    }
  }
  // Fallback for when user is not logged in (shouldn't happen in protected routes)
  return {
    name: 'User',
    email: '',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  }
})

// Recent Collections - get from store
const recentCollections = computed(() => {
  const allCollections = galleryStore.collections.filter(c => !c.isFolder)
  // Sort by updatedAt or createdAt, get latest 3
  return allCollections
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 3)
})

// Storage data
const totalStorage = ref(5 * 1024 * 1024 * 1024) // 5 GB in bytes
const usedStorage = ref(4.5 * 1024 * 1024 * 1024) // 4.5 GB used
const freeStorage = computed(() => totalStorage.value - usedStorage.value)
const storagePercentage = computed(() => Math.round((usedStorage.value / totalStorage.value) * 100))

// Format bytes helper
const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Format date helper
const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Fetch collections on mount
onMounted(async () => {
  setAllLoading(true)
  // Fetch collections
  try {
    await galleryStore.fetchCollections()
  } catch (error) {}
  // Simulate data fetch - keep loading for 2 seconds to see skeleton loaders
  setTimeout(() => {
    setAllLoading(false)
  }, 2000)
})

const handleViewAllCollections = () => {
  navigateTo({ name: 'manageCollections' })
}

// Recent Orders
const recentOrders = [
  {
    id: 'order-1',
    product: 'Premium Subscription',
    orderId: 'INV-0001',
    time: '3 days ago',
    price: '₦4,500.00',
    status: 'completed',
    icon: ShoppingCart,
    iconBg: 'bg-green-500',
  },
  {
    id: 'order-2',
    product: 'Photo Prints',
    orderId: 'INV-0002',
    time: '1 week ago',
    price: '₦2,200.00',
    status: 'processing',
    icon: ShoppingCart,
    iconBg: 'bg-blue-500',
  },
]

// Wishlist
const wishlist = [
  {
    id: 'wish-1',
    name: 'Premium Template Pack',
    type: 'Template',
    status: 'available',
    icon: Zap,
  },
  {
    id: 'wish-2',
    name: 'Extra Storage',
    type: 'Storage',
    status: 'available',
    icon: Zap,
  },
]

// Recent Posts
const recentPosts = [
  {
    id: 'post-1',
    title: 'How to organize your photos',
    source: 'Mazeloot Blog',
    date: 'Nov 10, 2025',
    status: 'published',
  },
  {
    id: 'post-2',
    title: 'New features in Mazeloot',
    source: 'Mazeloot News',
    date: 'Oct 21, 2025',
    status: 'published',
  },
]

// Products
const products = []
</script>

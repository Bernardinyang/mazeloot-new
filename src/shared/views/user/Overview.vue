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
      <MazelootLogo :show-text="true" size="sm" />

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
              <MailIcon class="h-4 w-4 text-blue-400" />
              <span>Email message</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Calendar class="h-4 w-4 text-blue-400" />
              <span>Calendar event</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <StickyNote class="h-4 w-4 text-yellow-400" />
              <span>Note</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <ListTodo class="h-4 w-4 text-blue-400" />
              <span>Reminder</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <FileEdit class="h-4 w-4 text-orange-400" />
              <span>Pages document</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <FileSpreadsheet class="h-4 w-4 text-green-400" />
              <span>Numbers spreadsheet</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Presentation class="h-4 w-4 text-blue-400" />
              <span>Keynote presentation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- Notifications -->
        <NotificationDropdown />

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
              <Settings class="h-4 w-4" />
              <span>Mazeloot Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Users2 class="h-4 w-4" />
              <span>Manage Account</span>
              <ChevronRight class="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem
              class="text-red-500 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/20 cursor-pointer focus:bg-red-500/20 dark:focus:bg-red-500/20"
              @click="handleSignOut"
            >
              <LogOut class="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 sm:px-6 pb-12 pt-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Welcome Section -->
        <div class="space-y-2">
          <h1
            :class="[
              'text-4xl sm:text-5xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent',
            ]"
          >
            Welcome back, {{ userData.name.split(' ')[0] }} 👋
          </h1>
          <p :class="['text-base sm:text-lg', theme.textSecondary]">
            Manage your photo galleries, projects, and client workflows
          </p>
        </div>

        <!-- User Profile Cover Card -->
        <div
          :class="[
            'group relative overflow-hidden rounded-2xl',
            'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
            'dark:from-blue-700 dark:via-purple-700 dark:to-pink-700',
            'light:from-blue-500 light:via-purple-500 light:to-pink-500',
            'backdrop-blur-md',
            'border border-blue-500/30 dark:border-blue-500/40 light:border-blue-300/50',
            'shadow-2xl dark:shadow-2xl dark:shadow-blue-500/20',
            'hover:shadow-3xl transition-all duration-300',
            'animate-in fade-in slide-in-from-top-4 duration-500',
          ]"
        >
          <!-- Cover Photo Background with Pattern -->
          <div class="absolute inset-0 opacity-20">
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
            ></div>
            <div
              class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -ml-40 -mb-40"
            ></div>
          </div>

          <!-- Content -->
          <div class="relative z-10 p-6 sm:p-8">
            <div v-if="isLoading" class="animate-pulse">
              <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                <div :class="['h-32 w-32 rounded-full', theme.bgSkeleton]"></div>
                <div class="flex-1 space-y-3 text-center sm:text-left">
                  <div :class="['h-8 w-48 rounded mx-auto sm:mx-0', theme.bgSkeleton]"></div>
                  <div :class="['h-5 w-64 rounded mx-auto sm:mx-0', theme.bgSkeleton]"></div>
                  <div class="flex gap-3 justify-center sm:justify-start mt-4">
                    <div :class="['h-10 w-24 rounded', theme.bgSkeleton]"></div>
                    <div :class="['h-10 w-24 rounded', theme.bgSkeleton]"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <!-- Avatar -->
              <div class="relative shrink-0">
                <!-- Outer glow ring -->
                <div
                  class="absolute inset-0 rounded-full bg-white/30 dark:bg-white/20 blur-xl scale-110"
                ></div>
                <!-- Avatar container -->
                <div
                  :class="[
                    'relative w-32 h-32 rounded-full overflow-hidden',
                    'ring-4 ring-white/40 dark:ring-white/20',
                    'shadow-2xl',
                    'border-4 border-white/50 dark:border-white/30',
                    'group-hover:scale-105 transition-transform duration-300',
                  ]"
                >
                  <img
                    v-if="userData.avatar"
                    :alt="userData.name"
                    :src="userData.avatar"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    :class="[
                      'w-full h-full bg-gradient-to-br from-white/90 to-white/70',
                      'dark:from-gray-800 dark:to-gray-900',
                      'flex items-center justify-center',
                    ]"
                  >
                    <span
                      class="text-5xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
                    >
                      {{ userData.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <!-- Status indicator -->
                  <div
                    class="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-900 shadow-lg"
                  ></div>
                </div>
              </div>

              <!-- User Info -->
              <div class="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <h2 :class="['text-3xl sm:text-4xl font-bold text-white drop-shadow-lg']">
                    {{ userData.name }}
                  </h2>
                  <p :class="['text-base sm:text-lg text-white/90 mt-1']">
                    {{ userData.email }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap items-center gap-3 justify-center sm:justify-start mt-4">
                  <Button
                    :class="[
                      'bg-white/20 dark:bg-white/10 light:bg-white/30',
                      'backdrop-blur-sm',
                      'border border-white/30 dark:border-white/20 light:border-white/40',
                      'text-white hover:bg-white/30 dark:hover:bg-white/20 light:hover:bg-white/40',
                      'transition-all duration-300 hover:scale-105 active:scale-95',
                    ]"
                    size="sm"
                    @click="handleViewProfile"
                  >
                    <Users2 class="h-4 w-4" />
                    View Profile
                  </Button>
                  <Button
                    :class="[
                      'bg-red-500/30 dark:bg-red-500/30 light:bg-red-500/40',
                      'backdrop-blur-sm',
                      'border border-red-400/50 dark:border-red-400/50 light:border-red-400/60',
                      'text-white hover:bg-red-500/40 dark:hover:bg-red-500/40 light:hover:bg-red-500/50',
                      'transition-all duration-300 hover:scale-105 active:scale-95 group',
                    ]"
                    size="sm"
                    @click="handleSignOut"
                  >
                    <LogOut
                      class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <!-- Collections Stat -->
          <div
            :class="[
              'group relative overflow-hidden rounded-2xl p-5',
              'bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent',
              'dark:from-blue-500/20 dark:via-blue-500/10',
              'light:from-blue-50 light:to-blue-100/50',
              'border border-blue-500/30 dark:border-blue-500/30 light:border-blue-200',
              'backdrop-blur-sm',
              'hover:scale-[1.02] transition-all duration-300',
              'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <p :class="['text-sm font-medium', theme.textSecondary]">Collections</p>
                <p :class="['text-2xl font-bold', theme.textPrimary]">
                  {{
                    isLoadingCollections
                      ? '...'
                      : galleryStore.collections.filter(c => !c.isFolder).length || 0
                  }}
                </p>
              </div>
              <div class="p-2 rounded-xl bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-100">
                <Folder class="h-5 w-5 text-blue-400 dark:text-blue-400 light:text-blue-600" />
              </div>
            </div>
            <div
              class="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mb-10"
            ></div>
          </div>

          <!-- Storage Stat -->
          <div
            :class="[
              'group relative overflow-hidden rounded-2xl p-5',
              'bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent',
              'dark:from-purple-500/20 dark:via-purple-500/10',
              'light:from-purple-50 light:to-purple-100/50',
              'border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200',
              'backdrop-blur-sm',
              'hover:scale-[1.02] transition-all duration-300',
              'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-purple-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <p :class="['text-sm font-medium', theme.textSecondary]">Storage</p>
                <p :class="['text-2xl font-bold', theme.textPrimary]">
                  {{ isLoadingStorage ? '...' : storagePercentage }}%
                </p>
              </div>
              <div
                class="p-2 rounded-xl bg-purple-500/20 dark:bg-purple-500/20 light:bg-purple-100"
              >
                <Database
                  class="h-5 w-5 text-purple-400 dark:text-purple-400 light:text-purple-600"
                />
              </div>
            </div>
            <div
              class="absolute bottom-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mb-10"
            ></div>
          </div>

          <!-- Projects Stat -->
          <div
            :class="[
              'group relative overflow-hidden rounded-2xl p-5',
              'bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent',
              'dark:from-green-500/20 dark:via-green-500/10',
              'light:from-green-50 light:to-green-100/50',
              'border border-green-500/30 dark:border-green-500/30 light:border-green-200',
              'backdrop-blur-sm',
              'hover:scale-[1.02] transition-all duration-300',
              'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-green-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <p :class="['text-sm font-medium', theme.textSecondary]">Projects</p>
                <p :class="['text-2xl font-bold', theme.textPrimary]">
                  {{ isLoadingProjects ? '...' : projectStore.projects.length || 0 }}
                </p>
              </div>
              <div class="p-2 rounded-xl bg-green-500/20 dark:bg-green-500/20 light:bg-green-100">
                <FolderKanban
                  class="h-5 w-5 text-green-400 dark:text-green-400 light:text-green-600"
                />
              </div>
            </div>
            <div
              class="absolute bottom-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mb-10"
            ></div>
          </div>

          <!-- Selections Stat -->
          <div
            :class="[
              'group relative overflow-hidden rounded-2xl p-5',
              'bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent',
              'dark:from-pink-500/20 dark:via-pink-500/10',
              'light:from-pink-50 light:to-pink-100/50',
              'border border-pink-500/30 dark:border-pink-500/30 light:border-pink-200',
              'backdrop-blur-sm',
              'hover:scale-[1.02] transition-all duration-300',
              'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-pink-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <p :class="['text-sm font-medium', theme.textSecondary]">Selections</p>
                <p :class="['text-2xl font-bold', theme.textPrimary]">
                  {{ isLoadingSelections ? '...' : selectionStore.selections.length || 0 }}
                </p>
              </div>
              <div class="p-2 rounded-xl bg-pink-500/20 dark:bg-pink-500/20 light:bg-pink-100">
                <CheckSquare class="h-5 w-5 text-pink-400 dark:text-pink-400 light:text-pink-600" />
              </div>
            </div>
            <div
              class="absolute bottom-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -mr-10 -mb-10"
            ></div>
          </div>

          <!-- Proofing Stat -->
          <div
            :class="[
              'group relative overflow-hidden rounded-2xl p-5',
              'bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent',
              'dark:from-orange-500/20 dark:via-orange-500/10',
              'light:from-orange-50 light:to-orange-100/50',
              'border border-orange-500/30 dark:border-orange-500/30 light:border-orange-200',
              'backdrop-blur-sm',
              'hover:scale-[1.02] transition-all duration-300',
              'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-orange-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-2">
                <p :class="['text-sm font-medium', theme.textSecondary]">Proofing</p>
                <p :class="['text-2xl font-bold', theme.textPrimary]">
                  {{ isLoadingProofing ? '...' : proofingStore.proofings.length || 0 }}
                </p>
              </div>
              <div
                class="p-2 rounded-xl bg-orange-500/20 dark:bg-orange-500/20 light:bg-orange-100"
              >
                <Eye class="h-5 w-5 text-orange-400 dark:text-orange-400 light:text-orange-600" />
              </div>
            </div>
            <div
              class="absolute bottom-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mb-10"
            ></div>
          </div>
        </div>

        <!-- Products and Storage Row -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- App Launcher Card -->
          <DashboardCard
            :loading="isLoadingApps"
            animation-class="animate-in fade-in slide-in-from-bottom-4 duration-500"
            description="Access all your Mazeloot products"
            title="Quick Access"
          >
            <template #loading>
              <div class="animate-pulse space-y-4">
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div
                    v-for="i in mazelootProducts.length"
                    :key="i"
                    class="flex flex-col items-center gap-3"
                  >
                    <div :class="['h-20 w-20 sm:h-16 sm:w-16 rounded-2xl', theme.bgSkeleton]"></div>
                    <div :class="['h-3 w-12 rounded', theme.bgSkeleton]"></div>
                  </div>
                </div>
              </div>
            </template>
            <div class="relative">
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 relative z-10">
                <div
                  v-for="(product, index) in mazelootProducts"
                  :key="product.id"
                  :class="[
                    'group flex flex-col items-center gap-3 cursor-pointer',
                    theme.transition,
                  ]"
                  :style="{ animationDelay: `${index * 50}ms` }"
                  @click="handleProductClick(product)"
                >
                  <div
                    :class="[
                      'relative rounded-2xl flex items-center justify-center overflow-hidden',
                      'bg-gradient-to-br from-gray-900/80 to-gray-800/80',
                      'dark:from-gray-800/80 dark:to-gray-900/80',
                      'light:from-white light:to-gray-50',
                      'border-2 border-gray-700/50 dark:border-gray-700/50 light:border-gray-200/80',
                      'shadow-sm dark:shadow-sm dark:shadow-black/40 light:shadow-sm',
                      'group-hover:scale-110 group-hover:-translate-y-1 group-active:scale-95',
                      'transition-all duration-300 ease-out',
                      'h-20 w-20 sm:h-16 sm:w-16',
                    ]"
                  >
                    <!-- Icon -->
                    <div class="relative z-10">
                      <AppIcon :custom-type="product.customType" />
                    </div>

                    <!-- Active indicator for Memora -->
                    <div
                      v-if="product.id === 'memora'"
                      class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg animate-pulse"
                    ></div>
                  </div>
                  <span
                    :class="[
                      'text-xs text-center font-semibold',
                      theme.textPrimary,
                      'group-hover:text-accent transition-colors duration-300',
                      'max-w-[80px] truncate',
                    ]"
                    >{{ product.displayName }}</span
                  >
                </div>
              </div>
            </div>
          </DashboardCard>

          <!-- Storage Space Section -->
          <DashboardCard
            :loading="isLoadingStorage"
            animation-class="animate-in fade-in slide-in-from-bottom-4 duration-500"
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
            <div class="relative">
              <div class="relative z-10 space-y-6">
                <!-- Storage Info with Icon -->
                <div class="flex items-start justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          'p-3 rounded-2xl',
                          'bg-gradient-to-br from-purple-500/20 to-blue-500/20',
                          'dark:from-purple-500/30 dark:to-blue-500/30',
                          'light:from-purple-100 light:to-blue-100',
                          'border border-purple-500/30 dark:border-purple-500/40 light:border-purple-200',
                          'shadow-lg',
                        ]"
                      >
                        <Database
                          :class="[
                            'h-6 w-6',
                            storagePercentage >= 90
                              ? 'text-red-400 dark:text-red-400 light:text-red-600'
                              : storagePercentage >= 70
                                ? 'text-yellow-400 dark:text-yellow-400 light:text-yellow-600'
                                : 'text-green-400 dark:text-green-400 light:text-green-600',
                          ]"
                        />
                      </div>
                      <div>
                        <p
                          :class="[
                            'text-xs font-medium uppercase tracking-wide',
                            theme.textSecondary,
                          ]"
                        >
                          Cloud Storage
                        </p>
                        <div class="flex items-baseline gap-2">
                          <h3 :class="['text-3xl font-bold', theme.textPrimary]">
                            {{ formatBytes(usedStorage) }}
                          </h3>
                          <span :class="['text-lg', theme.textSecondary]">
                            / {{ formatBytes(totalStorage) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    :class="[
                      'text-right px-4 py-2 rounded-xl',
                      'bg-white/10 dark:bg-white/5 light:bg-white/60',
                      'backdrop-blur-sm border',
                      'border-white/20 dark:border-white/10 light:border-gray-200/50',
                    ]"
                  >
                    <p :class="['text-xs font-medium', theme.textSecondary]">Used</p>
                    <p
                      :class="[
                        'text-2xl font-bold mt-0.5',
                        storagePercentage >= 90
                          ? 'text-red-400 dark:text-red-400 light:text-red-600'
                          : storagePercentage >= 70
                            ? 'text-yellow-400 dark:text-yellow-400 light:text-yellow-600'
                            : 'text-green-400 dark:text-green-400 light:text-green-600',
                      ]"
                    >
                      {{ storagePercentage }}%
                    </p>
                  </div>
                </div>

                <!-- Enhanced Progress Bar -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between text-xs font-medium">
                    <span :class="theme.textSecondary"
                      >{{ formatBytes(freeStorage) }} available</span
                    >
                    <span :class="theme.textSecondary">{{ storagePercentage }}% used</span>
                  </div>
                  <div
                    :class="[
                      'h-4 rounded-full overflow-hidden relative border',
                      'bg-gray-200/50 dark:bg-gray-800/50 border-white/20 dark:border-white/10 light:border-gray-200/50',
                      'backdrop-blur-sm',
                      'shadow-inner',
                    ]"
                  >
                    <div
                      :class="[
                        'h-full rounded-full transition-all duration-1000 ease-out relative',
                        'shadow-lg',
                        storagePercentage >= 90
                          ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700'
                          : storagePercentage >= 70
                            ? 'bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500'
                            : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500',
                      ]"
                      :style="{ width: `${storagePercentage}%` }"
                    >
                      <div
                        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                      ></div>
                      <div
                        class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-current to-transparent opacity-50"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Storage Breakdown -->
                <div class="grid grid-cols-2 gap-3">
                  <div
                    :class="[
                      'p-4 rounded-xl',
                      'bg-white/10 dark:bg-white/5 light:bg-white/60',
                      'backdrop-blur-sm border',
                      'border-white/20 dark:border-white/10 light:border-gray-200/50',
                      'hover:bg-white/15 dark:hover:bg-white/10 light:hover:bg-white/70',
                      'transition-all duration-300',
                    ]"
                  >
                    <p :class="['text-xs font-medium', theme.textSecondary]">Used</p>
                    <p :class="['text-lg font-bold mt-1', theme.textPrimary]">
                      {{ formatBytes(usedStorage) }}
                    </p>
                  </div>
                  <div
                    :class="[
                      'p-4 rounded-xl',
                      'bg-white/10 dark:bg-white/5 light:bg-white/60',
                      'backdrop-blur-sm border',
                      'border-white/20 dark:border-white/10 light:border-gray-200/50',
                      'hover:bg-white/15 dark:hover:bg-white/10 light:hover:bg-white/70',
                      'transition-all duration-300',
                    ]"
                  >
                    <p :class="['text-xs font-medium', theme.textSecondary]">Available</p>
                    <p :class="['text-lg font-bold mt-1', theme.textPrimary]">
                      {{ formatBytes(freeStorage) }}
                    </p>
                  </div>
                </div>

                <!-- Warning/Upgrade Message -->
                <div
                  v-if="storagePercentage >= 80"
                  :class="[
                    'rounded-xl p-4 flex items-start gap-3 transition-all duration-300',
                    'backdrop-blur-sm border',
                    'hover:scale-[1.01]',
                    storagePercentage >= 90
                      ? 'bg-gradient-to-br from-red-500/20 to-red-600/10 dark:from-red-500/20 dark:to-red-600/10 light:from-red-50 light:to-red-100/50 border-red-500/40 dark:border-red-500/40 light:border-red-300'
                      : 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 dark:from-yellow-500/20 dark:to-yellow-600/10 light:from-yellow-50 light:to-yellow-100/50 border-yellow-500/40 dark:border-yellow-500/40 light:border-yellow-300',
                  ]"
                >
                  <div
                    :class="[
                      'p-2 rounded-lg',
                      storagePercentage >= 90
                        ? 'bg-red-500/20 dark:bg-red-500/20 light:bg-red-100'
                        : 'bg-yellow-500/20 dark:bg-yellow-500/20 light:bg-yellow-100',
                    ]"
                  >
                    <AlertCircle
                      :class="[
                        'h-5 w-5',
                        storagePercentage >= 90
                          ? 'text-red-400 dark:text-red-400 light:text-red-600'
                          : 'text-yellow-400 dark:text-yellow-400 light:text-yellow-600',
                      ]"
                    />
                  </div>
                  <div class="flex-1 space-y-2.5">
                    <p
                      :class="[
                        'text-sm font-medium leading-relaxed',
                        storagePercentage >= 90
                          ? 'text-red-200 dark:text-red-200 light:text-red-800'
                          : 'text-yellow-200 dark:text-yellow-200 light:text-yellow-800',
                      ]"
                    >
                      {{
                        storagePercentage >= 90
                          ? 'Storage space is full. Upgrade to Premium to keep your data syncing.'
                          : 'Storage space is running low. Consider upgrading for more space.'
                      }}
                    </p>
                    <Button
                      :class="[
                        'transition-all duration-300 hover:scale-105 active:scale-95',
                        storagePercentage >= 90
                          ? 'bg-red-500/30 dark:bg-red-500/30 light:bg-red-100 border-red-500/50 dark:border-red-500/50 light:border-red-300 text-red-100 dark:text-red-100 light:text-red-800 hover:bg-red-500/40 dark:hover:bg-red-500/40 light:hover:bg-red-200'
                          : 'bg-yellow-500/30 dark:bg-yellow-500/30 light:bg-yellow-100 border-yellow-500/50 dark:border-yellow-500/50 light:border-yellow-300 text-yellow-100 dark:text-yellow-100 light:text-yellow-800 hover:bg-yellow-500/40 dark:hover:bg-yellow-500/40 light:hover:bg-yellow-200',
                      ]"
                      size="sm"
                      variant="outline"
                    >
                      Upgrade for ₦900.00/month
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

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
            <EmptyState
              :icon="Folder"
              action-label="Create Collection"
              description="Start organizing your photos by creating your first collection"
              icon-bg-class="bg-blue-500/20"
              icon-class="text-blue-400"
              message="No collections yet"
            />
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(collection, index) in recentCollections.slice(0, 3)"
              :key="collection.id"
              :class="[
                'group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer',
                'transition-all duration-300 ease-out',
                'hover:scale-[1.02] active:scale-[0.98]',
                theme.bgCard,
                theme.borderCard,
                'border hover:border-opacity-100',
                'hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/30',
                'backdrop-blur-sm',
              ]"
              :style="{ animationDelay: `${index * 100}ms` }"
              @click="navigateTo({ name: 'collectionPhotos', params: { uuid: collection.id } })"
            >
              <!-- Hover effect background -->
              <div
                :class="[
                  'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  'bg-gradient-to-r from-accent/5 via-transparent to-transparent',
                ]"
              ></div>

              <!-- Thumbnail -->
              <div class="relative shrink-0 z-10">
                <div
                  :class="[
                    'rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-opacity-60 transition-all duration-300',
                    'group-hover:ring-accent/30 shadow-md group-hover:shadow-lg',
                  ]"
                >
                  <ThumbnailImage
                    :alt="collection.name || collection.title || ''"
                    :fallback-text="collection.name || collection.title || ''"
                    :src="collection.thumbnail || collection.previewImages?.[0] || ''"
                    size="md"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0 z-10">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0 space-y-1">
                    <h3
                      :class="[
                        'text-sm font-semibold truncate group-hover:text-accent transition-colors',
                        theme.textPrimary,
                      ]"
                    >
                      {{ collection.name || collection.title }}
                    </h3>
                    <div :class="['flex items-center gap-2 text-xs', theme.textSecondary]">
                      <span class="font-medium">{{ collection.itemCount || 0 }} items</span>
                      <span class="opacity-40">•</span>
                      <span>
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
                  'text-accent',
                ]"
              >
                <ChevronRight class="h-5 w-5" />
              </div>
            </div>
          </div>
          <template #footer>
            <Button
              :class="['w-full', theme.textSecondary, theme.bgButtonHover, 'hover:text-accent']"
              size="sm"
              variant="ghost"
              @click="handleViewAllCollections"
            >
              View All Collections
              <ChevronRight class="ml-2 h-4 w-4" />
            </Button>
          </template>
        </DashboardCard>

        <!-- Recent Projects Widget -->
        <ListItemCard
          :loading="isLoadingProjects"
          :show-footer="true"
          description="Organize your work into projects"
          footer-label="View All Projects"
          title="Recent Projects"
          @footer-click="handleViewAllProjects"
        >
          <template #loading>
            <div class="animate-pulse space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-3">
                <div :class="['h-10 w-10 rounded-lg', theme.bgSkeleton]"></div>
                <div class="flex-1 space-y-2">
                  <div :class="['h-4 w-32 rounded', theme.bgSkeleton]"></div>
                  <div :class="['h-3 w-48 rounded', theme.bgSkeleton]"></div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="recentProjects.length === 0" class="text-center py-8">
            <EmptyState
              :icon="FolderKanban"
              action-label="Create Project"
              description="Organize your work by creating your first project"
              icon-bg-class="bg-green-500/20"
              icon-class="text-green-400"
              message="No projects yet"
            />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(project, index) in recentProjects.slice(0, 3)"
              :key="project.id"
              :class="[
                theme.listItem,
                'group rounded-xl p-3 hover:bg-opacity-80 transition-all duration-300 cursor-pointer',
                'hover:scale-[1.01] active:scale-[0.99]',
              ]"
              :style="{ animationDelay: `${index * 50}ms` }"
              @click="handleProjectClick(project)"
            >
              <div class="flex gap-3 items-start">
                <div
                  :class="[
                    'flex items-center justify-center p-2.5 rounded-xl shrink-0 transition-all duration-300',
                    'bg-gradient-to-br from-green-500/20 to-green-500/10',
                    'border border-green-500/20',
                    'group-hover:scale-110 group-hover:rotate-3 shadow-md group-hover:shadow-lg',
                  ]"
                >
                  <FolderKanban class="h-4 w-4 text-green-400" />
                </div>
                <div class="flex-1 min-w-0 space-y-1">
                  <p
                    :class="[
                      'text-sm font-semibold truncate group-hover:text-accent transition-colors',
                      theme.textPrimary,
                    ]"
                  >
                    {{ project.name }}
                  </p>
                  <p :class="['text-xs', theme.textSecondary]">
                    {{ formatDate(project.updatedAt || project.createdAt) }}
                  </p>
                  <div class="pt-1">
                    <StatusBadge :status="project.status || 'active'" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ListItemCard>

        <!-- Recent Selections Widget -->
        <ListItemCard
          :loading="isLoadingSelections"
          :show-footer="true"
          description="Client photo selection workflows"
          footer-label="View All Selections"
          title="Recent Selections"
          @footer-click="handleViewAllSelections"
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
          <div v-if="recentSelections.length === 0" class="text-center py-8">
            <EmptyState
              :icon="CheckSquare"
              description="Create a selection to let clients choose their favorite photos"
              icon-bg-class="bg-pink-500/20"
              icon-class="text-pink-400"
              message="No selections yet"
            />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(selection, index) in recentSelections.slice(0, 3)"
              :key="selection.id"
              :class="[
                theme.listItem,
                'group rounded-xl p-3 hover:bg-opacity-80 transition-all duration-300 cursor-pointer',
                'hover:scale-[1.01] active:scale-[0.99]',
              ]"
              :style="{ animationDelay: `${index * 50}ms` }"
              @click="handleSelectionClick(selection)"
            >
              <div class="flex gap-3 items-start">
                <div
                  :class="[
                    'flex items-center justify-center p-3 rounded-xl shrink-0 transition-all duration-300',
                    'bg-gradient-to-br from-pink-500/20 to-pink-500/10',
                    'border border-pink-500/20',
                    'group-hover:scale-110 group-hover:rotate-3',
                    'group-hover:border-pink-500/40 shadow-md group-hover:shadow-lg',
                  ]"
                >
                  <CheckSquare class="h-4 w-4 text-pink-400" />
                </div>
                <div class="flex-1 min-w-0 space-y-1">
                  <p
                    :class="[
                      'text-sm font-semibold truncate group-hover:text-accent transition-colors',
                      theme.textPrimary,
                    ]"
                  >
                    {{ selection.name }}
                  </p>
                  <p :class="['text-xs', theme.textSecondary]">
                    {{ formatDate(selection.updatedAt || selection.createdAt) }}
                  </p>
                  <div class="pt-1">
                    <StatusBadge :status="selection.status || 'active'" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ListItemCard>

        <!-- Recent Proofing Widget -->
        <ListItemCard
          :loading="isLoadingProofing"
          :show-footer="true"
          animation-class="animate-in fade-in slide-in-from-left-4"
          description="Client approval and feedback workflows"
          footer-label="View All Proofing"
          title="Recent Proofing"
          @footer-click="handleViewAllProofing"
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
          <div v-if="recentProofing.length === 0" class="text-center py-8">
            <EmptyState
              :icon="Eye"
              description="Create a proofing phase to collect client feedback and approvals"
              icon-bg-class="bg-orange-500/20"
              icon-class="text-orange-400"
              message="No proofing yet"
            />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(proofing, index) in recentProofing.slice(0, 3)"
              :key="proofing.id"
              :class="[
                theme.listItem,
                'group flex flex-col gap-1.5 pb-4 border-b rounded-lg px-2 -mx-2 cursor-pointer',
                theme.borderPrimary,
                'last:border-0 last:pb-0',
                'hover:bg-opacity-50 transition-all duration-300',
                'hover:scale-[1.01] active:scale-[0.99]',
              ]"
              :style="{ animationDelay: `${index * 50}ms` }"
              @click="handleProofingClick(proofing)"
            >
              <p
                :class="[
                  'text-sm font-semibold truncate group-hover:text-accent transition-colors',
                  theme.textPrimary,
                ]"
              >
                {{ proofing.name }}
              </p>
              <p :class="['text-xs', theme.textSecondary]">
                {{ formatDate(proofing.updatedAt || proofing.createdAt) }}
              </p>
              <div class="pt-0.5">
                <StatusBadge :status="proofing.status || 'active'" />
              </div>
            </div>
          </div>
        </ListItemCard>
      </div>
    </main>

    <!-- Footer -->
    <footer :class="['backdrop-blur-md mt-12', theme.borderPrimary, 'border-t', theme.bgFooter]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <MazelootLogo :show-text="true" container-class="h-8" size="sm" />
            <span :class="['text-xs', theme.textTertiary]">© {{ new Date().getFullYear() }}</span>
          </div>
          <div
            :class="[
              'flex items-center gap-6 text-sm',
              theme.textSecondary,
              theme.transitionColors,
            ]"
          >
            <a class="hover:text-accent opacity-70 hover:opacity-100 transition-colors" href="#"
              >Privacy</a
            >
            <a class="hover:text-accent opacity-70 hover:opacity-100 transition-colors" href="#"
              >Terms</a
            >
            <a class="hover:text-accent opacity-70 hover:opacity-100 transition-colors" href="#"
              >Support</a
            >
            <a class="hover:text-accent opacity-70 hover:opacity-100 transition-colors" href="#"
              >About</a
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import {
  AlertCircle,
  Calendar,
  CheckSquare,
  ChevronRight,
  Database,
  Eye,
  FileEdit,
  FileSpreadsheet,
  Folder,
  FolderKanban,
  Grid3x3,
  ListTodo,
  LogOut,
  MailIcon,
  Plus,
  Presentation,
  Settings,
  StickyNote,
  Users2,
} from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import AvatarDisplay from '@/shared/components/atoms/AvatarDisplay.vue'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import DashboardCard from '@/shared/components/organisms/DashboardCard.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import ListItemCard from '@/shared/components/molecules/ListItemCard.vue'
import AppIcon from '@/shared/components/atoms/AppIcon.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu/index'
import NotificationDropdown from '@/shared/components/organisms/NotificationDropdown.vue'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useThemeStore } from '@/shared/stores/theme'
import { useUserStore } from '@/shared/stores/user'
import { useLogout } from '@/shared/composables/useLogout'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useLoadingStates } from '@/shared/composables/useLoadingStates'
import { useAuthApi } from '@/shared/api/auth'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'
import ThumbnailImage from '@/shared/components/atoms/ThumbnailImage.vue'
import { MAZELOOT_PRODUCTS } from '@/domains/memora/constants/products'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useProjectStore } from '@/domains/memora/stores/project'
import { useSelectionStore } from '@/domains/memora/stores/selection'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'

const { navigateTo } = useNavigation()
useThemeStore() // Initialize theme store for reactivity
const theme = useThemeClasses()

// Loading states - consolidated
// Start with loading=true to show skeleton loaders initially
const loadingKeys = ['collections', 'projects', 'selections', 'proofing', 'storage']
const { states: loadingStates, setAllLoading } = useLoadingStates(loadingKeys, true)
// Vue templates automatically unwrap refs, so we can use them directly
// User and apps don't need loading states - data is immediately available
const isLoading = ref(false)
const isLoadingApps = ref(false)
const isLoadingCollections = loadingStates.collections
const isLoadingProjects = loadingStates.projects
const isLoadingSelections = loadingStates.selections
const isLoadingProofing = loadingStates.proofing
const isLoadingStorage = loadingStates.storage

const { logout } = useLogout()

const handleSignOut = async () => {
  await logout()
}

const handleViewProfile = () => {}

const handleViewAllProjects = () => {
  navigateTo({ name: 'projects' })
}

const handleProjectClick = project => {
  navigateTo({ name: 'projectDashboard', params: { projectId: project.id } })
}

const handleViewAllSelections = () => {
  navigateTo({ name: 'selections' })
}

const handleSelectionClick = selection => {
  navigateTo({ name: 'selectionDetail', params: { uuid: selection.id } })
}

const handleViewAllProofing = () => {
  navigateTo({ name: 'proofing' })
}

const handleProofingClick = proofing => {
  navigateTo({ name: 'proofingDetail', params: { uuid: proofing.id } })
}

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
  // Handle memora product specially
  if (product.id === 'memora') {
    if (userStore.isNewUser) {
      // New user: redirect to getting started
      navigateTo({ name: 'gettingStarted' })
      return
    } else {
      // Existing user: redirect to memora dashboard
      navigateTo({ name: 'memoraDashboard' })
      return
    }
  }
  handleAppSwitch(product)
}

// const handleAppClick = (_app) => {
//   // TODO
// }

const userStore = useUserStore()
const galleryStore = useGalleryStore()
const projectStore = useProjectStore()
const selectionStore = useSelectionStore()
const proofingStore = useProofingStore()
const authApi = useAuthApi()

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

// Recent Projects - get from store
const recentProjects = computed(() => {
  const allProjects = projectStore.projects || []
  return allProjects
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 3)
})

// Recent Selections - get from store
const recentSelections = computed(() => {
  const allSelections = selectionStore.selections || []
  return allSelections
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 3)
})

// Recent Proofing - get from store
const recentProofing = computed(() => {
  const allProofing = proofingStore.proofings || []
  return allProofing
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 3)
})

// Storage data - default to 5GB, will be updated from backend if available
const totalStorage = ref(5 * 1024 * 1024 * 1024) // 5 GB in bytes (default)
const usedStorage = ref(0)
const freeStorage = computed(() => totalStorage.value - usedStorage.value)
const storagePercentage = computed(() => {
  if (totalStorage.value === 0) return 0
  return Math.round((usedStorage.value / totalStorage.value) * 100)
})

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

// Fetch collections independently
const fetchCollections = async () => {
  try {
    loadingStates.collections.value = true
    await galleryStore.fetchCollections()
  } catch (error) {
    console.error('Failed to fetch collections:', error)
  } finally {
    loadingStates.collections.value = false
  }
}

// Fetch projects independently
const fetchProjects = async () => {
  try {
    loadingStates.projects.value = true
    await projectStore.fetchProjects({ perPage: 10 })
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  } finally {
    loadingStates.projects.value = false
  }
}

// Fetch selections independently
const fetchSelections = async () => {
  try {
    loadingStates.selections.value = true
    await selectionStore.fetchAllSelections({ perPage: 10 })
  } catch (error) {
    console.error('Failed to fetch selections:', error)
  } finally {
    loadingStates.selections.value = false
  }
}

// Fetch proofing independently
const fetchProofing = async () => {
  try {
    loadingStates.proofing.value = true
    await proofingStore.fetchAllProofing({ perPage: 10 })
  } catch (error) {
    console.error('Failed to fetch proofing:', error)
  } finally {
    loadingStates.proofing.value = false
  }
}

// Fetch storage usage independently
const fetchStorage = async () => {
  try {
    loadingStates.storage.value = true
    const storageData = await authApi.getStorage()
    usedStorage.value = storageData.total_used_bytes || 0
    // Backend now returns total_storage_bytes from quota config
    if (storageData.total_storage_bytes) {
      totalStorage.value = storageData.total_storage_bytes
    }
  } catch (error) {
    console.error('Failed to fetch storage usage:', error)
    // On error, keep default values (5GB)
  } finally {
    loadingStates.storage.value = false
  }
}

// Fetch data on mount - each section loads independently
onMounted(async () => {
  // Start loading all sections in parallel
  fetchCollections()
  fetchProjects()
  fetchSelections()
  fetchProofing()
  fetchStorage()
})

// Refresh storage when page is activated (user navigates back)
onActivated(() => {
  fetchStorage()
})

const handleViewAllCollections = () => {
  navigateTo({ name: 'manageCollections' })
}
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>

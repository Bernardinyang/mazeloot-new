<template>
  <div
    :class="[
      'min-h-screen',
      'bg-gradient-to-br from-violet-50/50 via-white to-fuchsia-50/40',
      'dark:from-gray-950 dark:via-gray-900/95 dark:to-violet-950/20',
      'transition-colors duration-500',
    ]"
  >
    <!-- Header -->
    <header
      :class="[
        'sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4',
        'backdrop-blur-xl border-b',
        'border-gray-200/80 bg-white/80 dark:border-white/10 dark:bg-gray-950/70',
        'transition-all duration-300',
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
              :class="[theme.textPrimary, theme.bgButtonHover, 'light:hover:text-gray-900 dark:hover:text-gray-100', theme.transition]"
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
              :class="[theme.textPrimary, theme.bgButtonHover, 'light:hover:text-gray-900 dark:hover:text-gray-100', theme.transition]"
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
            
            <!-- Memora Options -->
            <template v-if="hasMemora">
              <DropdownMenuItem
                v-if="canAccessCollection"
                :class="[
                  collectionLimitReached ? 'opacity-50 cursor-not-allowed' : theme.textPrimary,
                  collectionLimitReached ? '' : theme.bgButtonHover,
                  collectionLimitReached ? '' : 'cursor-pointer',
                ]"
                :disabled="collectionLimitReached"
                @click="!collectionLimitReached && openCreateDialog('collection')"
              >
                <Folder class="h-4 w-4 text-blue-400" />
                <span>Collection</span>
                <span v-if="collectionLimitReached" class="ml-auto text-xs text-amber-600 dark:text-amber-400">
                  Limit reached
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="canAccessSelection || canAccessCollection"
                :class="[
                  projectLimitReached ? 'opacity-50 cursor-not-allowed' : theme.textPrimary,
                  projectLimitReached ? '' : theme.bgButtonHover,
                  projectLimitReached ? '' : 'cursor-pointer',
                ]"
                :disabled="projectLimitReached"
                @click="!projectLimitReached && openCreateDialog('project')"
              >
                <FolderKanban class="h-4 w-4 text-green-400" />
                <span>Project</span>
                <span v-if="projectLimitReached" class="ml-auto text-xs text-amber-600 dark:text-amber-400">
                  Limit reached
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="canAccessSelection"
                :class="[
                  selectionLimitReached ? 'opacity-50 cursor-not-allowed' : theme.textPrimary,
                  selectionLimitReached ? '' : theme.bgButtonHover,
                  selectionLimitReached ? '' : 'cursor-pointer',
                ]"
                :disabled="selectionLimitReached"
                @click="!selectionLimitReached && openCreateDialog('selection')"
              >
                <CheckSquare class="h-4 w-4 text-pink-400" />
                <span>Selection</span>
                <span v-if="selectionLimitReached" class="ml-auto text-xs text-amber-600 dark:text-amber-400">
                  Limit reached
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="canAccessProofing"
                :class="[
                  proofingLimitReached ? 'opacity-50 cursor-not-allowed' : theme.textPrimary,
                  proofingLimitReached ? '' : theme.bgButtonHover,
                  proofingLimitReached ? '' : 'cursor-pointer',
                ]"
                :disabled="proofingLimitReached"
                @click="!proofingLimitReached && openCreateDialog('proofing')"
              >
                <Eye class="h-4 w-4 text-orange-400" />
                <span>Proofing</span>
                <span v-if="proofingLimitReached" class="ml-auto text-xs text-amber-600 dark:text-amber-400">
                  Limit reached
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="canAccessRawFiles"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click="openCreateDialog('rawFile')"
              >
                <FileText class="h-4 w-4 text-teal-400" />
                <span>Raw File</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator v-if="hasOtherProducts" :class="theme.bgDropdownSeparator" />
            </template>
            
            <!-- Other Products Options (placeholder for future products) -->
            <template v-if="hasOtherProducts && !hasMemora">
              <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
                <span class="text-xs text-muted-foreground">Coming soon</span>
              </DropdownMenuItem>
            </template>
            
            <!-- Empty State -->
            <template v-if="!hasMemora && !hasOtherProducts">
              <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
                <span class="text-xs text-muted-foreground">Select products to create</span>
              </DropdownMenuItem>
            </template>
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
                <div class="flex items-center gap-2">
                  <span class="font-semibold">{{ userData.name }}</span>
                  <Badge v-if="roleLabel" :variant="roleVariant" class="text-xs">
                    {{ roleLabel }}
                  </Badge>
                </div>
                <span :class="['text-xs font-normal', theme.textSecondary]">{{ userData.email }}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click="navigateTo({ name: 'overview-account' })"
            >
              <BadgeCheck class="h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click="navigateTo({ name: 'overview-account-refer' })"
            >
              <Users2 class="h-4 w-4" />
              <span>Refer a Friend</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click="navigateTo({ name: 'overview-account-billing' })"
            >
              <CreditCard class="h-4 w-4" />
              <span>Billing</span>
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
    <main class="px-4 sm:px-6 pb-16 pt-8 sm:pt-10">
      <div class="max-w-7xl mx-auto space-y-10">
        <!-- Welcome Section -->
        <div class="space-y-3">
          <p
            :class="[
              'text-xs font-semibold uppercase tracking-widest',
              'text-violet-600 dark:text-violet-400/90',
            ]"
          >
            Dashboard
          </p>
          <h1
            :class="[
              'text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight',
              'bg-gradient-to-r from-gray-900 via-violet-800 to-fuchsia-800',
              'dark:from-white dark:via-violet-200 dark:to-fuchsia-200',
              'bg-clip-text text-transparent',
            ]"
          >
            Welcome back, {{ userData.name.split(' ')[0] }} 👋
          </h1>
          <p :class="['text-base sm:text-lg max-w-xl', theme.textSecondary]">
            Summary of your Mazeloot products and activity
          </p>
        </div>

        <!-- User Profile Cover Card -->
        <div
          :class="[
            'group relative overflow-hidden rounded-3xl',
            'bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500',
            'dark:from-indigo-700 dark:via-violet-700 dark:to-fuchsia-700',
            'backdrop-blur-md',
            'border border-white/20 dark:border-white/10',
            'shadow-2xl shadow-violet-500/20 dark:shadow-2xl dark:shadow-violet-500/10',
            'hover:shadow-violet-500/25 dark:hover:shadow-violet-500/15 transition-all duration-500',
            'animate-in fade-in slide-in-from-top-4 duration-500',
          ]"
        >
          <!-- Cover: mesh + orbs -->
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.25),transparent)]"
            />
            <div
              class="absolute top-0 right-0 w-[28rem] h-[28rem] bg-white/15 rounded-full blur-3xl -mr-40 -mt-40"
            />
            <div
              class="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl -ml-32 -mb-32"
            />
            <div
              class="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
            />
          </div>

          <!-- Content -->
          <div class="relative z-10 p-4 sm:p-6 md:p-8">
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
                    loading="lazy"
                    decoding="async"
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
                <div class="flex flex-wrap items-center gap-3 justify-center sm:justify-start mt-5">
                  <Button
                    :class="[
                      'bg-white/25 dark:bg-white/15 border border-white/40 dark:border-white/25',
                      'text-white hover:bg-white/35 dark:hover:bg-white/25',
                      'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg',
                    ]"
                    size="sm"
                    @click="handleViewProfile"
                  >
                    <Users2 class="h-4 w-4" />
                    View Profile
                  </Button>
                  <Button
                    :class="[
                      'bg-red-400/30 dark:bg-red-500/25 border border-red-300/50 dark:border-red-400/40',
                      'text-white hover:bg-red-400/40 dark:hover:bg-red-500/35',
                      'transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg group',
                    ]"
                    size="sm"
                    @click="handleSignOut"
                  >
                    <LogOut class="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Plan / Tier card (Memora) -->
        <div
          v-if="hasMemora"
          :class="[
            'group relative overflow-hidden rounded-2xl p-6',
            'bg-gradient-to-br from-amber-400/15 via-orange-400/10 to-yellow-400/5',
            'dark:from-amber-500/25 dark:via-amber-500/15 dark:to-orange-500/10',
            'border border-amber-400/40 dark:border-amber-500/40',
            'shadow-lg shadow-amber-500/5 dark:shadow-amber-500/10',
            'hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-amber-500/15 transition-all duration-300',
          ]"
        >
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 dark:from-amber-500 dark:via-orange-500 dark:to-yellow-500 opacity-80" />
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-start gap-4">
              <div
                class="p-3 rounded-2xl bg-amber-500/25 dark:bg-amber-500/30 shrink-0 shadow-inner"
              >
                <Sparkles
                  class="h-6 w-6 text-amber-600 dark:text-amber-400"
                  aria-hidden="true"
                />
              </div>
              <div class="min-w-0">
                <span
                  :class="[
                    'inline-block text-[10px] font-semibold uppercase tracking-wider rounded-md px-2 py-0.5 mb-2',
                    theme.bgMuted,
                    theme.textSecondary,
                  ]"
                >
                  Memora
                </span>
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                      tierBadgeClass,
                    ]"
                    :aria-label="`Current plan tier: ${planLabel}`"
                    :title="planLabel"
                  >
                    {{ planBadgeLabel }}
                  </span>
                  <span :class="['text-xs font-medium uppercase tracking-wider', theme.textSecondary]">
                    Plan
                  </span>
                </div>
                <p
                  v-if="tierSummary"
                  :class="['text-sm mt-2 tabular-nums', theme.textSecondary]"
                >
                  {{ tierSummary }}
                </p>
              </div>
            </div>
            <RouterLink
              :to="{ name: 'memora-pricing' }"
              :class="[
                'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shrink-0 transition-all duration-300',
                hasPaidPlan
                  ? 'bg-amber-500/25 text-amber-800 dark:text-amber-200 hover:bg-amber-500/35 border border-amber-500/50 shadow-sm'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-amber-950 hover:from-amber-400 hover:to-orange-400 dark:from-amber-500 dark:to-orange-500 dark:text-amber-950 border border-amber-600/50 shadow-md hover:shadow-lg',
              ]"
            >
              {{ hasPaidPlan ? 'Manage subscription' : 'Upgrade plan' }}
              <ChevronRight class="h-4 w-4" aria-hidden="true" />
            </RouterLink>
          </div>
          <div
            class="absolute bottom-0 right-0 w-32 h-32 bg-amber-400/10 dark:bg-amber-500/15 rounded-full -mr-16 -mb-16 blur-2xl"
            aria-hidden="true"
          />
        </div>

        <!-- Stats Cards (Memora) -->
        <div v-if="hasMemora" class="space-y-4">
          <span
            :class="[
              'inline-block text-[10px] font-semibold uppercase tracking-wider rounded-full px-3 py-1',
              'bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300',
            ]"
          >
            Memora
          </span>
          <div class="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4">
          <!-- Collections Stat -->
          <div
            :class="[
              'group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300',
              'bg-gradient-to-br from-blue-500/15 to-cyan-500/10 dark:from-blue-500/25 dark:to-cyan-500/15',
              'border-blue-400/30 dark:border-blue-500/30',
              'hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/15 dark:hover:shadow-blue-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p :class="['text-xs font-semibold uppercase tracking-wide', theme.textSecondary]">Collections</p>
                <p :class="['text-2xl font-bold tabular-nums', theme.textPrimary]">
                  {{
                    isLoadingCollections
                      ? '—'
                      : galleryStore.collections.filter(c => !c.isFolder).length || 0
                  }}
                </p>
              </div>
              <div class="p-2.5 rounded-xl bg-blue-500/25 dark:bg-blue-500/30 ring-1 ring-blue-400/20">
                <Folder class="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full -mr-12 -mb-12 blur-xl" />
          </div>

          <!-- Storage Stat -->
          <div
            :class="[
              'group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300',
              'bg-gradient-to-br from-purple-500/15 to-violet-500/10 dark:from-purple-500/25 dark:to-violet-500/15',
              'border-purple-400/30 dark:border-purple-500/30',
              'hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/15 dark:hover:shadow-purple-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p :class="['text-xs font-semibold uppercase tracking-wide', theme.textSecondary]">Storage</p>
                <p :class="['text-2xl font-bold tabular-nums', theme.textPrimary]">
                  {{ isLoadingStorage ? '—' : storagePercentage }}%
                </p>
              </div>
              <div class="p-2.5 rounded-xl bg-purple-500/25 dark:bg-purple-500/30 ring-1 ring-purple-400/20">
                <Database class="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
            </div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-purple-400/10 rounded-full -mr-12 -mb-12 blur-xl" />
          </div>

          <!-- Projects Stat -->
          <div
            :class="[
              'group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300',
              'bg-gradient-to-br from-emerald-500/15 to-green-500/10 dark:from-emerald-500/25 dark:to-green-500/15',
              'border-emerald-400/30 dark:border-emerald-500/30',
              'hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p :class="['text-xs font-semibold uppercase tracking-wide', theme.textSecondary]">Projects</p>
                <p :class="['text-2xl font-bold tabular-nums', theme.textPrimary]">
                  {{ isLoadingProjects ? '—' : projectStore.projects.length || 0 }}
                </p>
              </div>
              <div class="p-2.5 rounded-xl bg-emerald-500/25 dark:bg-emerald-500/30 ring-1 ring-emerald-400/20">
                <FolderKanban class="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full -mr-12 -mb-12 blur-xl" />
          </div>

          <!-- Selections Stat (plan-gated) -->
          <div
            v-if="canAccessSelection"
            :class="[
              'group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300',
              'bg-gradient-to-br from-pink-500/15 to-rose-500/10 dark:from-pink-500/25 dark:to-rose-500/15',
              'border-pink-400/30 dark:border-pink-500/30',
              'hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/15 dark:hover:shadow-pink-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p :class="['text-xs font-semibold uppercase tracking-wide', theme.textSecondary]">Selections</p>
                <p :class="['text-2xl font-bold tabular-nums', theme.textPrimary]">
                  {{ isLoadingSelections ? '—' : selectionStore.selections.length || 0 }}
                </p>
              </div>
              <div class="p-2.5 rounded-xl bg-pink-500/25 dark:bg-pink-500/30 ring-1 ring-pink-400/20">
                <CheckSquare class="h-5 w-5 text-pink-500 dark:text-pink-400" />
              </div>
            </div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-pink-400/10 rounded-full -mr-12 -mb-12 blur-xl" />
          </div>

          <!-- Proofing Stat (plan-gated) -->
          <div
            v-if="canAccessProofing"
            :class="[
              'group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300',
              'bg-gradient-to-br from-orange-500/15 to-amber-500/10 dark:from-orange-500/25 dark:to-amber-500/15',
              'border-orange-400/30 dark:border-orange-500/30',
              'hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/15 dark:hover:shadow-orange-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p :class="['text-xs font-semibold uppercase tracking-wide', theme.textSecondary]">Proofing</p>
                <p :class="['text-2xl font-bold tabular-nums', theme.textPrimary]">
                  {{ isLoadingProofing ? '—' : proofingStore.proofings.length || 0 }}
                </p>
              </div>
              <div class="p-2.5 rounded-xl bg-orange-500/25 dark:bg-orange-500/30 ring-1 ring-orange-400/20">
                <Eye class="h-5 w-5 text-orange-500 dark:text-orange-400" />
              </div>
            </div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-orange-400/10 rounded-full -mr-12 -mb-12 blur-xl" />
          </div>

          <!-- Raw Files Stat (plan-gated) -->
          <div
            v-if="canAccessRawFiles"
            :class="[
              'group relative overflow-hidden rounded-2xl p-5 border transition-all duration-300',
              'bg-gradient-to-br from-teal-500/15 to-cyan-500/10 dark:from-teal-500/25 dark:to-cyan-500/15',
              'border-teal-400/30 dark:border-teal-500/30',
              'hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/15 dark:hover:shadow-teal-500/20',
            ]"
          >
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p :class="['text-xs font-semibold uppercase tracking-wide', theme.textSecondary]">Raw Files</p>
                <p :class="['text-2xl font-bold tabular-nums', theme.textPrimary]">
                  {{ isLoadingRawFiles ? '—' : rawFileStore.rawFiles.length || 0 }}
                </p>
              </div>
              <div class="p-2.5 rounded-xl bg-teal-500/25 dark:bg-teal-500/30 ring-1 ring-teal-400/20">
                <FileText class="h-5 w-5 text-teal-500 dark:text-teal-400" />
              </div>
            </div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-teal-400/10 rounded-full -mr-12 -mb-12 blur-xl" />
          </div>
          </div>
        </div>

        <!-- Products and Storage Row -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- App Launcher Card (all products) -->
          <DashboardCard
            :loading="isLoadingApps"
            animation-class="animate-in fade-in slide-in-from-bottom-4 duration-500"
            description="Access all your Mazeloot products"
            title="Quick Access"
          >
            <template #loading>
              <div class="animate-pulse space-y-4">
                <div :class="['grid gap-4 sm:gap-6', appCardGridClasses]">
                  <div
                    v-for="i in mazelootProducts.length || 1"
                    :key="i"
                    class="flex flex-col items-center gap-3"
                  >
                    <div :class="['h-20 w-20 sm:h-16 sm:w-16 rounded-2xl', theme.bgSkeleton]"></div>
                    <div :class="['h-3 w-12 rounded', theme.bgSkeleton]"></div>
                  </div>
                </div>
              </div>
            </template>
            <div class="relative w-full">
              <div :class="['grid gap-4 sm:gap-6 relative z-10 w-full', appCardGridClasses]">
                <div
                  v-for="(product, index) in mazelootProducts"
                  :key="product.id"
                  :class="[
                    'group flex flex-col items-center justify-center gap-3 cursor-pointer',
                    'w-full',
                    theme.transition,
                  ]"
                  :style="{ animationDelay: `${index * 50}ms` }"
                  @click="handleProductClick(product)"
                >
                  <div
                    :class="[
                      'relative rounded-3xl flex items-center justify-center overflow-hidden',
                      'bg-gradient-to-br from-white to-gray-100/80 dark:from-gray-800 dark:to-gray-900',
                      'border-2 border-gray-200/80 dark:border-gray-600/50',
                      'shadow-lg dark:shadow-xl dark:shadow-black/20',
                      'group-hover:border-violet-400/50 dark:group-hover:border-violet-500/50',
                      'group-hover:shadow-xl group-hover:shadow-violet-500/15 dark:group-hover:shadow-violet-500/20',
                      'group-hover:scale-105 group-hover:-translate-y-1',
                      'group-active:scale-95 group-active:translate-y-0',
                      'transition-all duration-300 ease-out',
                      'ring-0 group-hover:ring-4 group-hover:ring-violet-400/20 dark:group-hover:ring-violet-500/30',
                      'w-full aspect-square',
                    ]"
                  >
                    <div
                      :class="[
                        'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100',
                        'bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent',
                        'transition-opacity duration-300',
                      ]"
                    />

                    <!-- Icon -->
                    <div class="relative z-10 w-full h-full flex items-center justify-center p-2 transform group-hover:scale-110 transition-transform duration-300">
                      <AppIcon 
                        :custom-type="product.customType" 
                        :size="'lg'"
                        class="!w-full !h-full [&>div]:!w-full [&>div]:!h-full [&_svg]:!w-full [&_svg]:!h-full [&_svg]:!max-w-none [&_svg]:!max-h-none"
                      />
                    </div>

                    <!-- Active indicator for Memora -->
                    <div
                      v-if="product.id === 'memora'"
                      :class="[
                        'absolute -top-1 -right-1 w-3.5 h-3.5',
                        'bg-gradient-to-br from-green-400 to-emerald-500',
                        'rounded-full border-2 border-white dark:border-gray-900',
                        'shadow-lg shadow-green-500/50',
                        'animate-pulse',
                        'group-hover:scale-125 group-hover:shadow-xl group-hover:shadow-green-500/70',
                        'transition-all duration-300',
                      ]"
                    ></div>
                  </div>
                  <span
                    :class="[
                      'text-xs text-center font-semibold',
                      theme.textPrimary,
                      'group-hover:text-accent transition-colors duration-300',
                      'max-w-[90px] truncate',
                      'group-hover:scale-105 transition-transform duration-300',
                    ]"
                    >{{ product.displayName }}</span
                  >
                </div>
              </div>
            </div>
          </DashboardCard>

          <!-- Storage Space Section (Memora) -->
          <DashboardCard
            :loading="isLoadingStorage"
            animation-class="animate-in fade-in slide-in-from-bottom-4 duration-500"
            description="Manage your cloud storage space"
            product-label="Memora"
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
                    <RouterLink :to="{ name: 'memora-pricing' }">
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
                        Upgrade Plan
                      </Button>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        <!-- Recent Collections and Projects - Side by Side (Memora) -->
        <div v-if="hasMemora" class="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <!-- Recent Collections Widget -->
          <DashboardCard
            :loading="isLoadingCollections"
            animation-class="animate-in fade-in slide-in-from-right-4"
            description="Your latest photo collections and galleries"
            product-label="Memora"
            title="Recent Collections"
          >
          <template #loading>
            <div class="animate-pulse space-y-4">
              <div v-for="i in 5" :key="i" class="flex items-center gap-4">
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
              v-for="(collection, index) in recentCollections.slice(0, 5)"
              :key="collection.id"
              :class="[
                'group relative flex items-center gap-4 p-4 rounded-xl cursor-pointer',
                'transition-all duration-300 ease-out',
                'hover:scale-[1.01] active:scale-[0.99]',
                theme.bgCard,
                theme.borderCard,
                'border hover:border-violet-400/30 dark:hover:border-violet-500/30',
                'hover:shadow-lg hover:shadow-violet-500/5 dark:hover:shadow-violet-500/10',
                'backdrop-blur-sm',
                'rounded-l-xl border-l-4 border-l-transparent hover:border-l-violet-500',
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

              <!-- Thumbnail or Icon -->
              <div class="relative shrink-0 z-10">
                <div
                  v-if="collection.thumbnail || collection.previewImages?.[0]"
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
                <div
                  v-else
                  :class="[
                    'flex items-center justify-center p-3 rounded-xl shrink-0 transition-all duration-300',
                    'bg-gradient-to-br from-blue-500/20 to-blue-500/10',
                    'border border-blue-500/20',
                    'group-hover:scale-110 group-hover:rotate-3 shadow-md group-hover:shadow-lg',
                    'group-hover:border-blue-500/40',
                  ]"
                >
                  <Folder class="h-5 w-5 text-blue-400" />
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
              :class="[
                'w-full rounded-xl',
                theme.textSecondary,
                theme.bgButtonHover,
                'hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-500/10',
              ]"
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
            product-label="Memora"
            title="Recent Projects"
            @footer-click="handleViewAllProjects"
          >
          <template #loading>
            <div class="animate-pulse space-y-3">
              <div v-for="i in 5" :key="i" class="flex items-center gap-3">
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
              :action-disabled="projectLimitReached"
              description="Organize your work by creating your first project"
              icon-bg-class="bg-green-500/20"
              icon-class="text-green-400"
              message="No projects yet"
              @action="!projectLimitReached && openCreateDialog('project')"
            />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(project, index) in recentProjects.slice(0, 5)"
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
                </div>
                <div class="shrink-0">
                  <StatusBadge :status="project.status || 'active'" />
                </div>
              </div>
            </div>
          </div>
          </ListItemCard>
        </div>

        <!-- Recent Phase Cards - 3 Column Grid -->
        <div v-if="hasMemora && (canAccessSelection || canAccessProofing || canAccessRawFiles)" class="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          <!-- Recent Selections Widget -->
          <ListItemCard
            v-if="canAccessSelection"
            :loading="isLoadingSelections"
            :show-footer="true"
            animation-class="animate-in fade-in slide-in-from-bottom-4"
            description="Client photo selection workflows"
            footer-label="View All Selections"
            product-label="Memora"
            title="Recent Selections"
            @footer-click="handleViewAllSelections"
          >
            <template #loading>
              <div class="animate-pulse space-y-3">
                <div v-for="i in 5" :key="i" class="flex items-center gap-3 p-2">
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
                :action-label="selectionLimitReached ? undefined : 'Create Selection'"
                description="Create a selection to let clients choose their favorite photos"
                icon-bg-class="bg-pink-500/20"
                icon-class="text-pink-400"
                message="No selections yet"
                @action="canAccessSelection ? openCreateDialog('selection') : showUpgradePrompt('selection')"
              />
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(selection, index) in recentSelections.slice(0, 5)"
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
                  </div>
                  <div class="shrink-0">
                    <StatusBadge :status="selection.status || 'active'" />
                  </div>
                </div>
              </div>
            </div>
          </ListItemCard>

          <!-- Recent Proofing Widget -->
          <ListItemCard
            v-if="canAccessProofing"
            :loading="isLoadingProofing"
            :show-footer="true"
            animation-class="animate-in fade-in slide-in-from-bottom-4"
            description="Client approval and feedback workflows"
            footer-label="View All Proofing"
            product-label="Memora"
            title="Recent Proofing"
            @footer-click="handleViewAllProofing"
          >
            <template #loading>
              <div class="animate-pulse space-y-3">
                <div
                  v-for="i in 5"
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
                :action-label="proofingLimitReached ? undefined : (canAccessProofing ? 'Create Proofing' : `Upgrade to ${recommendedTierDisplayName('proofing')}`)"
                description="Create a proofing phase to collect client feedback and approvals"
                icon-bg-class="bg-orange-500/20"
                icon-class="text-orange-400"
                message="No proofing yet"
                @action="canAccessProofing ? openCreateDialog('proofing') : showUpgradePrompt('proofing')"
              />
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(proofing, index) in recentProofing.slice(0, 5)"
                :key="proofing.id"
                :class="[
                  theme.listItem,
                  'group rounded-xl p-3 hover:bg-opacity-80 transition-all duration-300 cursor-pointer',
                  'hover:scale-[1.01] active:scale-[0.99]',
                ]"
                :style="{ animationDelay: `${index * 50}ms` }"
                @click="handleProofingClick(proofing)"
              >
                <div class="flex gap-3 items-start">
                  <div
                    :class="[
                      'flex items-center justify-center p-3 rounded-xl shrink-0 transition-all duration-300',
                      'bg-gradient-to-br from-orange-500/20 to-orange-500/10',
                      'border border-orange-500/20',
                      'group-hover:scale-110 group-hover:rotate-3',
                      'group-hover:border-orange-500/40 shadow-md group-hover:shadow-lg',
                    ]"
                  >
                    <Eye class="h-4 w-4 text-orange-400" />
                  </div>
                  <div class="flex-1 min-w-0 space-y-1">
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
                  </div>
                  <div class="shrink-0">
                    <StatusBadge :status="proofing.status || 'active'" />
                  </div>
                </div>
              </div>
            </div>
          </ListItemCard>

          <!-- Recent Raw Files Widget -->
          <ListItemCard
            v-if="canAccessRawFiles"
            :loading="isLoadingRawFiles"
            :show-footer="true"
            animation-class="animate-in fade-in slide-in-from-bottom-4"
            description="Client raw file upload workflows"
            footer-label="View All Raw Files"
            product-label="Memora"
            title="Recent Raw Files"
            @footer-click="handleViewAllRawFiles"
          >
            <template #loading>
              <div class="animate-pulse space-y-3">
                <div
                  v-for="i in 5"
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
            <div v-if="recentRawFiles.length === 0" class="text-center py-8">
              <EmptyState
                :icon="FileText"
                :action-label="canAccessRawFiles ? 'Create Raw File' : `Upgrade to ${recommendedTierDisplayName('raw_files')}`"
                description="Create a raw file to let clients upload their photos"
                icon-bg-class="bg-teal-500/20"
                icon-class="text-teal-400"
                message="No raw files yet"
                @action="canAccessRawFiles ? openCreateDialog('rawFile') : showUpgradePrompt('raw_files')"
              />
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(rawFile, index) in recentRawFiles.slice(0, 5)"
                :key="rawFile.id"
                :class="[
                  theme.listItem,
                  'group rounded-xl p-3 hover:bg-opacity-80 transition-all duration-300 cursor-pointer',
                  'hover:scale-[1.01] active:scale-[0.99]',
                ]"
                :style="{ animationDelay: `${index * 50}ms` }"
                @click="handleRawFileClick(rawFile)"
              >
                <div class="flex gap-3 items-start">
                  <div
                    :class="[
                      'flex items-center justify-center p-3 rounded-xl shrink-0 transition-all duration-300',
                      'bg-gradient-to-br from-teal-500/20 to-teal-500/10',
                      'border border-teal-500/20',
                      'group-hover:scale-110 group-hover:rotate-3',
                      'group-hover:border-teal-500/40 shadow-md group-hover:shadow-lg',
                    ]"
                  >
                    <FileText class="h-4 w-4 text-teal-400" />
                  </div>
                  <div class="flex-1 min-w-0 space-y-1">
                    <p
                      :class="[
                        'text-sm font-semibold truncate group-hover:text-accent transition-colors',
                        theme.textPrimary,
                      ]"
                    >
                      {{ rawFile.name }}
                    </p>
                    <p :class="['text-xs', theme.textSecondary]">
                      {{ formatDate(rawFile.updatedAt || rawFile.createdAt) }}
                    </p>
                  </div>
                  <div class="shrink-0">
                    <StatusBadge :status="rawFile.status || 'active'" />
                  </div>
                </div>
              </div>
            </div>
          </ListItemCard>
        </div>
      </div>
    </main>

    <!-- Creation Dialogs -->
    <CreateCollectionDialog
      v-if="hasMemora"
      v-model:open="showCreateCollectionDialog"
      :is-submitting="isCreatingCollection"
      @create="handleCreateCollection"
    />
    <CreateProjectDialog
      v-if="hasMemora"
      v-model:open="showCreateProjectDialog"
      :is-submitting="isCreatingProject"
      @create="handleCreateProject"
    />
    <CreateSelectionDialog
      v-if="hasMemora"
      v-model:open="showCreateSelectionDialog"
      @success="handleCreateSelectionSuccess"
    />
    <CreateProofingDialog
      v-if="hasMemora"
      v-model:open="showCreateProofingDialog"
      @success="handleCreateProofingSuccess"
    />
    <CreateRawFileDialog
      v-if="hasMemora"
      v-model:open="showCreateRawFileDialog"
      @success="handleCreateRawFileSuccess"
    />

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
            <RouterLink
              :to="{ name: 'faq' }"
              class="hover:text-accent opacity-70 hover:opacity-100 transition-colors"
              >FAQ</RouterLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, onUnmounted, ref } from 'vue'
import {
  AlertCircle,
  Calendar,
  CheckSquare,
  ChevronRight,
  Database,
  Eye,
  FileEdit,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderKanban,
  Grid3x3,
  ListTodo,
  LogOut,
  MailIcon,
  Plus,
  Presentation,
  Settings,
  BadgeCheck,
  CreditCard,
  Sparkles,
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
import Badge from '@/shared/components/shadcn/badge/Badge.vue'
import NotificationDropdown from '@/shared/components/organisms/NotificationDropdown.vue'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useThemeStore } from '@/shared/stores/theme'
import { useUserStore } from '@/shared/stores/user'
import { useLogout } from '@/shared/composables/useLogout'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useFormatDate } from '@/shared/composables/useFormatDate'
import { useLoadingStates } from '@/shared/composables/useLoadingStates'
import { useAuthApi } from '@/shared/api/auth'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'
import ThumbnailImage from '@/shared/components/atoms/ThumbnailImage.vue'
import { MAZELOOT_PRODUCTS } from '@/domains/memora/constants/products'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useProjectStore } from '@/domains/memora/stores/project'
import { useSelectionStore } from '@/domains/memora/stores/selection'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import { useRawFileStore } from '@/domains/memora/stores/rawFile'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { useProductsStore } from '@/shared/stores/products'
import CreateCollectionDialog from '@/domains/memora/components/organisms/CreateCollectionDialog.vue'
import CreateProjectDialog from '@/shared/components/organisms/CreateProjectDialog.vue'
import CreateSelectionDialog from '@/domains/memora/components/organisms/CreateSelectionDialog.vue'
import CreateProofingDialog from '@/domains/memora/components/organisms/CreateProofingDialog.vue'
import CreateRawFileDialog from '@/domains/memora/components/organisms/CreateRawFileDialog.vue'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'

const { navigateTo } = useNavigation()
const { canAccessSelection, canAccessProofing, canAccessRawFiles, canAccessCollection, showUpgradePrompt, recommendedTierDisplayName, tierDisplayName, features, featureLabel } = useMemoraFeatures()
useThemeStore() // Initialize theme store for reactivity
const theme = useThemeClasses()

// Loading states - consolidated
// Start with loading=true to show skeleton loaders initially
const loadingKeys = ['collections', 'projects', 'selections', 'proofing', 'rawFiles', 'storage']
const { states: loadingStates, setAllLoading } = useLoadingStates(loadingKeys, true)
// Vue templates automatically unwrap refs, so we can use them directly
// User and apps don't need loading states - data is immediately available
const isLoading = ref(false)
const isLoadingApps = ref(false)
const isLoadingCollections = loadingStates.collections
const isLoadingProjects = loadingStates.projects
const isLoadingSelections = loadingStates.selections
const isLoadingProofing = loadingStates.proofing
const isLoadingRawFiles = loadingStates.rawFiles
const isLoadingStorage = loadingStates.storage

const { logout } = useLogout()

const handleSignOut = async () => {
  await logout()
}

const handleViewProfile = () => {
  navigateTo({ name: 'overview-account' })
}

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
  const id = selection.id || selection.uuid
  if (id) {
    navigateTo({ name: 'selectionDetail', params: { id } })
  }
}

const handleViewAllProofing = () => {
  navigateTo({ name: 'proofing' })
}

const handleProofingClick = proofing => {
  const id = proofing.id || proofing.uuid
  if (id) {
    navigateTo({ name: 'proofingDetail', params: { id } })
  }
}

const handleViewAllRawFiles = () => {
  navigateTo({ name: 'rawFiles' })
}

const handleRawFileClick = rawFile => {
  const id = rawFile.id || rawFile.uuid
  if (id) {
    navigateTo({ name: 'rawFileDetail', params: { id } })
  }
}

// Mazeloot Products - filter to only show selected products
const mazelootProducts = computed(() => {
  const selectedProducts = userStore.selectedProducts || []
  if (selectedProducts.length === 0) {
    return []
  }
  
  // Get slugs of selected products
  const selectedSlugs = selectedProducts.map(p => {
    const product = p.product || p
    return product?.slug
  }).filter(Boolean)
  
  // Filter MAZELOOT_PRODUCTS to only include selected products
  // Match by id (e.g., 'memora' matches 'memora', 'connect_stream' matches 'connect-stream')
  return MAZELOOT_PRODUCTS.filter(product => {
    const productId = product.id
    const normalizedId = productId.replace(/_/g, '-')
    return selectedSlugs.includes(productId) || 
           selectedSlugs.includes(normalizedId) ||
           selectedSlugs.some(slug => slug.replace(/_/g, '-') === normalizedId)
  })
})

// Dynamic grid classes based on number of products
const appCardGridClasses = computed(() => {
  const count = mazelootProducts.value.length
  if (count === 0) return 'grid-cols-1'
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-2'
  if (count === 3) return 'grid-cols-3'
  if (count === 4) return 'grid-cols-2 sm:grid-cols-4'
  return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
})


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
  
  const DASHBOARD_ROUTE_BY_SLUG = { memora: 'memoraDashboard' }
  if (product.route) {
    navigateTo(product.route)
  } else if (product.url) {
    navigateTo({ path: product.url })
  } else {
    const productSlug = product.slug || product.id
    if (productSlug && DASHBOARD_ROUTE_BY_SLUG[productSlug]) {
      navigateTo({ name: DASHBOARD_ROUTE_BY_SLUG[productSlug] })
    } else if (productSlug) {
      navigateTo({ path: `/${productSlug}/dashboard` })
    }
  }
}

const handleAppSwitch = product => {
  // Use the same logic as handleProductClick
  handleProductClick(product)
}

const userStore = useUserStore()
const roleLabel = computed(() => {
  if (userStore.isSuperAdmin) return 'Super Admin'
  if (userStore.isAdmin) return 'Admin'
  return null
})
const roleVariant = computed(() => {
  if (userStore.isSuperAdmin) return 'destructive'
  if (userStore.isAdmin) return 'secondary'
  return 'default'
})
const productsStore = useProductsStore()
const galleryStore = useGalleryStore()
const projectStore = useProjectStore()
const selectionStore = useSelectionStore()
const proofingStore = useProofingStore()
const rawFileStore = useRawFileStore()
const authApi = useAuthApi()

// Check if user has selected Memora product
const hasMemora = computed(() => {
  const selectedProducts = userStore.selectedProducts || []
  return selectedProducts.some(p => {
    const product = p.product || p
    return product?.slug === 'memora'
  })
})

// Check if user has selected other products (non-Memora)
const hasOtherProducts = computed(() => {
  const selectedProducts = userStore.selectedProducts || []
  return selectedProducts.some(p => {
    const product = p.product || p
    return product?.slug !== 'memora'
  })
})

// Dialog states
const showCreateCollectionDialog = ref(false)
const showCreateProjectDialog = ref(false)
const showCreateSelectionDialog = ref(false)
const showCreateProofingDialog = ref(false)
const showCreateRawFileDialog = ref(false)
const isCreatingCollection = ref(false)
const isCreatingProject = ref(false)

// Open create dialog based on type
const openCreateDialog = (type) => {
  switch (type) {
    case 'collection':
      showCreateCollectionDialog.value = true
      break
    case 'project':
      showCreateProjectDialog.value = true
      break
    case 'selection':
      showCreateSelectionDialog.value = true
      break
    case 'proofing':
      showCreateProofingDialog.value = true
      break
    case 'rawFile':
      showCreateRawFileDialog.value = true
      break
  }
}

// Handle collection creation
const handleCreateCollection = async (data) => {
  try {
    isCreatingCollection.value = true
    await galleryStore.createCollection(data)
    showCreateCollectionDialog.value = false
    // Refresh collections
    await fetchCollections()
  } catch (error) {
    console.error('Failed to create collection:', error)
  } finally {
    isCreatingCollection.value = false
  }
}

// Handle project creation
const handleCreateProject = async (data) => {
  try {
    isCreatingProject.value = true
    const project = await projectStore.createProject(data)
    showCreateProjectDialog.value = false
    // Refresh projects
    await fetchProjects()
    // Navigate to project dashboard
    if (project?.uuid || project?.id) {
      navigateTo({ name: 'projectDashboard', params: { id: project.id ?? project.uuid } })
    }
  } catch (error) {
    console.error('Failed to create project:', error)
  } finally {
    isCreatingProject.value = false
  }
}

// Handle selection creation success
const handleCreateSelectionSuccess = async () => {
  showCreateSelectionDialog.value = false
  await fetchSelections()
}

// Handle proofing creation success
const handleCreateProofingSuccess = async () => {
  showCreateProofingDialog.value = false
  await fetchProofing()
}

// Handle raw file creation success
const handleCreateRawFileSuccess = async () => {
  showCreateRawFileDialog.value = false
  await fetchRawFiles()
}

// Memora plan (tier) from user store
const memoraTier = computed(() => userStore.user?.memora_tier ?? 'starter')
const planLabel = computed(() => tierDisplayName(memoraTier.value))
const planBadgeLabel = computed(() => (memoraTier.value === 'byo' ? 'BYO' : planLabel.value))
const hasPaidPlan = computed(() => {
  const t = memoraTier.value
  return t !== 'starter' && t !== null && t !== undefined
})
const FEATURE_SUMMARY_ORDER = ['proofing', 'raw_files']
const tierSummary = computed(() => {
  const parts = []
  parts.push(formatBytes(totalStorage.value) + ' storage')
  if (projectLimit.value != null) {
    parts.push(`${projectCount.value} / ${projectLimit.value} projects`)
  } else {
    parts.push(`${projectCount.value} projects`)
  }
  if (collectionLimit.value != null) {
    parts.push(`${collectionCount.value} / ${collectionLimit.value} collections`)
  } else {
    parts.push(`${collectionCount.value} collections`)
  }
  const enabled = (features.value || []).filter((f) => FEATURE_SUMMARY_ORDER.includes(f))
  if (enabled.length) {
    const ordered = FEATURE_SUMMARY_ORDER.filter((f) => enabled.includes(f))
    parts.push(ordered.map((f) => featureLabel(f)).join(', '))
  }
  return parts.join(' · ')
})
const tierBadgeClass = computed(() => {
  const t = memoraTier.value
  if (t === 'pro') return 'bg-amber-500/25 text-amber-800 dark:text-amber-200 border-amber-500/40'
  if (t === 'byo') return 'bg-purple-500/25 text-purple-800 dark:text-purple-200 border-purple-500/40'
  return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30'
})

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
    .slice(0, 5)
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
    .slice(0, 5)
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
    .slice(0, 5)
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
    .slice(0, 5)
})

// Recent Raw Files - get from store
const recentRawFiles = computed(() => {
  const allRawFiles = rawFileStore.rawFiles || []
  return allRawFiles
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 5)
})

// Storage and usage data
const totalStorage = ref(5 * 1024 * 1024 * 1024)
const usedStorage = ref(0)
const projectCount = ref(0)
const projectLimit = ref(null)
const collectionCount = ref(0)
const collectionLimit = ref(null)
const proofingCount = ref(0)
const proofingLimit = ref(null)
const selectionCount = ref(0)
const selectionLimit = ref(null)
const freeStorage = computed(() => totalStorage.value - usedStorage.value)
const storagePercentage = computed(() => {
  if (totalStorage.value === 0) return 0
  return Math.round((usedStorage.value / totalStorage.value) * 100)
})

const projectLimitReached = computed(() => {
  const limit = projectLimit.value
  if (limit == null) return false
  return projectCount.value >= limit
})

const collectionLimitReached = computed(() => {
  const limit = collectionLimit.value
  if (limit == null) return false
  return collectionCount.value >= limit
})

const proofingLimitReached = computed(() => {
  const limit = proofingLimit.value
  if (limit == null) return false
  return proofingCount.value >= limit
})

const selectionLimitReached = computed(() => {
  const limit = selectionLimit.value
  if (limit == null) return false
  return selectionCount.value >= limit
})

const showLimitUpgradeBanner = computed(() => projectLimitReached.value || proofingLimitReached.value || selectionLimitReached.value)

// Format bytes helper
const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const { formatDate } = useFormatDate()

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

// Fetch raw files independently
const fetchRawFiles = async () => {
  try {
    loadingStates.rawFiles.value = true
    await rawFileStore.fetchAllRawFiles({ perPage: 10 })
  } catch (error) {
    console.error('Failed to fetch raw files:', error)
  } finally {
    loadingStates.rawFiles.value = false
  }
}

// Fetch storage usage independently
const fetchStorage = async () => {
  try {
    loadingStates.storage.value = true
    const storageData = await authApi.getStorage()
    usedStorage.value = storageData.total_used_bytes || 0
    if (storageData.total_storage_bytes) {
      totalStorage.value = storageData.total_storage_bytes
    }
    projectCount.value = storageData.project_count ?? 0
    projectLimit.value = storageData.project_limit ?? null
    collectionCount.value = storageData.collection_count ?? 0
    collectionLimit.value = storageData.collection_limit ?? null
    proofingCount.value = storageData.proofing_count ?? 0
    proofingLimit.value = storageData.proofing_limit ?? null
    selectionCount.value = storageData.selection_count ?? 0
    selectionLimit.value = storageData.selection_limit ?? null
    if (userStore.user && (storageData.memora_features || storageData.memora_capabilities)) {
      userStore.updateUser({
        ...(storageData.memora_features && { memora_features: storageData.memora_features }),
        ...(storageData.memora_capabilities && { memora_capabilities: storageData.memora_capabilities }),
      })
    }
  } catch (error) {
    console.error('Failed to fetch storage usage:', error)
    // On error, keep default values (5GB)
  } finally {
    loadingStates.storage.value = false
  }
}

const onStorageShouldRefresh = () => fetchStorage()

// Fetch data on mount - only load data for features the user's plan includes
onMounted(async () => {
  await userStore.fetchSelectedProducts()

  if (hasMemora.value) {
    fetchCollections()
    fetchProjects()
    if (canAccessSelection.value) fetchSelections()
    else loadingStates.selections.value = false
    if (canAccessProofing.value) fetchProofing()
    else loadingStates.proofing.value = false
    if (canAccessRawFiles.value) fetchRawFiles()
    else loadingStates.rawFiles.value = false
  }

  fetchStorage()
  window.addEventListener('storage:shouldRefresh', onStorageShouldRefresh)
})

onUnmounted(() => {
  window.removeEventListener('storage:shouldRefresh', onStorageShouldRefresh)
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

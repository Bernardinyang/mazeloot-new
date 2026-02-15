<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-primary-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900 scroll-smooth overflow-x-hidden">
    <!-- Announcement banner (dismissible) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-full"
    >
      <div
        v-if="showBanner"
        class="relative isolate overflow-hidden dark:bg-gradient-to-r dark:from-white/5 dark:via-white/5 dark:to-white/[0.03] light:bg-gradient-to-r light:from-indigo-50/80 light:via-purple-50/60 light:to-pink-50/80 backdrop-blur-xl dark:border-b dark:border-white/10 light:border-b light:border-indigo-200/50 px-3 py-2.5 sm:px-6 sm:py-3.5 shadow-sm"
      >
        <!-- Animated gradient background -->
        <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        <!-- Subtle glow effect -->
        <div aria-hidden="true" class="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-primary-500/10 to-transparent blur-xl" />
        
        <!-- Mobile: Stacked layout -->
        <div class="relative z-10 flex flex-col gap-2 sm:hidden">
          <!-- Top row: Badge and Dismiss -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 rounded-lg dark:bg-white/10 light:bg-white/60 px-2 py-1 backdrop-blur-sm">
              <svg class="size-3.5 dark:text-primary-400 light:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span class="text-[10px] font-semibold tracking-wide dark:text-primary-300 light:text-indigo-700">Launching soon</span>
            </div>
            <button
              type="button"
              class="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg dark:text-gray-300 light:text-gray-600 transition-all duration-200 dark:hover:bg-white/10 light:hover:bg-gray-200/60 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:focus-visible:outline-white light:focus-visible:outline-gray-900 touch-manipulation"
              aria-label="Dismiss banner"
              @click="dismissBanner"
            >
              <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
          
          <!-- Message -->
          <p class="text-xs leading-5 dark:text-gray-200 light:text-gray-700">
            Join the waitlist for early access.
          </p>
          
          <!-- CTA Button - Full width on mobile -->
          <RouterLink
            :to="{ name: 'waitlist' }"
            class="group relative flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <span>Join waitlist</span>
            <svg class="size-3.5 transition-transform group-active:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </RouterLink>
        </div>
        
        <!-- Desktop: Horizontal layout -->
        <div class="relative z-10 hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
          <!-- Content wrapper -->
          <div class="flex flex-1 flex-wrap items-center gap-3 sm:gap-4">
            <!-- Badge with icon -->
            <div class="flex items-center gap-2.5">
              <div class="flex items-center gap-2 rounded-lg dark:bg-white/10 light:bg-white/60 px-2.5 py-1.5 backdrop-blur-sm">
                <svg class="size-4 dark:text-accent-200 light:text-accent-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span class="text-xs font-semibold tracking-wide dark:text-accent-200 light:text-accent-700">Launching soon</span>
              </div>
            </div>
            
            <!-- Message -->
            <p class="flex-1 text-sm leading-6 dark:text-gray-200 light:text-gray-700 sm:text-base">
              Join the waitlist to be notified when we launch and get early access.
            </p>
            
            <!-- CTA Button -->
            <RouterLink
              :to="{ name: 'waitlist' }"
              class="group relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-400 hover:to-accent-400 hover:shadow-xl hover:shadow-primary-500/30 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <span>Join waitlist</span>
              <svg class="size-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </RouterLink>
          </div>
          
          <!-- Dismiss button -->
          <button
            type="button"
            class="relative z-10 -m-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg dark:text-gray-300 light:text-gray-600 transition-all duration-200 dark:hover:bg-white/10 light:hover:bg-gray-200/60 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:focus-visible:outline-white light:focus-visible:outline-gray-900"
            aria-label="Dismiss banner"
            @click="dismissBanner"
          >
            <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <PublicNav />

    <!-- 1. Hero: left copy, right image fills the rest -->
    <section class="relative flex min-h-screen overflow-hidden dark:bg-[#0f0f23] light:bg-white">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary-500/15 blur-[100px] -z-10" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent-500/10 blur-[80px] -z-10" aria-hidden="true" />
      <div class="relative z-10 flex min-h-screen w-full flex-col lg:flex-row">
        <div class="relative z-10 flex shrink-0 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:max-w-3xl lg:pl-12 lg:pr-12 xl:pl-24 xl:pr-20">
          <p class="text-xs sm:text-sm font-medium uppercase tracking-widest text-cyan-400">Built for creatives who care about the details</p>
          <h1 class="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight dark:text-white light:text-gray-900 lg:text-5xl xl:text-6xl lg:leading-[1.08]">
            Your best work—delivered the way you imagined
          </h1>
          <p class="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed dark:text-gray-300 light:text-gray-600">
            Stop juggling emails and random links. One beautiful workflow: share a gallery, get clear feedback, deliver finals and raws—so you can focus on shooting, not spreadsheets.
          </p>
          <ul class="mt-4 sm:mt-6 space-y-2 text-sm sm:text-base dark:text-gray-400 light:text-gray-600">
            <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-cyan-400 shrink-0" aria-hidden="true" /><span class="break-words">Selection → Proofing → Collection → Raw files</span></li>
            <li class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-pink-400 shrink-0" aria-hidden="true" /><span class="break-words">One link per project—clients never need an account</span></li>
          </ul>
          <div class="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
            <Button class="inline-flex h-11 sm:h-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0f0f23] light:focus-visible:ring-offset-white" @click="router.push({ name: 'register' })">Get started</Button>
            <button type="button" class="flex h-11 sm:h-12 items-center justify-center rounded-xl dark:border-white/20 light:border-gray-300 dark:bg-white/5 light:bg-gray-50 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium dark:text-white/90 light:text-gray-900 transition-all duration-200 dark:hover:border-white/30 dark:hover:bg-white/10 light:hover:border-gray-400 light:hover:bg-gray-100 dark:hover:text-white light:hover:text-gray-900 hover:-translate-y-0.5" @click="router.push({ name: 'memora' })">Learn more →</button>
          </div>
          <p class="mt-4 sm:mt-6 text-xs sm:text-sm dark:text-gray-500 light:text-gray-600">No credit card required.</p>
        </div>
        <div class="hero-dashboard-wrap relative z-0 min-h-[20rem] flex-1 lg:min-h-0">
          <div class="absolute inset-0 -z-10 shadow-[inset_8px_0_24px_-8px_rgba(0,0,0,0.4)]" aria-hidden="true" />
          <img src="/images/landing/hero-dashboard.png" alt="Dashboard overview" class="absolute inset-0 -z-10 h-full w-full object-cover object-left-top" width="800" height="480" loading="eager" decoding="async" fetchpriority="high" />
        </div>
      </div>
    </section>

    <!-- 2b. Logo cloud -->
    <section class="relative py-12 sm:py-16">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="logo-marquee overflow-hidden" aria-hidden="true">
          <div class="logo-marquee__track flex shrink-0 items-center gap-x-12">
            <div class="flex shrink-0 items-center" aria-label="Transistor"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="Reform"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="Tuple"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="SavvyCal"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="Statamic"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="Transistor"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/transistor-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="Reform"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/reform-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="Tuple"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/tuple-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="SavvyCal"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/savvycal-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
            <div class="flex shrink-0 items-center" aria-label="Statamic"><img width="158" height="48" src="https://tailwindcss.com/plus-assets/img/logos/158x48/statamic-logo-white.svg" alt="" class="h-12 w-auto object-contain dark:opacity-100 light:brightness-0" loading="lazy" decoding="async" /></div>
          </div>
        </div>
        <div class="mt-12 flex justify-center">
          <div class="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full dark:bg-white/[0.07] light:bg-gray-100/80 backdrop-blur-sm px-5 py-2.5 text-sm dark:text-gray-300 light:text-gray-700 ring-1 dark:ring-white/10 light:ring-gray-300/50">
            <span>Trusted by creatives who care about client experience.</span>
            <RouterLink :to="{ name: 'products' }" class="font-medium dark:text-cyan-400 light:text-cyan-600 transition-colors dark:hover:text-cyan-300 light:hover:text-cyan-700">
              See how it works
              <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. How Mazeloot works (step cards) -->
    <section id="how-it-works" class="relative scroll-mt-20 py-16 md:py-20" aria-labelledby="how-it-works-heading">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div class="text-center mb-12 sm:mb-16">
          <p class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-600/50 dark:text-cyan-300 light:text-cyan-600 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">Your workflow</p>
          <h2 id="how-it-works-heading" class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight dark:text-white light:text-gray-900 bg-gradient-to-r dark:from-white dark:to-gray-300 light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent px-4">
            From shoot to delivery—no chaos
          </h2>
          <p class="mx-auto mt-4 sm:mt-5 max-w-xl text-center text-base sm:text-lg dark:text-gray-300 light:text-gray-600 leading-relaxed px-4">
            One link per project. Clients see your work, pick favorites, give feedback, and get their files—without you playing email tag.
          </p>
        </div>
        <div class="mt-12 sm:mt-16 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6 stagger-children">
          <div class="group relative flex flex-col overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 transition-all duration-300 dark:hover:border-purple-500/40 light:hover:border-purple-500/60 dark:hover:bg-white/10 light:hover:bg-gray-50 hover:shadow-2xl dark:hover:shadow-purple-500/20 light:hover:shadow-purple-500/30 hover:-translate-y-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span class="absolute right-3 top-3 sm:right-4 sm:top-4 text-5xl sm:text-6xl md:text-7xl font-bold tabular-nums dark:bg-gradient-to-br dark:from-purple-200/10 dark:to-purple-300/10 light:bg-gradient-to-br light:from-purple-400/30 light:to-purple-500/40 bg-clip-text text-transparent dark:blur-[0.5px] light:blur-[0px] font-mono tracking-tighter" style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;" aria-hidden="true">01</span>
            <div class="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-600/50 group-hover:scale-110 transition-transform duration-300">
              <FolderOpen class="size-6 sm:size-6 sm:size-7 dark:text-purple-400 light:text-purple-600" aria-hidden="true" />
            </div>
            <h3 class="relative z-10 mt-4 sm:mt-5 text-lg sm:text-xl font-bold dark:text-white light:text-gray-900">Selection</h3>
            <p class="relative z-10 mt-2 text-xs sm:text-sm leading-6 dark:text-gray-300 light:text-gray-600">Send one link. Clients see your work, pick favorites, and react—no sign-up, no app.</p>
          </div>
          <div class="group relative flex flex-col overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 transition-all duration-300 hover:border-blue-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span class="absolute right-3 top-3 sm:right-4 sm:top-4 text-5xl sm:text-6xl md:text-7xl font-bold tabular-nums dark:bg-gradient-to-br dark:from-blue-200/10 dark:to-blue-300/10 light:bg-gradient-to-br light:from-blue-400/30 light:to-blue-500/40 bg-clip-text text-transparent dark:blur-[0.5px] light:blur-[0px] font-mono tracking-tighter" style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;" aria-hidden="true">02</span>
            <div class="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-600/50 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare class="size-6 sm:size-6 sm:size-7 dark:text-blue-400 light:text-blue-600" aria-hidden="true" />
            </div>
            <h3 class="relative z-10 mt-4 sm:mt-5 text-lg sm:text-xl font-bold dark:text-white light:text-gray-900">Proofing</h3>
            <p class="relative z-10 mt-2 text-xs sm:text-sm leading-6 dark:text-gray-300 light:text-gray-600">Comments and revision requests in one place. You get a clear list—no digging through inboxes.</p>
          </div>
          <div class="group relative flex flex-col overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 transition-all duration-300 hover:border-green-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span class="absolute right-3 top-3 sm:right-4 sm:top-4 text-5xl sm:text-6xl md:text-7xl font-bold tabular-nums dark:bg-gradient-to-br dark:from-green-200/10 dark:to-green-300/10 light:bg-gradient-to-br light:from-green-400/30 light:to-green-500/40 bg-clip-text text-transparent dark:blur-[0.5px] light:blur-[0px] font-mono tracking-tighter" style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;" aria-hidden="true">03</span>
            <div class="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-600/50 group-hover:scale-110 transition-transform duration-300">
              <Check class="size-6 sm:size-7 dark:text-green-400 light:text-green-600" aria-hidden="true" />
            </div>
            <h3 class="mt-4 sm:mt-5 text-lg sm:text-xl font-bold dark:text-white light:text-gray-900">Collection</h3>
            <p class="mt-2 text-xs sm:text-sm leading-6 dark:text-gray-300 light:text-gray-600">Deliver finals with one link. Clients download when they’re ready—you look pro, they’re happy.</p>
          </div>
          <div class="group relative flex flex-col overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 transition-all duration-300 hover:border-amber-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span class="absolute right-4 top-4 text-6xl sm:text-7xl font-bold tabular-nums dark:bg-gradient-to-br dark:from-amber-200/10 dark:to-amber-300/10 light:bg-gradient-to-br light:from-amber-400/30 light:to-amber-500/40 bg-clip-text text-transparent dark:blur-[0.5px] light:blur-[0px] font-mono tracking-tighter" style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;" aria-hidden="true">04</span>
            <div class="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-600/50 group-hover:scale-110 transition-transform duration-300">
              <Lock class="size-6 sm:size-6 sm:size-7 dark:text-amber-400 light:text-amber-600" aria-hidden="true" />
            </div>
            <h3 class="relative z-10 mt-4 sm:mt-5 text-lg sm:text-xl font-bold dark:text-white light:text-gray-900">Raw files</h3>
            <p class="relative z-10 mt-2 text-xs sm:text-sm leading-6 dark:text-gray-300 light:text-gray-600">Keep RAWs organized, link to edits, deliver originals securely. Optional PIN so only the right people get access.</p>
          </div>
        </div>
        <p class="mt-12 text-center">
          <RouterLink
            :to="{ name: 'memora' }"
            class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5"
          >
            See how it works <span aria-hidden="true">→</span>
          </RouterLink>
        </p>
      </div>
    </section>

    <!-- 4. Featured (dark two-column: copy + list + image) -->
    <section id="features" class="relative scroll-mt-20 overflow-hidden py-16 sm:py-20">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div class="lg:max-w-lg">
            <p class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-500/10 border border-primary-600/50 dark:text-primary-300 light:text-primary-600 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">Built for how you work</p>
            <h2 class="mt-3 text-pretty text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight dark:text-white light:text-gray-900 bg-gradient-to-r dark:from-white dark:to-gray-300 light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent">
              Less busywork. More time behind the lens.
            </h2>
            <p class="mt-4 sm:mt-5 text-base sm:text-lg leading-7 sm:leading-8 dark:text-gray-300 light:text-gray-600">
              One place for galleries, proofing, and delivery. Your clients get a smooth experience; you get your evenings back.
            </p>
            <ul class="mt-10 space-y-4" role="list">
              <li class="group relative flex gap-4 rounded-xl border dark:border-white/10 light:border-gray-200 dark:bg-white/5 light:bg-white p-4 backdrop-blur-xl transition-all duration-200 hover:border-cyan-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5">
                <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-600/50 dark:text-cyan-400 light:text-cyan-600 group-hover:scale-110 transition-transform duration-300">
                  <FolderOpen class="size-5" aria-hidden="true" />
                </span>
                <div class="relative z-10">
                  <span class="font-bold dark:text-white light:text-gray-900">Galleries that feel like you</span>
                  <p class="mt-1 text-sm leading-6 dark:text-gray-300 light:text-gray-600">Organize by shoot or project. One link, no client account—just your work, presented right.</p>
                </div>
              </li>
              <li class="group relative flex gap-4 rounded-xl border dark:border-white/10 light:border-gray-200 dark:bg-white/5 light:bg-white p-4 backdrop-blur-xl transition-all duration-200 hover:border-pink-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-0.5">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 border border-pink-600/50 dark:text-pink-400 light:text-pink-600">
                  <MessageSquare class="size-5" aria-hidden="true" />
                </span>
                <div>
                  <span class="font-semibold dark:text-white light:text-gray-900">Proofing that actually gets used</span>
                  <p class="mt-1 text-sm leading-6 dark:text-gray-400 light:text-gray-600">Favorites, comments, and revision requests in one thread. No more “which email was that?”</p>
                </div>
              </li>
              <li class="group relative flex gap-4 rounded-xl border dark:border-white/10 light:border-gray-200 dark:bg-white/5 light:bg-white p-4 backdrop-blur-xl transition-all duration-200 hover:border-emerald-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5">
                <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-600/50 dark:text-emerald-400 light:text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                  <Lock class="size-5" aria-hidden="true" />
                </span>
                <div class="relative z-10">
                  <span class="font-bold dark:text-white light:text-gray-900">You stay in control</span>
                  <p class="mt-1 text-sm leading-6 dark:text-gray-300 light:text-gray-600">Passwords, watermarks, and download limits. Your work, your rules.</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="relative lg:pl-0">
            <div class="overflow-hidden rounded-2xl border dark:border-white/10 light:border-gray-200 dark:bg-white/5 light:bg-white shadow-2xl shadow-black/30 ring-1 dark:ring-white/10 light:ring-gray-200/50 aspect-[3/4] min-h-[280px] sm:min-h-[380px] md:min-h-[480px] lg:ml-auto lg:max-w-lg lg:aspect-[3/4] lg:min-h-0 xl:max-w-xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Collaborative workflow and gallery management"
                class="size-full object-cover object-top"
                width="800"
                height="1067"
                loading="lazy"
                decoding="async"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4b. Bento grid -->
    <section class="relative py-16 sm:py-20">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div class="text-center mb-12 sm:mb-16">
          <p class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-600/50 dark:text-emerald-300 light:text-emerald-600 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">Your delivery, your brand</p>
          <h2 class="mx-auto mt-3 max-w-2xl text-balance text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight dark:text-white light:text-gray-900 dark:bg-gradient-to-r dark:from-white dark:to-gray-300 light:bg-gradient-to-r light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent px-4">
            Present your work the way it deserves
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-center text-sm sm:text-base dark:text-gray-300 light:text-gray-600 px-4">
            One link. Clients view, pick, comment, and download. You look polished; they get a great experience.
          </p>
        </div>
        <div class="mt-14 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:grid-rows-[1fr_1fr] lg:gap-6">
          <!-- Card 1: tall left -->
          <div class="group relative z-10 flex min-h-0 flex-col overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="relative z-10 shrink-0 p-4 sm:p-6 md:p-8">
              <span class="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl dark:bg-primary-500/50 light:bg-primary-500/20 text-xs sm:text-sm font-bold dark:text-primary-300 light:text-primary-600">1</span>
              <h3 class="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold tracking-tight dark:text-white light:text-gray-900">Galleries that wow</h3>
              <p class="mt-2 text-xs sm:text-sm leading-6 dark:text-gray-400 light:text-gray-600">One link. Clients view and pick on any device—no sign-up, no app. Your work, front and center.</p>
            </div>
            <div class="relative z-0 min-h-[180px] sm:min-h-[220px] md:min-h-[280px] flex-1 lg:min-h-0">
              <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" alt="Gallery on device" class="absolute inset-0 -z-10 size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]" width="800" height="600" loading="lazy" decoding="async" />
              <div class="absolute inset-0 -z-10 dark:bg-gradient-to-t dark:from-[#0f0f23]/80 light:bg-gradient-to-t light:from-white/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
          <!-- Card 2: real-time -->
          <div class="group relative flex flex-col overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 lg:col-start-2 lg:row-start-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl dark:bg-accent-500/50 light:bg-accent-500/20 text-sm font-bold dark:text-accent-300 light:text-accent-600">2</span>
              <h3 class="mt-4 text-xl font-semibold tracking-tight dark:text-white light:text-gray-900">Always in sync</h3>
              <p class="mt-2 text-sm leading-6 dark:text-gray-400 light:text-gray-600">Selections and comments update in real time. No “did you get my email?”—everyone’s on the same page.</p>
            </div>
            <div class="relative h-44 shrink-0 overflow-hidden sm:h-52">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80" alt="Collaboration" class="size-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]" width="600" height="208" loading="lazy" decoding="async" />
              <div class="absolute inset-0 dark:bg-gradient-to-t dark:from-[#0f0f23]/60 light:bg-gradient-to-t light:from-white/60 to-transparent pointer-events-none" />
            </div>
          </div>
          <!-- Card 3: security -->
          <div class="group relative flex flex-col overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 lg:col-start-2 lg:row-start-2">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
              <span class="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl dark:bg-sky-500/50 light:bg-sky-500/20 text-xs sm:text-sm font-bold dark:text-sky-300 light:text-sky-600">3</span>
              <h3 class="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold tracking-tight dark:text-white light:text-gray-900">Your work, protected</h3>
              <p class="mt-2 text-xs sm:text-sm leading-6 dark:text-gray-400 light:text-gray-600">Passwords, watermarks, download limits. You control who sees what and when.</p>
            </div>
            <div class="relative h-32 sm:h-36 md:h-44 shrink-0 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1614064548230-8aa2fc22f8b2?w=600&q=80" alt="Secure delivery" class="size-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]" width="600" height="176" loading="lazy" decoding="async" />
              <div class="absolute inset-0 dark:bg-gradient-to-t dark:from-[#0f0f23]/60 light:bg-gradient-to-t light:from-white/60 to-transparent pointer-events-none" />
            </div>
          </div>
          <!-- Card 4: tall right -->
          <div class="group relative z-10 flex min-h-0 flex-col overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 transition-all duration-300 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 lg:col-start-3 lg:row-span-2 lg:row-start-1">
            <div class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="relative z-10 shrink-0 p-4 sm:p-6 md:p-8">
              <span class="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl dark:bg-rose-500/50 light:bg-rose-500/20 text-xs sm:text-sm font-bold dark:text-rose-300 light:text-rose-600">4</span>
              <h3 class="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold tracking-tight dark:text-white light:text-gray-900">Your brand, every touchpoint</h3>
              <p class="mt-2 text-xs sm:text-sm leading-6 dark:text-gray-400 light:text-gray-600">Your logo and style on every client page. One workflow from first share to final delivery.</p>
            </div>
            <div class="relative z-0 min-h-[180px] sm:min-h-[220px] md:min-h-[280px] flex-1 lg:min-h-0">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Workspace" class="absolute inset-0 -z-10 size-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]" width="800" height="600" loading="lazy" decoding="async" />
              <div class="absolute inset-0 -z-10 dark:bg-gradient-to-t dark:from-[#0f0f23]/80 light:bg-gradient-to-t light:from-white/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4c. Content section (long-form) -->
    <section class="relative isolate px-6 py-16 sm:py-20 lg:px-8">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,theme(colors.indigo.500/0.15),transparent)]" aria-hidden="true" />
      <div class="relative z-10 mx-auto grid max-w-5xl grid-cols-1 items-start gap-y-12 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0">
        <div class="flex flex-col gap-y-10 lg:max-w-lg lg:pt-2">
          <div>
            <p class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-600/50 dark:text-sky-300 light:text-sky-600 text-sm font-medium mb-6 backdrop-blur-sm">One home for your client work</p>
            <h2 class="mt-3 text-pretty text-3xl font-bold tracking-tight dark:text-white light:text-gray-900 sm:text-4xl dark:bg-gradient-to-r dark:from-white dark:to-gray-300 light:bg-gradient-to-r light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent">Stop duct-taping five apps together</h2>
            <p class="mt-4 text-lg leading-8 dark:text-gray-300 light:text-gray-600">From first upload to final delivery—galleries, proofing, collections, and raws. One place, one link. No more WeTransfer + email + spreadsheet.</p>
          </div>
          <div class="space-y-4 sm:space-y-6 text-sm sm:text-base dark:text-gray-400 light:text-gray-600">
            <p>One link. Clients pick favorites, leave comments, and request revisions in one place. You get a clear list of what to edit and when to deliver—no digging through email, no “which version?”</p>
            <ul role="list" class="space-y-5">
              <li class="flex gap-3">
                <Check class="mt-0.5 size-5 shrink-0 dark:text-primary-500 light:text-primary-600" aria-hidden="true" />
                <span><strong class="font-semibold dark:text-white light:text-gray-900">Galleries & sharing.</strong> Organize by shoot or project. Passwords and watermarks when you want them. Clients view on any device—no app.</span>
              </li>
              <li class="flex gap-3">
                <Check class="mt-0.5 size-5 shrink-0 dark:text-primary-500 light:text-primary-600" aria-hidden="true" />
                <span><strong class="font-semibold dark:text-white light:text-gray-900">Proofing & feedback.</strong> Favorites, comments, revision requests—one thread. Full history so you never lose context.</span>
              </li>
              <li class="flex gap-3">
                <Check class="mt-0.5 size-5 shrink-0 dark:text-primary-500 light:text-primary-600" aria-hidden="true" />
                <span><strong class="font-semibold dark:text-white light:text-gray-900">Delivery & raw files.</strong> Deliver finals with a link. Store and share RAWs with optional PIN—no USBs, no random file hosts.</span>
              </li>
            </ul>
            <p class="dark:text-gray-400 light:text-gray-600">Updates sync in real time. Add your logo and style so every client touchpoint feels like you.</p>
            <div class="pt-4">
              <h3 class="text-xl font-bold tracking-tight dark:text-white light:text-gray-900">Built for creatives, not IT.</h3>
              <p class="mt-3 dark:text-gray-400 light:text-gray-600">Upload, share one link, and let clients do the rest. No mandatory apps or accounts—just a link and a browser. You focus on the work; we handle the pipeline.</p>
            </div>
          </div>
        </div>
        <div class="lg:sticky lg:top-24 lg:flex lg:justify-center lg:pl-4">
          <div class="aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 shadow-2xl lg:max-w-lg">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Collaborative workflow"
              class="size-full object-cover object-top"
              width="800"
              height="1067"
              loading="lazy"
              decoding="async"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Pricing (dark, two tiers) -->
    <section id="pricing" class="relative scroll-mt-20 isolate px-6 py-16 sm:py-20 lg:px-8">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative z-10 mx-auto max-w-7xl">
        <div class="mx-auto max-w-3xl text-center mb-12 sm:mb-16 px-4">
          <p class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent-500/10 border border-accent-600/50 text-accent-300 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">Pricing</p>
          <h2 class="mt-3 text-balance text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight dark:text-white light:text-gray-900 dark:bg-gradient-to-r dark:from-white dark:to-gray-300 light:bg-gradient-to-r light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent">
            Pricing that grows with you
          </h2>
          <p class="mt-4 text-base sm:text-lg dark:text-gray-300 light:text-gray-600">
            From side gigs to full books—galleries, proofing, and delivery without the enterprise price tag.
          </p>
          <div v-if="!pricingLoading && !pricingError" class="relative z-10 mt-6 flex flex-col items-center gap-2">
            <p class="text-sm dark:text-gray-500 light:text-gray-700">Prices in</p>
            <select
              :value="currencyStore.currency"
              aria-label="Currency"
              class="relative z-10 rounded-xl border dark:border-white/20 light:border-gray-300 dark:bg-white/5 light:bg-white px-4 py-2.5 text-sm font-medium dark:text-white light:text-gray-900 shadow-sm ring-1 dark:ring-white/10 light:ring-gray-200/50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors"
              @change="currencyStore.setCurrency($event.target.value)"
            >
              <option v-for="c in SUPPORTED_CURRENCIES" :key="c.code" :value="c.code">
                {{ c.label }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="pricingLoading" class="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
          <div v-for="i in 2" :key="i" class="rounded-2xl border dark:border-white/10 light:border-gray-200 dark:bg-white/5 light:bg-white p-4 sm:p-8 animate-pulse">
            <div class="h-6 w-24 rounded dark:bg-white/10 light:bg-gray-200" />
            <div class="mt-4 h-8 w-32 rounded dark:bg-white/10 light:bg-gray-200" />
            <div class="mt-6 h-4 w-full rounded dark:bg-white/10 light:bg-gray-200" />
            <div class="mt-4 space-y-3">
              <div class="h-4 w-full rounded dark:bg-white/10 light:bg-gray-200" />
              <div class="h-4 w-11/12 rounded dark:bg-white/10 light:bg-gray-200" />
              <div class="h-4 w-3/4 rounded dark:bg-white/10 light:bg-gray-200" />
            </div>
            <div class="mt-8 h-11 w-full rounded-lg dark:bg-white/10 light:bg-gray-200" />
          </div>
        </div>
        <div v-else-if="pricingError" class="mx-auto mt-14 max-w-4xl rounded-xl border border-red-500/20 dark:bg-red-500/5 light:bg-red-50 px-6 py-8 text-center dark:text-red-400 light:text-red-600">
          {{ pricingError }}
          <RouterLink :to="{ name: 'pricing' }" class="mt-4 inline-block text-sm font-medium dark:text-primary-400 light:text-primary-600 hover:dark:text-primary-300 hover:light:text-primary-700 transition-colors">View pricing page →</RouterLink>
        </div>
        <div v-else class="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2 stagger-children">
          <div
            v-for="tier in pricingTiers"
            :key="tier.id"
            :class="[
              'relative flex flex-col rounded-2xl border p-4 sm:p-8 backdrop-blur-xl transition-all duration-200 sm:p-10',
              tier.popular
                ? 'border-primary-500/50 dark:bg-primary-500/10 light:bg-gradient-to-br light:from-primary-50 light:to-accent-50 shadow-lg shadow-primary-500/10 dark:shadow-primary-500/20 light:shadow-primary-500/10'
                : 'dark:border-white/10 light:border-gray-300 dark:bg-white/5 light:bg-white light:shadow-sm light:ring-1 light:ring-gray-200/50 hover:border-primary-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 light:hover:shadow-md light:hover:ring-gray-300/50 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1',
            ]"
          >
            <div v-if="tier.popular" class="absolute right-6 top-6">
              <span class="rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary-500/25">Popular</span>
            </div>
            <h3 :id="`tier-${tier.id}`" class="text-lg font-bold dark:text-white light:text-gray-900">{{ tier.name }}</h3>
            <div class="mt-3 flex flex-wrap items-baseline gap-2">
              <span v-if="tier.price_monthly_cents != null" class="text-3xl font-bold tabular-nums dark:text-white light:text-gray-900">
                {{ tier.price_monthly_cents === 0 ? 'Free' : formatPrice(tier) }}
              </span>
              <span v-else class="text-xl font-medium dark:text-gray-400 light:text-gray-600">See plan details</span>
              <span v-if="tier.price_monthly_cents != null" class="dark:text-gray-400 light:text-gray-600">/month</span>
            </div>
            <p v-if="tier.description" class="mt-4 text-sm leading-6 dark:text-gray-400 light:text-gray-600">{{ tier.description }}</p>
            <ul v-if="tier.features?.length" role="list" class="mt-6 flex-1 space-y-3 text-sm dark:text-gray-300 light:text-gray-600">
              <li v-for="feature in tier.features" :key="feature" class="flex gap-3">
                <Check class="mt-0.5 size-5 shrink-0 dark:text-primary-500 light:text-primary-600" aria-hidden="true" />
                <span>{{ feature }}</span>
              </li>
            </ul>
            <Button
              class="mt-8 w-full rounded-xl py-3.5 text-sm font-semibold border-0 transition-all duration-200 sm:mt-10"
              :class="tier.popular ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25 hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 light:focus-visible:ring-offset-white' : 'dark:bg-white/10 light:bg-gray-900 dark:text-white light:text-white border dark:border-white/10 light:border-gray-900 dark:hover:bg-white/15 light:hover:bg-gray-800 hover:-translate-y-0.5 light:shadow-md light:hover:shadow-lg focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 light:focus-visible:ring-offset-white'"
              :aria-describedby="`tier-${tier.id}`"
              @click="goToPricingStart(tier)"
            >
              Get started today
            </Button>
          </div>
        </div>
        <p class="relative z-10 mx-auto mt-8 text-center text-sm dark:text-gray-500 light:text-gray-700">
          <button
            type="button"
            class="relative z-10 font-medium dark:text-indigo-400 light:text-indigo-600 hover:dark:text-indigo-300 hover:light:text-indigo-700 focus:outline-none focus:underline transition-colors"
            @click="showComparisonSheet = true"
          >
            Compare all plans →
          </button>
        </p>
      </div>
    </section>

    <!-- Plan comparison sidebar -->
    <Sheet :open="showComparisonSheet" @update:open="showComparisonSheet = $event">
      <SheetContent side="right" class="w-full overflow-hidden flex flex-col p-0 gap-0 sm:max-w-[95vw] md:max-w-6xl lg:max-w-7xl dark:bg-gray-900 light:bg-white dark:border-white/10 light:border-gray-200 dark:text-gray-100 light:text-gray-900">
        <div class="shrink-0 border-b dark:border-white/10 light:border-gray-200 px-6 py-4">
          <h2 class="text-lg font-semibold dark:text-white light:text-gray-900">Plan comparison</h2>
          <p class="mt-1 text-sm dark:text-gray-400 light:text-gray-600">Compare features across plans</p>
        </div>
        <div class="flex-1 overflow-auto">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[600px] text-left text-sm" role="grid" aria-label="Plan comparison">
              <thead>
                <tr class="border-b dark:border-white/10 light:border-gray-200 dark:bg-white/5 light:bg-gray-50">
                  <th scope="col" class="py-3 pl-6 pr-3 font-semibold dark:text-white light:text-gray-900 w-44">Feature</th>
                  <th v-for="tier in pricingTiers" :key="tier.id" scope="col" class="py-3 px-3 font-semibold dark:text-white light:text-gray-900 text-center">{{ tier.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in comparisonTableRows"
                  :key="idx"
                  :class="[
                    'border-b dark:border-white/10 light:border-gray-200',
                    item.type === 'category' ? 'dark:bg-white/5 light:bg-gray-50' : 'dark:hover:bg-white/[0.04] light:hover:bg-gray-50',
                  ]"
                >
                  <template v-if="item.type === 'category'">
                    <td :colspan="pricingTiers.length + 1" class="py-2 pl-6 pr-3 text-xs font-semibold uppercase tracking-wider dark:text-gray-400 light:text-gray-600">
                      {{ item.category }}
                    </td>
                  </template>
                  <template v-else>
                    <td class="py-2.5 pl-6 pr-3 font-medium dark:text-gray-200 light:text-gray-700">{{ item.row.label }}</td>
                    <td
                      v-for="tier in pricingTiers"
                      :key="tier.id"
                      :class="['py-2.5 px-3 text-center', tier.popular && 'dark:bg-primary-500/10 light:bg-primary-50']"
                    >
                      <span v-if="getComparisonValue(item.row, tier.id) === 'check'" class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 dark:text-indigo-500 light:text-indigo-600" aria-hidden="true">
                        <Check class="size-3.5" />
                      </span>
                      <span v-else-if="getComparisonValue(item.row, tier.id) === 'dash'" class="dark:text-gray-500 light:text-gray-500" aria-hidden="true">—</span>
                      <span v-else class="dark:text-gray-300 light:text-gray-600">{{ getComparisonValue(item.row, tier.id) }}</span>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="shrink-0 border-t dark:border-white/10 light:border-gray-200 px-6 py-4 flex justify-end">
          <Button
            variant="destructive"
            class="rounded-xl"
            @click="showComparisonSheet = false"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>

    <!-- 7b. Testimonials -->
    <section
      id="testimonials"
      class="relative scroll-mt-20 isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      aria-label="Testimonials"
      @keydown="onTestimonialKeydown"
    >
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.500),transparent)] opacity-20" />
      <div class="relative z-10 mx-auto max-w-3xl lg:max-w-4xl">
        <div class="text-center mb-16">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-600/50 text-rose-300 text-sm font-medium mb-6 backdrop-blur-sm">Testimonials</span>
          <h2 class="mt-4 text-xl font-bold tracking-tight dark:text-white light:text-gray-900 sm:text-2xl md:text-3xl lg:text-[2rem] dark:bg-gradient-to-r dark:from-white dark:to-gray-300 light:bg-gradient-to-r light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent">Creatives like you</h2>
          <p class="mt-2 text-sm dark:text-gray-300 light:text-gray-600">Creatives who got tired of the email-and-WeTransfer shuffle</p>
        </div>
        <div
          class="testimonial-viewport relative mt-10 w-full overflow-hidden sm:mt-14"
          tabindex="0"
          role="region"
          aria-roledescription="Testimonial carousel"
          aria-label="Customer testimonials"
          style="touch-action: pan-y;"
          @mouseenter="testimonialPaused = true"
          @mouseleave="testimonialPaused = false"
          @focusin="testimonialPaused = true"
          @focusout="testimonialPaused = false"
          @touchstart="onTestimonialTouchStart"
          @touchmove="onTestimonialTouchMove"
          @touchend="onTestimonialTouchEnd"
        >
          <div
            class="testimonial-track flex w-full"
            :style="{
              transform: `translateX(-${testimonialIndex * (100 / testimonials.length)}%)`,
              width: `${testimonials.length * 100}%`,
            }"
          >
            <figure
              v-for="(t, i) in testimonials"
              :key="i"
              class="shrink-0 px-2 sm:px-4 md:px-6"
              :style="{ width: `${100 / testimonials.length}%` }"
              :aria-hidden="i !== testimonialIndex"
            >
              <blockquote class="text-center">
                <p
                  aria-live="polite"
                  class="relative rounded-xl border dark:border-white/10 light:border-gray-200 dark:bg-gradient-to-b dark:from-white/[0.08] dark:to-white/[0.02] light:bg-gradient-to-b light:from-gray-50 light:to-white py-8 px-4 shadow-xl dark:shadow-black/10 light:shadow-gray-200/50 sm:rounded-2xl sm:px-8 sm:py-10 md:px-12 md:py-14 md:text-2xl md:leading-9"
                >
                  <span aria-hidden="true" class="absolute left-3 top-5 text-4xl font-serif leading-none text-primary-400/30 select-none sm:left-6 sm:text-5xl md:left-8 md:text-6xl">“</span>
                  <span class="relative text-lg font-medium leading-7 dark:text-white light:text-gray-900 sm:text-xl sm:leading-8 md:leading-9">{{ t.quote }}</span>
                  <span aria-hidden="true" class="font-serif text-3xl leading-none text-primary-400/30 select-none sm:text-4xl md:text-5xl">”</span>
                </p>
              </blockquote>
              <figcaption class="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-5">
                <img
                  :src="t.avatar"
                  :alt="t.name"
                  class="size-12 rounded-full border-2 border-white/20 object-cover shadow-lg ring-2 ring-primary-500/20 sm:size-14"
                  width="56"
                  height="56"
                  loading="lazy"
                  decoding="async"
                >
                <div class="text-center sm:text-left">
                  <p class="font-semibold dark:text-white light:text-gray-900">{{ t.name }}</p>
                  <p class="mt-0.5 text-sm dark:text-gray-400 light:text-gray-600">{{ t.role }}</p>
                </div>
              </figcaption>
            </figure>
          </div>
          <!-- Progress bar -->
          <div
            v-if="testimonialAutoAdvance && !testimonialPaused"
            class="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-full bg-white/10"
            aria-hidden="true"
          >
            <div
              class="testimonial-progress h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400"
              :style="{ width: `${testimonialProgress}%` }"
            />
          </div>
          <!-- Controls: Hidden on mobile, shown on desktop -->
          <div class="hidden sm:flex mt-10 sm:mt-12 sm:flex-row sm:justify-center sm:gap-8 items-center">
            <div class="flex items-center gap-2 rounded-full dark:bg-white/5 light:bg-white py-2 pl-2 pr-3 ring-1 dark:ring-white/10 light:ring-gray-200/50">
              <button
                type="button"
                class="flex size-10 shrink-0 items-center justify-center rounded-full dark:text-white/80 light:text-gray-600 transition-all dark:hover:bg-white/15 light:hover:bg-gray-100 dark:hover:text-white light:hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 light:focus-visible:ring-offset-white"
                aria-label="Previous testimonial"
                @click="goPrevTestimonial"
              >
                <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div class="flex gap-1" role="tablist" aria-label="Testimonial slides">
                <button
                  v-for="(_, i) in testimonials"
                  :key="i"
                  type="button"
                  class="flex size-8 items-center justify-center rounded-full text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  :class="i === testimonialIndex ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' : 'dark:text-white/50 light:text-gray-400 dark:hover:bg-white/10 light:hover:bg-gray-100 dark:hover:text-white/80 light:hover:text-gray-900'"
                  :aria-label="`Testimonial ${i + 1} of ${testimonials.length}`"
                  :aria-selected="i === testimonialIndex"
                  role="tab"
                  @click="goToTestimonial(i)"
                >
                  {{ i + 1 }}
                </button>
              </div>
              <button
                type="button"
                class="flex size-10 shrink-0 items-center justify-center rounded-full dark:text-white/80 light:text-gray-600 transition-all dark:hover:bg-white/15 light:hover:bg-gray-100 dark:hover:text-white light:hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 light:focus-visible:ring-offset-white"
                aria-label="Next testimonial"
                @click="goNextTestimonial"
              >
                <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <span class="text-xs sm:text-sm tabular-nums dark:text-white/40 light:text-gray-500" aria-hidden="true">{{ testimonialIndex + 1 }} of {{ testimonials.length }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. CTA section -->
    <section id="cta" class="relative scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative z-10 isolate mx-auto max-w-7xl overflow-hidden rounded-3xl dark:bg-white/5 light:bg-white backdrop-blur-xl border dark:border-white/10 light:border-gray-200 px-6 py-16 shadow-2xl sm:px-12 sm:py-20 md:px-16 md:py-24 lg:flex lg:items-center lg:gap-16 lg:px-20 lg:py-20">
        <div class="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div class="absolute inset-0 -z-10">
          <div class="absolute left-1/2 top-0 h-[60%] w-[80%] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" aria-hidden="true" />
          <div class="absolute bottom-0 right-0 h-[40%] w-[50%] rounded-full bg-accent-500/15 blur-3xl" aria-hidden="true" />
        </div>
        <div class="relative z-10 mx-auto max-w-xl text-center lg:mx-0 lg:max-w-md lg:text-left px-4">
          <p class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-600/50 dark:text-cyan-300 light:text-cyan-600 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">Stop juggling. Start delivering.</p>
          <h2 class="mt-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white light:text-gray-900 dark:bg-gradient-to-r dark:from-white dark:via-primary-200 dark:to-accent-200 light:bg-gradient-to-r light:from-gray-900 light:via-primary-600 light:to-accent-600 bg-clip-text text-transparent">
            Your best work deserves a better pipeline
          </h2>
          <p class="mt-4 text-base sm:text-lg leading-6 sm:leading-7 dark:text-gray-300 light:text-gray-600">
            One link from selection to delivery. Look pro, save time, and let your clients actually enjoy the experience.
          </p>
          <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-5 lg:justify-start">
            <Button
              class="order-1 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5 border-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 light:focus-visible:ring-offset-white"
              @click="router.push({ name: 'register' })"
            >
              Get started free
            </Button>
            <button
              type="button"
              class="order-2 text-sm font-medium dark:text-gray-300 light:text-gray-600 underline-offset-4 dark:hover:text-white light:hover:text-gray-900 hover:underline"
              @click="router.push({ name: 'memora' })"
            >
              See how it works
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <p class="mt-6 text-sm dark:text-gray-500 light:text-gray-600">No credit card required.</p>
        </div>
        <div class="relative z-0 mt-16 h-80 lg:mt-8 lg:flex-1 lg:flex lg:items-end">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80"
              alt="Gallery and client workflow"
              class="absolute left-0 top-0 -z-10 w-[57rem] max-w-none rounded-2xl dark:bg-white/5 light:bg-white ring-1 dark:ring-white/10 light:ring-gray-200/50 shadow-2xl object-cover object-left-top"
              width="1824"
              height="1080"
              loading="lazy"
              decoding="async"
            >
          </div>
      </div>
    </section>

    <!-- 9. Newsletter -->
    <section id="newsletter" class="relative scroll-mt-20 isolate overflow-hidden py-12 sm:py-16 lg:py-20">
      <div aria-hidden="true" class="absolute inset-0 -z-10 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.12)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div class="max-w-xl lg:max-w-lg">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-600/50 dark:text-primary-300 light:text-primary-600 text-sm font-medium mb-6 backdrop-blur-sm">
              <Mail class="h-4 w-4" />
              <span>Newsletter</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-bold tracking-tight dark:text-white light:text-gray-900 sm:text-4xl lg:text-5xl dark:bg-gradient-to-r dark:from-white dark:to-gray-300 light:bg-gradient-to-r light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent">Stay in the loop</h2>
            <p class="mt-4 text-lg dark:text-gray-300 light:text-gray-600">Workflow tips, product updates, and ideas for delivering work you’re proud of. No spam.</p>
            <form class="mt-8 flex max-w-md flex-col gap-4" @submit.prevent="submitNewsletter">
              <div class="flex flex-col sm:flex-row gap-3">
                <label for="newsletter-email" class="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  v-model="newsletterEmail"
                  type="email"
                  name="email"
                  required
                  :disabled="newsletterSubmitting"
                  placeholder="Enter your email"
                  autocomplete="email"
                  class="flex-1 min-w-0 rounded-xl dark:bg-white/5 light:bg-white px-5 py-3.5 sm:py-4 text-base dark:text-white light:text-gray-900 ring-1 ring-inset dark:ring-white/10 light:ring-gray-200/50 placeholder:dark:text-gray-500 light:placeholder:text-gray-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 light:focus:ring-offset-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:ring-primary-500/50"
                >
                <button
                  type="submit"
                  :disabled="newsletterSubmitting"
                  class="group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 sm:px-8 py-3.5 sm:py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/25 hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <span v-if="newsletterSubmitting" class="flex items-center gap-2">
                    <span class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                    <span>Subscribing...</span>
                  </span>
                  <span v-else class="flex items-center gap-2">
                    <span>Subscribe</span>
                    <svg class="size-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </button>
              </div>
              <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-2"
              >
                <div v-if="newsletterSuccess || newsletterError" class="rounded-xl border p-4 backdrop-blur-sm" :class="newsletterSuccess ? 'dark:border-green-500/30 light:border-green-500/50 dark:bg-green-500/10 light:bg-green-50' : 'dark:border-red-500/30 light:border-red-500/50 dark:bg-red-500/10 light:bg-red-50'">
                  <p class="text-sm font-medium flex items-center gap-2" :class="newsletterSuccess ? 'dark:text-green-400 light:text-green-600' : 'dark:text-red-400 light:text-red-600'">
                    <svg v-if="newsletterSuccess" class="size-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <svg v-else class="size-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    {{ newsletterSuccess || newsletterError }}
                  </p>
                </div>
              </Transition>
            </form>
          </div>
          <dl class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div class="flex flex-col items-start">
              <div class="rounded-xl dark:bg-white/5 light:bg-white p-2.5 ring-1 dark:ring-white/10 light:ring-gray-200/50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="size-6 dark:text-white light:text-gray-900">
                  <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <dt class="mt-4 text-base font-semibold dark:text-white light:text-gray-900">Weekly tips</dt>
              <dd class="mt-2 text-base dark:text-gray-400 light:text-gray-600">Workflow ideas, product updates, and ways to deliver client work you’re proud of.</dd>
            </div>
            <div class="flex flex-col items-start">
              <div class="rounded-xl dark:bg-white/5 light:bg-white p-2.5 ring-1 dark:ring-white/10 light:ring-gray-200/50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="size-6 dark:text-white light:text-gray-900">
                  <path d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <dt class="mt-4 text-base font-semibold dark:text-white light:text-gray-900">No spam</dt>
              <dd class="mt-2 text-base dark:text-gray-400 light:text-gray-600">Unsubscribe anytime. Only useful stuff for creatives.</dd>
            </div>
          </dl>
        </div>
      </div>
      <div aria-hidden="true" class="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        />
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t dark:border-white/10 light:border-gray-200 bg-transparent py-12 px-6 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div class="max-w-sm">
            <RouterLink :to="{ name: 'home' }" class="inline-block">
              <MazelootLogo size="sm" container-class="h-9" />
            </RouterLink>
            <p class="mt-3 text-sm leading-6 dark:text-gray-400 light:text-gray-700">
              Client galleries and proofing for creatives who care about the details. One workflow, one link.
            </p>
            <div class="mt-4 flex gap-4">
              <a href="#" aria-label="Facebook" class="dark:text-primary-400 light:text-primary-600 transition-colors dark:hover:text-primary-300 light:hover:text-primary-700">
                <svg class="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>
              </a>
              <a href="#" aria-label="Instagram" class="dark:text-pink-400 light:text-pink-600 transition-colors dark:hover:text-pink-300 light:hover:text-pink-700">
                <svg class="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.994 2.013 9.338 2 11.955 2h.08c0-.001.12-.001.28-.001zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.224 1.224 0 110 2.448 1.224 1.224 0 010-2.448z" clip-rule="evenodd" /></svg>
              </a>
              <a href="#" aria-label="X" class="dark:text-sky-400 light:text-sky-600 transition-colors dark:hover:text-sky-300 light:hover:text-sky-700">
                <svg class="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" aria-label="GitHub" class="dark:text-primary-400 light:text-primary-600 transition-colors dark:hover:text-primary-300 light:hover:text-primary-700">
                <svg class="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
              </a>
              <a href="#" aria-label="YouTube" class="dark:text-rose-400 light:text-rose-600 transition-colors dark:hover:text-rose-300 light:hover:text-rose-700">
                <svg class="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>
          <nav class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            <a href="#how-it-works" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900" @click.prevent="scrollToSection('how-it-works')">How it works</a>
            <a href="#features" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900" @click.prevent="scrollToSection('features')">Features</a>
            <a href="#pricing" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900" @click.prevent="scrollToSection('pricing')">Pricing</a>
            <a href="#testimonials" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900" @click.prevent="scrollToSection('testimonials')">Testimonials</a>
            <a href="#newsletter" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900" @click.prevent="scrollToSection('newsletter')">Newsletter</a>
            <RouterLink :to="{ name: 'faq' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">FAQ</RouterLink>
            <RouterLink :to="{ name: 'contact' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Contact us</RouterLink>
          </nav>
        </div>
        <div class="mt-10 border-t dark:border-white/10 light:border-gray-200 pt-6">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm dark:text-gray-400 light:text-gray-700">© {{ new Date().getFullYear() }} Mazeloot Inc. All rights reserved.</p>
            <nav class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" aria-label="Legal">
              <RouterLink :to="{ name: 'privacy' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Privacy Policy</RouterLink>
              <span class="dark:text-gray-600 light:text-gray-400" aria-hidden="true">•</span>
              <RouterLink :to="{ name: 'terms' }" class="dark:text-gray-400 light:text-gray-600 transition-colors dark:hover:text-white light:hover:text-gray-900">Terms of Service</RouterLink>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import { Sheet, SheetContent } from '@/shared/components/shadcn/sheet'
import Card from '@/shared/components/shadcn/Card.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import {
  Lock,
  CheckCircle,
  Check,
  FolderOpen,
  MessageSquare,
  Mail,
} from '@/shared/utils/lucideAnimated'
import { PLAN_COMPARISON_ROWS, getComparisonValue } from '@/domains/memora/constants/planComparison'
import { usePricingApi } from '@/domains/memora/api/pricing'
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '@/shared/stores/currency'
import { formatMoney } from '@/shared/utils/formatMoney'
import { convertUsdCentsToFormatted } from '@/shared/utils/convertCurrency'
import { setPostAuthRedirect } from '@/shared/utils/localStorage'
import { useUserStore } from '@/shared/stores/user'
import { useSeoMeta } from '@/shared/composables/useSeoMeta'
import { trackPageView } from '@/shared/composables/useAnalytics'
import { apiClient } from '@/shared/api/client'
import { toast } from '@/shared/utils/toast'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

// SEO Meta Tags
useSeoMeta({
  title: 'Mazeloot - Professional Gallery & Client Proofing Platform for Creatives',
  description: 'Share, organize, and deliver your creative work beautifully. Professional gallery platform for photographers, videographers, and creatives. Join the waitlist for early access.',
  image: `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/`,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mazeloot',
    url: BASE_URL,
    description: 'Professional gallery and client proofing platform for creatives',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
})

// Track page view
onMounted(() => {
  trackPageView('/', 'Home')
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const testimonialIndex = ref(0)
const testimonialPaused = ref(false)
const testimonialProgress = ref(0)
const testimonialAutoAdvance = ref(false)
let testimonialInterval = null
const TESTIMONIAL_AUTO_MS = 6000
const TESTIMONIAL_TICK_MS = 50
const testimonialTouchStart = ref(null)
const testimonialTouchStartX = ref(0)
const testimonialTouchStartY = ref(0)
const testimonialTouchCurrentX = ref(0)
const SWIPE_THRESHOLD = 50
const SWIPE_VELOCITY_THRESHOLD = 0.3
/**
 * Testimonials array - add new testimonials by adding objects with:
 * - quote: string (testimonial text)
 * - name: string (person's name)
 * - role: string (their role/title)
 * - avatar: string (image URL)
 */
const testimonials = ref([
  {
    quote: 'I was drowning in “which photo was that?” emails. Now I send one link, clients pick and comment in one place, and I actually get my evenings back.',
    name: 'Sarah M.',
    role: 'Wedding photographer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'My clients thought I upgraded my whole business. Same work—just finally presented in a way that doesn’t feel like homework for them.',
    name: 'James K.',
    role: 'Portrait photographer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'No more USBs in the mail or “check your WeTransfer.” One link for finals and raws. I look professional; they get what they need. Done.',
    name: 'Elena R.',
    role: 'Commercial photographer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'Clients used to take weeks to pick favorites because they couldn\'t figure out how to download or compare photos. Now they finish in days.',
    name: 'Marcus T.',
    role: 'Event photographer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'I spent more time managing file deliveries than shooting. Mazeloot cut that admin time by 80%. I can finally focus on what I love.',
    name: 'Rachel L.',
    role: 'Fashion photographer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'The proofing workflow is a game-changer. Clients mark what they want changed, I see it all in one place. No more back-and-forth.',
    name: 'David P.',
    role: 'Product photographer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'My clients love how easy it is. They don\'t need to sign up for anything—just click a link and start picking favorites. It\'s that simple.',
    name: 'Jessica W.',
    role: 'Boudoir photographer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'Raw file delivery used to be a nightmare. Now I organize everything in Mazeloot and clients can request specific files. So much cleaner.',
    name: 'Alex Chen',
    role: 'Real estate photographer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'I used three different tools before—one for galleries, one for proofing, one for delivery. Now it\'s all in one place. Worth every penny.',
    name: 'Maya S.',
    role: 'Family photographer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'The branded galleries make me look way more professional than sending Dropbox links. Clients actually comment on how polished everything feels.',
    name: 'Tom R.',
    role: 'Corporate photographer',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6cef03d354?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    quote: 'I can finally stop worrying about clients losing files or asking for resends. Everything\'s organized, accessible, and they can download whenever.',
    name: 'Sophie B.',
    role: 'Lifestyle photographer',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
])
const testimonialCount = computed(() => testimonials.value.length)
function goPrevTestimonial() {
  testimonialIndex.value = (testimonialIndex.value - 1 + testimonialCount.value) % testimonialCount.value
  testimonialProgress.value = 0
}
function goNextTestimonial() {
  testimonialIndex.value = (testimonialIndex.value + 1) % testimonialCount.value
  testimonialProgress.value = 0
}
function goToTestimonial(i) {
  testimonialIndex.value = i
  testimonialProgress.value = 0
}
function onTestimonialKeydown(e) {
  if (e.target.closest('[aria-roledescription="Testimonial carousel"]') === null) return
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    goPrevTestimonial()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    goNextTestimonial()
  }
}
function onTestimonialTouchStart(e) {
  testimonialPaused.value = true
  testimonialTouchStart.value = Date.now()
  testimonialTouchStartX.value = e.touches[0].clientX
  testimonialTouchStartY.value = e.touches[0].clientY
  testimonialTouchCurrentX.value = e.touches[0].clientX
}
function onTestimonialTouchMove(e) {
  if (!testimonialTouchStart.value) return
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  const deltaX = Math.abs(currentX - testimonialTouchStartX.value)
  const deltaY = Math.abs(currentY - testimonialTouchStartY.value)
  
  testimonialTouchCurrentX.value = currentX
  
  // Prevent scrolling if horizontal swipe is detected
  if (deltaX > deltaY && deltaX > 10) {
    e.preventDefault()
  }
}
function onTestimonialTouchEnd(e) {
  if (!testimonialTouchStart.value || testimonialTouchStartX.value === 0) {
    testimonialPaused.value = false
    return
  }
  
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  const deltaX = touchEndX - testimonialTouchStartX.value
  const deltaY = Math.abs(touchEndY - testimonialTouchStartY.value)
  const deltaTime = Date.now() - testimonialTouchStart.value
  const velocity = Math.abs(deltaX) / deltaTime
  
  // Swipe detection: horizontal movement > threshold AND horizontal > vertical AND (distance threshold OR velocity threshold)
  const isHorizontalSwipe = Math.abs(deltaX) > deltaY
  const meetsDistanceThreshold = Math.abs(deltaX) > SWIPE_THRESHOLD
  const meetsVelocityThreshold = velocity > SWIPE_VELOCITY_THRESHOLD && Math.abs(deltaX) > 30
  
  if (isHorizontalSwipe && (meetsDistanceThreshold || meetsVelocityThreshold)) {
    if (deltaX > 0) {
      goPrevTestimonial()
    } else {
      goNextTestimonial()
    }
  }
  
  // Reset touch state
  testimonialTouchStart.value = null
  testimonialTouchStartX.value = 0
  testimonialTouchStartY.value = 0
  testimonialTouchCurrentX.value = 0
  testimonialPaused.value = false
}

function goToPricingStart() {
  if (userStore.token) {
    router.push({ name: 'memora-pricing' })
  } else {
    setPostAuthRedirect({ name: 'memora-pricing' })
    router.push({ name: 'register' })
  }
}
const { getTiers, getCurrencyRates } = usePricingApi()
const pricingTiers = ref([])
const pricingLoading = ref(true)
const pricingError = ref(null)
const currencyRates = ref({})
const showComparisonSheet = ref(false)

const comparisonTableRows = computed(() => {
  const flat = []
  const rows = PLAN_COMPARISON_ROWS
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (i === 0 || rows[i - 1].category !== row.category) {
      flat.push({ type: 'category', category: row.category })
    }
    flat.push({ type: 'row', row })
  }
  return flat
})

async function fetchCurrencyRates() {
  if (currencyStore.currency === 'usd') {
    currencyRates.value = {}
    return
  }
  try {
    const rates = await getCurrencyRates()
    currencyRates.value = rates || {}
  } catch {
    currencyRates.value = {}
  }
}

function formatPrice(tier) {
  const cents = tier?.price_monthly_cents
  if (cents == null) return '—'
  if (cents === 0) return formatMoney(0, 'usd')
  const cur = currencyStore.currency
  if (cur === 'usd') return formatMoney(cents, 'usd')
  if (currencyRates.value[cur] == null) return '…'
  return convertUsdCentsToFormatted(cents, cur, currencyRates.value)
}

watch(
  () => currencyStore.currency,
  () => fetchCurrencyRates(),
  { immediate: false }
)

const BANNER_KEY = 'mazeloot-banner-dismissed'
const showBanner = ref(true)
onMounted(async () => {
  if (import.meta.client && sessionStorage.getItem(BANNER_KEY)) showBanner.value = false
  if (import.meta.client && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    testimonialAutoAdvance.value = true
    const step = (TESTIMONIAL_TICK_MS / TESTIMONIAL_AUTO_MS) * 100
    testimonialInterval = setInterval(() => {
      if (testimonialPaused.value) return
      testimonialProgress.value = Math.min(100, testimonialProgress.value + step)
      if (testimonialProgress.value >= 100) {
        goNextTestimonial()
      }
    }, TESTIMONIAL_TICK_MS)
  }
  try {
    const data = await getTiers()
    pricingTiers.value = Array.isArray(data) ? data : []
    await fetchCurrencyRates()
  } catch (e) {
    pricingError.value = e?.message ?? 'Failed to load plans'
  } finally {
    pricingLoading.value = false
  }
  
  if (import.meta.client) {
    window.addEventListener('hashchange', scrollToHash)
    
    const performScroll = () => {
      if (window.location.hash) {
        scrollToHash()
      }
    }
    
    if (document.readyState === 'complete') {
      await nextTick()
      performScroll()
    } else {
      window.addEventListener('load', () => {
        nextTick(() => performScroll())
      }, { once: true })
    }
    
    await nextTick()
    performScroll()
  }
})

onUnmounted(() => {
  if (testimonialInterval) clearInterval(testimonialInterval)
  if (import.meta.client) {
    window.removeEventListener('hashchange', scrollToHash)
  }
})

function scrollToHash() {
  if (!import.meta.client) return
  const hash = window.location.hash?.slice(1)
  if (!hash) return
  
  const attemptScroll = (attempt = 0) => {
    const el = document.getElementById(hash)
    if (el) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const offset = 100
          const targetY = rect.top + scrollTop - offset
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
        })
      })
      return true
    }
    
    if (attempt < 100) {
      setTimeout(() => attemptScroll(attempt + 1), 100)
    }
    return false
  }
  
  attemptScroll()
}

watch(() => route.name, (newName) => {
  if (newName === 'home') {
    nextTick(() => {
      setTimeout(() => scrollToHash(), 300)
    })
  }
})
function dismissBanner() {
  showBanner.value = false
  if (import.meta.client) sessionStorage.setItem(BANNER_KEY, '1')
}
const newsletterEmail = ref('')
const newsletterSubmitting = ref(false)
const newsletterSuccess = ref('')
const newsletterError = ref('')

async function submitNewsletter() {
  if (!newsletterEmail.value) return

  newsletterSubmitting.value = true
  newsletterSuccess.value = ''
  newsletterError.value = ''

  try {
    const email = newsletterEmail.value.trim()
    
    await apiClient.post(
      '/v1/public/newsletter',
      {
        email,
      },
      { skipAuth: true }
    )
    
    newsletterSuccess.value = 'Thanks for subscribing! We\'ll keep you updated.'
    toast.success('Successfully subscribed to newsletter!')
    newsletterEmail.value = ''
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Failed to subscribe. Please try again.'
    newsletterError.value = errorMessage
    toast.error(errorMessage)
  } finally {
    newsletterSubmitting.value = false
  }
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
@keyframes hero-dashboard-in {
  from {
    opacity: 0;
    transform: translateX(1.5rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.hero-dashboard-wrap {
  animation: hero-dashboard-in 0.6s ease-out both;
}
@media (prefers-reduced-motion: reduce) {
  .hero-dashboard-wrap {
    animation: none;
  }
}

@keyframes logo-marquee {
  to {
    transform: translate3d(-50%, 0, 0);
  }
}
.logo-marquee__track {
  animation: logo-marquee 40s linear infinite;
  width: max-content;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .logo-marquee__track {
    animation: none;
  }
}

.testimonial-viewport {
  touch-action: pan-y;
  -webkit-overflow-scrolling: touch;
}

.testimonial-track {
  transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .testimonial-track {
    transition: none;
  }
}

.testimonial-progress {
  transition: width 0.05s linear;
}
@media (prefers-reduced-motion: reduce) {
  .testimonial-progress {
    transition: none;
  }
}
</style>

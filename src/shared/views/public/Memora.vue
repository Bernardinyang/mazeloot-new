<template>
  <div class="min-h-screen bg-gradient-to-br dark:from-[#0f0f23] dark:via-primary-950/50 dark:to-[#0f0f23] light:from-gray-50 light:via-white light:to-gray-100 dark:text-gray-100 light:text-gray-900">
    <PublicNav />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary-500/15 blur-[100px]" aria-hidden="true" />
      <div class="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent-500/10 blur-[80px]" aria-hidden="true" />
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles class="h-4 w-4" />
            <span>Memora</span>
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-violet-200 light:bg-gradient-to-r light:from-gray-900 light:via-indigo-600 light:to-violet-600 bg-clip-text text-transparent">
            From selection to delivery
          </h1>
          <p class="text-lg sm:text-xl dark:text-gray-300 light:text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Memora is the client gallery and delivery workflow inside Mazeloot. One link per project, four phases: Selection, Proofing, Collection, and Raw files.
          </p>
        </div>
      </div>
    </section>

    <!-- Key Features Section -->
    <section class="relative pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.02)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold dark:text-white light:text-gray-900 mb-4 dark:bg-gradient-to-r dark:from-white dark:to-gray-300 light:bg-gradient-to-r light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent">Everything you need in one place</h2>
            <p class="text-lg dark:text-gray-300 light:text-gray-600 max-w-2xl mx-auto">
              Streamline your workflow with powerful features designed for creatives
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 hover:border-cyan-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div class="relative flex flex-col gap-4">
                <div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Image class="h-7 w-7 text-cyan-300" />
                </div>
                <div>
                  <h3 class="text-xl font-bold dark:text-white light:text-gray-900 mb-2">Branded Galleries</h3>
                  <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">
                    Customize layouts, colors, and typography to match your brand. Create professional galleries that reflect your style.
                  </p>
                </div>
              </div>
            </div>
            <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 hover:border-pink-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/10">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div class="relative flex flex-col gap-4">
                <div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Lock class="h-7 w-7 text-pink-300" />
                </div>
                <div>
                  <h3 class="text-xl font-bold dark:text-white light:text-gray-900 mb-2">Secure Sharing</h3>
                  <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">
                    Password protection, email whitelists, and PIN controls keep your work secure while giving clients easy access.
                  </p>
                </div>
              </div>
            </div>
            <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 hover:border-sky-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div class="relative flex flex-col gap-4">
                <div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-600/20 border border-sky-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Users class="h-7 w-7 text-sky-300" />
                </div>
                <div>
                  <h3 class="text-xl font-bold dark:text-white light:text-gray-900 mb-2">Client Collaboration</h3>
                  <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">
                    No accounts needed. Clients access galleries via links, select favorites, and provide feedback—all in one place.
                  </p>
                </div>
              </div>
            </div>
            <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 hover:border-indigo-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div class="relative flex flex-col gap-4">
                <div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Zap class="h-7 w-7 text-indigo-300" />
                </div>
                <div>
                  <h3 class="text-xl font-bold dark:text-white light:text-gray-900 mb-2">Fast Workflow</h3>
                  <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">
                    Move seamlessly from selection to proofing to collection. No more juggling multiple tools or email chains.
                  </p>
                </div>
              </div>
            </div>
            <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 hover:border-rose-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/10">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div class="relative flex flex-col gap-4">
                <div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/20 border border-rose-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Shield class="h-7 w-7 text-rose-300" />
                </div>
                <div>
                  <h3 class="text-xl font-bold dark:text-white light:text-gray-900 mb-2">Watermark Protection</h3>
                  <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">
                    Protect your work with customizable watermarks. Control download access and maintain your creative rights.
                  </p>
                </div>
              </div>
            </div>
            <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-6 md:p-8 hover:border-indigo-500/40 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div class="relative flex flex-col gap-4">
                <div class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Download class="h-7 w-7 text-indigo-300" />
                </div>
                <div>
                  <h3 class="text-xl font-bold dark:text-white light:text-gray-900 mb-2">High-Res Delivery</h3>
                  <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">
                    Deliver full-resolution images with download controls. Clients get what they need when they need it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="relative pb-20">
      <div aria-hidden="true" class="absolute inset-0 dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.02)_1px,transparent_1px)] light:bg-[linear-gradient(to_right,rgb(147_51_234/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(147_51_234/0.08)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl font-bold dark:text-white light:text-gray-900 mb-4 dark:bg-gradient-to-r dark:from-white dark:to-gray-300 light:bg-gradient-to-r light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent">How it works</h2>
            <p class="text-lg dark:text-gray-300 light:text-gray-600 max-w-2xl mx-auto">
              Four phases, one seamless workflow from first upload to final delivery
            </p>
          </div>
          <!-- Selection Phase -->
          <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-8 md:p-10 shadow-2xl hover:border-accent-500/40 hover:shadow-accent-500/10 transition-all duration-300 hover:-translate-y-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="relative flex gap-6">
              <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/40 text-accent-300 font-bold text-xl tabular-nums backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent-500/20">
                01
              </div>
              <div class="flex-1">
                <h2 class="text-2xl sm:text-3xl font-bold dark:text-white light:text-gray-900 mb-4">Selection</h2>
                <p class="dark:text-gray-300 light:text-gray-600 leading-relaxed mb-4">
                  You upload photos and create a <strong class="dark:text-white light:text-gray-900">selection</strong>—a gallery you share with one link. Clients open it in their browser, no account required. They browse, pick favorites, and submit their choices. You see exactly which images they want so you can edit and deliver without chasing emails or spreadsheets.
                </p>
                <p class="dark:text-gray-300 light:text-gray-600 leading-relaxed">
                  Selections can be password-protected and branded. You control visibility and limits (e.g. "pick up to 50"). Everything stays in one place per project.
                </p>
              </div>
            </div>
          </div>

          <!-- Connector -->
          <div class="flex justify-center py-2">
            <div class="h-8 w-0.5 bg-gradient-to-b from-accent-500/30 to-secondary-500/30"></div>
          </div>

          <!-- Proofing Phase -->
          <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-8 md:p-10 shadow-2xl hover:border-secondary-500/40 hover:shadow-secondary-500/10 transition-all duration-300 hover:-translate-y-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="relative flex gap-6">
              <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-500/20 to-secondary-600/20 border border-secondary-500/40 text-secondary-300 font-bold text-xl tabular-nums backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-secondary-500/20">
                02
              </div>
              <div class="flex-1">
                <h2 class="text-2xl sm:text-3xl font-bold dark:text-white light:text-gray-900 mb-4">Proofing</h2>
                <p class="dark:text-gray-300 light:text-gray-600 leading-relaxed mb-4">
                  In the <strong class="dark:text-white light:text-gray-900">proofing</strong> phase, clients leave comments and request revisions on the images you've shared. They can mark up specific areas, ask for changes, and approve or request another round. You get one clear list of feedback and revisions instead of scattered emails or chat threads.
                </p>
                <p class="dark:text-gray-300 light:text-gray-600 leading-relaxed">
                  Proofing keeps the conversation attached to the media. When you upload new versions, clients see the latest files and can confirm or add more feedback. The full history is kept so nothing gets lost.
                </p>
              </div>
            </div>
          </div>

          <!-- Connector -->
          <div class="flex justify-center py-2">
            <div class="h-8 w-0.5 bg-gradient-to-b from-secondary-500/30 to-primary-500/30"></div>
          </div>

          <!-- Collection Phase -->
          <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-8 md:p-10 shadow-2xl hover:border-primary-500/40 hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="relative flex gap-6">
              <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/40 text-primary-300 font-bold text-xl tabular-nums backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/20">
                03
              </div>
              <div class="flex-1">
                <h2 class="text-2xl sm:text-3xl font-bold dark:text-white light:text-gray-900 mb-4">Collection</h2>
                <p class="dark:text-gray-300 light:text-gray-600 leading-relaxed mb-4">
                  A <strong class="dark:text-white light:text-gray-900">collection</strong> is your delivery gallery—the final edited set you give to the client. You share one link; they view, download, or order prints from it. No separate delivery app or file-sending service. Clients get a clean, branded experience and can download when they're ready.
                </p>
                <p class="dark:text-gray-300 light:text-gray-600 leading-relaxed">
                  Collections support high-resolution delivery, optional watermarks, and access controls. You can customize layout and branding so the gallery matches your style.
                </p>
              </div>
            </div>
          </div>

          <!-- Connector -->
          <div class="flex justify-center py-2">
            <div class="h-8 w-0.5 bg-gradient-to-b from-primary-500/30 to-accent-500/30"></div>
          </div>

          <!-- Raw Files Phase -->
          <div class="group relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-8 md:p-10 shadow-2xl hover:border-accent-500/40 hover:shadow-accent-500/10 transition-all duration-300 hover:-translate-y-1">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="relative flex gap-6">
              <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/40 text-accent-300 font-bold text-xl tabular-nums backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent-500/20">
                04
              </div>
              <div class="flex-1">
                <h2 class="text-2xl sm:text-3xl font-bold dark:text-white light:text-gray-900 mb-4">Raw files</h2>
                <p class="dark:text-gray-300 light:text-gray-600 leading-relaxed mb-4">
                  The <strong class="dark:text-white light:text-gray-900">raw files</strong> phase is for storing and delivering original RAWs (or other originals) when the client needs them. You keep files organized by project; clients get a link to view and download only what you've shared. Optional PIN protection adds an extra layer for sensitive deliveries.
                </p>
                <p class="dark:text-gray-300 light:text-gray-600 leading-relaxed">
                  Raw files stay under your control. You choose what to share and when. No more USB sticks or one-off WeTransfer links—everything lives in the same workflow as your selections, proofing, and collections.
                </p>
              </div>
            </div>
          </div>

          <!-- Benefits Section -->
          <div class="relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-4 sm:p-8 md:p-10 shadow-2xl hover:border-emerald-500/30 transition-all duration-300">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
            <div class="relative">
              <h2 class="text-2xl sm:text-3xl font-bold dark:text-white light:text-gray-900 mb-8 text-center dark:bg-gradient-to-r dark:from-white dark:to-gray-300 light:bg-gradient-to-r light:from-gray-900 light:to-gray-700 bg-clip-text text-transparent">Why creatives choose Memora</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border dark:border-white/10 light:border-gray-200 hover:border-emerald-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle class="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 class="font-bold dark:text-white light:text-gray-900 mb-1.5">Save time</h3>
                    <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">Eliminate email chains and manual tracking. Everything happens in one place.</p>
                  </div>
                </div>
                <div class="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border dark:border-white/10 light:border-gray-200 hover:border-emerald-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle class="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 class="font-bold dark:text-white light:text-gray-900 mb-1.5">Professional delivery</h3>
                    <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">Branded galleries that impress clients and protect your work.</p>
                  </div>
                </div>
                <div class="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border dark:border-white/10 light:border-gray-200 hover:border-emerald-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle class="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 class="font-bold dark:text-white light:text-gray-900 mb-1.5">Better organization</h3>
                    <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">Keep projects organized with clear phases and revision tracking.</p>
                  </div>
                </div>
                <div class="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border dark:border-white/10 light:border-gray-200 hover:border-emerald-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle class="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 class="font-bold dark:text-white light:text-gray-900 mb-1.5">Client satisfaction</h3>
                    <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">Easy-to-use galleries that clients love. No accounts or downloads required.</p>
                  </div>
                </div>
                <div class="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border dark:border-white/10 light:border-gray-200 hover:border-emerald-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle class="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 class="font-bold dark:text-white light:text-gray-900 mb-1.5">Complete control</h3>
                    <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">Control access, downloads, and branding at every step.</p>
                  </div>
                </div>
                <div class="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border dark:border-white/10 light:border-gray-200 hover:border-emerald-500/30 dark:hover:bg-white/10 light:hover:bg-gray-50 transition-all duration-300">
                  <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle class="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 class="font-bold dark:text-white light:text-gray-900 mb-1.5">No more chaos</h3>
                    <p class="text-sm dark:text-gray-300 light:text-gray-600 leading-relaxed">Replace USB sticks, WeTransfer links, and scattered files with one workflow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Section -->
          <div class="relative rounded-2xl bg-white/5 dark:backdrop-blur-xl light:backdrop-blur-sm border dark:border-white/10 light:border-gray-200 p-10 sm:p-12 shadow-2xl text-center hover:border-indigo-500/30 transition-all duration-300">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
            <div class="relative">
              <h2 class="text-3xl sm:text-4xl font-bold dark:text-white light:text-gray-900 mb-4 dark:bg-gradient-to-r dark:from-white dark:via-indigo-200 dark:to-violet-200 light:bg-gradient-to-r light:from-gray-900 light:via-indigo-600 light:to-violet-600 bg-clip-text text-transparent">One workflow, one link</h2>
              <p class="text-lg dark:text-gray-300 light:text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
                Memora ties these four phases together so you and your clients stay in sync from first share to final delivery—without leaving the platform or juggling multiple tools.
              </p>
              <Button
                size="lg"
                class="rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 dark:text-white light:text-gray-900 font-semibold shadow-lg shadow-primary-500/25 transition-all duration-200 hover:from-primary-400 hover:to-accent-400 hover:shadow-primary-500/40 hover:-translate-y-1 hover:scale-105 border-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f23] px-8 py-6 text-base"
                @click="router.push({ name: 'register' })"
              >
                Get started with Memora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <footer class="border-t dark:border-white/10 light:border-gray-200 bg-transparent py-12 px-6 lg:px-8">
      <div class="mx-auto max-w-7xl text-center">
          <RouterLink :to="{ name: 'home' }" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
          <ArrowLeft class="h-4 w-4" />
          Back to home
        </RouterLink>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PublicNav from '@/shared/components/organisms/PublicNav.vue'
import { Button } from '@/shared/components/shadcn/button'
import { RouterLink } from 'vue-router'
import { Sparkles, ArrowLeft, Image, Lock, Users, Zap, Shield, Download, CheckCircle } from '@/shared/utils/lucideAnimated'
import { useSeoMeta } from '@/shared/composables/useSeoMeta'
import { trackPageView } from '@/shared/composables/useAnalytics'

const BASE_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : 'https://mazeloot.com'

const router = useRouter()

// SEO Meta Tags
useSeoMeta({
  title: 'Memora - Client Gallery & Proofing Workflow | Mazeloot',
  description: 'Memora is the client gallery and delivery workflow inside Mazeloot. One link per project, four phases: Selection, Proofing, Collection, and Raw files.',
  image: `${BASE_URL}/og-image.png`,
  url: `${BASE_URL}/memora`,
})

// Track page view
onMounted(() => {
  trackPageView('/memora', 'Memora')
})
</script>

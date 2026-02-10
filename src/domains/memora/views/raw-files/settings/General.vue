<template>
  <RawFileLayout :is-loading="isLoading" :rawFile="rawFile" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="max-w-full md:max-w-[50%] p-4 sm:p-6 md:p-8 transition-all duration-300">
          <!-- Skeleton Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <Skeleton class="h-8 w-48 rounded-lg" />
              <Skeleton class="h-5 w-5 rounded-full" />
            </div>
            <Skeleton class="h-4 w-96 rounded-md" />
          </div>

          <!-- Skeleton Settings Sections -->
          <div class="space-y-6">
            <!-- RawFile Name Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-32 rounded-md mb-2" />
                  <Skeleton class="h-3 w-64 rounded-md" />
                </div>
              </div>
              <Skeleton class="h-10 w-full max-w-md rounded-md" />
            </div>

            <!-- Description Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-24 rounded-md mb-2" />
                  <Skeleton class="h-3 w-72 rounded-md" />
                </div>
              </div>
              <Skeleton class="h-24 w-full max-w-2xl rounded-md" />
              <div class="flex items-center justify-between max-w-2xl">
                <Skeleton class="h-3 w-48 rounded-md" />
                <Skeleton class="h-3 w-16 rounded-md" />
              </div>
            </div>

            <!-- RawFile Color Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-32 rounded-md mb-2" />
                  <Skeleton class="h-3 w-64 rounded-md" />
                </div>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <Skeleton class="h-12 w-20 rounded-lg" />
                <Skeleton class="h-12 flex-1 rounded-md" />
                <Skeleton class="h-12 w-12 rounded-lg" />
              </div>
            </div>

            <!-- Typography Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-24 rounded-md mb-2" />
                  <Skeleton class="h-3 w-56 rounded-md" />
                </div>
              </div>
              <div class="space-y-5">
                <div>
                  <Skeleton class="h-3 w-24 rounded-md mb-2.5" />
                  <Skeleton class="h-10 w-full rounded-md" />
                </div>
                <div>
                  <Skeleton class="h-3 w-24 rounded-md mb-2.5" />
                  <Skeleton class="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>

            <!-- Allowed Email Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-32 rounded-md mb-2" />
                  <Skeleton class="h-3 w-80 rounded-md" />
                </div>
              </div>
              <Skeleton class="h-10 w-full max-w-md rounded-md" />
              <div class="flex items-center gap-2 pt-2">
                <Skeleton class="h-9 w-24 rounded-md" />
              </div>
            </div>

            <!-- Password Protection Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-40 rounded-md mb-2" />
                  <Skeleton class="h-3 w-72 rounded-md" />
                </div>
                <Skeleton class="h-6 w-12 rounded-full" />
              </div>
            </div>

          </div>
        </div>

        <div v-else class="max-w-full md:max-w-[50%] p-4 sm:p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                General Settings
              </h1>
              <button
                :class="theme.borderSecondary"
                class="w-5 h-5 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95"
                title="More information"
              >
                <Info :class="theme.textSecondary" class="h-3 w-3" />
              </button>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              Configure general settings for your rawFile including name, color, cover photo, and
              display preferences.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- RawFile Name -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    RawFile Name
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    The name of this rawFile as it appears in your dashboard and to customers.
                  </p>
                </div>
                <div v-if="nameSaved" class="flex items-center gap-2 text-violet-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <Input
                v-model="rawFileName"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-md focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="My RawFile"
                @keydown.enter="handleSave"
              />
            </div>

            <!-- RawFile Description -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Description</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Optional description shown to clients viewing this rawFile.
                  </p>
                </div>
              </div>
              <Textarea
                v-model="rawFileDescription"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-2xl min-h-[100px] resize-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Enter a description for this rawFile..."
                :maxlength="1000"
                @keydown.enter.prevent="handleSave"
              />
              <div class="flex items-center justify-between max-w-2xl">
                <p :class="theme.textTertiary" class="text-xs">
                  Description is shown to clients viewing this rawFile.
                </p>
                <span :class="theme.textTertiary" class="text-xs">
                  {{ (rawFileDescription || '').length }}/1000
                </span>
              </div>
            </div>

            <!-- RawFile Color -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    RawFile Color
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Choose a color to help identify this rawFile in your dashboard.
                  </p>
                </div>
                <div v-if="colorSaved" class="flex items-center gap-2 text-violet-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <input
                  v-model="rawFileColor"
                  :class="theme.borderSecondary"
                  class="h-12 w-20 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                  type="color"
                  @change="handleSave"
                />
                <Input
                  v-model="rawFileColor"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="flex-1 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono text-sm"
                  :placeholder="getAccentColor()"
                  @keydown.enter="handleSave"
                />
                <div
                  class="h-12 w-12 rounded-lg border-2 transition-all"
                  :style="{ backgroundColor: rawFileColor, borderColor: rawFileColor }"
                  :class="theme.borderSecondary"
                ></div>
              </div>
            </div>

            <!-- Typography -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Typography</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Select fonts that match your brand and style.
                  </p>
                </div>
                <div v-if="typographySaved" class="flex items-center gap-2 text-violet-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <div class="space-y-5">
                <!-- Font Family -->
                <div>
                  <label
                    :class="theme.textSecondary"
                    class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                  >
                    Font Family
                  </label>
                  <FontFamilySelect
                    v-model="fontFamily"
                    placeholder="Select font family"
                  />
                </div>
                <!-- Font Style -->
                <div>
                  <label
                    :class="theme.textSecondary"
                    class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                  >
                    Font Style
                  </label>
                  <Select v-model="fontStyle">
                    <SelectTrigger
                      :class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        'focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500',
                      ]"
                      class="transition-all"
                    >
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                      <SelectItem
                        v-for="style in fontStyleOptions"
                        :key="style.value"
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        :style="getStylePreview(style.value)"
                        :value="style.value"
                      >
                        {{ style.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <!-- Allowed Emails -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Allowed Email
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Specify which email address is allowed to access this rawFile. Leave empty
                    to allow all emails.
                  </p>
                </div>
                <div v-if="isSavingAllowedEmails" class="flex items-center gap-2 text-violet-500">
                  <Loader2 class="h-4 w-4 animate-spin" />
                  <span class="text-xs font-medium">Saving...</span>
                </div>
                <div v-else-if="emailsSaved" class="flex items-center gap-2 text-violet-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <div class="space-y-3 max-w-md">
                <div class="flex-1 relative">
                  <Input
                    v-model="allowedEmail"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      allowedEmail && !isValidEmail(allowedEmail) ? 'border-red-300 dark:border-red-700' : '',
                    ]"
                    class="w-full transition-all"
                    placeholder="email@example.com"
                    type="email"
                    @blur="() => handleAllowedEmailChange(false)"
                    @keydown.enter="handleAllowedEmailChange(true)"
                  />
                  <p
                    v-if="allowedEmail && !isValidEmail(allowedEmail)"
                    class="absolute -bottom-5 left-0 text-xs text-red-500 dark:text-red-400 mt-1"
                  >
                    Please enter a valid email address
                  </p>
                </div>
                <div class="flex items-center gap-2 pt-2">
                  <Button
                    :class="[
                      'bg-violet-500 hover:bg-violet-600 text-white transition-all',
                      isSavingAllowedEmails ? 'opacity-75 cursor-not-allowed' : '',
                    ]"
                    :disabled="isSavingAllowedEmails || (allowedEmail && !isValidEmail(allowedEmail))"
                    size="sm"
                    :loading="isSavingAllowedEmails"
                    loading-label="Saving..."
                    :icon="!isSavingAllowedEmails && emailsSaved ? Check : null"
                    @click="handleAllowedEmailChange(true)"
                  >
                    {{ emailsSaved ? 'Saved' : 'Save Email' }}
                  </Button>
                </div>
                <div class="space-y-1 pt-1">
                  <p
                    v-if="allowedEmail && isValidEmail(allowedEmail)"
                    :class="theme.textSecondary"
                    class="text-xs"
                  >
                    <span class="font-medium text-violet-600 dark:text-violet-400">
                      Email configured.
                    </span>
                  </p>
                  <p
                    v-else-if="!allowedEmail || !allowedEmail.trim()"
                    :class="theme.textSecondary"
                    class="text-xs italic"
                  >
                    No email restrictions. Anyone with the link can access this rawFile.
                  </p>
                </div>
              </div>
            </div>

            <!-- Password Protection -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Password Protection
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Require a password for customers to access this rawFile.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch
                    :model-value="hasPassword"
                    label=""
                    @update:model-value="handlePasswordToggle"
                  />
                </div>
              </div>
              <div v-if="hasPassword" class="space-y-3 max-w-md">
                <div v-if="!isChangingPassword" class="flex items-center gap-2">
                  <div class="flex-1">
                    <PasswordInput
                      :model-value="passwordDisplay"
                      :input-class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        'w-full focus:ring-2 focus:ring-violet-500/20 transition-all',
                      ]"
                      readonly
                      placeholder="Password"
                    />
                  </div>
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="handleCopyPassword"
                  >
                    <Copy class="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div v-else class="flex items-center gap-2">
                  <PasswordInput
                    v-model="newPassword"
                    :input-class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'flex-1 focus:ring-2 focus:ring-violet-500/20 transition-all',
                    ]"
                    placeholder="Enter new password"
                    @blur="handlePasswordChange"
                  />
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="handleGeneratePassword"
                  >
                    <RefreshCw class="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                <div class="flex items-center gap-2">
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="isChangingPassword = !isChangingPassword"
                  >
                    {{ isChangingPassword ? 'Cancel' : 'Change Password' }}
                  </Button>
                  <Button
                    v-if="isChangingPassword && newPassword"
                    :class="['bg-violet-500 hover:bg-violet-600 text-white']"
                    :disabled="isSavingPassword"
                    size="sm"
                    :loading="isSavingPassword"
                    loading-label="Saving..."
                    @click="handleSavePassword"
                  >
                    Save Password
                  </Button>
                </div>
              </div>
            </div>

            <!-- Allow Download -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Allow Download</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Allow visitors to download media from this raw file.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="downloadEnabled" label="" />
                </div>
              </div>
            </div>

            <!-- Download PIN -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Download PIN</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Require clients to enter a 4-digit PIN to download files.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="downloadPinEnabled" label="" :disabled="!downloadEnabled" />
                </div>
              </div>
              <div v-if="downloadPinEnabled" class="flex items-center gap-3 max-w-md">
                <PasswordInput
                  :model-value="downloadPin"
                  :input-class="[
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'flex-1 font-mono focus:ring-2 focus:ring-violet-500/20 transition-all',
                  ]"
                  :maxlength="4"
                  readonly
                />
                <Button
                  :class="[theme.borderSecondary, theme.textPrimary]"
                  class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                  size="sm"
                  variant="outline"
                  @click="resetDownloadPin"
                >
                  <RefreshCw class="h-4 w-4 mr-2" />
                  Reset PIN
                </Button>
                <Button
                  v-if="downloadPin"
                  :class="[theme.borderSecondary, theme.textPrimary]"
                  class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                  size="sm"
                  variant="outline"
                  @click="copyDownloadPin"
                >
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
            </div>

            <!-- Gallery Assist -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Gallery Assist
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Add walk-through cards to help visitors use the rawFile.
                    <a class="text-violet-600 dark:text-violet-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="galleryAssist" label="" />
                </div>
              </div>
            </div>

            <!-- Display Preferences -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Display Preferences
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Configure how media is displayed in this rawFile (your view only).
                  </p>
                </div>
              </div>
              <div class="space-y-4">
                <!-- View Mode -->
                <div class="flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">View Mode</p>
                    <p :class="theme.textSecondary" class="text-xs">Grid or List view</p>
                  </div>
                  <div class="flex-shrink-0">
                    <Select v-model="viewMode">
                      <SelectTrigger
                        :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                        class="w-32 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent :class="[theme.bgCard, theme.borderCard]">
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="grid"
                          >Grid</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="list"
                          >List</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- Grid Size -->
                <div v-if="viewMode === 'grid'" class="flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">Grid Size</p>
                    <p :class="theme.textSecondary" class="text-xs">Size of grid items</p>
                  </div>
                  <div class="flex-shrink-0">
                    <Select v-model="gridSize">
                      <SelectTrigger
                        :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                        class="w-32 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent :class="[theme.bgCard, theme.borderCard]">
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="small"
                          >Small</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="medium"
                          >Medium</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="large"
                          >Large</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- Show Filenames -->
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">
                      Show Filenames
                    </p>
                    <p :class="theme.textSecondary" class="text-xs">
                      Display file names below media thumbnails.
                    </p>
                  </div>
                  <div class="flex-shrink-0 pt-1">
                    <ToggleSwitch v-model="showFilename" label="" />
                  </div>
                </div>

                <!-- Sort Order -->
                <div class="flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">Sort Order</p>
                    <p :class="theme.textSecondary" class="text-xs">How media items are sorted</p>
                  </div>
                  <div class="flex-shrink-0">
                    <Select v-model="sortOrder">
                      <SelectTrigger
                        :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                        class="w-64 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent :class="[theme.bgCard, theme.borderCard]">
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="uploaded-new-old"
                          >Uploaded (Newest First)</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="uploaded-old-new"
                          >Uploaded (Oldest First)</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="name-a-z"
                          >Name (A-Z)</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="name-z-a"
                          >Name (Z-A)</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="date-taken-new-old"
                          >Date Taken (Newest First)</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="date-taken-old-new"
                          >Date Taken (Oldest First)</SelectItem
                        >
                        <SelectItem
                          :class="[
                            theme.textPrimary,
                            theme.bgButtonHover,
                            'hover:bg-violet-50 dark:hover:bg-violet-950/20',
                          ]"
                          value="random"
                          >Random</SelectItem
                        >
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div :class="theme.borderSecondary" class="mt-10 pt-6 border-t">
              <div class="flex items-center justify-between gap-3">
                <div v-if="hasChanges" class="flex items-center gap-2 text-sm">
                  <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span :class="theme.textSecondary">You have unsaved changes</span>
                </div>
                <div v-else class="flex items-center gap-2 text-sm">
                  <Check class="h-4 w-4 text-violet-500" />
                  <span :class="theme.textSecondary">All changes saved</span>
                </div>
                <div class="flex items-center gap-3">
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                    variant="outline"
                    :disabled="isSaving"
                    @click="goBack"
                  >
                    Cancel
                  </Button>
                  <Button
                    :class="[
                      'bg-violet-500 hover:bg-violet-600 text-white transition-all',
                      !hasChanges || isSaving ? 'opacity-50 cursor-not-allowed' : '',
                    ]"
                    :disabled="!hasChanges || isSaving"
                    :loading="isSaving"
                    loading-label="Saving..."
                    :icon="!isSaving && !hasChanges ? Check : null"
                    @click="handleSave"
                  >
                    {{ hasChanges ? 'Save Changes' : 'Saved' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </RawFileLayout>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Copy, Info, Loader2, X, Plus, Settings, Check, RefreshCw } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import FontFamilySelect from '@/shared/components/organisms/FontFamilySelect.vue'
import RawFileLayout from '@/domains/memora/layouts/RawFileLayout.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useRawFileStore } from '@/domains/memora/stores/rawFile'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { storeToRefs } from 'pinia'
import { getAccentColor } from '@/shared/utils/colors'
import { fontStyleOptions as baseFontStyleOptions } from '@/shared/utils/designConstants'
import { generatePassword } from '@/shared/utils/generatePassword'
import { generatePin } from '@/shared/utils/generatePin'
import { Skeleton } from '@/shared/components/shadcn/skeleton'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const rawFileStore = useRawFileStore()
const rawFilesApi = useRawFilesApi()

// RawFile data
const rawFile = ref(null)
const isLoading = ref(false)
const isSaving = ref(false)

// Settings state
const rawFileName = ref('')
const rawFileDescription = ref('')
const rawFileColor = ref(getAccentColor())
const hasPassword = ref(false)
const currentPassword = ref('') // Store the actual password value
const isChangingPassword = ref(false)
const newPassword = ref('')
const isSavingPassword = ref(false)
const allowedEmail = ref('')
const galleryAssist = ref(false)
const isSavingAllowedEmails = ref(false)
const emailsSaved = ref(false)
const nameSaved = ref(false)
const colorSaved = ref(false)
const typographySaved = ref(false)
const downloadEnabled = ref(true)
const downloadPinEnabled = ref(false)
const downloadPin = ref('')

// Typography state
const fontFamily = ref('sans')
const fontStyle = ref('normal')

// Font style options
const fontStyleOptions = [
  ...baseFontStyleOptions,
  { value: 'bold italic', label: 'Bold Italic' },
]


// Helper function for style preview
const getStylePreview = styleValue => {
  if (!styleValue) {
    return {
      fontWeight: 'normal',
      fontStyle: 'normal',
    }
  }
  const styles = styleValue.split(/[\s-]+/).filter(s => s.length > 0)
  return {
    fontWeight: styles.includes('bold') ? 'bold' : 'normal',
    fontStyle: styles.includes('italic') ? 'italic' : 'normal',
  }
}

// Original values for change tracking
const originalValues = ref({
  name: '',
  description: '',
  color: getAccentColor(),
  viewMode: 'grid',
  gridSize: 'medium',
  showFilename: true,
  sortOrder: 'uploaded-new-old',
  allowedEmail: '',
  fontFamily: 'sans',
  fontStyle: 'normal',
  galleryAssist: false,
  downloadEnabled: true,
})

// Display preferences (from store)
const { viewMode, gridSize, showFilename, sortOrder } = storeToRefs(rawFileStore)

// Computed

const passwordDisplay = computed(() => {
  if (!hasPassword.value) return ''
  return currentPassword.value || '••••••••'
})

const isValidEmail = email => {
  if (!email || !email.trim()) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}


const rawFileCoverImage = computed(() => {
  return rawFile.value?.coverPhotoUrl || rawFile.value?.cover_photo_url || null
})

// Check if there are unsaved changes
const hasChanges = computed(() => {
  return (
    rawFileName.value !== originalValues.value.name ||
    rawFileDescription.value !== originalValues.value.description ||
    rawFileColor.value !== originalValues.value.color ||
    viewMode.value !== originalValues.value.viewMode ||
    gridSize.value !== originalValues.value.gridSize ||
    showFilename.value !== originalValues.value.showFilename ||
    sortOrder.value !== originalValues.value.sortOrder ||
    fontFamily.value !== originalValues.value.fontFamily ||
    fontStyle.value !== originalValues.value.fontStyle ||
    galleryAssist.value !== originalValues.value.galleryAssist ||
    downloadEnabled.value !== originalValues.value.downloadEnabled ||
    downloadPinEnabled.value !== originalValues.value.downloadPinEnabled ||
    downloadPin.value !== originalValues.value.downloadPin
  )
})

// Load rawFile data
onMounted(async () => {
  const rawFileId = route.params.id
  if (!rawFileId) return

  isLoading.value = true
  try {
    const rawFileData = await rawFileStore.fetchRawFile(rawFileId)
    rawFile.value = rawFileData
    rawFileName.value = rawFileData.name || ''
    rawFileDescription.value = rawFileData.description || ''
    rawFileColor.value = rawFileData.color || getAccentColor()
    hasPassword.value = !!rawFileData.hasPassword || !!rawFileData.password
    galleryAssist.value = rawFileData.galleryAssist ?? rawFileData.settings?.general?.galleryAssist ?? false
    
    // Load download settings
    const downloadSettings = rawFileData.download || {}
    downloadEnabled.value = downloadSettings.downloadEnabled !== undefined ? downloadSettings.downloadEnabled : (rawFileData.downloadEnabled !== false)
    downloadPinEnabled.value = downloadSettings.downloadPinEnabled ?? false
    downloadPin.value = downloadSettings.downloadPin || ''

    // Set password from backend response (only available for owner)
    if (rawFileData.password) {
      currentPassword.value = rawFileData.password
    }

    // Initialize allowedEmail as single string
    const emails = rawFileData.allowedEmails || rawFileData.allowed_emails
    if (Array.isArray(emails) && emails.length > 0) {
      allowedEmail.value = emails[0] || ''
    } else if (typeof emails === 'string' && emails.trim()) {
      allowedEmail.value = emails.trim()
    } else {
      allowedEmail.value = ''
    }

    // Load display settings from backend
    const displaySettings = rawFileData.display_settings || {}
    if (displaySettings.view_mode) {
      rawFileStore.setViewMode(displaySettings.view_mode)
    }
    if (displaySettings.grid_size) {
      rawFileStore.setGridSize(displaySettings.grid_size)
    }
    if (displaySettings.show_filename !== undefined) {
      rawFileStore.showFilename = displaySettings.show_filename
    }
    if (displaySettings.sort_order) {
      rawFileStore.sortOrder = displaySettings.sort_order
    }

    // Load typography - backend always returns defaults
    const rawFileDesign = rawFileData.design || rawFileData.settings?.design || {}
    const rawFileTypography = rawFileData.typographyDesign || rawFileDesign.typography || {}
    
    fontFamily.value = rawFileTypography.fontFamily || 'sans'
    fontStyle.value = rawFileTypography.fontStyle || 'normal'

    // Store original values for change tracking
    originalValues.value = {
      name: rawFileName.value,
      description: rawFileDescription.value,
      color: rawFileColor.value,
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
      allowedEmail: allowedEmail.value,
      fontFamily: fontFamily.value,
      fontStyle: fontStyle.value,
      galleryAssist: galleryAssist.value,
      downloadEnabled: downloadEnabled.value,
      downloadPinEnabled: downloadPinEnabled.value,
      downloadPin: downloadPin.value,
    }
  } catch (error) {
    toast.error('Failed to load rawFile', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  // Reset to original values if there are unsaved changes
  if (hasChanges.value) {
    rawFileName.value = originalValues.value.name
    rawFileDescription.value = originalValues.value.description
    rawFileColor.value = originalValues.value.color
    rawFileStore.setViewMode(originalValues.value.viewMode)
    rawFileStore.setGridSize(originalValues.value.gridSize)
    rawFileStore.showFilename = originalValues.value.showFilename
    rawFileStore.sortOrder = originalValues.value.sortOrder
  }

  router.push({
    name: 'rawFileDetail',
    params: { id: rawFile.value?.id },
    query: { tab: 'photos' },
  })
}

// Handlers
const handleSave = async () => {
  if (!rawFile.value || !hasChanges.value || isSaving.value) return

  // Validate inputs
  if (!rawFileName.value.trim()) {
    toast.error('Invalid name', {
      description: 'RawFile name cannot be empty.',
    })
    return
  }

  // Validate color format
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!colorRegex.test(rawFileColor.value)) {
    toast.error('Invalid color format', {
      description: 'Please use a valid hex color',
    })
    return
  }

  isSaving.value = true

  try {
    const updateData = {}

    // Update rawFile name
    if (rawFileName.value.trim() !== originalValues.value.name) {
      updateData.name = rawFileName.value.trim()
      nameSaved.value = true
      setTimeout(() => {
        nameSaved.value = false
      }, 2000)
    }

    // Update description
    const normalizedDescription = (rawFileDescription.value || '').trim()
    const normalizedOriginalDescription = (originalValues.value.description || '').trim()
    if (normalizedDescription !== normalizedOriginalDescription) {
      updateData.description = normalizedDescription || null
    }

    // Update color
    if (rawFileColor.value !== originalValues.value.color) {
      updateData.color = rawFileColor.value
      colorSaved.value = true
      setTimeout(() => {
        colorSaved.value = false
      }, 2000)
    }

    // Update typography if changed
    if (
      fontFamily.value !== originalValues.value.fontFamily ||
      fontStyle.value !== originalValues.value.fontStyle
    ) {
      updateData.typographyDesign = {
        fontFamily: fontFamily.value,
        fontStyle: fontStyle.value,
      }
      typographySaved.value = true
      setTimeout(() => {
        typographySaved.value = false
      }, 2000)
    }

    // Update gallery assist if changed
    if (galleryAssist.value !== originalValues.value.galleryAssist) {
      updateData.galleryAssist = galleryAssist.value
    }

    // Update download settings if changed
    if (
      downloadEnabled.value !== originalValues.value.downloadEnabled ||
      downloadPinEnabled.value !== originalValues.value.downloadPinEnabled ||
      downloadPin.value !== originalValues.value.downloadPin
    ) {
      updateData.download = {
        downloadEnabled: downloadEnabled.value,
        downloadPinEnabled: downloadPinEnabled.value,
        downloadPin: downloadPinEnabled.value && downloadPin.value ? downloadPin.value : null,
      }
      // Also set top-level downloadEnabled for backward compatibility
      updateData.downloadEnabled = downloadEnabled.value
    }

    // Save rawFile updates
    if (Object.keys(updateData).length > 0) {
      const updatedRawFile = await rawFilesApi.updateRawFile(rawFile.value.id, updateData)
      
      // Update local rawFile object
      if (updatedRawFile) {
        rawFile.value = updatedRawFile
        // Reload typography from updated rawFile - backend always returns defaults
        const updatedDesign = updatedRawFile.design || updatedRawFile.settings?.design || {}
        const updatedTypography = updatedRawFile.typographyDesign || updatedDesign.typography || {}
        
        fontFamily.value = updatedTypography.fontFamily || 'sans'
        fontStyle.value = updatedTypography.fontStyle || 'normal'
        
        // Reload galleryAssist from updated rawFile
        galleryAssist.value = updatedRawFile.galleryAssist ?? updatedRawFile.settings?.general?.galleryAssist ?? false
        
        // Reload download settings from updated rawFile
        const updatedDownloadSettings = updatedRawFile.download || {}
        downloadEnabled.value = updatedDownloadSettings.downloadEnabled !== undefined ? updatedDownloadSettings.downloadEnabled : (updatedRawFile.downloadEnabled !== false)
        downloadPinEnabled.value = updatedDownloadSettings.downloadPinEnabled ?? false
        downloadPin.value = updatedDownloadSettings.downloadPin || ''
        
        // Update original values to reflect saved state
        originalValues.value.fontFamily = fontFamily.value
        originalValues.value.fontStyle = fontStyle.value
        originalValues.value.galleryAssist = galleryAssist.value
        originalValues.value.downloadEnabled = downloadEnabled.value
        originalValues.value.downloadPinEnabled = downloadPinEnabled.value
        originalValues.value.downloadPin = downloadPin.value
      } else {
        if (updateData.name) rawFile.value.name = updateData.name
        if ('description' in updateData) rawFile.value.description = updateData.description
        if (updateData.color) rawFile.value.color = updateData.color
        if (updateData.typographyDesign) {
          if (!rawFile.value.design) {
            rawFile.value.design = {}
          }
          if (!rawFile.value.design.typography) {
            rawFile.value.design.typography = {}
          }
          rawFile.value.design.typography = { ...updateData.typographyDesign }
          rawFile.value.typographyDesign = { ...updateData.typographyDesign }
          // Update local refs and original values
          if (updateData.typographyDesign.fontFamily !== undefined) fontFamily.value = updateData.typographyDesign.fontFamily
          if (updateData.typographyDesign.fontStyle !== undefined) fontStyle.value = updateData.typographyDesign.fontStyle
          originalValues.value.fontFamily = fontFamily.value
          originalValues.value.fontStyle = fontStyle.value
        }
        if ('galleryAssist' in updateData) {
          if (!rawFile.value.settings) {
            rawFile.value.settings = {}
          }
          if (!rawFile.value.settings.general) {
            rawFile.value.settings.general = {}
          }
          rawFile.value.settings.general.galleryAssist = updateData.galleryAssist
          rawFile.value.galleryAssist = updateData.galleryAssist
          originalValues.value.galleryAssist = galleryAssist.value
        }
        if ('download' in updateData || 'downloadEnabled' in updateData) {
          if (!rawFile.value.settings) {
            rawFile.value.settings = {}
          }
          if (!rawFile.value.settings.download) {
            rawFile.value.settings.download = {}
          }
          if ('download' in updateData) {
            rawFile.value.settings.download = { ...updateData.download }
            rawFile.value.download = { ...updateData.download }
          }
          if ('downloadEnabled' in updateData) {
            rawFile.value.downloadEnabled = updateData.downloadEnabled
            rawFile.value.settings.download.downloadEnabled = updateData.downloadEnabled
          }
          // Update local refs from updateData
          if ('download' in updateData) {
            if ('downloadEnabled' in updateData.download) {
              downloadEnabled.value = updateData.download.downloadEnabled
            }
            if ('downloadPinEnabled' in updateData.download) {
              downloadPinEnabled.value = updateData.download.downloadPinEnabled
            }
            if ('downloadPin' in updateData.download) {
              downloadPin.value = updateData.download.downloadPin || ''
            }
          }
          if ('downloadEnabled' in updateData) {
            downloadEnabled.value = updateData.downloadEnabled
          }
          originalValues.value.downloadEnabled = downloadEnabled.value
          originalValues.value.downloadPinEnabled = downloadPinEnabled.value
          originalValues.value.downloadPin = downloadPin.value
        }
      }
    }

    // Prepare display settings for backend
    const displaySettings = {}
    if (viewMode.value !== originalValues.value.viewMode) {
      displaySettings.view_mode = viewMode.value
    }
    if (gridSize.value !== originalValues.value.gridSize) {
      displaySettings.grid_size = gridSize.value
    }
    if (showFilename.value !== originalValues.value.showFilename) {
      displaySettings.show_filename = showFilename.value
    }
    if (sortOrder.value !== originalValues.value.sortOrder) {
      displaySettings.sort_order = sortOrder.value
    }

    // Update display settings in backend
    if (Object.keys(displaySettings).length > 0) {
      updateData.display_settings = displaySettings
    }

    // Update display preferences in store (keep for immediate UI updates)
    if (viewMode.value !== originalValues.value.viewMode) {
      rawFileStore.setViewMode(viewMode.value)
    }
    if (gridSize.value !== originalValues.value.gridSize) {
      rawFileStore.setGridSize(gridSize.value)
    }
    if (showFilename.value !== originalValues.value.showFilename) {
      rawFileStore.showFilename = showFilename.value
    }
    if (sortOrder.value !== originalValues.value.sortOrder) {
      rawFileStore.sortOrder = sortOrder.value
    }

    // Update original values
    originalValues.value = {
      name: rawFileName.value.trim(),
      description: rawFileDescription.value,
      color: rawFileColor.value,
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
      allowedEmail: allowedEmail.value,
      fontFamily: fontFamily.value,
      fontStyle: fontStyle.value,
      galleryAssist: galleryAssist.value,
      downloadEnabled: downloadEnabled.value,
      downloadPinEnabled: downloadPinEnabled.value,
      downloadPin: downloadPin.value,
    }

    toast.success('Settings saved', {
      description: 'All changes have been saved successfully.',
    })
  } catch (error) {
    toast.error('Failed to save settings', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  } finally {
    isSaving.value = false
  }
}

const handlePasswordToggle = async enabled => {
  if (!rawFile.value?.id) return

  // Store the previous state to check what changed
  const wasEnabled = hasPassword.value

  if (enabled && !wasEnabled) {
    // Password is being enabled
    if (currentPassword.value) {
      // If we have a password stored, enable it immediately
      try {
        await rawFilesApi.updateRawFile(rawFile.value.id, {
          password: currentPassword.value,
        })
        hasPassword.value = true
        // Update rawFile object
        if (rawFile.value) {
          rawFile.value.password = currentPassword.value
          rawFile.value.hasPassword = true
        }
        toast.success('Password enabled', {
          description: 'Password protection has been enabled for this rawFile.',
        })
      } catch (error) {
        // Revert the toggle if API call fails
        hasPassword.value = false
        toast.error('Failed to enable password', {
          description: getErrorMessage(error, 'An unknown error occurred'),
        })
      }
    } else {
      // No password set yet - prompt user to enter one
      hasPassword.value = true // Update UI to show password input
      isChangingPassword.value = true
    }
  } else if (!enabled && wasEnabled) {
    // User wants to disable password - remove it from backend
    try {
      await rawFilesApi.updateRawFile(rawFile.value.id, {
        password: '', // Empty string will set password to null in backend
      })
      hasPassword.value = false
      currentPassword.value = ''
      isChangingPassword.value = false // Reset password change mode
      // Update rawFile object
      if (rawFile.value) {
        rawFile.value.password = null
        rawFile.value.hasPassword = false
      }
      toast.success('Password removed', {
        description: 'Password protection has been disabled for this rawFile.',
      })
    } catch (error) {
      // Revert the toggle if API call fails
      hasPassword.value = true
      toast.error('Failed to remove password', {
        description: getErrorMessage(error, 'An unknown error occurred'),
      })
    }
  }
}

const handleSavePassword = async () => {
  if (!rawFile.value || !newPassword.value.trim()) {
    toast.error('Password required', {
      description: 'Please enter a password.',
    })
    return
  }

  isSavingPassword.value = true
  try {
    const response = await rawFilesApi.updateRawFile(rawFile.value.id, {
      password: newPassword.value,
    })
    hasPassword.value = true
    // Update password from backend response
    // The response structure is: { data: { ...rawFile data... } }
    const updatedRawFile = response?.data || response
    if (updatedRawFile?.password) {
      currentPassword.value = updatedRawFile.password
    } else {
      currentPassword.value = newPassword.value // Fallback to the value we just set
    }
    // Also update the rawFile object to reflect the new password
    if (rawFile.value) {
      rawFile.value.password = currentPassword.value
      rawFile.value.hasPassword = true
    }
    // Refresh the rawFile data to get the latest from backend
    const refreshedRawFile = await rawFileStore.fetchRawFile(rawFile.value.id)
    if (refreshedRawFile?.password) {
      currentPassword.value = refreshedRawFile.password
      rawFile.value = refreshedRawFile
    }
    isChangingPassword.value = false
    newPassword.value = ''
    toast.success('Password set', {
      description: 'Password protection has been enabled for this rawFile.',
    })
  } catch (error) {
    toast.error('Failed to set password', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  } finally {
    isSavingPassword.value = false
  }
}

const handleGeneratePassword = () => {
  newPassword.value = generatePassword()
  toast.success('Password generated', {
    description: 'A new password has been generated.',
  })
}

const handleCopyPassword = async () => {
  if (!currentPassword.value) {
    toast.error('No password available', {
      description: 'Password is not set or not available.',
    })
    return
  }

  try {
    await navigator.clipboard.writeText(currentPassword.value)
    toast.success('Password copied!', {
      description: 'Password has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: 'Could not copy password to clipboard. Please try again.',
    })
  }
}

// Allowed email management
const handleAllowedEmailChange = async (forceSave = false) => {
  if (!rawFile.value) return
  if (isSavingAllowedEmails.value && !forceSave) return

  const emailValue = (allowedEmail.value || '').trim().toLowerCase()
  const isValid = emailValue ? isValidEmail(emailValue) : true

  if (emailValue && !isValid) {
    return
  }

  // Only save if email changed
  if (!forceSave) {
    const currentEmails = rawFile.value.allowedEmails || rawFile.value.allowed_emails || []
    const currentEmail = Array.isArray(currentEmails) && currentEmails.length > 0 
      ? currentEmails[0].toLowerCase().trim() 
      : typeof currentEmails === 'string' 
        ? currentEmails.toLowerCase().trim() 
        : ''
    
    if (emailValue === currentEmail) {
      return
    }
  }

  isSavingAllowedEmails.value = true
  try {
    await rawFilesApi.updateRawFile(rawFile.value.id, {
      allowedEmails: emailValue ? [emailValue] : null,
    })
    const updatedRawFile = await rawFileStore.fetchRawFile(rawFile.value.id)
    rawFile.value = updatedRawFile
    
    const savedEmails = updatedRawFile.allowedEmails || updatedRawFile.allowed_emails || []
    if (Array.isArray(savedEmails) && savedEmails.length > 0) {
      allowedEmail.value = savedEmails[0]
      rawFile.value.allowedEmails = savedEmails
      rawFile.value.allowed_emails = savedEmails
    } else if (typeof savedEmails === 'string' && savedEmails.trim()) {
      allowedEmail.value = savedEmails.trim()
      rawFile.value.allowedEmails = [savedEmails.trim()]
      rawFile.value.allowed_emails = [savedEmails.trim()]
    } else {
      allowedEmail.value = ''
      rawFile.value.allowedEmails = null
      rawFile.value.allowed_emails = null
    }

    emailsSaved.value = true
    setTimeout(() => {
      emailsSaved.value = false
    }, 3000)

    toast.success('Email updated', {
      description: emailValue ? 'Email saved successfully.' : 'Email restriction removed.',
    })
  } catch (error) {
    emailsSaved.value = false
    toast.error('Failed to update email', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
    // Reload to get original values
    const rawFileData = await rawFileStore.fetchRawFile(rawFile.value.id)
    const emails = rawFileData.allowedEmails || rawFileData.allowed_emails || []
    if (Array.isArray(emails) && emails.length > 0) {
      allowedEmail.value = emails[0]
    } else if (typeof emails === 'string' && emails.trim()) {
      allowedEmail.value = emails.trim()
    } else {
      allowedEmail.value = ''
    }
  } finally {
    isSavingAllowedEmails.value = false
  }
}

const handlePasswordChange = async () => {
  if (!newPassword.value.trim() || !isChangingPassword.value) return
  // Only save if user explicitly clicks save button
}

const handleImageError = event => {
  const img = event.target
  if (img && img.src) {
    img.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
  }
}

const formatDate = date => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const resetDownloadPin = () => {
  downloadPin.value = generatePin(4)
  toast.success('PIN reset. Click "Save Changes" to apply.')
}

const copyDownloadPin = async () => {
  if (!downloadPin.value) return
  try {
    await navigator.clipboard.writeText(downloadPin.value)
    toast.success('PIN copied to clipboard')
  } catch (error) {
    toast.error('Failed to copy PIN')
  }
}

</script>

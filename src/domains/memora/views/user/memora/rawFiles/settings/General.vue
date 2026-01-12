<template>
  <RawFilesLayout :is-loading="isLoading" :raw-files="rawFiles" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading settings...</p>
          </div>
        </div>

        <div v-else class="max-w-[50%] p-6 md:p-8 transition-all duration-300">
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
              Configure general settings for your raw files phase including name, color, and display
              preferences.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Raw Files Name -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Raw Files Name
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    The name of this raw files phase as it appears in your dashboard.
                  </p>
                </div>
                <div v-if="nameSaved" class="flex items-center gap-2 text-violet-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <Input
                v-model="rawFilesName"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-md focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="My Raw Files"
                @keydown.enter="handleSave"
              />
            </div>

            <!-- Raw Files Description -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Description</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Optional description for this raw files phase.
                  </p>
                </div>
              </div>
              <Textarea
                v-model="rawFilesDescription"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-2xl min-h-[100px] resize-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Enter a description for this raw files phase..."
                :maxlength="1000"
                @keydown.enter.prevent="handleSave"
              />
              <div class="flex items-center justify-between max-w-2xl">
                <p :class="theme.textTertiary" class="text-xs">
                  Description is shown to clients viewing this raw files phase.
                </p>
                <span :class="theme.textTertiary" class="text-xs">
                  {{ (rawFilesDescription || '').length }}/1000
                </span>
              </div>
            </div>

            <!-- Raw Files Color -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Raw Files Color
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Choose a color to help identify this raw files phase in your dashboard.
                  </p>
                </div>
                <div v-if="colorSaved" class="flex items-center gap-2 text-violet-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <input
                  v-model="rawFilesColor"
                  :class="theme.borderSecondary"
                  class="h-12 w-20 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                  type="color"
                  @change="handleSave"
                />
                <Input
                  v-model="rawFilesColor"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="flex-1 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono text-sm"
                  :placeholder="getAccentColor()"
                  @keydown.enter="handleSave"
                />
                <div
                  class="h-12 w-12 rounded-lg border-2 transition-all"
                  :style="{ backgroundColor: rawFilesColor, borderColor: rawFilesColor }"
                  :class="theme.borderSecondary"
                ></div>
              </div>
            </div>

            <!-- Allowed Emails -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Allowed Emails
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Specify which email addresses are allowed to access this raw files phase. Leave empty
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
              <div class="space-y-3 max-w-2xl">
                <div
                  v-for="(email, index) in allowedEmails || []"
                  :key="index"
                  class="flex items-start gap-2 group"
                >
                  <div class="flex-1 relative">
                    <Input
                      v-model="allowedEmails[index]"
                      :class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        email && !isValidEmail(email) ? 'border-red-300 dark:border-red-700' : '',
                      ]"
                      class="w-full transition-all"
                      placeholder="email@example.com"
                      type="email"
                      @blur="() => handleAllowedEmailsChange(false)"
                      @keydown.enter="handleAllowedEmailsChange(true)"
                    />
                    <p
                      v-if="email && !isValidEmail(email)"
                      class="absolute -bottom-5 left-0 text-xs text-red-500 dark:text-red-400 mt-1"
                    >
                      Please enter a valid email address
                    </p>
                  </div>
                  <Button
                    v-if="allowedEmails.length > 1"
                    variant="ghost"
                    size="sm"
                    :class="[
                      theme.textSecondary,
                      theme.bgButtonHover,
                      'opacity-0 group-hover:opacity-100 transition-opacity',
                    ]"
                    @click="removeAllowedEmail(index)"
                  >
                    <X class="h-4 w-4" />
                  </Button>
                  <div v-else class="w-10"></div>
                </div>
                <div class="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    @click="addAllowedEmail"
                  >
                    <Plus class="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                  <Button
                    :class="[
                      'bg-violet-500 hover:bg-violet-600 text-white transition-all',
                      isSavingAllowedEmails ? 'opacity-75 cursor-not-allowed' : '',
                    ]"
                    :disabled="isSavingAllowedEmails || !hasValidEmails"
                    size="sm"
                    :loading="isSavingAllowedEmails"
                    loading-label="Saving..."
                    :icon="!isSavingAllowedEmails && emailsSaved ? Check : null"
                    @click="handleAllowedEmailsChange(true)"
                  >
                    {{ emailsSaved ? 'Saved' : 'Save Emails' }}
                  </Button>
                </div>
                <div class="space-y-1 pt-1">
                  <p
                    v-if="hasValidEmails && allowedEmails.some(e => e && e.trim())"
                    :class="theme.textSecondary"
                    class="text-xs"
                  >
                    <span class="font-medium text-violet-600 dark:text-violet-400">
                      {{ validEmailsCount }} email{{ validEmailsCount !== 1 ? 's' : '' }}
                      configured.
                    </span>
                  </p>
                  <p
                    v-else-if="
                      !allowedEmails ||
                      allowedEmails.length === 0 ||
                      allowedEmails.every(e => !e || !e.trim())
                    "
                    :class="theme.textSecondary"
                    class="text-xs italic"
                  >
                    No email restrictions. Anyone with the link can access this raw files phase.
                  </p>
                </div>
              </div>
            </div>

            <!-- Password Protection -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Password Protection
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Require a password for customers to access this raw files phase.
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
                  <div class="flex-1">
                    <PasswordInput
                      v-model="newPassword"
                      :input-class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        'focus:ring-2 focus:ring-violet-500/20 transition-all',
                      ]"
                      placeholder="Enter new password"
                      @blur="handlePasswordChange"
                    />
                  </div>
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

            <!-- Download PIN -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Download PIN
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Require a 4-digit PIN for customers to download files from this raw files phase.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch
                    :model-value="downloadPinEnabled"
                    label=""
                    @update:model-value="handleDownloadPinToggle"
                  />
                </div>
              </div>
              <div v-if="downloadPinEnabled" class="space-y-3 max-w-md">
                <div v-if="!isChangingDownloadPin" class="flex items-center gap-2">
                  <div class="flex-1">
                    <Input
                      :model-value="downloadPinDisplay"
                      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                      class="w-full focus:ring-2 focus:ring-violet-500/20 transition-all font-mono text-center text-lg"
                      readonly
                      placeholder="0000"
                      maxlength="4"
                    />
                  </div>
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="handleCopyDownloadPin"
                  >
                    <Copy class="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div v-else class="flex items-center gap-2">
                  <div class="flex-1">
                    <Input
                      v-model="newDownloadPin"
                      :class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        newDownloadPin && !isValidDownloadPin(newDownloadPin) ? 'border-red-300 dark:border-red-700' : '',
                      ]"
                      class="w-full focus:ring-2 focus:ring-violet-500/20 transition-all font-mono text-center text-lg"
                      placeholder="0000"
                      maxlength="4"
                      @input="newDownloadPin = newDownloadPin.replace(/\D/g, '')"
                    />
                  </div>
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="handleGenerateDownloadPin"
                  >
                    <RefreshCw class="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                <p
                  v-if="newDownloadPin && !isValidDownloadPin(newDownloadPin)"
                  class="text-xs text-red-500 dark:text-red-400"
                >
                  PIN must be exactly 4 digits
                </p>
                <div class="flex items-center gap-2">
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="isChangingDownloadPin = !isChangingDownloadPin"
                  >
                    {{ isChangingDownloadPin ? 'Cancel' : 'Change PIN' }}
                  </Button>
                  <Button
                    v-if="isChangingDownloadPin && newDownloadPin && isValidDownloadPin(newDownloadPin)"
                    :class="['bg-violet-500 hover:bg-violet-600 text-white']"
                    :disabled="isSavingDownloadPin"
                    size="sm"
                    :loading="isSavingDownloadPin"
                    loading-label="Saving..."
                    @click="handleSaveDownloadPin"
                  >
                    Save PIN
                  </Button>
                </div>
              </div>
            </div>

            <!-- Limit Downloads -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Limit Downloads
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Set a maximum number of downloads allowed for this raw files phase.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch
                    :model-value="limitDownloads"
                    label=""
                    @update:model-value="handleLimitDownloadsToggle"
                  />
                </div>
              </div>
              <div v-if="limitDownloads" class="space-y-4 max-w-md">
                <div>
                  <label :class="theme.textPrimary" class="text-sm font-medium mb-2 block">
                    Maximum Downloads
                  </label>
                  <div class="flex items-center gap-3">
                    <Input
                      v-model.number="downloadLimit"
                      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                      class="max-w-xs focus:ring-2 focus:ring-violet-500/20 transition-all"
                      max="9999"
                      min="1"
                      placeholder="1"
                      type="number"
                      @keydown.enter="handleSave"
                    />
                    <span :class="theme.textSecondary" class="text-sm">downloads</span>
                  </div>
                  <p :class="theme.textSecondary" class="text-xs mt-2">
                    Once this limit is reached, no more downloads will be allowed.
                  </p>
                </div>
              </div>
            </div>

            <!-- Display Preferences -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Display Preferences
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Configure how media is displayed in this raw files phase (your view only).
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
  </RawFilesLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Info, Loader2, Check, X, Plus, Copy, RefreshCw } from 'lucide-vue-next'
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
import RawFilesLayout from '@/shared/layouts/RawFilesLayout.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { getAccentColor } from '@/shared/utils/colors'
import { generatePassword } from '@/shared/utils/generatePassword'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const rawFilesApi = useRawFilesApi()

// Raw files data
const rawFiles = ref(null)
const isLoading = ref(false)
const isSaving = ref(false)

// Settings state
const rawFilesName = ref('')
const rawFilesDescription = ref('')
const rawFilesColor = ref(getAccentColor())
const nameSaved = ref(false)
const colorSaved = ref(false)
const hasPassword = ref(false)
const currentPassword = ref('')
const isChangingPassword = ref(false)
const newPassword = ref('')
const isSavingPassword = ref(false)
const allowedEmails = ref([])
const isSavingAllowedEmails = ref(false)
const emailsSaved = ref(false)
const downloadPinEnabled = ref(false)
const currentDownloadPin = ref('')
const isChangingDownloadPin = ref(false)
const newDownloadPin = ref('')
const isSavingDownloadPin = ref(false)
const limitDownloads = ref(false)
const downloadLimit = ref(1)

// Display preferences (from localStorage or defaults)
const viewMode = ref('grid')
const gridSize = ref('medium')
const showFilename = ref(true)
const sortOrder = ref('uploaded-new-old')

// Original values for change tracking
const originalValues = ref({
  name: '',
  description: '',
  color: getAccentColor(),
  viewMode: 'grid',
  gridSize: 'medium',
  showFilename: true,
  sortOrder: 'uploaded-new-old',
  allowedEmails: [],
  hasPassword: false,
  downloadPinEnabled: false,
  limitDownloads: false,
  downloadLimit: 1,
})

// Computed
const passwordDisplay = computed(() => {
  if (!hasPassword.value) return ''
  return currentPassword.value || '••••••••'
})

const downloadPinDisplay = computed(() => {
  if (!downloadPinEnabled.value) return ''
  return currentDownloadPin.value || '••••'
})

const isValidEmail = email => {
  if (!email || !email.trim()) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

const hasValidEmails = computed(() => {
  return allowedEmails.value.some(email => isValidEmail(email))
})

const validEmailsCount = computed(() => {
  return allowedEmails.value.filter(email => isValidEmail(email)).length
})

const isValidDownloadPin = pin => {
  return /^\d{4}$/.test(pin)
}

const hasChanges = computed(() => {
  return (
    rawFilesName.value !== originalValues.value.name ||
    rawFilesDescription.value !== originalValues.value.description ||
    rawFilesColor.value !== originalValues.value.color ||
    viewMode.value !== originalValues.value.viewMode ||
    gridSize.value !== originalValues.value.gridSize ||
    showFilename.value !== originalValues.value.showFilename ||
    sortOrder.value !== originalValues.value.sortOrder
  )
})

// Load raw files data
onMounted(async () => {
  const rawFilesId = route.params.id
  if (!rawFilesId) return

  isLoading.value = true
  try {
    const rawFilesData = await rawFilesApi.fetchRawFiles(rawFilesId)
    rawFiles.value = rawFilesData
    rawFilesName.value = rawFilesData.name || ''
    rawFilesDescription.value = rawFilesData.description || ''
    rawFilesColor.value = rawFilesData.color || getAccentColor()
    hasPassword.value = !!rawFilesData.hasPassword || !!rawFilesData.password
    if (rawFilesData.password) {
      currentPassword.value = rawFilesData.password
    }
    downloadPinEnabled.value = rawFilesData.downloadPinEnabled || false
    if (rawFilesData.downloadPin) {
      currentDownloadPin.value = rawFilesData.downloadPin
    }
    limitDownloads.value = rawFilesData.limitDownloads || false
    downloadLimit.value = rawFilesData.downloadLimit || 1

    // Initialize allowedEmails as array
    const emails = rawFilesData.allowedEmails || rawFilesData.allowed_emails
    allowedEmails.value = Array.isArray(emails) && emails.length > 0 ? [...emails, ''] : ['']

    // Load display settings from localStorage
    const displaySettingsKey = `rawFiles_${rawFilesId}_display`
    const savedSettings = localStorage.getItem(displaySettingsKey)
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.viewMode) viewMode.value = settings.viewMode
        if (settings.gridSize) gridSize.value = settings.gridSize
        if (settings.showFilename !== undefined) showFilename.value = settings.showFilename
        if (settings.sortOrder) sortOrder.value = settings.sortOrder
      } catch (e) {
        console.error('Failed to parse display settings:', e)
      }
    }

    // Store original values for change tracking
    originalValues.value = {
      name: rawFilesName.value,
      description: rawFilesDescription.value,
      color: rawFilesColor.value,
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
      allowedEmails: [...allowedEmails.value.filter(e => e && e.trim())],
      hasPassword: hasPassword.value,
      downloadPinEnabled: downloadPinEnabled.value,
      limitDownloads: limitDownloads.value,
      downloadLimit: downloadLimit.value,
    }
  } catch (error) {
    toast.error('Failed to load raw files', {
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
    rawFilesName.value = originalValues.value.name
    rawFilesDescription.value = originalValues.value.description
    rawFilesColor.value = originalValues.value.color
    viewMode.value = originalValues.value.viewMode
    gridSize.value = originalValues.value.gridSize
    showFilename.value = originalValues.value.showFilename
    sortOrder.value = originalValues.value.sortOrder
    allowedEmails.value = [...originalValues.value.allowedEmails, '']
    hasPassword.value = originalValues.value.hasPassword
    downloadPinEnabled.value = originalValues.value.downloadPinEnabled
    limitDownloads.value = originalValues.value.limitDownloads
    downloadLimit.value = originalValues.value.downloadLimit
  }

  router.push({
    name: 'rawFilesDetail',
    params: { id: rawFiles.value?.id },
    query: { tab: 'photos' },
  })
}

// Handlers
const handleSave = async () => {
  if (!rawFiles.value || !hasChanges.value || isSaving.value) return

  // Validate inputs
  if (!rawFilesName.value.trim()) {
    toast.error('Invalid name', {
      description: 'Raw files name cannot be empty.',
    })
    return
  }

  // Validate color format
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!colorRegex.test(rawFilesColor.value)) {
    toast.error('Invalid color format', {
      description: 'Please use a valid hex color',
    })
    return
  }

  isSaving.value = true

  try {
    const updateData = {}

    // Update raw files name
    if (rawFilesName.value.trim() !== originalValues.value.name) {
      updateData.name = rawFilesName.value.trim()
      nameSaved.value = true
      setTimeout(() => {
        nameSaved.value = false
      }, 2000)
    }

    // Update description
    const normalizedDescription = (rawFilesDescription.value || '').trim()
    const normalizedOriginalDescription = (originalValues.value.description || '').trim()
    if (normalizedDescription !== normalizedOriginalDescription) {
      updateData.description = normalizedDescription || null
    }

    // Update color
    if (rawFilesColor.value !== originalValues.value.color) {
      updateData.color = rawFilesColor.value
      colorSaved.value = true
      setTimeout(() => {
        colorSaved.value = false
      }, 2000)
    }

    // Save raw files updates
    if (Object.keys(updateData).length > 0) {
      const updatedRawFiles = await rawFilesApi.updateRawFiles(rawFiles.value.id, updateData)
      if (updatedRawFiles) {
        rawFiles.value = updatedRawFiles
      } else {
        if (updateData.name) rawFiles.value.name = updateData.name
        if ('description' in updateData) rawFiles.value.description = updateData.description
        if (updateData.color) rawFiles.value.color = updateData.color
      }
    }

    // Save display preferences to localStorage
    const displaySettingsKey = `rawFiles_${rawFiles.value.id}_display`
    const displaySettings = {
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
    }
    localStorage.setItem(displaySettingsKey, JSON.stringify(displaySettings))

    // Update original values
    originalValues.value = {
      name: rawFilesName.value.trim(),
      description: rawFilesDescription.value,
      color: rawFilesColor.value,
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
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

// Password handlers
const handlePasswordToggle = async enabled => {
  if (!rawFiles.value?.id) return

  const wasEnabled = hasPassword.value

  if (enabled && !wasEnabled) {
    if (currentPassword.value) {
      try {
        await rawFilesApi.updateRawFiles(rawFiles.value.id, {
          password: currentPassword.value,
        })
        hasPassword.value = true
        if (rawFiles.value) {
          rawFiles.value.password = currentPassword.value
          rawFiles.value.hasPassword = true
        }
        toast.success('Password enabled', {
          description: 'Password protection has been enabled for this raw files phase.',
        })
      } catch (error) {
        hasPassword.value = false
        toast.error('Failed to enable password', {
          description: getErrorMessage(error, 'An unknown error occurred'),
        })
      }
    } else {
      hasPassword.value = true
      isChangingPassword.value = true
    }
  } else if (!enabled && wasEnabled) {
    try {
      await rawFilesApi.updateRawFiles(rawFiles.value.id, {
        password: '',
      })
      hasPassword.value = false
      currentPassword.value = ''
      isChangingPassword.value = false
      if (rawFiles.value) {
        rawFiles.value.password = null
        rawFiles.value.hasPassword = false
      }
      toast.success('Password removed', {
        description: 'Password protection has been disabled for this raw files phase.',
      })
    } catch (error) {
      hasPassword.value = true
      toast.error('Failed to remove password', {
        description: getErrorMessage(error, 'An unknown error occurred'),
      })
    }
  }
}

const handleSavePassword = async () => {
  if (!rawFiles.value || !newPassword.value.trim()) {
    toast.error('Password required', {
      description: 'Please enter a password.',
    })
    return
  }

  isSavingPassword.value = true
  try {
    const response = await rawFilesApi.updateRawFiles(rawFiles.value.id, {
      password: newPassword.value,
    })
    hasPassword.value = true
    const updatedRawFiles = response?.data || response
    if (updatedRawFiles?.password) {
      currentPassword.value = updatedRawFiles.password
    } else {
      currentPassword.value = newPassword.value
    }
    if (rawFiles.value) {
      rawFiles.value.password = currentPassword.value
      rawFiles.value.hasPassword = true
    }
    const refreshedRawFiles = await rawFilesApi.fetchRawFiles(rawFiles.value.id)
    if (refreshedRawFiles?.password) {
      currentPassword.value = refreshedRawFiles.password
      rawFiles.value = refreshedRawFiles
    }
    isChangingPassword.value = false
    newPassword.value = ''
    toast.success('Password set', {
      description: 'Password protection has been enabled for this raw files phase.',
    })
  } catch (error) {
    toast.error('Failed to set password', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  } finally {
    isSavingPassword.value = false
  }
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

const handlePasswordChange = async () => {
  if (!newPassword.value.trim() || !isChangingPassword.value) return
}

const handleGeneratePassword = () => {
  newPassword.value = generatePassword()
  toast.success('Password generated', {
    description: 'A new password has been generated.',
  })
}

// Allowed emails handlers
const addAllowedEmail = () => {
  if (!Array.isArray(allowedEmails.value)) {
    allowedEmails.value = []
  }
  allowedEmails.value.push('')
}

const removeAllowedEmail = index => {
  if (!Array.isArray(allowedEmails.value)) {
    allowedEmails.value = []
    return
  }
  allowedEmails.value.splice(index, 1)
  handleAllowedEmailsChange()
}

const handleAllowedEmailsChange = async (forceSave = false) => {
  if (!rawFiles.value) return
  if (isSavingAllowedEmails.value && !forceSave) return

  const emailsArray = Array.isArray(allowedEmails.value) ? allowedEmails.value : []

  const validEmails = emailsArray
    .map(email => (email || '').trim().toLowerCase())
    .filter(email => {
      if (!email) return false
      return isValidEmail(email)
    })

  const uniqueEmails = [...new Set(validEmails)]

  if (!forceSave) {
    const currentEmails = rawFiles.value.allowedEmails || rawFiles.value.allowed_emails || []
    const currentEmailsNormalized = (Array.isArray(currentEmails) ? currentEmails : [])
      .map(e => (e || '').toLowerCase().trim())
      .filter(Boolean)
    const currentEmailsSet = new Set(currentEmailsNormalized)
    const newEmailsSet = new Set(uniqueEmails)

    const emailsMatch =
      currentEmailsSet.size === newEmailsSet.size &&
      [...currentEmailsSet].every(email => newEmailsSet.has(email))

    if (emailsMatch) {
      return
    }
  }

  isSavingAllowedEmails.value = true
  try {
    await rawFilesApi.updateRawFiles(rawFiles.value.id, {
      allowedEmails: uniqueEmails.length > 0 ? uniqueEmails : null,
    })
    const updatedRawFiles = await rawFilesApi.fetchRawFiles(rawFiles.value.id)
    rawFiles.value = updatedRawFiles
    rawFiles.value.allowedEmails = uniqueEmails.length > 0 ? uniqueEmails : []
    rawFiles.value.allowed_emails = uniqueEmails.length > 0 ? uniqueEmails : []

    const savedEmails = updatedRawFiles.allowedEmails || updatedRawFiles.allowed_emails || []
    if (savedEmails.length > 0) {
      allowedEmails.value = [...savedEmails, '']
    } else {
      allowedEmails.value = ['']
    }

    emailsSaved.value = true
    setTimeout(() => {
      emailsSaved.value = false
    }, 3000)

    toast.success('Emails updated', {
      description: `${uniqueEmails.length} email(s) saved successfully.`,
    })
  } catch (error) {
    emailsSaved.value = false
    toast.error('Failed to update emails', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
    const rawFilesData = await rawFilesApi.fetchRawFiles(rawFiles.value.id)
    allowedEmails.value = Array.isArray(rawFilesData.allowedEmails)
      ? [...rawFilesData.allowedEmails, '']
      : Array.isArray(rawFilesData.allowed_emails)
        ? [...rawFilesData.allowed_emails, '']
        : ['']
  } finally {
    isSavingAllowedEmails.value = false
  }
}

// Download PIN handlers
const handleDownloadPinToggle = async enabled => {
  if (!rawFiles.value?.id) return

  const wasEnabled = downloadPinEnabled.value

  if (enabled && !wasEnabled) {
    if (currentDownloadPin.value) {
      try {
        await rawFilesApi.updateRawFiles(rawFiles.value.id, {
          downloadPinEnabled: true,
          downloadPin: currentDownloadPin.value,
        })
        downloadPinEnabled.value = true
        toast.success('Download PIN enabled', {
          description: 'Download PIN protection has been enabled.',
        })
      } catch (error) {
        downloadPinEnabled.value = false
        toast.error('Failed to enable download PIN', {
          description: getErrorMessage(error, 'An unknown error occurred'),
        })
      }
    } else {
      downloadPinEnabled.value = true
      isChangingDownloadPin.value = true
    }
  } else if (!enabled && wasEnabled) {
    try {
      await rawFilesApi.updateRawFiles(rawFiles.value.id, {
        downloadPinEnabled: false,
        downloadPin: null,
      })
      downloadPinEnabled.value = false
      currentDownloadPin.value = ''
      isChangingDownloadPin.value = false
      toast.success('Download PIN removed', {
        description: 'Download PIN protection has been disabled.',
      })
    } catch (error) {
      downloadPinEnabled.value = true
      toast.error('Failed to remove download PIN', {
        description: getErrorMessage(error, 'An unknown error occurred'),
      })
    }
  }
}

const handleSaveDownloadPin = async () => {
  if (!rawFiles.value || !newDownloadPin.value.trim() || !isValidDownloadPin(newDownloadPin.value)) {
    toast.error('Invalid PIN', {
      description: 'Please enter a valid 4-digit PIN.',
    })
    return
  }

  isSavingDownloadPin.value = true
  try {
    await rawFilesApi.updateRawFiles(rawFiles.value.id, {
      downloadPinEnabled: true,
      downloadPin: newDownloadPin.value,
    })
    downloadPinEnabled.value = true
    currentDownloadPin.value = newDownloadPin.value
    if (rawFiles.value) {
      rawFiles.value.downloadPin = currentDownloadPin.value
      rawFiles.value.downloadPinEnabled = true
    }
    isChangingDownloadPin.value = false
    newDownloadPin.value = ''
    toast.success('Download PIN set', {
      description: 'Download PIN protection has been enabled.',
    })
  } catch (error) {
    toast.error('Failed to set download PIN', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  } finally {
    isSavingDownloadPin.value = false
  }
}

const handleCopyDownloadPin = async () => {
  if (!currentDownloadPin.value) {
    toast.error('No PIN available', {
      description: 'Download PIN is not set or not available.',
    })
    return
  }

  try {
    await navigator.clipboard.writeText(currentDownloadPin.value)
    toast.success('PIN copied!', {
      description: 'Download PIN has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: 'Could not copy PIN to clipboard. Please try again.',
    })
  }
}

const handleGenerateDownloadPin = () => {
  newDownloadPin.value = String(Math.floor(1000 + Math.random() * 9000))
  toast.success('PIN generated', {
    description: 'A new 4-digit PIN has been generated.',
  })
}

// Limit downloads handlers
const handleLimitDownloadsToggle = async enabled => {
  if (!rawFiles.value?.id) return

  try {
    await rawFilesApi.updateRawFiles(rawFiles.value.id, {
      limitDownloads: enabled,
      downloadLimit: enabled ? downloadLimit.value : null,
    })
    limitDownloads.value = enabled
    if (rawFiles.value) {
      rawFiles.value.limitDownloads = enabled
      rawFiles.value.downloadLimit = enabled ? downloadLimit.value : null
    }
    toast.success(enabled ? 'Download limit enabled' : 'Download limit disabled', {
      description: enabled
        ? `Downloads are now limited to ${downloadLimit.value}.`
        : 'Download limit has been removed.',
    })
  } catch (error) {
    limitDownloads.value = !enabled
    toast.error('Failed to update download limit', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
  }
}
</script>

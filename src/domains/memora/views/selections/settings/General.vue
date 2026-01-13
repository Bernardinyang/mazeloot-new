<template>
  <SelectionLayout :is-loading="isLoading" :selection="selection" @go-back="goBack">
    <template #content>
      <div>
        <SelectionLimitModal
          v-model="showSelectionLimitModal"
          :current-limit="selection?.selectionLimit"
          :is-saving="isSavingSelectionLimit"
          @save="handleSaveSelectionLimit"
          @cancel="handleCancelSelectionLimit"
        />
      </div>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="max-w-[50%] p-6 md:p-8 transition-all duration-300">
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
            <!-- Selection Name Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2"
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
              class="space-y-4 p-6 rounded-2xl border-2"
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

            <!-- Selection Color Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2"
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
              class="space-y-4 p-6 rounded-2xl border-2"
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
              class="space-y-4 p-6 rounded-2xl border-2"
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
              class="space-y-4 p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-40 rounded-md mb-2" />
                  <Skeleton class="h-3 w-72 rounded-md" />
                </div>
                <Skeleton class="h-6 w-12 rounded-full" />
              </div>
            </div>

            <!-- Selection Limit Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-32 rounded-md mb-2" />
                  <Skeleton class="h-3 w-80 rounded-md" />
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Skeleton class="h-10 w-32 rounded-md" />
                <Skeleton class="h-10 w-24 rounded-md" />
              </div>
            </div>

            <!-- Auto Delete Skeleton -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <Skeleton class="h-6 w-32 rounded-md mb-2" />
                  <Skeleton class="h-3 w-80 rounded-md" />
                </div>
                <Skeleton class="h-6 w-12 rounded-full" />
              </div>
            </div>
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
              Configure general settings for your selection including name, color, cover photo, and
              display preferences.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Selection Name -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Selection Name
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    The name of this selection as it appears in your dashboard and to customers.
                  </p>
                </div>
                <div v-if="nameSaved" class="flex items-center gap-2 text-violet-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <Input
                v-model="selectionName"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-md focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="My Selection"
                @keydown.enter="handleSave"
              />
            </div>

            <!-- Selection Description -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Description</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Optional description shown to clients viewing this selection.
                  </p>
                </div>
              </div>
              <Textarea
                v-model="selectionDescription"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-2xl min-h-[100px] resize-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                placeholder="Enter a description for this selection..."
                :maxlength="1000"
                @keydown.enter.prevent="handleSave"
              />
              <div class="flex items-center justify-between max-w-2xl">
                <p :class="theme.textTertiary" class="text-xs">
                  Description is shown to clients viewing this selection.
                </p>
                <span :class="theme.textTertiary" class="text-xs">
                  {{ (selectionDescription || '').length }}/1000
                </span>
              </div>
            </div>

            <!-- Selection Color -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Selection Color
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Choose a color to help identify this selection in your dashboard.
                  </p>
                </div>
                <div v-if="colorSaved" class="flex items-center gap-2 text-violet-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <input
                  v-model="selectionColor"
                  :class="theme.borderSecondary"
                  class="h-12 w-20 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                  type="color"
                  @change="handleSave"
                />
                <Input
                  v-model="selectionColor"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="flex-1 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono text-sm"
                  :placeholder="getAccentColor()"
                  @keydown.enter="handleSave"
                />
                <div
                  class="h-12 w-12 rounded-lg border-2 transition-all"
                  :style="{ backgroundColor: selectionColor, borderColor: selectionColor }"
                  :class="theme.borderSecondary"
                ></div>
              </div>
            </div>

            <!-- Typography -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
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

            <!-- Cover Focal Point -->
            <div
              v-if="selection?.coverPhotoUrl || selection?.cover_photo_url"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-5 p-6 rounded-2xl border-2 transition-shadow duration-300"
            >
              <div class="mb-2">
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Cover Focal Point
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                  Choose where to focus the cover image for optimal cropping
                </p>
              </div>
              <Button
                class="w-full"
                variant="default"
                @click="showFocalPointModal = true"
              >
                <Eye class="h-4 w-4 mr-2" />
                <span>Set Focal Point</span>
              </Button>
            </div>

            <!-- Allowed Emails -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Allowed Email
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Specify which email address is allowed to access this selection. Leave empty
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
                    No email restrictions. Anyone with the link can access this selection.
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
                    Require a password for customers to access this selection.
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

            <!-- Selection Limit -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Selection Limit
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Set the maximum number of media items clients can select from this selection.
                    Leave empty for unlimited.
                  </p>
                </div>
              </div>
              <div class="space-y-4 max-w-md">
                <div
                  :class="[theme.bgButtonHover, theme.borderSecondary]"
                  class="p-4 rounded-lg border-2 flex items-center justify-between gap-4"
                >
                  <div class="flex-1">
                    <p :class="theme.textSecondary" class="text-xs font-medium mb-1">
                      Current Limit
                    </p>
                    <p :class="theme.textPrimary" class="text-lg font-semibold">
                      {{
                        selection?.selectionLimit
                          ? `${selection.selectionLimit} item${selection.selectionLimit !== 1 ? 's' : ''}`
                          : 'Unlimited'
                      }}
                    </p>
                  </div>
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="handleOpenSelectionLimitModal"
                  >
                    <Settings class="h-4 w-4 mr-2" />
                    {{ selection?.selectionLimit ? 'Change' : 'Set Limit' }}
                  </Button>
                </div>
                <p :class="theme.textSecondary" class="text-xs">
                  <span class="font-medium">Note:</span> This limit applies to all sets unless a set
                  has its own limit.
                </p>
              </div>
            </div>

            <!-- Gallery Assist -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Gallery Assist
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Add walk-through cards to help visitors use the selection.
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

            <!-- Auto-Delete Settings -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-violet-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Auto-Delete Settings
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Configure when unselected media will be automatically deleted after selection
                    completion.
                  </p>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">
                      Enable Auto-Delete
                    </p>
                    <p :class="theme.textSecondary" class="text-xs">
                      Automatically delete unselected media after a specified number of days.
                    </p>
                  </div>
                  <div class="flex-shrink-0 pt-1">
                    <ToggleSwitch v-model="autoDeleteEnabled" label="" />
                  </div>
                </div>
                <div v-if="autoDeleteEnabled" class="space-y-4 max-w-md">
                  <div>
                    <label :class="theme.textPrimary" class="text-sm font-medium mb-2 block">
                      Days Until Deletion
                    </label>
                    <div class="flex items-center gap-3">
                      <Input
                        v-model.number="autoDeleteDays"
                        :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                        class="max-w-xs focus:ring-2 focus:ring-violet-500/20 transition-all"
                        max="365"
                        min="1"
                        placeholder="30"
                        type="number"
                        @keydown.enter="handleSave"
                      />
                      <span :class="theme.textSecondary" class="text-sm">days</span>
                    </div>
                    <p :class="theme.textSecondary" class="text-xs mt-2">
                      Unselected media will be deleted this many days after selection completion.
                    </p>
                  </div>
                  <div
                    v-if="autoDeleteDate"
                    :class="[theme.bgButtonHover, theme.borderSecondary]"
                    class="p-4 rounded-lg border-2"
                  >
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <p :class="theme.textSecondary" class="text-xs font-medium">
                        Calculated Auto-Delete Date
                      </p>
                      <div class="h-2 w-2 rounded-full bg-violet-500"></div>
                    </div>
                    <p :class="theme.textPrimary" class="text-base font-semibold mb-1">
                      {{ formatDate(autoDeleteDate) }}
                    </p>
                    <p
                      v-if="selection?.status === 'completed'"
                      :class="theme.textSecondary"
                      class="text-xs"
                    >
                      Based on completion date + {{ autoDeleteDays }} day{{
                        autoDeleteDays !== 1 ? 's' : ''
                      }}
                    </p>
                    <p v-else :class="theme.textSecondary" class="text-xs">
                      Will be calculated when selection is completed
                    </p>
                  </div>
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
                    Configure how media is displayed in this selection (your view only).
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

      <!-- Focal Point Modal -->
      <CoverFocalPointModal
        :is-open="showFocalPointModal"
        :image-url="selectionCoverImage"
        :initial-focal-point="formData?.coverFocalPoint || { x: 50, y: 50 }"
        @update:is-open="showFocalPointModal = $event"
        @confirm="handleFocalPointConfirm"
      />
    </template>
  </SelectionLayout>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Copy, Info, Loader2, X, Plus, Settings, Check, Eye, RefreshCw } from 'lucide-vue-next'
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
import SelectionLayout from '@/shared/layouts/SelectionLayout.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import SelectionLimitModal from '@/shared/components/organisms/SelectionLimitModal.vue'
import CoverFocalPointModal from '@/shared/components/organisms/CoverFocalPointModal.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSelectionStore } from '@/domains/memora/stores/selection'
import { useSelectionsApi } from '@/domains/memora/api/selections'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { storeToRefs } from 'pinia'
import { getAccentColor } from '@/shared/utils/colors'
import { fontStyleOptions as baseFontStyleOptions } from '@/shared/utils/designConstants'
import { generatePassword } from '@/shared/utils/generatePassword'
import { Skeleton } from '@/shared/components/shadcn/skeleton'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const selectionStore = useSelectionStore()
const selectionsApi = useSelectionsApi()

// Selection data
const selection = ref(null)
const isLoading = ref(false)
const isSaving = ref(false)

// Settings state
const selectionName = ref('')
const selectionDescription = ref('')
const selectionColor = ref(getAccentColor())
const hasPassword = ref(false)
const currentPassword = ref('') // Store the actual password value
const isChangingPassword = ref(false)
const newPassword = ref('')
const isSavingPassword = ref(false)
const autoDeleteEnabled = ref(false)
const autoDeleteDays = ref(30)
const allowedEmail = ref('')
const galleryAssist = ref(false)
const isSavingAllowedEmails = ref(false)
const emailsSaved = ref(false)
const nameSaved = ref(false)
const colorSaved = ref(false)
const typographySaved = ref(false)

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

// Selection limit modal state
const showSelectionLimitModal = ref(false)
const isSavingSelectionLimit = ref(false)

// Focal point state
const showFocalPointModal = ref(false)
const formData = reactive({
  coverFocalPoint: { x: 50, y: 50 },
})

// Original values for change tracking
const originalValues = ref({
  name: '',
  description: '',
  color: getAccentColor(),
  autoDeleteEnabled: false,
  autoDeleteDays: 30,
  viewMode: 'grid',
  gridSize: 'medium',
  showFilename: true,
  sortOrder: 'uploaded-new-old',
  allowedEmail: '',
  coverFocalPoint: { x: 50, y: 50 },
  fontFamily: 'sans',
  fontStyle: 'normal',
  galleryAssist: false,
})

// Display preferences (from store)
const { viewMode, gridSize, showFilename, sortOrder } = storeToRefs(selectionStore)

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


const selectionCoverImage = computed(() => {
  return selection.value?.coverPhotoUrl || selection.value?.cover_photo_url || null
})

const autoDeleteDate = computed(() => {
  if (!autoDeleteEnabled.value) {
    return null
  }
  // If selection is already completed, use existing auto-delete date or calculate from completion
  if (selection.value?.selectionCompletedAt || selection.value?.selection_completed_at) {
    if (selection.value.autoDeleteDate || selection.value.auto_delete_date) {
      return new Date(selection.value.autoDeleteDate || selection.value.auto_delete_date)
    }
    const completionDate = new Date(
      selection.value.selectionCompletedAt || selection.value.selection_completed_at
    )
    const deleteDate = new Date(completionDate)
    deleteDate.setDate(deleteDate.getDate() + autoDeleteDays.value)
    return deleteDate
  }
  return null
})

// Check if there are unsaved changes
const hasChanges = computed(() => {
  return (
    selectionName.value !== originalValues.value.name ||
    selectionDescription.value !== originalValues.value.description ||
    selectionColor.value !== originalValues.value.color ||
    autoDeleteEnabled.value !== originalValues.value.autoDeleteEnabled ||
    autoDeleteDays.value !== originalValues.value.autoDeleteDays ||
    viewMode.value !== originalValues.value.viewMode ||
    gridSize.value !== originalValues.value.gridSize ||
    showFilename.value !== originalValues.value.showFilename ||
    sortOrder.value !== originalValues.value.sortOrder ||
    fontFamily.value !== originalValues.value.fontFamily ||
    fontStyle.value !== originalValues.value.fontStyle ||
    galleryAssist.value !== originalValues.value.galleryAssist ||
    (formData?.coverFocalPoint &&
      originalValues.value?.coverFocalPoint &&
      (formData.coverFocalPoint.x !== originalValues.value.coverFocalPoint.x ||
        formData.coverFocalPoint.y !== originalValues.value.coverFocalPoint.y))
  )
})

// Load selection data
onMounted(async () => {
  const selectionId = route.params.id
  if (!selectionId) return

  isLoading.value = true
  try {
    const selectionData = await selectionStore.fetchSelection(selectionId)
    selection.value = selectionData
    selectionName.value = selectionData.name || ''
    selectionDescription.value = selectionData.description || ''
    selectionColor.value = selectionData.color || getAccentColor()
    hasPassword.value = !!selectionData.hasPassword || !!selectionData.password
    galleryAssist.value = selectionData.galleryAssist ?? selectionData.settings?.general?.galleryAssist ?? false

    // Set password from backend response (only available for owner)
    if (selectionData.password) {
      currentPassword.value = selectionData.password
    }

    // Initialize allowedEmail as single string
    const emails = selectionData.allowedEmails || selectionData.allowed_emails
    if (Array.isArray(emails) && emails.length > 0) {
      allowedEmail.value = emails[0] || ''
    } else if (typeof emails === 'string' && emails.trim()) {
      allowedEmail.value = emails.trim()
    } else {
      allowedEmail.value = ''
    }
    autoDeleteEnabled.value = !!selectionData.autoDeleteDate || !!selectionData.auto_delete_date
    if (selectionData.autoDeleteDate || selectionData.auto_delete_date) {
      // Calculate days from completion date if available
      if (selectionData.selectionCompletedAt) {
        const completionDate = new Date(selectionData.selectionCompletedAt)
        const deleteDate = new Date(selectionData.autoDeleteDate || selectionData.auto_delete_date)
        const diffTime = deleteDate - completionDate
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays > 0) {
          autoDeleteDays.value = diffDays
        }
      }
    }

    // Load display settings from backend
    const displaySettings = selectionData.display_settings || {}
    if (displaySettings.view_mode) {
      selectionStore.setViewMode(displaySettings.view_mode)
    }
    if (displaySettings.grid_size) {
      selectionStore.setGridSize(displaySettings.grid_size)
    }
    if (displaySettings.show_filename !== undefined) {
      selectionStore.showFilename = displaySettings.show_filename
    }
    if (displaySettings.sort_order) {
      selectionStore.sortOrder = displaySettings.sort_order
    }

    // Load focal point
    const focalPoint = selectionData.coverFocalPoint || selectionData.cover_focal_point
    if (focalPoint && typeof focalPoint === 'object' && focalPoint.x !== undefined && focalPoint.y !== undefined) {
      formData.coverFocalPoint = { x: focalPoint.x, y: focalPoint.y }
    } else {
      formData.coverFocalPoint = { x: 50, y: 50 }
    }

    // Load typography - backend always returns defaults
    const selectionDesign = selectionData.design || selectionData.settings?.design || {}
    const selectionTypography = selectionData.typographyDesign || selectionDesign.typography || {}
    
    fontFamily.value = selectionTypography.fontFamily || 'sans'
    fontStyle.value = selectionTypography.fontStyle || 'normal'

    // Store original values for change tracking
    originalValues.value = {
      name: selectionName.value,
      description: selectionDescription.value,
      color: selectionColor.value,
      autoDeleteEnabled: autoDeleteEnabled.value,
      autoDeleteDays: autoDeleteDays.value,
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
      allowedEmail: allowedEmail.value,
      coverFocalPoint: formData?.coverFocalPoint ? { ...formData.coverFocalPoint } : { x: 50, y: 50 },
      fontFamily: fontFamily.value,
      fontStyle: fontStyle.value,
      galleryAssist: galleryAssist.value,
    }
  } catch (error) {
    toast.error('Failed to load selection', {
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
    selectionName.value = originalValues.value.name
    selectionDescription.value = originalValues.value.description
    selectionColor.value = originalValues.value.color
    autoDeleteEnabled.value = originalValues.value.autoDeleteEnabled
    autoDeleteDays.value = originalValues.value.autoDeleteDays
    selectionStore.setViewMode(originalValues.value.viewMode)
    selectionStore.setGridSize(originalValues.value.gridSize)
    selectionStore.showFilename = originalValues.value.showFilename
    selectionStore.sortOrder = originalValues.value.sortOrder
  }

  router.push({
    name: 'selectionDetail',
    params: { id: selection.value?.id },
    query: { tab: 'photos' },
  })
}

// Handlers
const handleSave = async () => {
  if (!selection.value || !hasChanges.value || isSaving.value) return

  // Validate inputs
  if (!selectionName.value.trim()) {
    toast.error('Invalid name', {
      description: 'Selection name cannot be empty.',
    })
    return
  }

  // Validate color format
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!colorRegex.test(selectionColor.value)) {
    toast.error('Invalid color format', {
      description: 'Please use a valid hex color',
    })
    return
  }

  // Validate auto-delete days
  if (autoDeleteEnabled.value && (autoDeleteDays.value < 1 || autoDeleteDays.value > 365)) {
    toast.error('Invalid auto-delete days', {
      description: 'Auto-delete days must be between 1 and 365.',
    })
    return
  }

  isSaving.value = true

  try {
    const updateData = {}

    // Update selection name
    if (selectionName.value.trim() !== originalValues.value.name) {
      updateData.name = selectionName.value.trim()
      nameSaved.value = true
      setTimeout(() => {
        nameSaved.value = false
      }, 2000)
    }

    // Update description
    const normalizedDescription = (selectionDescription.value || '').trim()
    const normalizedOriginalDescription = (originalValues.value.description || '').trim()
    if (normalizedDescription !== normalizedOriginalDescription) {
      updateData.description = normalizedDescription || null
    }

    // Update color
    if (selectionColor.value !== originalValues.value.color) {
      updateData.color = selectionColor.value
      colorSaved.value = true
      setTimeout(() => {
        colorSaved.value = false
      }, 2000)
    }

    // Update auto-delete settings
    if (
      autoDeleteEnabled.value !== originalValues.value.autoDeleteEnabled ||
      (autoDeleteEnabled.value && autoDeleteDays.value !== originalValues.value.autoDeleteDays)
    ) {
      let autoDeleteDateValue = null
      if (autoDeleteEnabled.value) {
        // Calculate date if selection is completed
        if (selection.value.selectionCompletedAt || selection.value.selection_completed_at) {
          const completionDate = new Date(
            selection.value.selectionCompletedAt || selection.value.selection_completed_at
          )
          const deleteDate = new Date(completionDate)
          deleteDate.setDate(deleteDate.getDate() + autoDeleteDays.value)
          autoDeleteDateValue = deleteDate.toISOString().split('T')[0]
        }
      }
      updateData.autoDeleteDate = autoDeleteDateValue
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

    // Save selection updates
    if (Object.keys(updateData).length > 0) {
      const updatedSelection = await selectionsApi.updateSelection(selection.value.id, updateData)
      
      // Update local selection object
      if (updatedSelection) {
        selection.value = updatedSelection
        // Reload typography from updated selection - backend always returns defaults
        const updatedDesign = updatedSelection.design || updatedSelection.settings?.design || {}
        const updatedTypography = updatedSelection.typographyDesign || updatedDesign.typography || {}
        
        fontFamily.value = updatedTypography.fontFamily || 'sans'
        fontStyle.value = updatedTypography.fontStyle || 'normal'
        
        // Reload galleryAssist from updated selection
        galleryAssist.value = updatedSelection.galleryAssist ?? updatedSelection.settings?.general?.galleryAssist ?? false
        
        // Update original values to reflect saved state
        originalValues.value.fontFamily = fontFamily.value
        originalValues.value.fontStyle = fontStyle.value
        originalValues.value.galleryAssist = galleryAssist.value
      } else {
        if (updateData.name) selection.value.name = updateData.name
        if ('description' in updateData) selection.value.description = updateData.description
        if (updateData.color) selection.value.color = updateData.color
        if (updateData.autoDeleteDate !== undefined) {
          selection.value.autoDeleteDate = updateData.autoDeleteDate
          selection.value.auto_delete_date = updateData.autoDeleteDate
        }
        if (updateData.typographyDesign) {
          if (!selection.value.design) {
            selection.value.design = {}
          }
          if (!selection.value.design.typography) {
            selection.value.design.typography = {}
          }
          selection.value.design.typography = { ...updateData.typographyDesign }
          selection.value.typographyDesign = { ...updateData.typographyDesign }
          // Update local refs and original values
          if (updateData.typographyDesign.fontFamily !== undefined) fontFamily.value = updateData.typographyDesign.fontFamily
          if (updateData.typographyDesign.fontStyle !== undefined) fontStyle.value = updateData.typographyDesign.fontStyle
          originalValues.value.fontFamily = fontFamily.value
          originalValues.value.fontStyle = fontStyle.value
        }
        if ('galleryAssist' in updateData) {
          if (!selection.value.settings) {
            selection.value.settings = {}
          }
          if (!selection.value.settings.general) {
            selection.value.settings.general = {}
          }
          selection.value.settings.general.galleryAssist = updateData.galleryAssist
          selection.value.galleryAssist = updateData.galleryAssist
          originalValues.value.galleryAssist = galleryAssist.value
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

    // Update focal point if changed
    if (
      formData?.coverFocalPoint &&
      originalValues.value?.coverFocalPoint &&
      (formData.coverFocalPoint.x !== originalValues.value.coverFocalPoint.x ||
        formData.coverFocalPoint.y !== originalValues.value.coverFocalPoint.y)
    ) {
      updateData.cover_focal_point = formData.coverFocalPoint
      updateData.coverFocalPoint = formData.coverFocalPoint
    }

    // Update display preferences in store (keep for immediate UI updates)
    if (viewMode.value !== originalValues.value.viewMode) {
      selectionStore.setViewMode(viewMode.value)
    }
    if (gridSize.value !== originalValues.value.gridSize) {
      selectionStore.setGridSize(gridSize.value)
    }
    if (showFilename.value !== originalValues.value.showFilename) {
      selectionStore.showFilename = showFilename.value
    }
    if (sortOrder.value !== originalValues.value.sortOrder) {
      selectionStore.sortOrder = sortOrder.value
    }

    // Update original values
    originalValues.value = {
      name: selectionName.value.trim(),
      description: selectionDescription.value,
      color: selectionColor.value,
      autoDeleteEnabled: autoDeleteEnabled.value,
      autoDeleteDays: autoDeleteDays.value,
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
      allowedEmail: allowedEmail.value,
      coverFocalPoint: formData?.coverFocalPoint ? { ...formData.coverFocalPoint } : { x: 50, y: 50 },
      fontFamily: fontFamily.value,
      fontStyle: fontStyle.value,
      galleryAssist: galleryAssist.value,
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
  if (!selection.value?.id) return

  // Store the previous state to check what changed
  const wasEnabled = hasPassword.value

  if (enabled && !wasEnabled) {
    // Password is being enabled
    if (currentPassword.value) {
      // If we have a password stored, enable it immediately
      try {
        await selectionsApi.updateSelection(selection.value.id, {
          password: currentPassword.value,
        })
        hasPassword.value = true
        // Update selection object
        if (selection.value) {
          selection.value.password = currentPassword.value
          selection.value.hasPassword = true
        }
        toast.success('Password enabled', {
          description: 'Password protection has been enabled for this selection.',
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
      await selectionsApi.updateSelection(selection.value.id, {
        password: '', // Empty string will set password to null in backend
      })
      hasPassword.value = false
      currentPassword.value = ''
      isChangingPassword.value = false // Reset password change mode
      // Update selection object
      if (selection.value) {
        selection.value.password = null
        selection.value.hasPassword = false
      }
      toast.success('Password removed', {
        description: 'Password protection has been disabled for this selection.',
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
  if (!selection.value || !newPassword.value.trim()) {
    toast.error('Password required', {
      description: 'Please enter a password.',
    })
    return
  }

  isSavingPassword.value = true
  try {
    const response = await selectionsApi.updateSelection(selection.value.id, {
      password: newPassword.value,
    })
    hasPassword.value = true
    // Update password from backend response
    // The response structure is: { data: { ...selection data... } }
    const updatedSelection = response?.data || response
    if (updatedSelection?.password) {
      currentPassword.value = updatedSelection.password
    } else {
      currentPassword.value = newPassword.value // Fallback to the value we just set
    }
    // Also update the selection object to reflect the new password
    if (selection.value) {
      selection.value.password = currentPassword.value
      selection.value.hasPassword = true
    }
    // Refresh the selection data to get the latest from backend
    const refreshedSelection = await selectionStore.fetchSelection(selection.value.id)
    if (refreshedSelection?.password) {
      currentPassword.value = refreshedSelection.password
      selection.value = refreshedSelection
    }
    isChangingPassword.value = false
    newPassword.value = ''
    toast.success('Password set', {
      description: 'Password protection has been enabled for this selection.',
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
  if (!selection.value) return
  if (isSavingAllowedEmails.value && !forceSave) return

  const emailValue = (allowedEmail.value || '').trim().toLowerCase()
  const isValid = emailValue ? isValidEmail(emailValue) : true

  if (emailValue && !isValid) {
    return
  }

  // Only save if email changed
  if (!forceSave) {
    const currentEmails = selection.value.allowedEmails || selection.value.allowed_emails || []
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
    await selectionsApi.updateSelection(selection.value.id, {
      allowedEmails: emailValue ? [emailValue] : null,
    })
    const updatedSelection = await selectionStore.fetchSelection(selection.value.id)
    selection.value = updatedSelection
    
    const savedEmails = updatedSelection.allowedEmails || updatedSelection.allowed_emails || []
    if (Array.isArray(savedEmails) && savedEmails.length > 0) {
      allowedEmail.value = savedEmails[0]
      selection.value.allowedEmails = savedEmails
      selection.value.allowed_emails = savedEmails
    } else if (typeof savedEmails === 'string' && savedEmails.trim()) {
      allowedEmail.value = savedEmails.trim()
      selection.value.allowedEmails = [savedEmails.trim()]
      selection.value.allowed_emails = [savedEmails.trim()]
    } else {
      allowedEmail.value = ''
      selection.value.allowedEmails = null
      selection.value.allowed_emails = null
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
    const selectionData = await selectionStore.fetchSelection(selection.value.id)
    const emails = selectionData.allowedEmails || selectionData.allowed_emails || []
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

// Selection limit handlers
const handleOpenSelectionLimitModal = () => {
  showSelectionLimitModal.value = true
}

const handleSaveSelectionLimit = async limit => {
  if (!selection.value?.id) return

  isSavingSelectionLimit.value = true
  try {
    const updatedSelection = await selectionsApi.updateSelection(selection.value.id, {
      selectionLimit: limit,
    })
    selection.value = updatedSelection
    showSelectionLimitModal.value = false
    toast.success('Selection limit updated', {
      description: limit
        ? `Clients can now select up to ${limit} items.`
        : 'Selection limit removed.',
    })
  } catch (error) {
    toast.error('Failed to update selection limit', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isSavingSelectionLimit.value = false
  }
}

const handleCancelSelectionLimit = () => {
  showSelectionLimitModal.value = false
}

const handleFocalPointConfirm = async focalPoint => {
  if (!selection.value?.id || isSaving.value) return

  if (!formData) return
  formData.coverFocalPoint = { ...focalPoint }

  // Save immediately
  isSaving.value = true
  try {
    const updatedSelection = await selectionsApi.updateSelection(selection.value.id, {
      cover_focal_point: formData.coverFocalPoint,
      coverFocalPoint: formData.coverFocalPoint,
    })

    // Update local state with response
    if (updatedSelection) {
      selection.value = updatedSelection
      if (formData?.coverFocalPoint) {
        selection.value.coverFocalPoint = formData.coverFocalPoint
        selection.value.cover_focal_point = formData.coverFocalPoint
      }
    } else if (selection.value && formData?.coverFocalPoint) {
      // Fallback: update manually if response doesn't include it
      selection.value.coverFocalPoint = formData.coverFocalPoint
      selection.value.cover_focal_point = formData.coverFocalPoint
      selection.value = { ...selection.value }
    }

    // Update original values for change tracking
    if (originalValues.value && formData?.coverFocalPoint) {
      originalValues.value.coverFocalPoint = { ...formData.coverFocalPoint }
    }

    toast.success('Focal point updated', {
      description: 'The cover focal point has been set successfully.',
    })
  } catch (error) {
    toast.error('Failed to update focal point', {
      description: getErrorMessage(error, 'An error occurred while setting the focal point.'),
    })
  } finally {
    isSaving.value = false
  }
}
</script>

/**
 * Regional settings (timezone, language) from Memora Preference.
 * Used for date/time formatting across the app.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRegionalStore = defineStore('regional', () => {
  const timezone = ref(null)
  const language = ref(null)

  function setFromSettings(settings) {
    if (!settings?.preference) return
    if (settings.preference.timezone != null) timezone.value = settings.preference.timezone
    if (settings.preference.language != null) language.value = settings.preference.language
  }

  function getTimezone() {
    return timezone.value ?? (typeof Intl !== 'undefined' && Intl.DateTimeFormat?.().resolvedOptions?.().timeZone) ?? 'UTC'
  }

  return { timezone, language, setFromSettings, getTimezone }
})

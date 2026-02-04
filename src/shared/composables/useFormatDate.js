import { useRegionalStore } from '@/shared/stores/regional'

const defaultDateOptions = { month: 'short', day: 'numeric', year: 'numeric' }
const defaultDateTimeOptions = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }

export function useFormatDate() {
  const regionalStore = useRegionalStore()
  const timeZone = regionalStore.getTimezone()

  function formatDate(dateInput, options = {}) {
    if (dateInput == null) return ''
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('en-US', { ...defaultDateOptions, ...options, timeZone }).format(date)
  }

  function formatDateTime(dateInput, options = {}) {
    if (dateInput == null) return ''
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('en-US', { ...defaultDateTimeOptions, ...options, timeZone }).format(date)
  }

  function formatTime(dateInput, options = {}) {
    if (dateInput == null) return ''
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', ...options, timeZone }).format(date)
  }

  return { formatDate, formatDateTime, formatTime, timeZone }
}

/**
 * Form handling composable
 * Provides form state management and validation helpers
 */

import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface FormField<T = any> {
  value: T
  error?: string
  touched?: boolean
}

export interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit?: (values: T) => Promise<void> | void
}

export function useForm<T extends Record<string, any>>(options: UseFormOptions<T>) {
  const fields = ref<Record<keyof T, FormField>>({} as Record<keyof T, FormField>)
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)

  // Initialize fields
  Object.keys(options.initialValues).forEach(key => {
    fields.value[key as keyof T] = {
      value: options.initialValues[key],
      error: undefined,
      touched: false,
    }
  })

  /**
   * Get field value
   */
  const getValue = <K extends keyof T>(key: K): T[K] => {
    return fields.value[key]?.value as T[K]
  }

  /**
   * Set field value
   */
  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    if (fields.value[key]) {
      fields.value[key].value = value
      fields.value[key].touched = true
      fields.value[key].error = undefined
    }
  }

  /**
   * Set field error
   */
  const setError = <K extends keyof T>(key: K, error: string) => {
    if (fields.value[key]) {
      fields.value[key].error = error
    }
  }

  /**
   * Get all values
   */
  const getValues = (): T => {
    const values = {} as T
    Object.keys(fields.value).forEach(key => {
      values[key as keyof T] = fields.value[key as keyof T].value as T[keyof T]
    })
    return values
  }

  /**
   * Reset form
   */
  const reset = () => {
    Object.keys(options.initialValues).forEach(key => {
      fields.value[key as keyof T] = {
        value: options.initialValues[key],
        error: undefined,
        touched: false,
      }
    })
    submitError.value = null
  }

  /**
   * Validate form
   */
  const validate = (): boolean => {
    if (!options.validate) return true

    const values = getValues()
    const errors = options.validate(values)

    let isValid = true
    Object.keys(fields.value).forEach(key => {
      const error = errors[key as keyof T]
      if (error) {
        fields.value[key as keyof T].error = error
        isValid = false
      } else {
        fields.value[key as keyof T].error = undefined
      }
    })

    return isValid
  }

  /**
   * Submit form
   */
  const submit = async () => {
    submitError.value = null

    if (!validate()) {
      return false
    }

    if (!options.onSubmit) {
      return true
    }

    isSubmitting.value = true
    try {
      await options.onSubmit(getValues())
      return true
    } catch (error: any) {
      submitError.value = error.message || 'An error occurred'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * Check if form is valid
   */
  const isValid = computed(() => {
    return Object.values(fields.value).every(field => !field.error)
  })

  /**
   * Check if form is dirty
   */
  const isDirty = computed(() => {
    return Object.keys(fields.value).some(key => {
      const field = fields.value[key as keyof T]
      return field.touched && field.value !== options.initialValues[key as keyof T]
    })
  })

  return {
    fields,
    isSubmitting,
    submitError,
    isValid,
    isDirty,
    getValue,
    setValue,
    setError,
    getValues,
    reset,
    validate,
    submit,
  }
}

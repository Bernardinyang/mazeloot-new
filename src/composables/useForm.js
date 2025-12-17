/**
 * Form handling composable
 * Provides form state management and validation helpers
 */

import { ref, computed } from 'vue'
import { getErrorMessage } from '@/utils/errors'

export function useForm(options) {
  const fields = ref({})
  const isSubmitting = ref(false)
  const submitError = ref(null)

  // Initialize fields
  Object.keys(options.initialValues).forEach(key => {
    fields.value[key] = {
      value: options.initialValues[key],
      error: undefined,
      touched: false,
    }
  })

  /**
   * Get field value
   */
  const getValue = key => {
    return fields.value[key]?.value
  }

  /**
   * Set field value
   */
  const setValue = (key, value) => {
    if (fields.value[key]) {
      fields.value[key].value = value
      fields.value[key].touched = true
      fields.value[key].error = undefined
    }
  }

  /**
   * Set field error
   */
  const setError = (key, error) => {
    if (fields.value[key]) {
      fields.value[key].error = error
    }
  }

  /**
   * Get all values
   */
  const getValues = () => {
    const values = {}
    Object.keys(fields.value).forEach(key => {
      values[key] = fields.value[key].value
    })
    return values
  }

  /**
   * Reset form
   */
  const reset = () => {
    Object.keys(options.initialValues).forEach(key => {
      fields.value[key] = {
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
  const validate = () => {
    if (!options.validate) return true

    const values = getValues()
    const errors = options.validate(values)

    let isValid = true
    Object.keys(fields.value).forEach(key => {
      const error = errors[key]
      if (error) {
        fields.value[key].error = error
        isValid = false
      } else {
        fields.value[key].error = undefined
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
    } catch (error) {
      submitError.value = getErrorMessage(error, 'An error occurred')
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
      const field = fields.value[key]
      return field.touched && field.value !== options.initialValues[key]
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

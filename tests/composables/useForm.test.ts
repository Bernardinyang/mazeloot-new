import { describe, it, expect, vi } from 'vitest'
import { useForm } from '@/shared/composables/useForm'

describe('useForm Composable', () => {
  it('should initialize with initial values', () => {
    const form = useForm({
      initialValues: {
        name: 'Test',
        email: 'test@example.com',
      },
    })

    expect(form.getValue('name')).toBe('Test')
    expect(form.getValue('email')).toBe('test@example.com')
  })

  it('should set field values', () => {
    const form = useForm({
      initialValues: { name: '' },
    })

    form.setValue('name', 'Updated')
    expect(form.getValue('name')).toBe('Updated')
    expect(form.fields.value.name.touched).toBe(true)
  })

  it('should validate form', () => {
    const form = useForm({
      initialValues: { email: '' },
      validate: (values) => {
        const errors = {}
        if (!values.email) {
          errors.email = 'Email is required'
        }
        return errors
      },
    })

    expect(form.validate()).toBe(false)
    expect(form.fields.value.email.error).toBe('Email is required')

    form.setValue('email', 'test@example.com')
    expect(form.validate()).toBe(true)
    expect(form.fields.value.email.error).toBeUndefined()
  })

  it('should submit form successfully', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true)
    const form = useForm({
      initialValues: { name: 'Test' },
      onSubmit,
    })

    const result = await form.submit()

    expect(result).toBe(true)
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Test' })
    expect(form.isSubmitting.value).toBe(false)
  })

  it('should handle submit errors', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Submit failed'))
    const form = useForm({
      initialValues: { name: 'Test' },
      onSubmit,
    })

    const result = await form.submit()

    expect(result).toBe(false)
    expect(form.submitError.value).toBeTruthy()
  })

  it('should reset form', () => {
    const form = useForm({
      initialValues: { name: 'Initial' },
    })

    form.setValue('name', 'Changed')
    form.reset()

    expect(form.getValue('name')).toBe('Initial')
    expect(form.fields.value.name.touched).toBe(false)
  })

  it('should compute isValid', () => {
    const form = useForm({
      initialValues: { name: '', email: '' },
      validate: (values) => {
        const errors = {}
        if (!values.name) errors.name = 'Required'
        return errors
      },
    })

    // Initially invalid because name is required
    form.validate()
    expect(form.isValid.value).toBe(false)

    // Set name and validate again
    form.setValue('name', 'Test')
    form.validate()
    // isValid is computed from fields.value, so it should update after validation clears errors
    expect(form.fields.value.name.error).toBeUndefined()
    expect(form.isValid.value).toBe(true)
  })

  it('should compute isDirty', () => {
    const form = useForm({
      initialValues: { name: 'Initial' },
    })

    expect(form.isDirty.value).toBe(false)

    form.setValue('name', 'Changed')
    expect(form.isDirty.value).toBe(true)
  })
})

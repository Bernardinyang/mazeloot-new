import { describe, it, expect, vi } from 'vitest'
import { useForm } from '@/composables/useForm'

describe('useForm Composable', () => {
  it('should initialize with initial values', () => {
    const form = useForm({
      initialValues: {
        name: 'John',
        email: 'john@example.com',
      },
    })

    expect(form.getValue('name')).toBe('John')
    expect(form.getValue('email')).toBe('john@example.com')
  })

  it('should set field values', () => {
    const form = useForm({
      initialValues: {
        name: '',
        email: '',
      },
    })

    form.setValue('name', 'Jane')
    form.setValue('email', 'jane@example.com')

    expect(form.getValue('name')).toBe('Jane')
    expect(form.getValue('email')).toBe('jane@example.com')
  })

  it('should set field errors', () => {
    const form = useForm({
      initialValues: {
        name: '',
      },
    })

    form.setError('name', 'Name is required')

    expect(form.fields.value.name.error).toBe('Name is required')
  })

  it('should validate form', () => {
    const form = useForm({
      initialValues: {
        name: '',
        email: '',
      },
      validate: values => {
        const errors: Record<string, string> = {}
        if (!values.name) errors.name = 'Name is required'
        if (!values.email) errors.email = 'Email is required'
        return errors
      },
    })

    const isValid = form.validate()

    expect(isValid).toBe(false)
    expect(form.fields.value.name.error).toBe('Name is required')
    expect(form.fields.value.email.error).toBe('Email is required')
  })

  it('should return true when validation passes', () => {
    const form = useForm({
      initialValues: {
        name: 'John',
        email: 'john@example.com',
      },
      validate: () => ({}),
    })

    const isValid = form.validate()

    expect(isValid).toBe(true)
  })

  it('should submit form successfully', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const form = useForm({
      initialValues: {
        name: 'John',
        email: 'john@example.com',
      },
      onSubmit,
    })

    const result = await form.submit()

    expect(result).toBe(true)
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    })
  })

  it('should handle submit errors', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Submit failed'))
    const form = useForm({
      initialValues: {
        name: 'John',
      },
      onSubmit,
    })

    const result = await form.submit()

    expect(result).toBe(false)
    expect(form.submitError.value).toBe('Submit failed')
  })

  it('should reset form', () => {
    const form = useForm({
      initialValues: {
        name: 'John',
        email: 'john@example.com',
      },
    })

    form.setValue('name', 'Jane')
    form.setError('name', 'Error')
    form.reset()

    expect(form.getValue('name')).toBe('John')
    expect(form.fields.value.name.error).toBeUndefined()
    expect(form.fields.value.name.touched).toBe(false)
  })

  it('should compute isValid correctly', () => {
    const form = useForm({
      initialValues: {
        name: 'John',
      },
    })

    expect(form.isValid.value).toBe(true)

    form.setError('name', 'Error')
    expect(form.isValid.value).toBe(false)
  })

  it('should compute isDirty correctly', () => {
    const form = useForm({
      initialValues: {
        name: 'John',
      },
    })

    expect(form.isDirty.value).toBe(false)

    form.setValue('name', 'Jane')
    expect(form.isDirty.value).toBe(true)
  })
})

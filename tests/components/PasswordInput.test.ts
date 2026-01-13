import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'

describe('PasswordInput', () => {
  it('toggles input type when button clicked', async () => {
    const wrapper = shallowMount(PasswordInput)
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')

    const btn = wrapper.find('button')
    await btn.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')

    await btn.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })
})

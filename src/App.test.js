// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App integration test', () => {
  it('додає завдання через інтерфейс і показує його у списку', async () => {
    const wrapper = mount(App)

    const input = wrapper.find('input')
    const button = wrapper.find('button')

    await input.setValue('Підготувати лабораторну')
    await button.trigger('click')

    expect(wrapper.text()).toContain('Підготувати лабораторну')
  })
})

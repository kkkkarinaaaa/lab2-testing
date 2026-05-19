import { test, expect } from '@playwright/test'

test('користувач додає нове завдання', async ({ page }) => {
  await page.goto('/')

  await page.getByPlaceholder('Введіть завдання').fill('Зробити лабораторну №2')
  await page.getByRole('button', { name: 'Додати' }).click()

  await expect(page.getByText('Зробити лабораторну №2')).toBeVisible()
})

test('користувач не може додати порожнє завдання', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Додати' }).click()

  await expect(page.getByText('Назва завдання обовʼязкова')).toBeVisible()
})
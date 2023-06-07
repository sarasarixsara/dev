import { faker } from '@faker-js/faker'
import { AppCache } from '../../src/app/AppCache'

describe('Cache test suite', () => {
  test('Testing Store in cache', () => {
    const storeString = faker.string.sample()
    AppCache.setStored('testing_store', storeString)
    const stored = AppCache.getStored('testing_store')

    expect(stored).toBe(storeString)
  })

  test('Testing Store in cache with timeout', async () => {
    const storeString = faker.string.sample()
    AppCache.setStored('testing_store_due', storeString, 2)
    await new Promise(resolve => setTimeout(resolve, 3000))
    const stored = AppCache.getStored('testing_store_due')
    expect(stored).toBeFalsy()
  })

  it('Retrieve Store in cache with false key', async () => {
    const stored = AppCache.getStored('testing_store_empty')
    expect(stored).toBeFalsy()
  })
})

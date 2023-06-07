import { faker } from '@faker-js/faker'
import { RandomString } from '../../src/utils/RandomString'
import { decryptString, encryptString } from '../../src/utils/Encryptor'

describe('Testing App Encrypt and Decrypt "/"', () => {
  test('Testing App Encrypt and Decrypt "/"', () => {
    const stringLength = faker.number.int({ min: 10, max: 50 })
    const keyLength = faker.number.int({ min: 10, max: 50 })

    const targetString = RandomString(stringLength)
    const key = faker.string.sample(keyLength)

    const encrypted = encryptString(targetString, key)
    expect(decryptString(encrypted, key)).toBe(targetString)
  })

  test('Testing App Random Strings "/"', () => {
    const stringLength = faker.number.int({ min: 10, max: 50 })
    const targetString = RandomString(stringLength)
    expect(targetString.length).toBe(stringLength)
  })
})

import { Log } from '../../src/app/Log'
import { faker } from '@faker-js/faker'
import * as fs from 'fs'
import path from 'path'
import { type ReadStream } from 'fs'

const streamAsPromise = async (stream: ReadStream, criteria:string): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    let contains = false
    stream.on('data', chunk => {
      contains ||= chunk.includes(criteria)
    })
    stream.on('end', () => { resolve(contains) })
    stream.on('error', error => { reject(error) })
  })
}

const logPath = path.join(__dirname, '../../logs')

afterAll(async () => {
  fs.rmSync(`${logPath}/test.log`)
})

describe('Logs Testing suite', () => {
  test('Testing App log in test', async () => {
    const logFake = faker.string.sample(10)
    Log.report({ test: 1, string: logFake }, 'test')
    await new Promise(process.nextTick)
    const reader = fs.createReadStream(`${logPath}/test.log`)

    const result = await streamAsPromise(reader, logFake)
    expect(result).toBeTruthy()
  })
})

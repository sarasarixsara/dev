import {Config} from '../../src/app/Config'
import {faker} from "@faker-js/faker";

jest.mock('dotenv', () => {
    return {
        config: () => ({
            parsed: undefined,
            error: undefined
        })
    }
})

describe('Config mocked load test suite', () => {

    beforeEach(() => {
        jest.resetModules()
    })

    test('Testing Invalid Config .env parse', () => {
        const invalid = Config.getValue(faker.string.sample())
        expect(invalid).toBeFalsy()
    })

})

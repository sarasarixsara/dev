import {Config} from '../../src/app/Config'
import {ErrorParams} from '../../src/core/ErrorParams'
import {faker} from "@faker-js/faker";


describe('Config load test suite', () => {

    test('Testing Config invalid key', () => {
        const invalid = Config.getValue('INVALID_KEY')
        expect(invalid).toBeFalsy()
    })

    test('Testing Config invalid key', () => {
        const t = (): void => {
            Config.getValue('INVALID_KEY_REQUIRED', {required: true})
        }
        expect(t).toThrow(ErrorParams)
    })
})

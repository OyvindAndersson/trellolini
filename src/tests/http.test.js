import {makeRequest, trelloAxios, trelloCSRFRequestInterceptor} from '../helpers/http'
import Axios from 'axios'

test('trelloAxios has property interceptors', () => {
    expect(trelloAxios).toHaveProperty('interceptors')
})

describe('http - makeRequest function', () => {

    it('should return instance of Promise', () => {
        var promise = makeRequest()

        expect(promise).toBeInstanceOf(Promise)
    })
})
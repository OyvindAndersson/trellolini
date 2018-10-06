import Trello from '../../Trello'
import Board from '../../api/Board'

import {paramsSerializer} from '../../helpers/http'
import mockAxios from "axios"


let validConfig, trello, requestConfig
const beforeEachFunc = () => {
    validConfig =  { key: 'foo', token: 'bar' }
    trello = new Trello(validConfig)
    requestConfig = {
        params: validConfig,
        paramsSerializer
    }
}

describe('byId(id) function', () => {
    beforeEach(beforeEachFunc)

    it('should fail if no id is passed as an argument', () => {
        expect(() => {  trello.board().byId() }).toThrow()
    })

    it('should make a get request to a specific resource on the boards endpoint', () => {
        trello.board().byId('someOtherId')
    
        expect(mockAxios.request).toHaveBeenCalledWith({
            ...requestConfig,
            url: `https://trello.com/1/boards/someOtherId/`,
            method: 'get',
            data: ''
        })
    })

    it(`should make a get request to a specific resource on the boards endpoint with 'fields' parameters when 'fields()' is called first`, () => {
        trello.board().fields(['name', 'desc']).byId('some_resource_id')
    
        expect(mockAxios.request).toHaveBeenCalledWith({
            params: { ...validConfig, fields: ['name', 'desc'] },
            url: `https://trello.com/1/boards/some_resource_id/`,
            method: 'get',
            data: 'fields=name&fields=desc',
            paramsSerializer
        })
    })
})

describe('fields(fields) function', () => {
    it(`should add a fields object key to the instance's params var`, () => {
        let params = trello.board().fields(['foo', 'bar']).params

        expect(params).toEqual({
            fields: ['foo', 'bar']
        })
    })
    
    it(`should overwrite identical fields when they are set multiple times`, () => {
        let params = trello.board().fields(['foo']).fields(['foo', 'bar']).params

        expect(params).toEqual({
            fields: ['foo', 'bar']
        })
    }) 
})

describe(`getUri() function`, () => {
    beforeEach(beforeEachFunc)

    it(`should return object with the correct Trello api endpoint for 'boards'`, () => {
        let uri = trello.board('foobar').getUri()

        expect(uri).toEqual({ uri: 'boards', params: ''})
    })
})

describe(`get() function`, () => {
    beforeEach(beforeEachFunc)
    it(`should make a get-request to the '/boards/' api endpoint with the id url-parameter set to the resourceId`, () => {
        trello.board('foobar').get()
    
        expect(mockAxios.request).toHaveBeenCalledWith({
            ...requestConfig,
            url: `https://trello.com/1/boards/foobar/`,
            method: 'get',
            data: ''
        })
    })
})

describe('create() function', () => {
    beforeEach(beforeEachFunc)
    it('should fail without required params', () => {
        expect(() => {
            trello.boards.create({})
        }).toThrow()
    })
})
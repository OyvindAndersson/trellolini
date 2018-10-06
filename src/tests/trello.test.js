import Trello from '../Trello'
import Board from '../api/Board'

import {paramsSerializer} from '../helpers/http'
import mockAxios from "axios"

/**
 * Client construction error tests
 */
describe('Trello client construction', () => {

    it('should throw Error with invalid config', () => {
        expect(() => {
            var client = new Trello({})
        }).toThrow()
    })

    it('should throw Error with empty "valid" config', () => {
        expect(() => {
            var client = new Trello({token: '', key: ''})
        }).toThrow()
    })
})

/**
 * Client construction valid tests
 */
describe('Trello class constructor with valid config', () => {
    let trello, validConfig, requestConfig

    beforeEach(() => {
        validConfig =  { key: 'foo', token: 'bar' }
        trello = new Trello(validConfig)
        requestConfig = {
            params: validConfig,
            paramsSerializer
        }
    })

    it('should return a new instance of Trello', () => {
        let instance = new Trello(validConfig)
        expect(instance).toBeInstanceOf(Trello)
    })

    describe(`A valid Trello instance`, () => {
    
        it(`should return a new instance of Board with resourceID 'foo' set, when addBoard({ foo: 'bar'}) is called before 'board('foo')' `, () => {
            trello.addBoard({ foo: 'bar' })
            let board = trello.board('foo')
    
            expect(board).toBeInstanceOf(Board)
            expect(board.hasResourceId).toBeTruthy()
            expect(board.resourceId).toEqual('bar')
        })

        it(`should return a Board instance with resourceID: 'foobar' when board('foobar') is called`, () => {
            let board = trello.board('foobar')
    
            expect(board.hasResourceId).toBeTruthy()
            expect(board.resourceId).toEqual('foobar')
        })
    })

})


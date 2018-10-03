import Trello from '../Trello'
import Board from '../api/Board';


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
describe('Trello client with valid config', () => {
    let validConfig
    let trello

    beforeEach(() => {
        validConfig =  { key: 'foo', token: 'bar' }
        trello = new Trello(validConfig)
    })

    it('should return instance of Trello', () => {
        let instance = new Trello(validConfig)
        expect(instance).toBeInstanceOf(Trello)
    })

    /**
     * Client board function tests
     */
    describe('board function', () => {

        it('should return Board instance with valid board key', () => {
            trello.addBoard({ foo: 'bar' })

            let board = trello.board('foo')
            expect(board).toBeInstanceOf(Board)
        })
    })

    describe('board creation', () => {
        it('should fail without required params', () => {
            expect(() => {
                trello.boards.create({})
            }).toThrow()
        })
    })
})
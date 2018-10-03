/**
 * API Classes
 */
import {makeRequest, trelloAxios, trelloCSRFRequestInterceptor} from './helpers/http'
import Board from './api/Board'

/**
 * Configuration
 */
export const defaultConfig = {
    baseUrl: 'https://trello.com/1',
    defaultBoardId: '',
    defaultListId: '',
    boards: {},

    removeCsrfHeaders: true,
    responseTransformer: null
}

/**
 * Validates configuration object for Trello client
 * @param {Object} config 
 */
function validateConfig(config){
    let errors = []

    if(!config.key){
        errors.push(`Missing config 'config.key'`)
    }

    if(!config.token){
        errors.push(`Missing config 'config.token'`)
    }

    if(config.responseTransformer != null && typeof config.responseTransformer !== 'function'){
        errors.push(`Reponse interceptor must be a function`)
    }

    return errors
}

/**
 * Trello js
 */
export default class Trello {

    /**
     * 
     * @param {Object} config
     * @param {String} config.key
     * @param {String} config.token
     * @param {String} config.baseUrl
     * @param {String} config.defaultBoardId
     * @param {String} config.defaultListId
     */
    constructor(config){
        this._config = { ...defaultConfig, ...config }

        let errors = validateConfig(this._config)
        if(errors.length > 0){
            throw new Error(`Failed to build Trello Client:\n\t${errors.join('\n\t')}`)
        }

        if(this._config.boards){
            this._boards = {...this._config.boards}
        }

        // 'Hide' axios interceptor full function by inserting only the transformer,
        // or allow a full interceptor definition in config??
        if(this._config.responseTransformer) {
            trelloAxios.interceptors.response.use(
                this._config.responseTransformer, 
                (error) => {
                return Promise.reject(error)
            })
        }

        // If for some reason a user opts to not removing CSRF headers (if set)
        if(!this._config.removeCsrfHeaders) {
            trelloAxios.interceptors.request.eject(trelloCSRFRequestInterceptor)
        }
    }

    //===============================================
    // Accessors / Resources
    //===============================================

    /**
     * Returns a direct instance of Board, by a predefined ID
     * 
     * @param {String} nameOrId Name of an object key that contains board id's (this._boards) or the ID for a board entity
     * @example 
     * // get by actual resource id
     * Trello.board('xxxxxxxxxxxxxxxxxxxxxxxxx').get();
     * @example
     * // Get by using a preset, added to a client instance
     * Trello.addBoard({ myBoard: 'xxxxxxxxxxxxxxxxxxxxxxxxx'});
     * Trello.board('myBoard').get();
     * @returns {Board} current instance, or new if not set
     */
    board(nameOrId){
        // Check if there are any presets with that key name, if not, it should be a pure id
        if(!this._boards[nameOrId]){
            this._board = new Board(this, nameOrId)
        }

        // We found a preset with the named key. Create a new instance of Board unless 
        // it's already set
        if(!this._board){
            this._board = new Board(this, this._boards[nameOrId])
        } else {
            this._board.id = nameOrId
        }


        return this._board
    }

    /**
     * Adds a new board identifier that can be quick-accessed with this.board(name)
     * @param {Object} board new board detail in form: { key: 'boardId' }
     * @todo Persist the boards array in localstorage
     */
    addBoard(board){
        this._boards = {...this._boards, ...board}
    }

    /**
     * Retrieves internal instance of Board, or instantiates it
     * The board is not associated with any id
     */
    get boards(){
        if(!this._board){
            this._board = new Board(this)
        }

        return this._board
    }

    get me() {
        return this.get(`members/me`)
    }

    //===============================================
    // Accessors / Resources
    //===============================================

    get defaultBoardId(){
        return this._config.defaultBoardId
    }
    get defaultListId() {
        return this._config.defaultListId
    }

    //===============================================
    // http
    //===============================================

    get (uri, data = {})           { return makeRequest('get', uri, this._config, data) }
    delete (uri)        { return makeRequest('delete', uri, this._config) }
    post (uri, data)    { return makeRequest('post', uri, this._config, data) }
    put (uri, data)     { return makeRequest('put', uri, this._config, data) }
}
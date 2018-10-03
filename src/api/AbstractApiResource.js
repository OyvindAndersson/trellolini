import Trello from "../Trello"
const qs = require('query-string')

export default class AbstractApiResource {
    constructor(client, id, uri = ''){
        // Abstractness hack
        if(new.target === AbstractApiResource){
            throw new TypeError('Cannot construct AbstractApiResource instances directly. Extend into a subclass.')
        }

        if(!client || !(client instanceof Trello)){
            throw new TypeError('')
        }

        this._resourceId = id
        this._client = client
        this._uri = uri
        this._fields = []
        this._required = []
        this._params = {}
    }

    get hasResourceId() {
        return this._resourceId && this._resourceId.length > 0
    }

    set id(id) {
        this._resourceId = id
    }

    /** --------------------------------
     * SELECTORS
     ------------------------------------*/

    /**
     * Retrieves a resource with a specific ID
     * @param {String} id ID of the resource to get
     * @returns {Promise}
     */
    byId(id){
        return this._client.get(`${this._uri}/${id}`)
    }

    /**
     * Sets a list of fields to include in the query for a resource.
     * @example board('id').fields(['x', 'y', 'z']).get() => '/boards/{id}/?fields=x,y,z'
     * @param {Array} fields an array of fields to request for a resource
     */
    fields(fields){
        this._params['fields'] = fields
        return this
    }

    /** --------------------------------
     * REST
     ------------------------------------*/

    /**
     * Standard get request on the current URI and params
     * @param {Object} params Query parameters
     */
    get(params){
        let id = this._resourceId
        this._params = {...this._params, ...params}

        return this._client.get(`${this._uri}/${id}`, this._params)
    }

    /**
     * Creates a new Trello board
     * https://developers.trello.com/v1.0/reference#boardsid
     * @param {Object} params Trello board creation params
     * @returns {Promise}
     */
    create(params){
        this.validateRequiredParams(params)

        return this._client.post(this._uri, params)
    }

    /**
     * Update any resource of this type, based on id
     * 
     * @param {String} id Id of the resource to update
     * @param {Object} params Parameters to update with
     * @returns {Promise}
     */
    update(params, id = null) {
        if(id != null){
            return this._client.put(`${this._uri}/${id}`, params)
        } else if(this.hasResourceId){
            return this._client.put(`${this._uri}/${this._resourceId}`, params)
        } else {
            throw new Error(`Invalid ID. Either pass in ID to second arg, or have it set on the instance via the constructor`)
        }
        
    }

    /** --------------------------------
     * UTILS
     ------------------------------------*/

    getUri() {
        return {
            uri: this._uri,
            params: qs.stringify(this._params)
        }
    }

    setAndValidateParams(params){
    }

    /**
     * Checks if all the required params are present
     * @param {Object} params parameters
     */
    validateRequiredParams(params){
        // First check if there are any requirements at all
        if(!this._required.length) {
            return
        }
        else if(!params && this._required){
            throw new Error(`Parameters {${this._required.join(', ')}} are required`)
        } else {
            this._required.forEach( (el) => {
                if(!params[el]){
                    throw new Error(`The '${el}' parameter is required.`)
                }
            })
        }
        
    }
}
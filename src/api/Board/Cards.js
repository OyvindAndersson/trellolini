
import AbstractApiResource from '../AbstractApiResource'

/**
 * https://developers.trello.com/reference#board-object
 */
export default class Cards extends AbstractApiResource {
    constructor(client, id = ''){
        super(client, id, `boards/${id}/cards`)

        this._required = ['name']
        this._fields = [
            'name'
        ]
    }

    all() {
        this._params['filter'] = ['all']
        return this.get()
    }

    get(params){
        this._params = {...this._params, ...params}

        return this._client.get(`${this._uri}`, this._params)
    }
}
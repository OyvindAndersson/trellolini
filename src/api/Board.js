
import AbstractApiResource from './AbstractApiResource'
import Cards from './Board/Cards'

/**
 * https://developers.trello.com/reference#board-object
 */
export default class Board extends AbstractApiResource {
    constructor(client, id = ''){
        super(client, id, 'boards')

        this._required = ['name']
        this._fields = [
            'name',
            'desc',
            'descData',
            'closed',
            'idOrganization',
            'pinned',
            'url',
            'shortUrl',
            'prefs',
            'labelNames',
            'starred',
            'limits',
            'memberships'
        ]
    }


    get cards() {
        if(!this._cards){
            this._cards = new Cards(this._client, this._resourceId)
        }

        return this._cards
    }
}
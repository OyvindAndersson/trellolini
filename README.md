# Trello API

each API takes an ID for the resource
- cards/id/
- boards/id/
- members/id/


/1/boards/{id}?nestedResource


## Config

### Example config
```javascript
{
    key: '{app_key}',
    token: '{user_token}',
    defaultBoardId: '{boardId}',
    boards: {
        myBoard: '{boardId}',
        myOtherBoard: '{boardId}'
    },
    selectors: {
        coolCardsNameOnly: (this) => { return this.cards.fromBoard('XYZ').withFields(['name']) }
    }
}
```

## API

```javascript
var trello = new trello({})

// Get ONLY cards related to a board
trello.cards.fromBoard('XYZ').withFields(['field']).get()
trello.cards.fromList('XYZ').withFields(['field']).get()

// Get a certain board by id
trello.boards.byId('XYZ').withFields(['field'])

// Get all boards from a member
trello.boards.fromMember('XYZ').withFields(['field'])

// Get board AND cards related to it (nested)
trello.board('XYZ').with('cards').withFields('fields')
```

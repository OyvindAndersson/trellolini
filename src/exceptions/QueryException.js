
export default class QueryException extends Error {
    constructor(msg){
        super(`QueryException: ${msg}`)
    }
}
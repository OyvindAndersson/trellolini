import axios from 'axios'

const trelloAxios = axios.create()
const queryString = require('query-string');


/**
 * Intercept the request to get rid of possible X-CSRF-TOKEN headers that are set.
 * They will not make it possible to send requests to Trello.
 * This is common in frameworks that configure axios headers globally, such as 'laravel'.
 */
const trelloCSRFRequestInterceptor = trelloAxios.interceptors.request.use((config) => {
        config = { 
            ...config, 
            transformRequest: [(data, headers) => {
                // Common headers on axios from Laravel bootstrap must be removed. Only solution so far...
                delete headers.common['X-Requested-With']
                delete headers.common['X-CSRF-TOKEN']
                return data
            }],
            
        }
        return config 
    }, (error) => {
        return Promise.reject(error)
    }
)

/**
 * 
 * @param {*} params 
 */
export const paramsSerializer = (params) => {
    return queryString.stringify(params, {arrayFormat: 'bracket'})
}

/**
 * The required config for makeRequest
 */
const defaultConfig = {
    baseUrl: '',
    token: '',
    key: ''
}

/**
 * 
 * @param {String} method request method; get,put,delete,post
 * @param {String} uri request url
 * @param {Object} config request configuration
 * @param {Object} data data to pass with the request
 */
export function makeRequest( method = 'get', uri = '', config = defaultConfig, data = {} ){
    let path = uri
    let queryObj = {}
    /*
    {
        // BEGIN DEBUG
        let debugUrl = queryString.parseUrl(`${config.baseUrl}/${path}`)
        debugUrl.source = `http::makeRequest`
        debugUrl.original = `${method}'${config.baseUrl}/${path}'`
        debugUrl.url = debugUrl.url.split('/').filter(n=>n)
        console.log(debugUrl)

        console.debug(data)
        // END DEBUG
    }
    */
    /*
    console.debug(`----------------------`)
    console.debug(data)
    console.debug(queryString.stringify(data))
    console.debug(`----------------------`)
*/
    if(method.toLowerCase() == 'get'){
        queryObj = {...data}
    }

    // Create the request configuration for AXIOS
    let request = {
        method,
        data: queryString.stringify(data),
        url     : `${config.baseUrl}/${path}/`,
        params  : Object.assign(queryObj, {token: config.token, key: config.key }),
        paramsSerializer
    }


    return trelloAxios.request(request)
}

export {trelloAxios, trelloCSRFRequestInterceptor}
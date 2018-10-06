/* Axios mock to be placed in __mocks__ */
'use strict';
var Promise = require.requireActual('bluebird');
var mockDelay = 1;
var mockError;
var mockResponse = {
  data: {},
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

var axiosMock = jest.genMockFromModule('axios');

function req() {
  return new Promise(function(resolve, reject) {
    axiosMock.delayTimer = setTimeout(function() {
      if (mockError) {
        reject(mockError);
      } else {
        resolve(mockResponse);
      }
    }, mockDelay);
  });
};


axiosMock.get.mockImplementation(req);
axiosMock.post.mockImplementation(req);
axiosMock.put.mockImplementation(req);
axiosMock.delete.mockImplementation(req);
axiosMock.create.mockImplementation(() => axiosMock)

axiosMock._setMockError = (mE) => { mockError = mE };
axiosMock._setMockResponse = (mR) => { mockReseponse = mR };
axiosMock._setDelay = (mD) => { mockDelay = mD };
axiosMock.finishRequest = () => { jest.runOnlyPendingTimers() };

module.exports = axiosMock;
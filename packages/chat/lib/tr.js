const validator = require('../validator');

function createRequest(request = {}, schema) {
  if (!Array.isArray(schema)) {
    schema = [schema];
  }
  if (schema.length === 0) {
    return {};
  }
  const requestValidator = validator(schema);
  const obj = requestValidator(request);

  if (obj.invalid()) {
    throw new Error('invalid request scheme');
  }

  return request;
}

function createResponse(payload = {}) {
  let statusCode = 200;
  let status = 'OK';
  let error = null;

  if (payload instanceof Error) {
    status = 'Internal server error';
    statusCode = 500;
    error = payload.toString();
  }

  if (!payload) {
    payload = {};
  }

  return {
    status: status,
    statusCode: statusCode,
    error: error,
    payload: payload,
  };
}

module.exports = {
  createRequest: createRequest,
  createResponse: createResponse,
};
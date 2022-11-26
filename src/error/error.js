class NotFound extends Error {  
  constructor (message) {
    super(message)

    this.name = this.constructor.name
    this.status = 404
  }

  statusCode() {
    return this.status
  }
};

class AlreadyReported extends Error {  
  constructor (message) {
    super(message)

    this.name = this.constructor.name
    this.status = 208
  }

  statusCode() {
    return this.status
  }
};

class Unauthorized extends Error {  
  constructor (message) {
    super(message)

    this.name = this.constructor.name
    this.status = 401
  }

  statusCode() {
    return this.status
  }
};


module.exports = {NotFound, AlreadyReported, Unauthorized};  
// error handlers

// development error handler
// will print stacktrace
const devErrorHandler = (err, req, res, next) => {
    const { status } = err;
    res.status(status || 500).send( { message : err.message, em : err.em, code : err.status, cause : err.cause } );
}

// production error handler
// no stacktrace leaked to user
const prodErrorHandler = (err, req, res, next) => {
    const { status } = err;
    res.status(status || 500).send( { message : err.message, em : err.em, code : err.status, cause : err.cause } );
}
    
module.exports = process.env.NODE_ENV === 'production' ? prodErrorHandler : devErrorHandler;
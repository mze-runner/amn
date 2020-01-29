// error handlers

// development error handler
// will print stacktrace
const devErrorHandler = (err, req, res, next) => {
    const { status } = err;
    console.log(err.stack);
    res.status(status || 500).send( { code : err.code, message : err.message, explain : err.explain } );
}

// production error handler
// no stacktrace leaked to user
const prodErrorHandler = (err, req, res, next) => {
    const { status } = err;
    res.status(status || 500).send( { code : err.code, message : err.message, explain : err.explain } );
}
    
module.exports = process.env.NODE_ENV === 'production' ? prodErrorHandler : devErrorHandler;
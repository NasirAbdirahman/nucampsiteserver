//CORS module configured
const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {//Checks val. of req.header(indexOf returns -1 if item looking for is not found)
        corsOptions = { origin: true };// Checks to see if origin is found:if found allows req. to be accepted
    } else {
        corsOptions = { origin: false }; // if not found denies req.
    }
    callback(null, corsOptions);// callback expects two parameters: error(null= no errs found) and options(corsoptions obj.)
};

//exporting two middleware functions
exports.cors = cors();//returns middleware fn. configured to set cors header of access-control-allow-origin(w/ wildcard val.)
exports.corsWithOptions = cors(corsOptionsDelegate);//checks to see if incoming req. belongs to whitelisted origins
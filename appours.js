/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var log4js = require('log4js');
var fs = require('fs');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
var path = require('path');
require('./config.js');
var hfc = require('fabric-client');
var MongoClient = require('mongodb').MongoClient;
var ObjectIdVar = require('mongodb').ObjectID;
var helper = require('./app/helper.js');
var channels = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');
var dbUrl = 'mongodb://localhost:27017/SSLNG_login';
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var orgName;
var username;
var trxnId;

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());
app.use(cors());

//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// bower component
console.log("log");

app.use('/static', express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.locals.pretty = true;

app.use(cookieParser('secret'));
app.use(session({
  secret:'yoursecret',
  resave: true,
  saveUninitialized: true,
  cookie:{maxAge:30*60*1000}
}));

app.use(express.Router());
require(__dirname+'/routes/index')(app);

app.set('secret', 'thisismysecret');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});


app.use(expressJWT({
	secret: 'thisismysecret' ,


}).unless({
	path: ['/','/favicon.ico','/userLogin','/sslng/products', '/getUserName','/channels/mychannel/chaincodes/Products/fcnname/createProduct','/channels/mychannel/chaincodes/Products/fcnname/updateProduct','/channels/mychannel/chaincodes/DemandRequests/fcnname/createDemandRequest/rdd','/channels/mychannel/chaincodes/Products/fcnname/updateProduct','/channels/mychannel/chaincodes/DemandRequests/fcnname/updateDemandRequest/rdd','/sslng/getDemandRequest_Customer', '/channels/mychannel/chaincodes/doctorcode']
}));
app.use(bearerToken());
app.use(function(req, res, next) {
	if (req.originalUrl.indexOf('/userLogin') >= 0) {
		return next();
	}
  if (req.originalUrl.indexOf('/users') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf('/channels/mychannel/chaincodes/Products/fcnname/createProduct') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf('/channels/mychannel/chaincodes/Products/fcnname/updateProduct') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf('/sslng/products') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf('/getUserName') >=0) {
		return next();
	}
	if (req.originalUrl.indexOf('/channels/mychannel/chaincodes/DemandRequests/fcnname/createDemandRequest/rdd') >=0) {
		return next();
	}
if (req.originalUrl.indexOf('/sslng/getDemandRequest_Customer') >=0) {
		return next();
	}
	if (req.originalUrl.indexOf('/channels/mychannel/chaincodes/DemandRequests/fcnname/updateDemandRequest/rdd') >=0) {
		return next();
	}



	var token = req.token;

	jwt.verify(token, app.get('secret'), function(err, decoded) {
		if (err) {
			res.send({
				success: false,
				message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /users call in the authorization header ' +
					' as a Bearer token'
			});
			return;
		} else {
			// add the decoded user name and org name to the request object
			// for the downstream code to use
			req.session.username = decoded.username;
			req.session.orgName = decoded.orgName;
			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
			return next();
		}
	});
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function() {});
logger.info('****************** SERVER STARTED ************************');
logger.info('**************  http://' + host + ':' + port +
	'  ******************');
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Register and enroll user
app.post('/userLogin', multipartMiddleware, function(req, res, next) {

		console.log(req.body);

	 MongoClient.connect(dbUrl, function(err, db) {
        console.log("connected to DB")
        if (err) throw err;
        var collection = db.collection('login');

        collection.findOne({

            username: req.body.username

        },

function(err, result) {
            if (result != null) {
                console.log(result.password);
console.log(req.body.password);
                if (result.password == req.body.password) {
                    req.session.username = result.username;
                    req.session.type = result.type;
                    req.session.orgName = result.orgName;
                     console.log("userLogin " + " type of user ="+ result.type + " username = "+result.username);
                    console.log("password  matched");
                    if (result.type == "Uniper") {
                    	console.log("inside type = " +result.username);
                    	console.log("inside type = " +result.orgName);
                        req.session.username = result.username;
                        req.session.orgName = result.orgName;
                        username = req.session.username;
                        orgName = req.session.orgName;
                        logger.debug('End point : /userLogin');
	logger.debug('User name : ' + username);
	logger.debug('Org name  : ' + orgName);
	if (!username) {
		res.json(getErrorMessage('\'username\''));
		return;
	}
	if (!orgName) {
		res.json(getErrorMessage('\'orgName\''));
		return;
	}
	var token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),

	}, app.get('secret'));

      helper.getRegisteredUsers(username, orgName, true).then(function(response) {
                        	console.log("getRegisteredUsers "+  username);
		if (response && typeof response !== 'string' ) {
			response.token = token;

			 res.redirect('/uniper_index#/uniper');
			 console.log(response);
		} else {
			res.json({
				success: false,
				message: response
			});
		}
	});
    }

	else  if (result.type == "Customer") {
                    	console.log("inside type = " +result.username);
                    	console.log("inside type = " +result.orgName);
                        req.session.username = result.username;
                        req.session.orgName = result.orgName;
                        username = req.session.username;
                        orgName = req.session.orgName;
                        logger.debug('End point : /userLogin');
	logger.debug('User name : ' + username);
	logger.debug('Org name  : ' + orgName);
	if (!username) {
		res.json(getErrorMessage('\'username\''));
		return;
	}
	if (!orgName) {
		res.json(getErrorMessage('\'orgName\''));
		return;
	}
	var token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),

	}, app.get('secret'));

      helper.getRegisteredUsers(username, orgName, true).then(function(response) {
                        	console.log("getRegisteredUsers "+  username);
		if (response && typeof response !== 'string' ) {
			response.token = token;

			 res.redirect('/customer_index#/customer');
			 console.log(response);
		} else {
			res.json({
				success: false,
				message: response
			});
		}
	});

                    }

                    db.close();
                } else {
                    console.log("password do not match");
                    res.redirect('/login?valid=y');

                }
            } else {
                console.log("username do not match");

                res.redirect('/login?valid=y');

                console.log(err);
            }
        });
    });

});

// Register and enroll user



// Create Channel
app.post('/channels', function(req, res) {
	logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>');
	logger.debug('End point : /channels');
	var channelName = req.body.channelName;
	var channelConfigPath = req.body.channelConfigPath;
	logger.debug('Channel name : ' + channelName);
	logger.debug('channelConfigPath : ' + channelConfigPath); //../artifacts/channel/mychannel.tx
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!channelConfigPath) {
		res.json(getErrorMessage('\'channelConfigPath\''));
		return;
	}

	channels.createChannel(channelName, channelConfigPath, username, orgName)
	.then(function(message) {
		res.send(message);
	});
});

// Join Channel
app.post('/channels/:channelName/peers', function(req, res) {
	logger.info('<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>');
	var channelName = req.params.channelName;
	var peers = req.body.peers;
	logger.debug('channelName : ' + channelName);
	logger.debug('peers : ' + peers);
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}

	join.joinChannel(channelName, peers, username, orgName)
	.then(function(message) {
		res.send(message);
	});
});

// Install chaincode on target peers
app.post('/chaincodes', function(req, res) {
	logger.debug('==================== INSTALL CHAINCODE ==================');
	var peers = req.body.peers;
	var chaincodeName = req.body.chaincodeName;
	var chaincodePath = req.body.chaincodePath;
	var chaincodeVersion = req.body.chaincodeVersion;
	logger.debug('peers : ' + peers); // target peers list
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodePath  : ' + chaincodePath);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodePath) {
		res.json(getErrorMessage('\'chaincodePath\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}

	install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, username, orgName)
	.then(function(message) {
		res.send(message);
	});
});

// Instantiate chaincode on target peers
app.post('/channels/:channelName/chaincodes', function(req, res) {
	logger.debug('==================== INSTANTIATE CHAINCODE ==================');
	var chaincodeName = req.body.chaincodeName;
	var chaincodeVersion = req.body.chaincodeVersion;
	var channelName = req.params.channelName;
	var fcn = req.body.fcn;
	var args = req.body.args;
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('chaincodeVersion  : ' + chaincodeVersion);
	logger.debug('fcn  : ' + fcn);
	logger.debug('args  : ' + args);
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!chaincodeVersion) {
		res.json(getErrorMessage('\'chaincodeVersion\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}
	instantiate.instantiateChaincode(channelName, chaincodeName, chaincodeVersion, fcn, args, username, orgName)
	.then(function(message) {
		res.send(message);
	});
});

// Invoke transaction on chaincode on target peers
 app.post('/channels/:channelName/chaincodes/:chaincodeName/fcnname/:fcn', multipartMiddleware, function(req, res, next) {
// app.post('/sslng/product', multipartMiddleware, function(req, res, next) {
  // app.post('/sslng/product', multipartMiddleware, function(req, res, next) {
	logger.debug('==================== INVOKE ON CHAINCODE ==================');
	var peers = req.body.peers;
	console.log(peers);
  var fcn = req.params.fcn;
	// var chaincodeName = "Products";
	// var channelName = "mychannel";
	// var fcn = "createProduct";
  var chaincodeName = req.params.chaincodeName;
	var channelName = req.params.channelName;
  var timeStamp = Date.now();
  var prid = 'PR' + timeStamp;
  if(fcn == "createProduct"){
  var args = [prid,
  	 req.body.supplier_name,
  	 req.body.source_location_city,
  	 req.body.source_location_country,
  	 req.body.volume,
  	  req.body.supplier_cost,
  		 req.body.supplier_load_date,
  		 req.body.tranporter_name,
  		 req.body.transporter_cost,
  		  req.body.container_load_date,
  			 req.body.load_port,
  			 req.body.container_discharge_date,
  			 req.body.discharge_port,
  			  req.body.destination_location_country,
  				req.body.destination_location_city,
  				req.body.destination_date,
  				req.body.created_by,
  				req.body.updated_by,
  				req.body.last_update_timestamp];
}  else if(fcn == "updateProduct"){
  var args = [req.body.prid,
    req.body.supplier_name,
     req.body.source_location_city,
     req.body.source_location_country,
     req.body.volume,
      req.body.supplier_cost,
       req.body.supplier_load_date,
       req.body.tranporter_name,
       req.body.transporter_cost,
        req.body.container_load_date,
         req.body.load_port,
         req.body.container_discharge_date,
         req.body.discharge_port,
          req.body.destination_location_country,
          req.body.destination_location_city,
          req.body.destination_date,
          req.body.created_by,
          req.body.updated_by,
          req.body.last_update_timestamp];
}
logger.debug('channelName  : ' + channelName);
logger.debug('chaincodeName : ' + chaincodeName);
logger.debug('fcn  : ' + fcn);
logger.debug('args  : ' + args);
if (!chaincodeName) {
  res.json(getErrorMessage('\'chaincodeName\''));
  return;
}
if (!channelName) {
  res.json(getErrorMessage('\'channelName\''));
  return;
}
if (!fcn) {
  res.json(getErrorMessage('\'fcn\''));
  return;
}
if (!args) {
  res.json(getErrorMessage('\'args\''));
  return;
}
	invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgName)
	.then(function(message) {
		res.send(message);
	});
});

//GetUserName
app.get("/getUserName", function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({
        username: username,
        name: req.body.name,
        type: req.body.type

    });
});
// Query on chaincode on target peers
app.get('/sslng/products', multipartMiddleware, function(req, res, next) {
	logger.debug('==================== QUERY BY CHAINCODE ==================');
	var channelName = "mychannel";
	var chaincodeName = "Products";
	// var codeName = patientcode;

	// if(orgName == "org1"){
	var args = [];
	var fcn = "getAllProducts"
	    var peer = ["peer1"];
	// }

	logger.debug('channelName : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('fcn : ' + fcn);
	logger.debug('args : ' + args);

	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	logger.debug(args);

	query.queryChaincode(peer, channelName, chaincodeName, args, fcn, username, orgName)
	.then(function(message) {
    console.log("-----------message after query chain code----------------");
    console.log(message);
		res.send(message);
	});
});


// Invoke transaction on chaincode for Demand Request.
 app.post('/channels/:channelName/chaincodes/:chaincodeName/fcnname/:fcn/rdd', multipartMiddleware, function(req, res, next) {
// app.post('/sslng/product', multipartMiddleware, function(req, res, next) {
  // app.post('/sslng/product', multipartMiddleware, function(req, res, next) {
	logger.debug('==================== INVOKE ON CHAINCODE For Demand Request ==================');
	var peers = req.body.peers;
	console.log(peers);
  var fcn = req.params.fcn;
	// var chaincodeName = "Products";
	// var channelName = "mychannel";
	// var fcn = "createProduct";
  var chaincodeName = req.params.chaincodeName;
	var channelName = req.params.channelName;
  var timeStamp = Date.now();
  var drid = 'DR' + timeStamp;
  if(fcn == "createDemandRequest"){

  var args = [drid,
  	 req.body.prid,
  	 req.body.volume,
  	 req.body.price,
  	 req.body.delivery_location_country,
  	  req.body.delivery_location_city,
  		 req.body.destination_date,
  		 req.body.counter_offer_count,
  		  req.body.customer_id,
  			 req.body.uniper_id,
  			 req.body.created_by,
  			 req.body.updated_by,
  			  req.body.last_update_timestamp];
}  else if(fcn == "updateDemandRequest"){
  var args = [req.body.drid,
  	 req.body.volume,
  	 req.body.price,
  	 req.body.delivery_location_country,
  	  req.body.delivery_location_city,
  		 req.body.delivery_date,
  		 req.body.status,
  		 req.body.updated_by,
  		  req.body.customer_id];
}
logger.debug('channelName  : ' + channelName);
logger.debug('chaincodeName : ' + chaincodeName);
logger.debug('fcn  : ' + fcn);
logger.debug('args  : ' + args);
if (!chaincodeName) {
  res.json(getErrorMessage('\'chaincodeName\''));
  return;
}
if (!channelName) {
  res.json(getErrorMessage('\'channelName\''));
  return;
}
if (!fcn) {
  res.json(getErrorMessage('\'fcn\''));
  return;
}
if (!args) {
  res.json(getErrorMessage('\'args\''));
  return;
}
	invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, username, orgName)
	.then(function(message) {
		res.send(message);
	});
});

// Query on chaincode on target peers
app.get('/sslng/getDemandRequest_Customer', multipartMiddleware, function(req, res, next) {
	logger.debug('==================== QUERY BY CHAINCODE For Demand Request ==================');
	var channelName = "mychannel";
	var chaincodeName = "DemandRequests";
	// var codeName = patientcode;

	// if(orgName == "org1"){
  if(orgName == "customer"){
	var args = [username];
   var fcn = "getDemandRequestByCustomer"
}

else if(orgName == "uniper"){
  var args = [];
  var fcn = "getAllDemandRequests"
}

	    var peer = ["peer1"];
	// }

	logger.debug('channelName : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('fcn : ' + fcn);
	logger.debug('args : ' + args);

	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	logger.debug(args);

	query.queryChaincode(peer, channelName, chaincodeName, args, fcn, username, orgName)
	.then(function(message) {
		res.send(message);
	});
});



//  Query Get Block by BlockNumber
app.get('/channels/:channelName/blocks/:blockId', function(req, res) {
	logger.debug('==================== GET BLOCK BY NUMBER ==================');
	let blockId = req.params.blockId;
	let peer = req.query.peer;
	logger.debug('channelName : ' + req.params.channelName);
	logger.debug('BlockID : ' + blockId);
	logger.debug('Peer : ' + peer);
	if (!blockId) {
		res.json(getErrorMessage('\'blockId\''));
		return;
	}

	query.getBlockByNumber(peer, blockId, req.username, req.orgname)
		.then(function(message) {
			res.send(message);
		});
});

// Query Get Transaction by Transaction ID

app.get('/channels/:channelName/transactions/:trxnId', multipartMiddleware, function(req, res, next) {
	logger.debug(
		'================ GET TRANSACTION BY TRANSACTION_ID ======================'
	);
	logger.debug('channelName : ' + req.params.channelName);
	let trxnId = req.params.trxnId;
	let peer = req.query.peer;
	console.log("peer: ",peer);
	console.log("trxnId: ",trxnId);
	if (!trxnId) {
		res.json(getErrorMessage('\'trxnId\''));
		return;
	}

	query.getTransactionByID(peer, trxnId, username, orgName)
		.then(function(message) {
			console.log("message: ",message);
			res.send(message);
		});
});
// Query Get Block by Hash
app.get('/channels/:channelName/blocks', function(req, res) {
	logger.debug('================ GET BLOCK BY HASH ======================');
	logger.debug('channelName : ' + req.params.channelName);
	let hash = req.query.hash;
	let peer = req.query.peer;
	if (!hash) {
		res.json(getErrorMessage('\'hash\''));
		return;
	}

	query.getBlockByHash(peer, hash, req.username, req.orgname).then(
		function(message) {
			res.send(message);
		});
});
//Query for Channel Information
app.get('/channels/:channelName', function(req, res) {
	logger.debug(
		'================ GET CHANNEL INFORMATION ======================');
	logger.debug('channelName : ' + req.params.channelName);
	let peer = req.query.peer;

	query.getChainInfo(peer, req.username, req.orgname).then(
		function(message) {
			res.send(message);
		});
});
// Query to fetch all Installed/instantiated chaincodes
app.get('/chaincodes', function(req, res) {
	var peer = req.query.peer;
	var installType = req.query.type;
	//TODO: add Constnats
	if (installType === 'installed') {
		logger.debug(
			'================ GET INSTALLED CHAINCODES ======================');
	} else {
		logger.debug(
			'================ GET INSTANTIATED CHAINCODES ======================');
	}

	query.getInstalledChaincodes(peer, installType, req.username, req.orgname)
	.then(function(message) {
		res.send(message);
	});
});
// Query to fetch channels
app.get('/channels', function(req, res) {
	logger.debug('================ GET CHANNELS ======================');
	logger.debug('peer: ' + req.query.peer);
	var peer = req.query.peer;
	if (!peer) {
		res.json(getErrorMessage('\'peer\''));
		return;
	}

	query.getChannels(peer, req.username, req.orgname)
	.then(function(
		message) {
		res.send(message);
	});
});

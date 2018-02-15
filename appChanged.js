
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var path=require('path');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var MongoClient = require('mongodb').MongoClient;
var ObjectIdVar = require('mongodb').ObjectID;

require('./config.js');
var hfc = require('fabric-client');

var helper = require('./app/helper.js');
var channels = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var host = process.env.HOST || hfc.getConfigSetting('host');
var dbUrl = 'mongodb://localhost:27017/SSLNG_login';
var username;
var orgName;
// New changes
// var webpack = require('webpack');

// var webpackDevMiddleware = require('webpack-dev-middleware');
// var webpackHotMiddleware = require('webpack-hot-middleware');
// var config = require('./webpack.config');
// var index = require('./webserver/routes/index');
// var users = require('./webserver/routes/users');

// var compiler = webpack(config);

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use('/', express.static(path.join(__dirname, './webclient/')));

// app.use('/', index);

// app.use(webpackDevMiddleware(compiler, {
//     noInfo: true,
//     publicPath: config.output.publicPath,
//     stats: {
//         colors: true
//     },
//     watchOptions: {
//       aggregateTimeout: 300,
//       poll: 1000
//     }
// }));

// app.use(webpackHotMiddleware(compiler));


// Changes End

/*var port = process.env.PORT || hfc.getConfigSetting('port');*/
var port = 80
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use('/bower_components',  express.static(__dirname + '/bower_components'));



app.locals.pretty = true;
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});



// set secret variable
app.set('secret', 'thisismysecret');
app.use(expressJWT({
	secret: 'thisismysecret'
}).unless({
	path: ['/users',
	'/userLogin'
]
}));
app.use(bearerToken());
app.use(function(req, res, next) {
	if (req.originalUrl.indexOf('/users') >= 0) {
		return next();
	}
	if (req.originalUrl.indexOf('/userLogin') >= 0) {
		return next();
	}
	// if (req.originalUrl.indexOf('/channels/mychannel/chaincodes/TradeCC/fcnname/createTrade') >= 0) {
	// 	return next();
	// }
	// if (req.originalUrl.indexOf('/channels/mychannel/chaincodes/TradeCC/fcnname/updateTrade') >= 0) {
	// 	return next();
	// }
	// if (req.originalUrl.indexOf('/getTradebyid') >= 0) {
	// 	return next();
	// }

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
			req.username = decoded.username;
			req.orgname = decoded.orgName;
			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
			return next();
		}
	});
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(8080, function() {});
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
// UserLogin

////////////////

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
				req.session.name=result.name;
				req.session.orgName = result.orgName;
				 console.log("userLogin " + " type of user ="+ result.type + " username = "+result.username);
				console.log("password  matched");
				if (result.type == "Uniper") {
					console.log("inside type = " +result.username);
					console.log("inside type = " +result.orgName);
					req.session.username = result.username;
					req.session.orgName = result.orgName;
					// username = req.session.username;
					// orgName = req.session.orgName;
					logger.debug('End point : /userLogin');
logger.debug('User name : ' + req.session.username);
logger.debug('Org name  : ' + req.session.orgName);
if (!req.session.username) {
	res.json(getErrorMessage('\'username\''));
	return;
}
if (!req.session.username) {
	res.json(getErrorMessage('\'orgName\''));
	return;
}
var token = jwt.sign({
	exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),

}, app.get('secret'));

  helper.getRegisteredUsers(req.session.username , req.session.orgName, true).then(function(response) {
						console.log("getRegisteredUsers "+  req.session.username);
	if (response && typeof response !== 'string' ) {
		response.token = token;

		 res.redirect('/');
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

else  if (result.type == "Supplier") {
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

		 res.redirect('/supplier_index#/supplier');
		 console.log(response);
	} else {
		res.json({
			success: false,
			message: response
		});
	}
});

}

   else  if (result.type == "Transporter") {
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

		 res.redirect('/transporter_index#/transporter');
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
app.post('/users', function(req, res) {
	var username = req.body.username;
	var orgName = req.body.orgName;
	logger.debug('End point : /users');
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
		username: username,
		orgName: orgName
	}, app.get('secret'));
	helper.getRegisteredUsers(username, orgName, true).then(function(response) {
		if (response && typeof response !== 'string') {
			response.token = token;
			console.log(token);
			/*req.session.username = username;
            req.session.orgName = orgName;
            req.session.token = token;
            console.log("session saved with ", req.session.username + " " + req.session.orgName+ " "+ req.session.token)*/
			res.json(response);
		} else {
			res.json({
				success: false,
				message: response
			});
		}
	});
});
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

	channels.createChannel(channelName, channelConfigPath, req.username, req.orgname)
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

	join.joinChannel(channelName, peers, req.username, req.orgname)
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

	install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, req.username, req.orgname)
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
	instantiate.instantiateChaincode(channelName, chaincodeName, chaincodeVersion, fcn, args, req.username, req.orgname)
	.then(function(message) {
		res.send(message);
	});
});
// Invoke transaction on chaincode on target peers
app.post('/channels/:channelName/chaincodes/:chaincodeName/fcnname/:fcn', multipartMiddleware, function(req, res, next) {
	logger.debug('==================== INVOKE ON CHAINCODE ==================');
	console.log("req.headers ")
	console.log(req.headers)
	console.log("req.user ")
	console.log(req.user)
	console.log("req.user: ")
	console.log(req.username)
	var peers = req.body.peers;
	var chaincodeName = req.params.chaincodeName;
	var channelName = req.params.channelName;
	var fcn = req.params.fcn;
	// var args = req.body.args;
	var timeStamp = Date.now();
	var trid = 'TRID' + timeStamp;
	if(fcn == "createTrade"){
		//var args = req.body.args;
   var args = [trid,
		req.body.version,
		req.body.direction,
		req.body.counter_party_direction,
		req.body.party1,
		req.body.party2,
		req.body.inco_term,
		req.body.trade_location,
		req.body.delivery_date,
		req.body.laycan_date,
		req.body.price_type,
		req.body.index,
		req.body.price_UoM,
		req.body.associated_fees,
		req.body.total_fee,
		req.body.commodity,
		req.body.product_name,
		req.body.volume,
		req.body.quality_api,
		req.body.quality_sul,
		req.body.tolerance,
		req.body.trader_comments,
		req.body.marine_freight_estimate,
		req.body.inspector_fee,
		req.body.agent_fee,
		req.body.demurrage_estimate,
		req.body.throughput,
		req.body.storate_lease,
		req.body.buyer_id,
		req.body.seller_id,
		req.body.last_update_timestamp,
		req.body.updated_by,
		req.body.trade_confirm_doc];
} else if(fcn == "updateTrade"){
	var args = [req.body.trid,
		req.body.version,
		req.body.new_status,
		req.body.direction,
		req.body.counter_party_direction,
		req.body.party1,
		req.body.party2,
		req.body.inco_term,
		req.body.trade_location,
		req.body.delivery_date,
		req.body.laycan_date,
		req.body.price_type,
		req.body.index,
		req.body.price_UoM,
		req.body.associated_fees,
		req.body.total_fee,
		req.body.commodity,
		req.body.product_name,
		req.body.volume,
		req.body.quality_api,
		req.body.quality_sul,
		req.body.tolerance,
		req.body.trader_comments,
		req.body.marine_freight_estimate,
		req.body.inspector_fee,
		req.body.agent_fee,
		req.body.demurrage_estimate,
		req.body.throughput,
		req.body.storate_lease,
		req.body.buyer_id,
		req.body.seller_id,
		req.body.last_update_timestamp,
		req.body.updated_by,
		req.body.trade_confirm_doc];
}else if(fcn == "updateParcel"){
	var args = [
		req.body.trid,
		req.body.parcel_id
	];
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
// var username = "gins" ;
// var orgname = "uniper" ;
	//invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, req.body.username, req.body.orgname)

	invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, req.username, req.orgname)
	.then(function(message) {
		res.send(message);
	});
});
// Query on chaincode on target peers
app.get('/channels/:channelName/chaincodes/:chaincodeName', multipartMiddleware, function(req, res, next) {
	logger.debug('==================== QUERY BY CHAINCODE ==================');
	/*var channelName = "mychannel";
	var chaincodeName = "TradeCC";
	// var codeName = patientcode;

	// if(orgName == "org1"){
	var args = ["TR123456"];
	var fcn = "getTradeByTraderID"
	    var peer = ['peer1'];*/
	// }
	var channelName = req.params.channelName;
	var chaincodeName = req.params.chaincodeName;
	var fcn = req.query.fcn;
	var args = req.query.args;
	var peer = req.query.peer;

	logger.debug('channelName : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('fcn : ' + fcn);
	logger.debug('args : ' + args);
	logger.debug('peer : ' + peer);

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
	args = args.replace(/'/g, '"');
	args = JSON.parse(args);
	logger.debug(args);

	query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname)
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
app.get('/channels/:channelName/transactions/:trxnId', function(req, res) {
	logger.debug(
		'================ GET TRANSACTION BY TRANSACTION_ID ======================'
	);
	logger.debug('channelName : ' + req.params.channelName);
	let trxnId = req.params.trxnId;
	let peer = req.query.peer;
	if (!trxnId) {
		res.json(getErrorMessage('\'trxnId\''));
		return;
	}

	query.getTransactionByID(peer, trxnId, req.username, req.orgname)
		.then(function(message) {
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

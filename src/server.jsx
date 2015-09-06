var React = require('react')
  , Layout = require('./Components/Layout')
  , NuiApiTest = require('./Components/NuiApiTest')
  , express = require('express')
  , path = require('path')
  , fs = require('fs')
  , rp = require('request-promise')
  , nodeCache = require( "node-cache" )
  
var cache = new nodeCache();  
var app = express()
app.use('/pages', express.static(path.join(__dirname, 'Pages')))

app.post('/router', function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'})
    
    var options = {
        uri : 'http://10.2.16.71/expense/expensedotnet/proxy/Router.ashx',
        method : 'POST',
        json: true,
        body: [{"action": "ExpenseReport", "method": "GetReportsList", "data": ["", "", "", "", "", "", "", "", ""]}]
    };
    
    rp(options)
    .then(function (response) {
        res.end(response)
    })
    .catch(function (response) {
        res.end("{success:0}")
    });
})

app.get('/api', function (req, res) {
    res.writeHead(200, {'Content-Type': 'application/json'})
    getApi(function(api_json) {
        res.end(JSON.stringify(api_json))
    })
})

app.get('/', function (req, res) {
  	res.writeHead(200, {'Content-Type': 'text/html'})    
    getApi(function(api_json) {
        renderer(req, res, api_json);
    }) 
})

var getApi = function(callback) {
    var json = cache.get( "nuiapi");
    if (json) {
        callback(json);
    }
    else {
        rp('http://10.2.16.71/expense/expensedotnet/proxy/nuiapi.ashx')
        .then(function (response) {
            var api_json = JSON.parse(response);
            success = cache.set("nuiapi", api_json, 0);
            callback(api_json);
         })
        .catch(console.error);
    }
}

var renderer = function (req, res, api_json) {
    var content = React.renderToString(
        <NuiApiTest api_json={api_json} />
    )
    var html = React.renderToStaticMarkup(
        <Layout content={content} api_json={api_json}/>
    )
    res.end(html)
}

app.listen(1337)
console.log('Server running at http://localhost:1337/')

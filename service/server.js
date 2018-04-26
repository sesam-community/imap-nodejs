var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var url = require('url');

var Imap = require('imap');
var xoauth2 = require('xoauth2');

var parserLimit = process.env.PARSER_LIMIT || '1000kb';

var app = express();

app.use(bodyParser.json({limit: parserLimit}));
app.use(morgan('tiny'));

var MIN_UID = 1;

// Configure router to respond with a list of entities to /entities
app.get("/xoauth2/:host/:user", function (request, response) {
  var host = request.params.host;
  var user = request.params.user;
  var parsedUrl = url.parse(request.url, true);
  var since = parsedUrl.query.since;

  var lastUid;
  var lastUidValidity = null;
  if (since !== undefined) {
    var parts = since.split(':');
    lastUid = parts[0];
    lastUidValidity = parts[1];
  }
  var accessToken = parsedUrl.query.access_token;

  var tokenGenerator = xoauth2.createXOAuth2Generator({user: user, accessToken: accessToken });

  tokenGenerator.getToken(function (err, token) {
    // shouldn't happen
    if (err) throw err;
    var imap = new Imap({
      xoauth2: token,
      host: host,
      port: 993,
      tls: true
    });

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function() {
      openInbox(function(err, box) {
        // shouldn't happen, inbox should always be present
        if (err) {
          console.log('Inbox error: ' + err);
          response.status(500).send('Unable to open INBOX: ' + err);
          return;
        }

        var headers = {
          'Content-Type': 'application/json',
        };

        if (lastUidValidity !== '' + box.uidvalidity) {
          // need to do a full scan regardless of previous since
          lastUid = MIN_UID;
          headers['X-Entities-Estimate'] = box.messages.total;
        }

        response.writeHead(200, headers);

        response.write("[");

        var counter = 0;

        // seems like gmail still repeats the last ~600 messages, shouldn't be a problem
        var f = imap.fetch(lastUid + ':*', { envelope: true });
        f.on('message', function(msg, seqno) {
          var entity = {};

          msg.once('attributes', function(attrs) {
            var envelope = attrs.envelope;
            entity['_id'] = envelope.messageId;
            entity['_updated'] = seqno + ':' + box.uidvalidity;
            entity['in-reply-to'] = envelope.inReplyTo;
            entity['date'] = envelope.date;
            entity['sender_hosts'] = envelope.sender.map(function (s) { return s.host; });
          });
          msg.once('end', function() {
            if (counter === 0){
              response.write(JSON.stringify(entity));
              counter++;
            }
            else {
              response.write("," + JSON.stringify(entity) );
            }
          });
        });
        f.once('error', function(err) {
          // can't return error, headers has already been sent :(
          console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
          response.write("]");
          imap.end();
        });
      });
    });
    imap.once('error', function(err) {
      response.status(400).send('Unable to connect: ' + err);
    });
    imap.once('end', function() {
      response.end();
    });
    imap.connect();
  });
});

// Listen on port 5000, IP defaults to 127.0.0.1
app.listen(5000, "0.0.0.0", function () {
  console.log("Server running at http://0.0.0.0:5000/");
});

# imap-adapter
A NodeJS micro service template for reading of IMAP envelopes as a JSON entity stream to a Sesam service instance or any other client.

```
$ cd service && npm install && npm run start
<some-path>/nodejs-datasource-template/service
└── ...

[..]

Server running at http://0.0.0.0:5000/
```

The service listens on port 5000. JSON entities can be retrieved from 'curl -v  "http://0.0.0.0:5000/xoauth2/<imap-host>/<user-account>?access_token=<oauth-access-token>"'.

```
$ curl -s 'http://localhost:5000/xoauth2/...' | jq .
[
  {
    "_id": "<1a48ed6cf9e0e3979e1345725b94cf81@async.twshared2206.07.lla2.facebook.com>",
    "_updated": "66498:3",
    "envelope": {
      "date": "2018-04-26T07:58:13.000Z",
      "subject": "See Ivar Lyngner's message and other notifications you've missed",
      "from": [
        {
          "name": "Facebook",
          "mailbox": "notification+zj4y0f0t40zy",
          "host": "facebookmail.com"
        }
      ],
      "sender": [
        {
          "name": "Facebook",
          "mailbox": "notification+zj4y0f0t40zy",
          "host": "facebookmail.com"
        }
      ],
      "replyTo": [
        {
          "name": "noreply",
          "mailbox": "noreply",
          "host": "facebookmail.com"
        }
      ],
      "to": [
        {
          "name": "Baard Johansen",
          "mailbox": "baard",
          "host": "rehn.no"
        }
      ],
      "cc": null,
      "bcc": null,
      "inReplyTo": null,
      "messageId": "<1a48ed6cf9e0e3979e1345725b94cf81@async.twshared2206.07.lla2.facebook.com>"
    }
  },
  {
    "_id": "<1a48ed6cf9e0e3979e1345725b94cf81@async.twshared2206.07.lla2.facebook.com>",
    "_updated": "66499:3",
    [..]
  }
]
```

```
$ curl -s 'http://localhost:5000/xoauth2/...?since=66498:3' | jq .
[
  {
    "_id": "<1a48ed6cf9e0e3979e1345725b94cf81@async.twshared2206.07.lla2.facebook.com>",
    "_updated": "66499:3",
    [..]
  }
]
```
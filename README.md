# imap-adapter
A NodeJS micro service template for reading a subset of IMAP envelopes as a JSON entity stream to a Sesam service instance or any other client.

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
    "_id": "<0.0.4B.76F.1D3DD30CC772E50.0@e3uspmta192.emarsys.net>",
    "_updated": "66498:3",
    "in-reply-to": "<2099627186973827-1902653223337892@groups.facebook.com>",
    "date": "2018-04-26T07:32:58.000Z",
    "sender_hosts": [
      "reply-seller.ebay.com"
    ]
  },
  {
    "_id": "<1a48ed6cf9e0e3979e1345725b94cf81@async.twshared2206.07.lla2.facebook.com>",
    "_updated": "66499:3",
    "in-reply-to": null,
    "date": "2018-04-26T07:58:13.000Z",
    "sender_hosts": [
      "facebookmail.com"
    ]
  }
]
```

```
$ curl -s 'http://localhost:5000/xoauth2/...?since=66498:3' | jq .
[
  {
    "_id": "<1a48ed6cf9e0e3979e1345725b94cf81@async.twshared2206.07.lla2.facebook.com>",
    "_updated": "66499:3",
    "in-reply-to": null,
    "date": "2018-04-26T07:58:13.000Z",
    "sender_hosts": [
      "facebookmail.com"
    ]
  }
]
```
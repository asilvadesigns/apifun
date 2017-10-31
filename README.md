# CapitalOne
This is a private repository.


### Dev
##### Environment
```
OS X    10.11.6
NodeJS  6.11.4
npm     3.10.10
```

##### Build
1. `nvm use` to set correct NodeJS version.
2. `npm install` to download dependencies. 


### Reference
##### Documentation
- [Node.js ES2015 Support][1]
- [Node.js ES2015 and beyond][2]
- [Node.js v6.11.4 Documentation][3]
- [Express.js v4.x API][4]

[1]: http://node.green/
[2]: https://nodejs.org/en/docs/es6/
[3]: https://nodejs.org/dist/latest-v6.x/docs/api/
[4]: https://expressjs.com/en/4x/api.html

##### HTTP status codes
- 200 – ok: request was successful
- 201 - created: a new resource was successfully created
- 204 - server successfully processed request, but is not returning any content
- 400 - bad request: the request was malformed or invalid
- 404 - not found: request resource could not be found
- 500 - internal server error: unknown server error has occurred
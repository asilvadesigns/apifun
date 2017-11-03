# CapitalOne
This is a private repository.


### Dev
##### Environment
```
OS X    10.11.6
NodeJS  6.11.4
npm     3.10.10
```
NOTE: If you have NVM - run `nvm use` to set correct NodeJS version.

##### Build
1. `npm install` to download dependencies. 
2. `npm run prepare` to run any build scripts.
3. `npm -- --host <host> --port <port>` to run server or...
    - `npm start` will default to `localhost:3000`.

##### Tests
`npm test` will run tests using [Mocha][5] and [Chai][6].



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
[5]: https://mochajs.org/
[6]: http://chaijs.com/

##### Some HTTP status codes
- 200 – ok: request was successful
- 201 - created: a new resource was successfully created
- 204 - server successfully processed request, but is not returning any content
- 400 - bad request: the request was malformed or invalid
- 404 - not found: request resource could not be found
- 409 - request could not be completed due to a conflict with the current state of the target resource
- 500 - internal server error: unknown server error has occurred
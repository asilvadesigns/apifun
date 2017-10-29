## TODO
##### Wed Oct 18 23:26:11 2017
- [x] error handling for invalid types
- [x] do you even json schema bro 
- [x] handle collisions... can't post same timestamp
- [_] generate dynamic timestamp on post request maybe..?
- [x] project architecture.. it's ugly dude
- [_] automate testing or at least get some asserts
- [x] implement get method for given timestamp

##### Thu Oct 19 15:06:22 2017
- [x] handle posting single vs multiple items
- [x] research best practices for multiple posts single request
- [x] implement get method for given data

##### Mon Oct 23 09:05:21 2017
- [x] refactor / startover
- [x] change app structure
- [x] setup validation && schema

##### Tue Oct 24 16:56:12 2017
- [x] handle "get measurements from date"
- [x] throw error if date is not valid
- [_] automate testing...
- [_] cleanup "store" dir
- [x] handle posting multiple time stamps
- [_] add store utilities, like checking if something exists..
- [_] store will need to add, remove, update, check entries

##### Wed Oct 25 08:18:55 2017
- [x] use official json patch
- [_] when putting, tell me if it's the same, would be nice

##### Thu Oct 26 00:13:31 2017
- [_] time complexity in stats sucks
- [_] refactor code... acting like hoisting isn't a thing..
- [x] handle datetime validation in stats
- [x] handle metric validation
- [x] handle stat validation..
- [x] assume measurements are sorted..? should be...
- [x] change logic stats logic: start with date range, filter out metrics, generate stats
- [x] handle "if invalid metric exists among existing, output existing"

##### Fri Oct 27 00:09:24 2017
- [x] need to return the average from the object, not the expected mathmatical value
- [x] handle stats, if there are none etc, and build up the statistics using condition
- [_] test deliverable, npm shrinkwrap, zip file, npm commands etc.

##### Sat Oct 28 23:33:45 2017

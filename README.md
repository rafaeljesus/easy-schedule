## easy-schedule

[![Node version](https://img.shields.io/node/v/latest-version.svg?style=flat-square)](https://npmjs.org/package/easy-schedule)
[![Build Status](https://img.shields.io/travis/rafaeljesus/easy-schedule/master.svg?style=flat-square
)](https://travis-ci.org/rafaeljesus/easy-schedule)
[![bitHound Score](https://www.bithound.io/github/rafaeljesus/easy-schedule/badges/score.svg)](https://www.bithound.io/github/rafaeljesus/easy-schedule)
[![bitHound Dependencies](https://www.bithound.io/github/rafaeljesus/easy-schedule/badges/dependencies.svg)](https://www.bithound.io/github/rafaeljesus/easy-schedule/master/dependencies/npm)
[![license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/rafaeljesus/easy-schedule/blob/master/LICENSE)

Easy Schedule handles job scheduling for your application by storing and managing events that correspond to actions that your application intends to execute in the future.
At the appropriate time, Easy Schedule calls back to your application at the provided URL to signal that some work must be completed.

## Built with
- [nodejs](https://https://nodejs.org) &mdash; Back end is a nodejs.
- [koa](http://koajs.com) &mdash; API is a KOA app. It respond to requests RESTfully in JSON.
- [Mongodb](https://www.mongodb.com/) &mdash; Mongodb as a data store.

## REST API

#### Users
(POST /v1/users) create a user account

(DELETE /v1/users) delete a user account

#### Events
(GET /v1/events) list all events from user

(GET /v1/events/:id) find a event by id

(POST /v1/events) create a event

(PUT /v1/events/:id) update a event by id

(DELETE /v1/events/:id) delete a event by id

#### History
(GET /v1/history) list all history events from user

## Contributing
- Fork it
- Create your feature branch (`git checkout -b my-new-feature`)
- Commit your changes (`git commit -am 'Add some feature'`)
- Push to the branch (`git push origin my-new-feature`)
- Create new Pull Request

## Front-end project
- [easy-schedule-ui](https://github.com/fabiohbarbosa/easy-schedule-ui/)

## Maintaners

* [Rafael Jesus](https://github.com/rafaeljesus)

## License
Easy Schedule is released under the [MIT License](http://www.opensource.org/licenses/MIT).

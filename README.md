## easy-schedule

[![Build Status](https://travis-ci.org/rafaeljesus/easy-schedule.svg)](https://travis-ci.org/rafaeljesus/easy-schedule) [![Code Climate](https://codeclimate.com/github/rafaeljesus/easy-schedule/badges/gpa.svg)](https://codeclimate.com/github/rafaeljesus/easy-schedule) [![Test Coverage](https://codeclimate.com/github/rafaeljesus/easy-schedule/badges/coverage.svg)](https://codeclimate.com/github/rafaeljesus/easy-schedule/coverage)

Easy Schedule handles job scheduling for your application by storing and managing events that correspond to actions that your application intends to execute in the future.
At the appropriate time, Easy Schedule calls back to your application at the provided URL to signal that some work must be completed.

## Built with

- [iojs](https://iojs.org) &mdash; Back end is a iojs.
- [koa](http://koajs.com) &mdash; API is a KOA app. It respond to requests RESTfully in JSON.
- [Redis](http://redis.io) &mdash; Redis as a data store and message queue events.

## Maintaners

* [Rafael Jesus](https://github.com/rafaeljesus)

## License
Easy Schedule is released under the [MIT License](http://www.opensource.org/licenses/MIT).

'use strict';

module.exports = function() {
  return {
    event1: {
      url: 'https://google.com',
      type: 'Recurring',
      cron: '* * * * *'
    },
    event2: {
      url: 'https://google.com',
      type: 'Recurring',
      cron: '* * * * *'
    }
  };
};

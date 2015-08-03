'use strict';

module.exports = function() {
  return {
    event1: {
      url: 'https://example1.com',
      type: 'Recurring',
      cron: '* * * * *'
    },
    event2: {
      url: 'https://example2.com',
      type: 'Recurring',
      cron: '* * * * *'
    }
  };
};

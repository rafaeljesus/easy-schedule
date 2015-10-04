'use strict'

module.exports = () => {
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
  }
}

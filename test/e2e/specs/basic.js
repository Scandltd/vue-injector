module.exports = {
  'basic': function (browser) {
    browser.url('http://localhost:8080/basic/')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.service-name', 'AnyService')
      .end()
  }
}

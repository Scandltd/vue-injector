module.exports = {
  'import': function (browser) {
    browser.url('http://localhost:8080/import/')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.service-name', 'AnyService')
      .assert.containsText('.service-import', 'Service')
      .end()
  }
}

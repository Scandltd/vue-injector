module.exports = {
  'import': function (browser) {
    browser.url('http://localhost:8080/import/')
      .waitForElementVisible('#app', 1000)
      .assert.containsText('.root-service .json-formatter-constructor-name', 'AnyService')
      .assert.containsText('.inject-service .json-formatter-constructor-name', 'Service')
      .end()
  }
}

# Selenium virtual authenticators example

This is an example of how to complete a U2F authentication using Selenium and virtual authenticators

## Dependencies

1. Docker image selenium/standalone-chrome:selenium-4.0.0-alpha-4 with ChromeDriver ^79
2. Patched version of selenium js client library. For now, the code is at https://github.com/whyamiroot/selenium/tree/js-virtual-authenticator. The library is temporarily published as `selenium-webdriver-js-virtual-auth@4.0.0-alpha.5-js-virtual-auth`
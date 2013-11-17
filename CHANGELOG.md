# Changelog

## 0.5.2 - 2013-11-17

- Add amCalendar filter ([#24](https://github.com/urish/angular-moment/issues/24), contributed by [OndraM](https://github.com/OndraM))

## 0.5.1 - 2013-11-09

- Add amDuration filter ([#20](https://github.com/urish/angular-moment/issues/20), contributed by [gabrielstuff](https://github.com/gabrielstuff))

## 0.5.0 - 2013-11-02

- Use $window.setTimeout instead of $timeout, fixes protractor synchronization issue ([#19](https://github.com/urish/angular-moment/issues/19))

## 0.4.2 - 2013-10-30

- Add settings constant for configuring moment.js withoutSuffix-option ([#18](https://github.com/urish/angular-moment/pull/18))

## 0.4.1 - 2013-10-27

- Support moment.js v2.4.0. See [here](https://github.com/moment/moment/#240) for changelog.

## 0.4.0 - 2013-10-08

- Support moment.js v2.3.0. See [here](https://gist.github.com/ichernev/6864354) for possibly breaking changes.

## 0.3.0 - 2013-10-07

- Bugfix: am-time-ago support for empty string ([#15](https://github.com/urish/angular-moment/issues/15))
- Behavior change: am-time-ago will only change the text once there is date

## 0.2.2 - 2013-09-29

- Add support for passing unix timestamp as a string to amDateFormat filter ([#14](https://github.com/urish/angular-moment/issues/14))

## 0.2.1 - 2013-09-13

- Fix an issue with tests failing on a different timezone
- Support moment 2.2.x, AngularJS 1.2

## 0.2.0 - 2013-08-22

- Add optional am-format attribute to am-time-ago ([#11](https://github.com/urish/angular-moment/issues/11))
- Add new amDateFormat filter ([#12](https://github.com/urish/angular-moment/issues/12))
- Add changelog file

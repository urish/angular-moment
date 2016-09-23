angular-moment
==============

AngularJS directive and filters for [Moment.JS](http://www.momentjs.com).

Copyright (C) 2013, 2014, 2015, 2016, Uri Shaked <uri@urish.org>

[![Build Status](https://travis-ci.org/urish/angular-moment.png?branch=master)](https://travis-ci.org/urish/angular-moment)
[![Coverage Status](https://coveralls.io/repos/urish/angular-moment/badge.png)](https://coveralls.io/r/urish/angular-moment)

### Angular 2 version is now available: [angular2-moment](https://github.com/urish/angular2-moment)

---

Installation
------------

You can choose your preferred method of installation:
* Through bower: `bower install angular-moment --save`
* Through npm: `npm install angular-moment moment --save`
* Through NuGet: `Install-Package angular-moment Moment.js`
* From a CDN: [jsDelivr](https://cdn.jsdelivr.net/angular.moment/1.0.0-beta.6/angular-moment.min.js) or [CDNJS](https://cdnjs.cloudflare.com/ajax/libs/angular-moment/1.0.0-beta.6/angular-moment.min.js)
* Download from github: [angular-moment.min.js](https://raw.github.com/urish/angular-moment/master/angular-moment.min.js)


Instructions for using moment-timezone with webpack
----------

 Even if you have `moment-timezone` in your `package.json`, `angular-moment` will not be able to use it unless you override
  moment using Angular's dependency injection [See Resolved Issue](https://github.com/urish/angular-moment/pull/234)
 
 ```javascript
 var angular = require('angular');
 require('angular-moment');
 var ngModule = angular.module('ngApp',['angularMoment']);
 ngModule.constant('moment', require('moment-timezone'));
 ```
 
 
Usage
-----
Include both **moment.js** and **angular-moment.js** in your application.

```html
<script src="components/moment/moment.js"></script>
<script src="components/angular-moment/angular-moment.js"></script>
```

Add the module `angularMoment` as a dependency to your app module:

```js
var myapp = angular.module('myapp', ['angularMoment']);
```

If you need internationalization support, load specified moment.js locale file right after moment.js:

```html
<script src="components/moment/moment.js"></script>
<script src="components/moment/locale/de.js"></script>
<script src="components/angular-moment/angular-moment.js"></script>
```

Then call the `amMoment.changeLocale()` method (e.g. inside your app's run() callback):

```js
myapp.run(function(amMoment) {
	amMoment.changeLocale('de');
});
```


### Use in controller/service/factory
Inject the `moment`-constant into your dependency injection. For example:
 
```js
angular.module('fooApp')
    .controller('FooCtrl', ['$scope', 'moment', function ($scope, moment) {
        $scope.exampleDate = moment().hour(8).minute(0).second(0).toDate();
    }]);
```

### am-time-ago directive
Use the `am-time-ago` directive to format your relative timestamps. For example:

```html
<span am-time-ago="message.time"></span>
```

angular-moment will dynamically update the span to indicate how much time
passed since the message was created. So, if your controller contains the following
code:
```js
$scope.message = {
   text: 'hello world!',
   time: new Date()
};
```

The user will initially see "a few seconds ago", and about a minute
after the span will automatically update with the text "a minute ago",
etc.

### amParse filter

Parses a custom-formatted date into a moment object that can be used with the `am-time-ago` directive and the
other filters. For example, the following code will accept dates that are formatted like "2015.04.25 22:00:15':

```html
<span am-time-ago="message.time | amParse:'YYYY.MM.DD HH:mm:ss'"></span>
```

Note: To use `amParse`, install angular-moment version 1.0.0-beta.3 or newer

### amFromUnix filter

Converts a unix-timestamp (seconds since 1/1/1970) into a moment object. Example:

```html
<span am-time-ago="message.unixTime | amFromUnix">
```

Note: To use `amFromUnix`, install angular-moment version 1.0.0-beta.3 or newer

### amUtc filter

Create / switch the current moment object into UTC mode. For example, given a date object in `message.date`, 
the following code will display the time in UTC instead of the local timezone:

```html
<span>{{message.date | amUtc | amDateFormat:'MM.DD.YYYY HH:mm:ss'}}</span>
```

Note: To use `amUtc`, install angular-moment version 1.0.0-beta.3 or newer

### amUtcOffset filter

Uses the given utc offset when displaying a date. For example, the following code will display the date with
a UTC + 3 hours time offset:

```html
<span>{{message.date | amUtcOffset:'+0300' | amDateFormat:'MM.DD.YYYY HH:mm:ss'}}</span>
```

Note: To use `amUtcOffset`, install angular-moment version 1.0.0-beta.3 or newer

### amLocal filter

Changes the given moment object to be in the local timezone. Usually used in conjunction with `amUtc` / `amTimezone` 
for timezone conversion. For example, the following will convert the given UTC date to local time:

```html
<span>{{message.date | amUtc | amLocal | amDateFormat:'MM.DD.YYYY HH:mm:ss'}}</span>
```

Note: To use `amLocal`, install angular-moment version 1.0.0-beta.3 or newer

### amTimezone filter

Applies a timezone to the given date / moment object. You need to include `moment-timezone.js` in your project
and load timezone data in order to use this filter. The following example displays the time in Israel's timezone:

```html
<span>{{message.date | amTimezone:'Israel' | amDateFormat:'MM.DD.YYYY HH:mm:ss'}}</span>
```

Note: To use `amTimezone`, install angular-moment version 1.0.0-beta.3 or newer

### amDateFormat filter
Format dates using moment.js format() method. Example:

```html
<span>{{message.time | amDateFormat:'dddd, MMMM Do YYYY, h:mm:ss a'}}</span>
```

This snippet will format the given time as "Monday, October 7th 2013, 12:36:29 am".

For more information about Moment.JS formatting options, see the
[docs for the format() function](http://momentjs.com/docs/#/displaying/format/).

### amCalendar filter

Format dates using moment.js calendar() method. Example:

```html
<span>{{message.time | amCalendar:referenceTime:formats}}</span>
```

This snippet will format the given time as e.g. "Today 2:30 AM" or "Last Monday 2:30 AM" etc..

For more information about Moment.JS calendar time format, see the
[docs for the calendar() function](http://momentjs.com/docs/#/displaying/calendar-time/).

### amDifference filter

Get the difference between two dates in milliseconds.
Parameters are date, units and usePrecision. Date defaults to current date. Example:

```html
<span>Scheduled {{message.createdAt | amDifference : null : 'days' }} days from now</span>
```

This snippet will return the number of days between the current date and the date filtered.

For more information about Moment.JS difference function, see the
[docs for the diff() function](http://momentjs.com/docs/#/displaying/difference/).

### amDurationFormat filter

Formats a duration (such as 5 days) in a human readable format. See [Moment.JS documentation](http://momentjs.com/docs/#/durations/creating/)
for a list of supported duration formats, and [`humanize() documentation`](http://momentjs.com/docs/#/durations/humanize/) 
for explanation about the formatting algorithm.

Example:

```html
<span>Message age: {{message.ageInMinutes | amDurationFormat : 'minute' }}</span>
```

Will display the age of the message (e.g. 10 minutes, 1 hour, 2 days, etc).

### amSubtract filter

Subtract values (hours, minutes, seconds ...) from a specified date.

See [Moment.JS documentation](http://momentjs.com/docs/#/durations/creating/) for a list of supported duration formats.

Example:

```html
<span>Start time: {{day.start | amSubtract : '1' : 'hours' | amDateFormat : 'hh'}} : {{day.start | amSubtract : '30' : 'minutes' | amDateFormat : 'mm'}}</span>

```

### amAdd filter

Add values (hours, minutes, seconds ...) to a specified date.

See [Moment.JS documentation](http://momentjs.com/docs/#/durations/creating/) for a list of supported duration formats.

Example:

```html
<span>Start time: {{day.start | amAdd : '1' : 'hours' | amDateFormat : 'hh'}} : {{day.start | amAdd : '30' : 'minutes' | amDateFormat : 'mm'}}</span>

```

### amStartOf filter

Mutates the original moment by setting it to the start of a unit(minute, hour, day..) of time.

See [Moment.JS documentation](http://momentjs.com/docs/#/manipulating/start-of/) for a list of supported duration formats.

Example:

```html
<span>{{ date | amStartOf:'month' | amLocal }}</span>

```

### amEndOf filter

Mutates the original moment by setting it to the end of a unit(minute, hour, day..) of time.

See [Moment.JS documentation](http://momentjs.com/docs/#/manipulating/end-of/) for a list of supported duration formats.

Example:

```html
<span>{{ date | amEndOf:'month' | amLocal }}</span>

```

### Time zone support

The `amDateFormat` and `amCalendar` filters can be configured to display dates aligned
to a specific timezone. You can configure the timezone using the following syntax:

```js
angular.module('myapp').constant('angularMomentConfig', {
    timezone: 'Name of Timezone' // e.g. 'Europe/London'
});
```

Remember to include `moment-timezone.js` v0.3.0 or greater in your project, otherwise the custom timezone
functionality will not be available. You will also need to include a timezone data file that
you can create using the [Timezone Data Builder](http://momentjs.com/timezone/)
or simply download from [here](https://rawgithub.com/qw4n7y/7282780/raw/6ae3b334b295f93047e8f3ad300db6bc4387e235/moment-timezone-data.js).

### Accessing `moment()` in your javascript

If you wish to use `moment()` in your services, controllers, or directives, simply inject the `moment` variable into the
constructor.

License
----

Released under the terms of the [MIT License](LICENSE).

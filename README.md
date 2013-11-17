angular-moment
==============

Angular.JS directive and filters for [Moment.JS](http://www.momentjs.com).

Copyright (C) 2013, Uri Shaked <uri@urish.org>

[![Build Status](https://travis-ci.org/urish/angular-moment.png?branch=master)](https://travis-ci.org/urish/angular-moment)

Usage
-----
Include both moment.js and angular-moment.js in your application.

```html
<script src="components/moment/moment.js"></script>
<script src="components/angular-moment/angular-moment.js"></script>
```

Add the module `angularMoment` as a dependency to your app module:

```js
var myapp = angular.module('myapp', ['angularMoment']);
```

If you need internationalization support, load specified moment.js locale file first:

```html
<script src="components/moment/lang/de.js"></script>
```

Than trigger global moment.js language (e.g. in your app's run() callback):

```html
$window.moment.lang('de');
```

### Timeago directive
Use am-time-ago directive to format your relative timestamps. For example:

```html
<span am-time-ago="message.time"></span>
```

angular-moment will dynamically update the span to indicate how much time
passed since the message was created. So, if you controller contains the following
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
<span>{{message.time | amCalendar}}</span>
```

This snippet will format the given time as e.g. "Today 2:30 AM" or "Last Monday 2:30 AM" etc..

For more information about Moment.JS calendar time format, see the
[docs for the calendar() function](http://momentjs.com/docs/#/displaying/calendar-time/).

License
----

Released under the terms of MIT License:

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



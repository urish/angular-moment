angular-moment
==============

Angular.JS directive for [Moment.JS](http://www.momentjs.com).
Copyright (C) 2013, Uri Shaked <uri@urish.org>

Usage
-----
Include both moment.js and angular-moment.js in your application.

```html
<script src="moment.js"></script>
<script src="angular-moment.js"></script>
```

Add the module `angularMoment` as a dependency to your app module:

```js
var myapp = angular.module('myapp', ['angularMoment']);
```

You can now start using the am-time-ago directive to format your
relative timestamps. For example:

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

License
----

Released under the terms of Apache 2 License.


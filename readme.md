# grunt-bower-install

Inject your Bower dependencies right into your HTML from Grunt.

## Getting Started

Install the module:
```
npm install grunt-bower-install --save-dev
```

Include the task in your Gruntfile:
```js
grunt.loadNpmTasks('grunt-bower-install');
```

Create a config block within your Gruntfile:
```js
'bower-install': {
  // Point to the html file that should be updated
  // when you run `bower-install`
  html: 'app/index.html',

  // Optional:
  // If your scripts shouldn't contain a certain
  // portion of a url, it can be excluded
  ignorePath: 'app/'
}
```

Pop this in your HTML file:
```html
<!-- bower -->
<!-- endbower -->
```

Install a Bower component:
```
grunt bower-install:jquery
```

You're in business!
```html
<!-- bower -->
<script src="components/jquery/jquery.js"></script>
<!-- endbower -->
```

If you want to uninstall a Bower component:
```
grunt bower-install:uninstall:jquery
```

## Examples
A simple sample apple:
[website](http://stephenplusplus.github.io/grunt-bower-install) | [github](http://github.com/stephenplusplus/grunt-bower-install)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2013 Stephen Sawchuk
Licensed under the MIT license.

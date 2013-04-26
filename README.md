# bower-install

Inject your dependencies right into your HTML from Grunt.

## Getting Started
Install the module:

```
npm install bower-install
```

Include the task in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-bower-install');
```

Create a config block within your Gruntfile:

```js
'bower-install': {
  // Point to your index file.
  index: 'app/index.html',

  // Optional:
  // If your scripts shouldn't contain a certain
  // portion of a url, it can be excluded.
  ignorePath: 'app/'
}
```

When installing a Bower component:

```
grunt bower-install:codecode
```

When uninstalling a Bower component:

```
grunt bower-install:uninstall:codecode
```

Pop this in your HTML file:

```html
<!-- bower -->
<!-- endbower -->
```

You're in business!

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Stephen Sawchuk
Licensed under the MIT license.

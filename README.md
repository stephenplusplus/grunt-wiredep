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
  // Point to your index file.
  index: 'app/index.html',

  // Optional:
  // If your scripts shouldn't contain a certain
  // portion of a url, it can be excluded.
  ignorePath: 'app/'
}
```

Pop this in your HTML file:

```html
<!-- bower -->
<!-- endbower -->
```

When installing a Bower component:

```
grunt bower-install:codecode
```

When uninstalling a Bower component:

```
grunt bower-install:uninstall:codecode
```

You're in business!

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2013 Stephen Sawchuk
Licensed under the MIT license.

# @irysius/grid-math

## This thing needs bloody unit tests

## Library Validation
### Validate CommonJS
To check if the library can run in a NodeJS setting:

    $ gulp build
    $ node check


### Validate AMD
To check if the library can run in a RequireJS setting:

    $ gulp build
    $ http-server

Inspect the console to see if the components all loaded.

## Library Usage
### Usage in NodeJS

    $ npm install --save @irysius/grid-math

### Usage in RequireJS

    $ npm install --save @irysius/grid-math

Assuming your `require` config might look like the following:

    var require = {
        paths: {
            '@irysius/grid-math': 'lib/math'
        }
    };

You would then copy the contents of the `build` folder to `lib/math`.

If you would like to take advantage of the predefined TypeScript definitions, please use `@irysius/grid-math` as the name.




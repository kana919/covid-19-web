# covid-19-web

A covid-19 web site for Japan.
[Demo Site](http://www.covid19jp.org) is currently under developing.

## Setup

Install dependency packages via npm.

```
$ cd js
$ npm install
```

## Run on local environment.

If you want to start web server on local environment, run following command.

```
$ cd js
$ npm run start
```

Then, web server is started on 8001 port.

***This site is assumed to connect to [covid-19-api](https://github.com/satoshi03/covid-19-api). So, start the API server at first.***

## Build and deploy

If you want to build js files, run following command.

```
$ cd js
$ npm run build
```

Then, source codes are built and outputted to `dist` directory.

Deploy `dist` files to Google Storage via `gsutil`.

```
$ gsutil rsync -R dist/ gs://www.covid19jp.org
```

## Development tips

### css format

In order to manage css file easier, css formatter has been installed.
If you want to format `css/style.css`, run following command.

```
$ cd js
$ npx beautify-css ../css/style.css ../css/style.css
```

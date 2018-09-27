# Edgy

Simple ORM-bases Interaction for RESTful APIs

---

[![Travis (.org)](https://api.travis-ci.com/labsvisual/edgy.svg)](https://travis-ci.com/labsvisual/edgy)
[![GitHub issues](https://img.shields.io/github/issues/labsvisual/edgy.svg)](https://github.com/labsvisual/edgy/issues)

## Introduction
After scouring through the internet looking for JavaScript libraries which can make the pain of interacting with RESTful APIs a little bearable, I came back with nothing. Now, of course, there is the great [axios](https://github.com/axios/axios) library but it does not support object-based interaction like with the plethora of database ORM tools.

For that reason, I created Edgy: a simple, efficient, object-based RESTful API interaction layer built solely in JavaScript with zero dependencies. Its super simple API makes it a breeze to interact with any kind of RESTful API endpoint.

## Table of Contents
[Getting Started](#getting-started)

## Getting Started
Getting started with Edgy is super simple. This first section will give a simple example to interact with the `User` resource of an API deployed locally at `http://localhost:3345/user`.

### Installation
If you are using `Node.js`, you can start using **Edgy** by just installing it like a normal package:

```sh
$ npm i --save edgy
```
For my friends wanting to use this library on the web, you can use the lovely [unpkg](https://unpkg.com) and include the minified production file:

```html
<script src="https://unpkg.com/edgy/dist/edgy-build-$VERSION-browser.min.js"></script>
```
where `$VERSION` is the version you want to use. The current version is `1.0.0`.

### Using Edgy

#### Importing Edgy
Edgy follows UMD and, hence, can be used in browsers or in server-side code.

##### Node.js and CommonJS Environments
For `Node` environments, it should be pretty simple to import by

```javascript
import Edgy from 'edgy';
```

or with the following for those who still (~~for some reason~~) use non-^ES6 environments:

```javascript
var Edgy = require( 'edgy' );
```

##### Browser
If you import **Edgy** using the `script` tag in an HTML file, the library is exposed within the `window` object as `window.Edgy`.

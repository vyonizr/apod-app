# NASA APOD

[![Build Status](https://travis-ci.org/vyonizr/apod-app.svg?branch=develop)](https://travis-ci.org/vyonizr/apod-app) [![codecov](https://codecov.io/gh/vyonizr/apod-app/branch/develop/graph/badge.svg)](https://codecov.io/gh/vyonizr/apod-app) [![Known Vulnerabilities](https://snyk.io/test/github/vyonizr/apod-app/badge.svg?targetFile=server/package.json)](https://snyk.io/test/github/vyonizr/apod-app?targetFile=server/package.json) [![Greenkeeper badge](https://badges.greenkeeper.io/vyonizr/apod-app.svg)](https://greenkeeper.io/)

## Routes

### Users

| Route                      | Method | Header(s) | Params | Body                                                               | Description                        | Response                                                                                                                                                                                |
|----------------------------|--------|-----------| -------- |--------------------------------------------------------------------|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/users/register`          | POST   | -         | -       | `username:String` (**required**), `password:String` (**required**) | Register a user                    | Success<br />Code: 201<br/>body: {token:String}<br /><br />Error (invalid password format):<br />(400)<br />body: {object error}<br /><br />Error:<br />(500)<br />body: {object error} |
| `/users/login`             | POST   | -         | -       | `username:String` (**required**),`password:String` (**required**)  | Log in and obtain `JSON Web Token` | Success<br />Code: 200<br/>body: {object user}<br /><br />Error (wrong username/password):<br />(401)<br />body: {object error}<br /><br />Error:<br />(500)<br />body: {object error}  |
| `/users/profile/:username` | GET   | -         | `username`       | - | Get a user | Success<br />Code: 200<br/>body: {object user}<br /><br />Error (username not found):<br />(404)<br />body: {object error}<br /><br />Error:<br />(500)<br />body: {object error}  |

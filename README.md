# NASA APOD - REST API

## Routes

### Users

| Route                      | Method | Header(s) | Params | Body                                                               | Description                        | Response                                                                                                                                                                                |
|----------------------------|--------|-----------| -------- |--------------------------------------------------------------------|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/users/register`          | POST   | -         | -       | `username:String` (**required**), `password:String` (**required**) | Register a user                    | Success<br />Code: 201<br/>body: {token:String}<br /><br />Error (invalid password format):<br />(400)<br />body: {object error}<br /><br />Error:<br />(500)<br />body: {object error} |
| `/users/login`             | POST   | -         | -       | `username:String` (**required**),`password:String` (**required**)  | Log in and obtain `JSON Web Token` | Success<br />Code: 200<br/>body: {object user}<br /><br />Error (wrong username/password):<br />(401)<br />body: {object error}<br /><br />Error:<br />(500)<br />body: {object error}  |
| `/users/profile/:username` | GET   | -         | `username`       | - | Get a user | Success<br />Code: 200<br/>body: {object user}<br /><br />Error (username not found):<br />(404)<br />body: {object error}<br /><br />Error:<br />(500)<br />body: {object error}  |

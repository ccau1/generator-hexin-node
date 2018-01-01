`POST - api/auth/register`

User can register using this api call.

Request Body
```
{
    "firstName": "k",
    "lastName": "p",
    "email": "k@hexin.com",
    "username": "kani",
    "password": "123456",
    "confirmPassword": "123456"
}
```

Response - Created user
```
{
    "__v": 0,
    "firstName": "k",
    "lastName": "p",
    "email": "k@hexin.com",
    "username": "kani",
    "password": "$2a$10$EBrlHf7VslVBqR5DShT8U.iE1ZQV9qIKjyhShRJ846mb1MW2kX7A6",
    "_id": "599fde0eb11467be59511936",
    "avatars": [],
    "roles": [
        "staff"
    ]
}
```
# Postman Example
### Request
![](images/authRegisterRequest.png?raw=true)
### Response
![](images/authRegisterResponse.png?raw=true)

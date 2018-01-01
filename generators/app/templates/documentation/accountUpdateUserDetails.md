`PUT - api/account/user`

User can update user details

Request headers

```
Content-Type - application/json

Authorization - Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoiNTk5ZmRlMGViMTE0NjdiZTU5NTExOTM2IiwiZXhwIjp7ImV4cGlyZSI6MTUwMzgyMjMwMX0sInR5cGUiOiJtZW1iZXIifQ.OdPB56LlgPdvpSmI-ZxvuVvgz0zJMu2SR2Lgdl1n9cI
```

Request Body - The Fileds you need to update with the _id

```
{
    "_id": "599fde0eb11467be59511936",
    "firstName": "kk",
    "lastName": "pp"
}
```

Response -  Updated User object (object)

```
{
    "_id": "599fde0eb11467be59511936",
    "firstName": "kk",
    "lastName": "pp",
    "email": "k@hexin.com",
    "username": "kani",
    "password": "$2a$10$EBrlHf7VslVBqR5DShT8U.iE1ZQV9qIKjyhShRJ846mb1MW2kX7A6",
    "__v": 0,
    "avatars": [],
    "resetToken": {
        "token": "1a08b9b3753b2c5a765703c6",
        "expiredAt": "1504254532415"
    },
    "roles": [
        "staff"
    ]
}
```

# Postman Example

### Request
![](images/accountUpdateUserRequestHeader.png?raw=true)
![](images/accountUpdateUserRequestBody.png?raw=true)

### Response
![](images/accountUpdateUserResponse.png?raw=true)

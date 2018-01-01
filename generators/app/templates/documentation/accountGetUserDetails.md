`GET - api/account/user`

User can get details after logged in

Request headers

```
Authorization - Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoiNTk5ZmRlMGViMTE0NjdiZTU5NTExOTM2IiwiZXhwIjp7ImV4cGlyZSI6MTUwMzgyMjMwMX0sInR5cGUiOiJtZW1iZXIifQ.OdPB56LlgPdvpSmI-ZxvuVvgz0zJMu2SR2Lgdl1n9cI
```

Response -  User object (object)

```
{
    "_id": "599fde0eb11467be59511936",
    "firstName": "k",
    "lastName": "p",
    "email": "k@hexin.com",
    "roles": [
        "staff"
    ]
}
```

# Postman Example

### Request and response
![](images/accountGetUser.png?raw=true)

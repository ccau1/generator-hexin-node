`POST - api/auth/token`

User can login using this api call.

Request Body
```
{
    "username": "kani",
    "password": "123456"
}
```

Response - User Email and Token
```
{
    "id": "599fde0eb11467be59511936",
    "email": "k@hexin.com",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoiNTk5ZmRlMGViMTE0NjdiZTU5NTExOTM2IiwiZXhwIjp7ImV4cGlyZSI6MTUwMzgyMjMwMX0sInR5cGUiOiJtZW1iZXIifQ.OdPB56LlgPdvpSmI-ZxvuVvgz0zJMu2SR2Lgdl1n9cI"
}
```


# Postman Example

### Request
![](images/authLoginRequest.png?raw=true)

### Response
![](images/authLoginResponse.png?raw=true)

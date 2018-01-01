`POST - api/auth/reset-password/:token`

User can update the new password using reset password token

Request Params
```
token (String)
```

Request body
```
{
    "password": "aaaaaa"
}
```

Response - Updated User object (object)


# Postman Example

### Request 
![](images/authUpdateNewResetPasswordRequest.png?raw=true)

### Response
![](images/authUpdateNewResetPasswordResponse.png?raw=true)
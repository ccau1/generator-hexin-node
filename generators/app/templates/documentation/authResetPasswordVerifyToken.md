`GET - api/auth/reset-password-verify/:token`

User can check if the reset password token is vaild

Request
```
http://localhost:8280/api/auth/reset-password-verify/1ab46b278350eb1049334407
```

Response - Vaild status (boolean)
```
{
    "valid": true
}
```


# Postman Example

### Request 
![](images/authRsetPasswordVerifyTokenRequest.png?raw=true)

### Response
![](images/authRsetPasswordVerifyTokenReponse.png?raw=true)
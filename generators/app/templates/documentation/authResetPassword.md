`POST - api/auth/reset-password`

User can get the password reset email using this api call

Request Body
```
{
    "email": "k@httpeace.com"
}
```
Response - Email sent details
```
{
    "accepted": [
        "k@httpeace.com"
    ],
    "rejected": [],
    "response": "250 Ok 0101015e18822d41-65bd490a-d481-4dc4-a12b-45a78f954f39-000000",
    "envelope": {
        "from": "cs@uncleprint.com.hk",
        "to": [
            "k@httpeace.com"
        ]
    },
    "messageId": "<962c8392-cfd7-fd50-fb40-6c8a4c5d0198@uncleprint.com.hk>"
}
```


# Postman Example

### Request 
![](images/authResetPasswordRequest.png?raw=true)

### Response
![](images/authResetPasswordResponse.png?raw=true)

### REset passwrod Email
![](images/authResetPasswordRequestEmail.png?raw=true)
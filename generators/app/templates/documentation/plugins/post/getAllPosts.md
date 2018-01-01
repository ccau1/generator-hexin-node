`GET - api/posts`

User can get all posts


Request headers
```
Accept-Language - en
```

Response - a post list

```
{
    "docs": [
        {
            "_id": "59ae5b0cb016bac5dc4ac037",
            "updatedAt": "2017-09-05T11:07:59.193Z",
            "createdAt": "2017-09-05T11:07:59.193Z",
            "type": "news",
            "permalink": "/news/test1234d1",
            "isActive": true,
            "files": [],
            "content": "cn",
            "synopsis": "cn",
            "title": "cn",
            "__v": 0,
            "id": "59ae5b0cb016bac5dc4ac037"
        }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
}
```

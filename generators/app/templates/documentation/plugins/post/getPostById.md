`GET - api/posts/:_id`

User can get a post

Optional Request query parameters

```
api/posts/:_id?full - if you pass 'full' you will get the full post details
```

Request headers

```
Accept-Language - en
```


Response - a post

```
{
    "_id": "59a8d61b5a9af25a8c1890d4",
    "updatedAt": "2017-09-01T03:38:03.190Z",
    "createdAt": "2017-09-01T03:38:03.190Z",
    "type": "news",
    "permalink": "/news/xxx",
    "isActive": true,
    "files": [],
    "content": "content",
    "synopsis": "synopsis",
    "title": "title",
    "__v": 0
}
```

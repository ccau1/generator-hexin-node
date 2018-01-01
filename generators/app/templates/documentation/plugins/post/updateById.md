`PUT - api/posts/:_id`

User can update a post

Request Body

```
{
	"_id": "59ae5b0cb016bac5dc4ac037",
    "type": "news",
    "title": {
    	"zh_HK": "hk",
    	"zh_CN": "cn",
    	"en": "en"
    },
    "synopsis": {
    	"zh_HK": "hk",
    	"zh_CN": "cn",
    	"en": "en"
    },
    "content": {
    	"zh_HK": "hk",
    	"zh_CN": "cn",
    	"en": "enfff"
    },
    "permalink": "/news/test1234d1"
}

```

Request headers

```
Content-Type - application/json
Accept-Language - en
```


Response - updated post

```
{
    "__v": 0,
    "updatedAt": "2017-09-05T11:07:59.193Z",
    "createdAt": "2017-09-05T11:07:59.193Z",
    "_id": "59ae5b0cb016bac5dc4ac037",
    "type": "news",
    "permalink": "/news/test1234d1",
    "isActive": true,
    "files": [],
    "content": {
        "zh_HK": "hk",
        "zh_CN": "cn",
        "en": "enfff"
    },
    "synopsis": {
        "zh_HK": "hk",
        "zh_CN": "cn",
        "en": "en"
    },
    "title": {
        "zh_HK": "hk",
        "zh_CN": "cn",
        "en": "en"
    }
}
```

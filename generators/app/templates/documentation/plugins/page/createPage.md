`POST - /api/pages`

User can create a page

Request headers
```
Accept-Language - en
Content-Type - application/json
```

Request Body

```
{
   "code" : "/about/our-visionab",
   "name" : "about-our-vision",
    "pageContent" : {
        "versions" : {
            "default" : {
                "sections" : {
                    "padding" : {
                        "t" : 80,
                        "r" : 15,
                        "b" : 60,
                        "l" : 15
                    },
                    "items" : [
                        {
                            "containerStyle" : 0,
                            "_element" : {
                                "val" : {
                                    "html" : "<p>supply chain design</p>"
                                },
                                "type" : "text"
                            },
                            "lastModified" : 1502107663726.0,
                            "createdAt" : 1502107663726.0,
                            "identifier" : "c3a4e2eb-c3df-4fd4-bbed-c9c4e7099f40"
                        }
                    ]
                }
            }
        }
    },
    "version" : 1
}
```


Response

```
{
    "code": "/about/our-visionab",
    "name": "about-our-vision",
    "pageContent": {
        "versions": {
            "default": {
                "sections": {
                    "items": [
                        {
                            "identifier": "c3a4e2eb-c3df-4fd4-bbed-c9c4e7099f40",
                            "createdAt": 1502107663726,
                            "lastModified": 1502107663726,
                            "_element": {
                                "type": "text",
                                "val": {
                                    "html": "<p>supply chain design</p>"
                                }
                            },
                            "containerStyle": 0
                        }
                    ],
                    "padding": {
                        "l": 15,
                        "b": 60,
                        "r": 15,
                        "t": 80
                    }
                }
            }
        }
    },
    "__v": 0,
    "_id": "59af576e1261013201f2ed17",
    "version": 1,
    "lastModified": 1504663048052,
    "languages": [
        "default"
    ]
}
```


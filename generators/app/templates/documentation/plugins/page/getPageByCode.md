`GET - /api/pages/get-by-page?page=aaa`

User can get a page by code

Request headers
```
Accept-Language - en
```



Response

```
{
    "_id": "59af576e1261013201f2ed17",
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
    "version": 1,
    "lastModified": 1504663048052,
    "languages": [
        "default"
    ]
}
```


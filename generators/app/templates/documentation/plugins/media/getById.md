`GET - api/uploads/:_id`

User can get media by id

Request headers

```
Authorization - Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoiNTk5ZmRlMGViMTE0NjdiZTU5NTExOTM2IiwiZXhwIjp7ImV4cGlyZSI6MTUwMzgyMjMwMX0sInR5cGUiOiJtZW1iZXIifQ.OdPB56LlgPdvpSmI-ZxvuVvgz0zJMu2SR2Lgdl1n9cI
```


Response -  record

```
{
    "_id": "59ae82f3ace07f08082ff41c",
    "folder": "assets/images/test",
    "serviceType": "s3",
    "category": "posts",
    "uri": "https://s3-ap-southeast-1.amazonaws.com/devcdn.wtt-we.com/assets/images/test/OdP6i-b2dbebf5cbc68472bb80d30cdc43a4ef-ed674d52a9c3a69b5cfb1cdc82959a9c.jpg",
    "thumbnailUri": "https://s3-ap-southeast-1.amazonaws.com/devcdn.wtt-we.com/assets/images/test/OdP6i-b2dbebf5cbc68472bb80d30cdc43a4ef-ed674d52a9c3a69b5cfb1cdc82959a9c.jpg",
    "originalName": "OdP6i-b2dbebf5cbc68472bb80d30cdc43a4ef",
    "fileExtension": ".jpg",
    "displayName": "ed674d52a9c3a69b5cfb1cdc82959a9c",
    "uploadedName": "OdP6i-b2dbebf5cbc68472bb80d30cdc43a4ef-ed674d52a9c3a69b5cfb1cdc82959a9c",
    "size": "27765",
    "createBy": "a",
    "modifyBy": "a",
    "modifyDate": "2017-09-05T10:56:51.810Z",
    "createDate": "2017-09-05T10:56:51.810Z",
    "__v": 0
}
```

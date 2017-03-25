# Troop Photo Processor

A lambda function for processing troop photos (auto orienting and resizing, etc).

The function uses promises to chain asynchronous behaviors (fetch image,
transform image, put image, etc). Each instance of a lambda function will
process one image. Since the function is triggered on a PUT event, then
all of the image instances we need will eventually be created.

For example, the original image is uploaded, which triggers a lambda that
produces the full image, which triggers a lambda that produces the medium
image, which triggers a lambda that produces the small image.

## Development

Fetch the code from Github and then npm install.

```
$> npm install
```

## Testing

Unit tests for non-promisy things run using npm test

```
$> npm test
```

If you export your AWS keys, you can run a full regression test using local.js

```
$> node local.js
```

## Packaging

This lambda can be packaged from the cli.

```
$> npm run package
```

This produces a deploy.zip

### Deploy

The deploy.zip can be uploaded to lambda manually.

This function is currently deployed as:

  * imageProcessingInDev

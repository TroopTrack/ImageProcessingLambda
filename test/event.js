/*
 * Use as a sample event for testing. This is taken from the test data that
 * lambda provides, so it resembles an actual S3 put event.
 */

exports.event = {
  Records: [
    {
      eventVersion: '2.0',
      eventTime: '1970-01-01T00:00:00.000Z',
      requestParameters: {
        sourceIPAddress: '127.0.0.1',
      },
      s3: {
        configurationId: 'testConfigRule',
        object: {
          eTag: 'd41d8cd98f00b204e9800998ecf8427e',
          key: 'photos/1483/02671d5188895686ce28f1d13530322a/original/cave_scenery.png',
          size: 1024,
        },
        bucket: {
          arn: 'arn:aws:s3:::trooptrack-dev',
          name: 'trooptrack-dev',
          ownerIdentity: {
            principalId: 'EXAMPLE',
          },
        },
        s3SchemaVersion: '1.0',
      },
      responseElements: {
        'x-amz-id-2': 'FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD',
        'x-amz-request-id': 'C3D13FE58DE4C810',
      },
      awsRegion: 'us-east-1',
      eventName: 'ObjectCreated:Put',
      userIdentity: {
        principalId: 'EXAMPLE',
      },
      eventSource: 'aws:s3',
    },
  ],
};

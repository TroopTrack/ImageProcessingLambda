var test = require('tape');
var LE = require('../lib/s3events');

test('s3events', function(t) {
  t.test('s3Key', (st) => {
    st.plan(1);
    st.equal(
      LE.s3Key(event.Records[0]),
      'photos/1483/02671d5188895686ce28f1d13530322a/original/cave_scenery.png'
    );
  });

  t.test('s3key handles uri encoded spaces', function(st) {
    st.plan(1);
    st.equal(
      LE.s3Key(uriTricksy.Records[0]),
      'photos/1483/02671d5188895686ce28f1d13530322a/original/cave_scenery 13.00.png'
    );
  });

  t.test('isImageKey', function(st) {
    st.plan(3);
    st.ok(LE.isImageKey('photos/1483/02671d5188895686ce28f1d13530322a/original/cave_scenery.png'));
    st.ok(LE.isImageKey('photos/1483/02671d5188895686ce28f1d13530322a/original/cave_scenery.PNG'));

    st.notOk(
      LE.isImageKey('photos/1483/02671d5188895686ce28f1d13530322a/original/cave_scenery.pdf')
    );
  });

  t.test('isImage', function(st) {
    st.plan(1);
    st.ok(LE.isImage(event.Records[0]));
  });

  t.test('imageRecords', function(st) {
    st.plan(2);
    st.equal(LE.imageRecords(event).length, 1);
    st.equal(LE.imageRecords(notImageFolder).length, 0);
  });

  t.test('processableImages', function(st) {
    st.plan(1);
    st.equal(LE.processableImages(event).length, 1);
  });

  t.test('isImageSize', function(st) {
    st.plan(3);
    st.ok(LE.isOriginal(event.Records[0]));
    st.notOk(LE.isFull(event.Records[0]));
    st.notOk(LE.isMedium(event.Records[0]));
  });

  t.end();
});

var event = {
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

var uriTricksy = {
  Records: [
    {
      s3: {
        object: {
          key: 'photos/1483/02671d5188895686ce28f1d13530322a/original/cave_scenery+13.00.png',
        },
      },
    },
  ],
};

var notImageFolder = {
  Records: [
    {
      s3: {
        object: {
          key: 'uploads/1483/02671d5188895686ce28f1d13530322a/original/cave_scenery.png',
        },
      },
    },
  ],
};

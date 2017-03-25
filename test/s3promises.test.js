var test = require('tape');
var s3tasks = require('../lib/s3promises');

test('s3tasks', (t) => {
  t.test('unwrapBody', (st) => {
    st.plan(1);
    st.equal(s3tasks.unwrapBody({ Body: 'a-buffer' }), 'a-buffer');
  });

  t.end();
});

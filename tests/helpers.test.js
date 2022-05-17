const slugify = require('../helpers/slugify');

describe('Helpers tests', () => {
  test('Slugify should return all alphanumeric, lowercase, dash-connected', (done) => {
    const str = 'Hello World! From @bove 2';
    const result = slugify(str);

    expect(result).toBe('hello-world-from-bove-2');
    done();
  });
});

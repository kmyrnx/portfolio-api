const request = require('supertest');
const mongoose = require('mongoose');
const db = require('./db');
const app = require('../app');

let token = '';

jest.setTimeout(15000);

beforeAll(async () => {
  await db.connectToDatabase();
  await db.clearDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

describe('Database connection', () => {
  test('database should be connected', (done) => {
    expect(db.connection.readyState).toBe(1);
    done();
  });
});

describe('Server is running', () => {
  test('GET / should return 200', async () => {
    const index = await request(app)
      .get('/');

    expect(index.statusCode).toBe(200);
    expect(index.body).toHaveProperty('message');
    expect(index.body.message).toBe('Portfolio API is working');
  });

  test('OPTIONS / should return error', async () => {
    const index = await request(app)
      .options('/');

    expect(index.statusCode).toBe(405);
    expect(index.body).toHaveProperty('error');
  });

  test('GET /InvalidPath should return error', async () => {
    const index = await request(app)
      .get('/InvalidPath');

    expect(index.statusCode).toBe(404);
    expect(index.body).toHaveProperty('error');
  });
});

describe('User routes', () => {
  test('POST /user should return error with no payload', async () => {
    const user = await request(app)
      .post('/user')
      .send();

    expect(user.statusCode).toBe(500);
    expect(user.body).toHaveProperty('error');
  });

  test('POST /user should return error with empty payload', async () => {
    const user = await request(app)
      .post('/user')
      .send({});

    expect(user.statusCode).toBe(500);
    expect(user.body).toHaveProperty('error');
  });

  test('POST /user should return error with faulty payload', async () => {
    const user = await request(app)
      .post('/user')
      .send({
        name: 'Test',
        password: 'Test',
      });

    expect(user.statusCode).toBe(500);
    expect(user.body).toHaveProperty('error');
  });

  test('POST /user should create a user', async () => {
    const user = await request(app)
      .post('/user')
      .send({
        username: 'test',
        password: 'test',
        email: 'test@test.com',
      });

    expect(user.statusCode).toBe(200);
    expect(user.body.message).toBe('User test created');
  });

  test('POST /user should not create more than one user', async () => {
    const user = await request(app)
      .post('/user')
      .send({
        username: 'test2',
        password: 'test2',
        email: 'test2@test.com',
      });

    expect(user.statusCode).toBe(400);
    expect(user.body).toHaveProperty('error');
    expect(user.body.error).toBe('User not created');
  });

  test('POST /user/signin should sign-in the user', async () => {
    const user = await request(app)
      .post('/user/signin')
      .send({
        username: 'test',
        password: 'test',
      });

    token = user.body.message;
    expect(user.statusCode).toBe(200);
    expect(user.body).toHaveProperty('message');
    expect(user.body.message).toBeTruthy();
  });

  test('POST /user/signin should not sign-in user', async () => {
    const user = await request(app)
      .post('/user/signin')
      .send({
        username: 'test2',
        password: 'test2',
      });

    expect(user.statusCode).toBe(400);
    expect(user.body).toHaveProperty('error');
    expect(user.body.error).toBe('User not signed in');
  });

  test('PUT /user/change-password should change user\'s password', async () => {
    const user = await request(app)
      .put('/user/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test',
        password: 'test2',
      });

    expect(user.statusCode).toBe(200);
    expect(user.body).toHaveProperty('message');
    expect(user.body.message).toBe('Password changed');
  });

  test('PUT /user/change-password should return error with no token provided', async () => {
    const user = await request(app)
      .put('/user/change-password')
      .send({
        username: 'test',
        password: 'test2',
      });

    expect(user.statusCode).toBe(400);
    expect(user.body).toHaveProperty('error');
    expect(user.body.error).toBe('No token provided');
  });

  test('PUT /user/change-password should return error with invalid token', async () => {
    const user = await request(app)
      .put('/user/change-password')
      .set('Authorization', 'invalid token')
      .send({
        username: 'test',
        password: 'test2',
      });

    expect(user.statusCode).toBe(400);
    expect(user.body).toHaveProperty('error');
    expect(user.body.error).toBe('Invalid token');
  });

  test('PUT /user/change-password should return error with false username', async () => {
    const user = await request(app)
      .put('/user/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'test2',
        password: 'test2',
      });

    expect(user.statusCode).toBe(400);
    expect(user.body).toHaveProperty('error');
    expect(user.body.error).toBe('Password not changed');
  });

  test('PUT /user/change-password should return error with no data provided', async () => {
    const user = await request(app)
      .put('/user/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(user.statusCode).toBe(500);
    expect(user.body).toHaveProperty('error');
  });
});

describe('Profile routes', () => {
  test('GET /profile should not return profile', async () => {
    const profile = await request(app)
      .get('/profile');

    expect(profile.statusCode).toBe(400);
    expect(profile.body).toHaveProperty('error');
    expect(profile.body.error).toBe('Profile not found');
  });

  test('POST /profile should not create profile with missing data', async () => {
    const profile = await request(app)
      .post('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Engineer',
        image: 'https://test.com/test.jpg',
        links: [
          { name: 'Test', url: 'https://test.com' },
        ],
      });

    expect(profile.statusCode).toBe(500);
  });

  test('POST /profile should create profile', async () => {
    const profile = await request(app)
      .post('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profile: {
          name: 'Test',
          title: 'Test Engineer',
          image: 'https://test.com/test.jpg',
          links: [
            { name: 'Test', url: 'https://test.com' },
          ],
        },
      });

    expect(profile.statusCode).toBe(200);
    expect(profile.body).toHaveProperty('message');
    expect(profile.body.message).toBe('Profile created');
  });

  test('POST /profiled should return error with invalid token', async () => {
    const user = await request(app)
      .put('/profile')
      .set('Authorization', 'invalid token')
      .send({
        profile: {
          name: 'Test',
          title: 'Test Engineer',
          image: 'https://test.com/test.jpg',
          links: [
            { name: 'Test', url: 'https://test.com' },
          ],
        },
      });

    expect(user.statusCode).toBe(400);
    expect(user.body).toHaveProperty('error');
    expect(user.body.error).toBe('Invalid token');
  });

  test('POST /profile should not create more than one profile', async () => {
    const profile = await request(app)
      .post('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profile: {
          name: 'Test',
          title: 'Test Engineer',
          image: 'https://test.com/test.jpg',
          links: [
            { name: 'Test', url: 'https://test.com' },
          ],
        },
      });

    expect(profile.statusCode).toBe(400);
    expect(profile.body).toHaveProperty('error');
    expect(profile.body.error).toBe('Profile not created');
  });

  test('GET /profile should return profile', async () => {
    const profile = await request(app)
      .get('/profile');

    expect(profile.statusCode).toBe(200);
    expect(profile.body).toHaveProperty('name');
  });

  test('PUT /profile should update profile', async () => {
    const profile = await request(app)
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ profile: { name: 'Updated' } });

    expect(profile.statusCode).toBe(200);
    expect(profile.body).toHaveProperty('message');
    expect(profile.body.message).toBe('Profile updated');
  });

  test('PUT /profile should return error with no data provided', async () => {
    const profile = await request(app)
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(profile.statusCode).toBe(400);
    expect(profile.body).toHaveProperty('error');
    expect(profile.body.error).toBe('Profile not updated');
  });

  test('PUT /profile should return error with invalid token', async () => {
    const profile = await request(app)
      .put('/profile')
      .set('Authorization', 'invalid token')
      .send({ profile: { name: 'Updated' } });

    expect(profile.statusCode).toBe(400);
    expect(profile.body).toHaveProperty('error');
    expect(profile.body.error).toBe('Invalid token');
  });
});

describe('Tags routes', () => {
  test('GET /tags should return error', async () => {
    const tag = await request(app)
      .get('/tags');

    expect(tag.statusCode).toBe(400);
    expect(tag.body).toHaveProperty('error');
    expect(tag.body.error).toBe('No tags found');
  });

  test('GET /tags/test should return error', async () => {
    const tag = await request(app)
      .get('/tags/test');

    expect(tag.statusCode).toBe(400);
    expect(tag.body).toHaveProperty('error');
    expect(tag.body.error).toBe('Tag not found');
  });

  test('POST /tags should not create tag with missing data', async () => {
    const tag = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(tag.statusCode).toBe(500);
    expect(tag.body).toHaveProperty('error');
  });

  test('POST /tags should create tag', async () => {
    const tag = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ tag: 'Test' });

    expect(tag.statusCode).toBe(200);
    expect(tag.body).toHaveProperty('message');
    expect(tag.body.message).toBe('Tag Test created');
  });

  test('POST /tags should return invalid token', async () => {
    const tag = await request(app)
      .post('/tags')
      .set('Authorization', 'invalid token')
      .send({ tag: 'Test' });

    expect(tag.statusCode).toBe(400);
    expect(tag.body).toHaveProperty('error');
    expect(tag.body.error).toBe('Invalid token');
  });

  test('GET /tags should return tags', async () => {
    const tag = await request(app)
      .get('/tags');

    expect(tag.statusCode).toBe(200);
    expect(tag.body).toBeInstanceOf(Array);
    expect(tag.body.length).toBe(1);
  });

  test('GET /tags/test should return tag', async () => {
    const tag = await request(app)
      .get('/tags/test');

    expect(tag.statusCode).toBe(200);
    expect(tag.body).toHaveProperty('slug');
    expect(tag.body.slug).toBe('test');
  });

  test('PUT /tags/test should update tag', async () => {
    const tag = await request(app)
      .put('/tags/test')
      .set('Authorization', `Bearer ${token}`)
      .send({ tag: 'New Tag' });

    expect(tag.statusCode).toBe(200);
    expect(tag.body).toHaveProperty('message');
    expect(tag.body.message).toBe('Tag New Tag updated');
  });

  test('PUT /tags/new-tag should not update tag with faulty data', async () => {
    const tag = await request(app)
      .put('/tags/new-tag')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(tag.statusCode).toBe(500);
    expect(tag.body).toHaveProperty('error');
  });

  test('PUT /tags/new-tagz should not update tag with wrong tag', async () => {
    const tag = await request(app)
      .put('/tags/new-tagz')
      .set('Authorization', `Bearer ${token}`)
      .send({ tag: 'New Tag' });

    expect(tag.statusCode).toBe(400);
    expect(tag.body).toHaveProperty('error');
    expect(tag.body.error).toBe('Tag not updated');
  });

  test('PUT /tags/new-tag should return error with no data provided', async () => {
    const tag = await request(app)
      .put('/tags/new-tag')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(tag.statusCode).toBe(500);
    expect(tag.body).toHaveProperty('error');
  });

  test('PUT /tags/new-tag should return error with invalid token', async () => {
    const tag = await request(app)
      .put('/tags/new-tag')
      .set('Authorization', 'invalid token')
      .send({ tag: 'New Tag' });

    expect(tag.statusCode).toBe(400);
    expect(tag.body).toHaveProperty('error');
    expect(tag.body.error).toBe('Invalid token');
  });

  test('DELETE /tags/new-tagz should not delete tag with wrong tag', async () => {
    const tag = await request(app)
      .delete('/tags/new-tagz')
      .set('Authorization', `Bearer ${token}`);

    expect(tag.statusCode).toBe(400);
    expect(tag.body).toHaveProperty('error');
    expect(tag.body.error).toBe('Tag not deleted');
  });

  test('DELETE /tags/new-tag should return error with invalid token', async () => {
    const tag = await request(app)
      .delete('/tags/new-tag')
      .set('Authorization', 'invalid token');

    expect(tag.statusCode).toBe(400);
    expect(tag.body).toHaveProperty('error');
    expect(tag.body.error).toBe('Invalid token');
  });

  test('DELETE /tags/new-tag should delete tag', async () => {
    const tag = await request(app)
      .delete('/tags/new-tag')
      .set('Authorization', `Bearer ${token}`);

    expect(tag.statusCode).toBe(200);
    expect(tag.body).toHaveProperty('message');
    expect(tag.body.message).toBe('Tag New Tag deleted');
  });
});

describe('Projects routes', () => {
  test('GET /projects should return error', async () => {
    const project = await request(app)
      .get('/projects');

    expect(project.statusCode).toBe(400);
    expect(project.body).toHaveProperty('error');
    expect(project.body.error).toBe('No projects found');
  });

  test('GET /projects/test should return error', async () => {
    const project = await request(app)
      .get('/projects/test');

    expect(project.statusCode).toBe(400);
    expect(project.body).toHaveProperty('error');
    expect(project.body.error).toBe('Project not found');
  });

  test('POST /projects should not create project with missing data', async () => {
    const project = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test',
      });

    expect(project.statusCode).toBe(500);
    expect(project.body).toHaveProperty('error');
  });

  test('POST /projects should create project', async () => {
    const project = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        project: {
          name: 'Test',
          image: 'https://test.com/test.png',
          description: 'Test project',
          tags: [new mongoose.Types.ObjectId()],
        },
      });

    expect(project.statusCode).toBe(200);
    expect(project.body).toHaveProperty('message');
    expect(project.body.message).toBe('Project created');
  });

  test('POST /projects should return invalid token', async () => {
    const project = await request(app)
      .post('/projects')
      .set('Authorization', 'invalid token')
      .send({
        name: 'Test',
        image: 'https://test.com/test.png',
        description: 'Test project',
        tags: ['test'],
      });

    expect(project.statusCode).toBe(400);
    expect(project.body).toHaveProperty('error');
    expect(project.body.error).toBe('Invalid token');
  });

  test('GET /projects should return projects', async () => {
    const projects = await request(app)
      .get('/projects');

    expect(projects.statusCode).toBe(200);
    expect(projects.body).toBeInstanceOf(Array);
    expect(projects.body.length).toBe(1);
  });

  test('GET /projects/test should return project', async () => {
    const tag = await request(app)
      .get('/projects/test');

    expect(tag.statusCode).toBe(200);
    expect(tag.body).toHaveProperty('slug');
    expect(tag.body.slug).toBe('test');
  });

  test('PUT /projects/test should update project', async () => {
    const project = await request(app)
      .put('/projects/test')
      .set('Authorization', `Bearer ${token}`)
      .send({ project: { name: 'New Project' } });

    expect(project.statusCode).toBe(200);
    expect(project.body).toHaveProperty('message');
    expect(project.body.message).toBe('Project updated');
  });

  test('PUT /projects/new-project should not update project with faulty data', async () => {
    const project = await request(app)
      .put('/projects/new-project')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(project.statusCode).toBe(500);
    expect(project.body).toHaveProperty('error');
  });

  test('PUT /projects/new-projectz should not update tag with wrong project', async () => {
    const project = await request(app)
      .put('/projects/new-projectz')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Project' });

    expect(project.statusCode).toBe(500);
    expect(project.body).toHaveProperty('error');
  });

  test('PUT /projects/new-project should return error with no data provided', async () => {
    const project = await request(app)
      .put('/projects/new-project')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(project.statusCode).toBe(500);
    expect(project.body).toHaveProperty('error');
  });

  test('PUT /projects/new-project should return error with invalid token', async () => {
    const project = await request(app)
      .put('/projects/new-project')
      .set('Authorization', 'invalid token')
      .send({ name: 'New Project' });

    expect(project.statusCode).toBe(400);
    expect(project.body).toHaveProperty('error');
    expect(project.body.error).toBe('Invalid token');
  });

  test('DELETE /projects/new-projectz should not delete project with wrong project', async () => {
    const project = await request(app)
      .delete('/projects/new-projectz')
      .set('Authorization', `Bearer ${token}`);

    expect(project.statusCode).toBe(400);
    expect(project.body).toHaveProperty('error');
    expect(project.body.error).toBe('Project not deleted');
  });

  test('DELETE /projects/new-project should return error with invalid token', async () => {
    const project = await request(app)
      .delete('/projects/new-project')
      .set('Authorization', 'invalid token');

    expect(project.statusCode).toBe(400);
    expect(project.body).toHaveProperty('error');
    expect(project.body.error).toBe('Invalid token');
  });

  test('DELETE /projects/new-project should delete project', async () => {
    const project = await request(app)
      .delete('/projects/new-project')
      .set('Authorization', `Bearer ${token}`);

    expect(project.statusCode).toBe(200);
    expect(project.body).toHaveProperty('message');
    expect(project.body.message).toBe('Project deleted');
  });
});

describe('Search routes', () => {
  test('Creating sample data for search tests', async () => {
    await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tag: 'Test',
      });

    await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tag: 'Test2',
      });

    const testTag = (await request(app).get('/tags/test'));
    const testTag2 = (await request(app).get('/tags/test2'));

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        project: {
          name: 'Test',
          image: 'https://test.com/test.png',
          description: 'Test project',
          tags: [testTag.body._id],
        },
      });

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        project: {
          name: 'Test2',
          image: 'https://test.com/test.png',
          description: 'Test2 project',
          tags: [testTag2.body._id],
        },
      });

    expect(testTag.statusCode).toBe(200);
    expect(testTag2.statusCode).toBe(200);
  });

  test('GET /search should return all projects', async () => {
    const projects = await request(app)
      .get('/search');

    expect(projects.statusCode).toBe(200);
    expect(projects.body).toBeInstanceOf(Array);
    expect(projects.body.length).toBe(2);
  });

  test('GET /search should return the test2 project', async () => {
    const projects = await request(app)
      .get('/search?q=test2');

    expect(projects.statusCode).toBe(200);
    expect(projects.body).toBeInstanceOf(Array);
    expect(projects.body.length).toBe(1);
    expect(projects.body[0].name).toBe('Test2');
  });

  test('GET /search should return the test project', async () => {
    const projects = await request(app)
      .get('/search?t=test');

    expect(projects.statusCode).toBe(200);
    expect(projects.body).toBeInstanceOf(Array);
    expect(projects.body.length).toBe(1);
    expect(projects.body[0].name).toBe('Test');
  });

  test('GET /search should return the test project', async () => {
    const projects = await request(app)
      .get('/search?q=test&t=test');

    expect(projects.statusCode).toBe(200);
    expect(projects.body).toBeInstanceOf(Array);
    expect(projects.body.length).toBe(1);
    expect(projects.body[0].name).toBe('Test');
  });

  test('GET /search should return error', async () => {
    const projects = await request(app)
      .get('/search?q=INVALID_TERM');

    expect(projects.statusCode).toBe(400);
    expect(projects.body).toHaveProperty('error');
    expect(projects.body.error).toBe('No results found');
  });
});

describe('Rate Limit', () => {
  test('should set IP rate limit headers', async () => {
    const reqs = [];

    for (let i = 0; i < 11; i += 1) {
      reqs.push(request(app).get('/'));
    }

    await Promise.allSettled(reqs);

    const index = await request(app).get('/');

    expect(index.statusCode).toBe(429);
    expect(index.headers).toHaveProperty('retry-after');
  });
});

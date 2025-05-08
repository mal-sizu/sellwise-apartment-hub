import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// Setup in-memory MongoDB for testing
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Authentication', () => {
  it('should register a new admin user', async () => {
    // First, we need to create an admin user to test the user creation endpoint
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );

    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    };

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.name).toBe(newUser.name);
    expect(response.body.data.email).toBe(newUser.email);
    expect(response.body.data.role).toBe(newUser.role);
    // Password should not be returned
    expect(response.body.data.password).toBeUndefined();
  });

  it('should login a user and return a token', async () => {
    // Create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    };

    await User.create(testUser);

    // Login
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.email).toBe(testUser.email);
    expect(response.body.data.user.name).toBe(testUser.name);
    // Password should not be returned
    expect(response.body.data.user.password).toBeUndefined();
  });

  it('should not login with incorrect credentials', async () => {
    // Create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    };

    await User.create(testUser);

    // Try to login with wrong password
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should update password for authenticated user', async () => {
    // Create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    };

    const user = await User.create(testUser);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );

    // Update password
    const response = await request(app)
      .put(`/api/users/${user._id}/password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Password updated successfully');

    // Try to login with new password
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'newpassword123',
      })
      .expect(200);

    expect(loginResponse.body.status).toBe('success');
  });

  it('should get current user profile', async () => {
    // Create a test user
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
    };

    const user = await User.create(testUser);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );

    // Get current user profile
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data._id.toString()).toBe(user._id.toString());
    expect(response.body.data.name).toBe(testUser.name);
    expect(response.body.data.email).toBe(testUser.email);
    expect(response.body.data.role).toBe(testUser.role);
  });
});
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import User from '../models/User';
import Seller from '../models/Seller';
import Property from '../models/Property';
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
  await Seller.deleteMany({});
  await Property.deleteMany({});
});

describe('Property API', () => {
  let sellerUser: any;
  let sellerToken: string;
  
  beforeEach(async () => {
    // Create a seller for testing
    sellerUser = await User.create({
      name: 'Test Seller',
      email: 'seller@example.com',
      password: 'password123',
      role: 'seller',
    });

    await Seller.create({
      _id: sellerUser._id,
      firstName: 'Test',
      lastName: 'Seller',
      email: 'seller@example.com',
      phone: '1234567890',
      identification: 'ID12345',
      username: 'testseller',
      preferredLanguages: ['English'],
      status: 'Approved',
    });

    sellerToken = jwt.sign(
      { id: sellerUser._id, role: sellerUser.role },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '1h' }
    );
  });

  it('should create a new property', async () => {
    const newProperty = {
      title: 'Test Property',
      type: 'Residential',
      description: 'A beautiful test property',
      address: {
        house: '123',
        street: 'Test Street',
        city: 'Test City',
        postalCode: '12345',
      },
      price: 200000,
      images: ['image1.jpg', 'image2.jpg'],
      options: {
        parkingSpot: true,
        furnished: false,
      },
      beds: 3,
      baths: 2,
    };

    const response = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(newProperty)
      .expect(201);

    expect(response.body.status).toBe('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.title).toBe(newProperty.title);
    expect(response.body.data.sellerId.toString()).toBe(sellerUser._id.toString());
  });

  it('should get a list of properties', async () => {
    // Create a test property
    await Property.create({
      title: 'Test Property 1',
      type: 'Residential',
      description: 'A beautiful test property',
      address: {
        house: '123',
        street: 'Test Street',
        city: 'Test City',
        postalCode: '12345',
      },
      price: 200000,
      images: ['image1.jpg', 'image2.jpg'],
      sellerId: sellerUser._id,
    });

    await Property.create({
      title: 'Test Property 2',
      type: 'Commercial',
      description: 'Another beautiful test property',
      address: {
        house: '456',
        street: 'Test Avenue',
        city: 'Test City',
        postalCode: '12345',
      },
      price: 300000,
      images: ['image3.jpg', 'image4.jpg'],
      sellerId: sellerUser._id,
    });

    // Get all properties
    const response = await request(app)
      .get('/api/properties')
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].title).toBeDefined();
    expect(response.body.data[1].title).toBeDefined();
  });

  it('should get a property by ID', async () => {
    // Create a test property
    const property = await Property.create({
      title: 'Test Property',
      type: 'Residential',
      description: 'A beautiful test property',
      address: {
        house: '123',
        street: 'Test Street',
        city: 'Test City',
        postalCode: '12345',
      },
      price: 200000,
      images: ['image1.jpg', 'image2.jpg'],
      sellerId: sellerUser._id,
    });

    // Get property by ID
    const response = await request(app)
      .get(`/api/properties/${property._id}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data._id.toString()).toBe(property._id.toString());
    expect(response.body.data.title).toBe(property.title);
  });

  it('should update a property', async () => {
    // Create a test property
    const property = await Property.create({
      title: 'Test Property',
      type: 'Residential',
      description: 'A beautiful test property',
      address: {
        house: '123',
        street: 'Test Street',
        city: 'Test City',
        postalCode: '12345',
      },
      price: 200000,
      images: ['image1.jpg', 'image2.jpg'],
      sellerId: sellerUser._id,
    });

    const updateData = {
      title: 'Updated Property',
      price: 250000,
    };

    // Update property
    const response = await request(app)
      .put(`/api/properties/${property._id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.title).toBe(updateData.title);
    expect(response.body.data.price).toBe(updateData.price);
    // Other fields should remain unchanged
    expect(response.body.data.type).toBe(property.type);
  });

  it('should update property availability', async () => {
    // Create a test property
    const property = await Property.create({
      title: 'Test Property',
      type: 'Residential',
      description: 'A beautiful test property',
      address: {
        house: '123',
        street: 'Test Street',
        city: 'Test City',
        postalCode: '12345',
      },
      price: 200000,
      images: ['image1.jpg', 'image2.jpg'],
      sellerId: sellerUser._id,
      forSale: true,
    });

    // Update availability to not for sale
    const response = await request(app)
      .patch(`/api/properties/${property._id}/availability`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ forSale: false })
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.data.forSale).toBe(false);
  });

  it('should delete a property', async () => {
    // Create a test property
    const property = await Property.create({
      title: 'Test Property',
      type: 'Residential',
      description: 'A beautiful test property',
      address: {
        house: '123',
        street: 'Test Street',
        city: 'Test City',
        postalCode: '12345',
      },
      price: 200000,
      images: ['image1.jpg', 'image2.jpg'],
      sellerId: sellerUser._id,
    });

    // Delete property
    const response = await request(app)
      .delete(`/api/properties/${property._id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Property deleted successfully');

    // Verify it's deleted
    const deletedProperty = await Property.findById(property._id);
    expect(deletedProperty).toBeNull();
  });
});
const adminController = require('../controllers/adminController');
const adminService = require('../services/adminService');
const { uploadToMinIO } = require('../services/uploadService');
const mailer = require('../utils/mailer');

jest.mock('../services/adminService');
jest.mock('../services/uploadService');
jest.mock('../utils/mailer');

describe('adminController tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Admin',
        email: 'admin@example.com',
        password: 'testpassword',
        role: 'admin'
      },
      params: { id: 'adminId' },
      files: {
        image: [{ originalname: 'image.png', buffer: Buffer.from('image data') }]
      }
    };

    res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
        return this;
      }
    };

    jest.clearAllMocks(); 
  });

  test('admin creation should return 201 with created user data', async () => {
    const mockAdmin = {
      id: 'newAdminId',
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      image: 'minio-url/image.png'
    };

    uploadToMinIO.mockResolvedValue('minio-url/image.png');
    mailer.sendCredentials.mockResolvedValue(true);
    adminService.createUser.mockResolvedValue(mockAdmin);

    await adminController.createUser(req, res);

    expect(uploadToMinIO).toHaveBeenCalledWith(req.files.image[0]);
    expect(mailer.sendCredentials).toHaveBeenCalledWith(
      req.body.email,
      req.body.name,
      req.body.password
    );
    expect(res.statusCode).toBe(201);
    expect(res.data).toEqual(mockAdmin);
  });

  test('admin creation should return 500 if image upload fails', async () => {
    uploadToMinIO.mockRejectedValue(new Error('Image upload failed'));

    await adminController.createUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ error: 'Image upload failed' });
  });

  test('admin creation should return 500 if service fails', async () => {
    uploadToMinIO.mockResolvedValue('minio-url/image.png');
    adminService.createUser.mockRejectedValue(new Error('Service failure'));

    await adminController.createUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ error: 'Service failure' });
  });

  test('updateUser should return 200 and updated user', async () => {
    const mockUpdatedUser = {
      id: 'testUserId',
      name: 'Updated Name',
      email: 'updated@example.com',
      image: 'minio-url/updated-image.png'
    };

    uploadToMinIO.mockResolvedValue('minio-url/updated-image.png');
    adminService.updateUser.mockResolvedValue(mockUpdatedUser);

    await adminController.updateUser(req, res);

    expect(uploadToMinIO).toHaveBeenCalledWith(req.files.image[0]);
    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockUpdatedUser);
  });

  test('updateUser should return 404 if user not found', async () => {
    adminService.updateUser.mockResolvedValue(null);

    await adminController.updateUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ error: 'User not found' });
  });

  test('updateUser should return 500 if image upload fails', async () => {
    uploadToMinIO.mockRejectedValue(new Error('Image upload failed'));

    await adminController.updateUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ error: 'Image upload failed' });
  });

  test('updateUser should return 400 if service fails', async () => {
    adminService.updateUser.mockRejectedValue(new Error('Service failure'));

    await adminController.updateUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.data).toEqual({ error: 'Service failure' });
  });

  test('banUser should return 200 and updated user', async () => {
    const mockBannedUser = { id: 'adminId', banned: true };

    adminService.banUser.mockResolvedValue(mockBannedUser);

    await adminController.banUser(req, res);

    expect(adminService.banUser).toHaveBeenCalledWith('adminId');
    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockBannedUser);
  });

  test('banUser should return 404 if user not found', async () => {
    adminService.banUser.mockResolvedValue(null);

    await adminController.banUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ error: 'User not found' });
  });

  test('banUser should return 500 if service fails', async () => {
    adminService.banUser.mockRejectedValue(new Error('Service failure'));

    await adminController.banUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ error: 'Service failure' });
  });

  test('unbanUser should return 200 and updated user', async () => {
    const mockUnbannedUser = { id: 'adminId', banned: false };

    adminService.UnbanUser.mockResolvedValue(mockUnbannedUser);

    await adminController.UnbanUser(req, res);

    expect(adminService.UnbanUser).toHaveBeenCalledWith('adminId');
    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockUnbannedUser);
  });

  test('unbanUser should return 404 if user not found', async () => {
    adminService.UnbanUser.mockResolvedValue(null);

    await adminController.UnbanUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ error: 'User not found' });
  });

  test('unbanUser should return 500 if service fails', async () => {
    adminService.UnbanUser.mockRejectedValue(new Error('Service failure'));

    await adminController.UnbanUser(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ error: 'Service failure' });
  });

  test('getAllAdmins should return 200 and list of admins', async () => {
    const mockAdmins = [
      { name: 'Admin1', email: 'admin1@example.com', role: 'admin' },
      { name: 'Admin2', email: 'admin2@example.com', role: 'admin' }
    ];

    adminService.getAllAdmins.mockResolvedValue(mockAdmins);

    await adminController.getAllAdmins(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockAdmins);
  });

  test('getAllAdmins should return 500 if service fails', async () => {
    adminService.getAllAdmins.mockRejectedValue(new Error('Service failure'));

    await adminController.getAllAdmins(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.data).toEqual({ error: 'Service failure' });
  });
});

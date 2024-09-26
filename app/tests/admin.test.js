const adminController = require('../controllers/adminController');
const adminService = require('../services/adminService');

jest.mock('../services/adminService'); // Mock the adminService

describe('adminController tests', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'dsfghjfdrsezzeqruj',
        email: 'dfghfjkljjhgdfsqsdfg',
        password: '12-02-2000',
        role: 'admin'
      },
      params: { adminId: 'adminId' }
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
      },
    };
  });

  test('admin creation must return statusCode 200', async () => {
    const mockAdmin = {
      id: 'newAdminId',
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    };

    adminService.createUser.mockResolvedValue(mockAdmin);

    await adminController.createUser(req, res);

    expect(res.statusCode).toBe(200);

    expect(res.data).toEqual(mockAdmin);
  });

  test('admin creation should return statusCode 500 if service fails', async () => {
    adminService.createUser.mockRejectedValue(new Error('Service failure'));

    await adminController.createUser(req, res);

    expect(res.statusCode).toBe(500);

    expect(res.data).toEqual({ error: 'Service failure' });
  });
});

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
      params: {id: 'adminId' }
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
    
    test('get all users must return statusCode 200', async () => {
        const mockAdmins = [
            
            {
                name: "ghtfygjuhkj",
                email: "jhvhb",
                role: "admin"
            }
        ];
        adminService.getAllUsers.mockResolvedValue(mockAdmins);

        await adminController.getAllUsers(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockAdmins);
    });

    test('get all users must return statusCode 400 if ther is any error', async () => {
        adminService.getAllUsers.mockRejectedValue({ error: "erore" });
        await adminController.getAllUsers(req, res);
        expect(res.statusCode).toBe(400);

    });
     test('updateUser should return 200 and updated user', async () => {
    const mockUpdatedUser = {
      id: 'testUserId',
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    adminService.updateUser.mockResolvedValue(mockUpdatedUser);

    await adminController.updateUser(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.data).toEqual(mockUpdatedUser);
     });
     test('updateUser should return 404 if user not found', async () => {
    adminService.updateUser.mockResolvedValue(null);

    await adminController.updateUser(req, res);

    expect(res.statusCode).toBe(404);
    expect(res.data).toEqual({ error: 'User not found' });
  });
    test('updateUser should return 400 if there is an error', async () => {
    adminService.updateUser.mockRejectedValue(new Error('Something went wrong'));

    await adminController.updateUser(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.data).toEqual({ error: 'Something went wrong' });
    });
    




    
});
    


const roomService = require('../services/roomService');
const roomController = require('../controllers/roomController');

jest.mock('../services/roomService');

describe('roomController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 'testUserId' },
            body: {
                name: "Room A",
                capacity: 22,
                location: "First Floor"
            },
            params: { id: 'roomId123' }
        };

        res = {
            statusCode: 200,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(data) {
                this.data = data;
            },
        };
    });

    test('createRoom should return status 201 and new room data', async () => {
        const mockRoom = { id: 'roomId123', ...req.body };
        roomService.createRoom.mockResolvedValue(mockRoom);

        await roomController.createRoom(req, res);

        expect(res.statusCode).toBe(201);
        expect(res.data).toEqual(mockRoom);
    });

    test('getAllRooms should return status 200 and all rooms', async () => {
        const mockRooms = [
            { id: 'room1', name: 'Room A', capacity: 12, creator: 'testUserId' },
            { id: 'room2', name: 'Room B', capacity: 22, creator: 'testUserId' }
        ];

        roomService.getAllRooms.mockResolvedValue(mockRooms);

        await roomController.getAllRooms(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockRooms);
    });

    test('getRoomById should return status 200 and room data', async () => {
        const mockRoom = { id: 'room1', name: 'Room A', capacity: 22 };
        roomService.getRoomById.mockResolvedValue(mockRoom);

        await roomController.getRoomById(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockRoom);
    });

    test('updateRoom should return status 200 and updated room data', async () => {
        const mockRoom = { id: 'room1', name: 'Updated Room', capacity: 30 };
        roomService.updateRoom.mockResolvedValue(mockRoom);
        req.params.id = 'room1';
        req.body = { name: "Updated Room", capacity: 30 };

        await roomController.updateRoom(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockRoom);
    });

    test('deleteRoom should return status 200 and success message', async () => {
        const successMessage = { msg: 'Room deleted successfully' };
        roomService.deleteRoom.mockResolvedValue(successMessage);
        req.params.id = 'room1';

        await roomController.deleteRoom(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(successMessage);
    });

    // Error handling tests
    test('createRoom should return status 400 for validation errors', async () => {
        const errorMessage = 'Room name is required';
        roomService.createRoom.mockRejectedValue(new Error(errorMessage));

        await roomController.createRoom(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.data).toEqual(errorMessage);
    });

    test('getRoomById should return status 404 when room is not found', async () => {
        const errorMessage = 'Room not found';
        roomService.getRoomById.mockRejectedValue(new Error(errorMessage));

        await roomController.getRoomById(req, res);

        expect(res.statusCode).toBe(500);
        expect(res.data).toEqual({ msg: errorMessage });
    });

    test('deleteRoom should return status 404 when room is not found', async () => {
        const errorMessage = 'Room not found or you are not the creator';
        roomService.deleteRoom.mockRejectedValue(new Error(errorMessage));

        await roomController.deleteRoom(req, res);

        expect(res.statusCode).toBe(500);
        expect(res.data).toEqual({ msg: errorMessage });
    });
});

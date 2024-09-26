const roomService = require('../services/roomService');
const roomController = require('../controllers/roomController');

jest.mock('../services/roomService');

describe('roomController', () => {
    let req, res;
    beforeEach(() => {
        req = {
         
            user: { id: 'testUserId' },
            body: {
                name: "Inception",
             
                capacity: 22
            },
            params: { roomId: 'testMovieId' }
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


    test('create room have to return status with 201', async () => {
            roomService.createRoom({
                id: "roomid",
                ...req.body
            });
            await roomController.createRoom(req, res);
            expect(res.statusCode).toBe(201);
            // expect(res.data).toEqual({
            //     id: 'newMovieId',
            //     ...req.body
            // });
    });
    
    test('get all rooms must return status with 201', async () => {
        const mockRooms = [
            { id: 'room1', name: 'Inception', capacity: 12, creator: 'testUserId' },
            { id: 'room2', name: 'The Dark Knight', capacity: 22, creator: 'testUserId' }
        ];

        roomService.getAllRooms.mockResolvedValue(mockRooms);
        await roomController.getAllRooms(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockRooms);
      
    });

    test('get room by id have to return status with 200', async () => {
        const mockRoom = { id: 'room1', name: 'Inception', capacity: 22 };
        
        roomService.getRoomById.mockResolvedValue(mockRoom);


        await roomController.getRoomById(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockRoom);
      
    });

    test('updateroom must return status with 200', async () => {
        const mockRoom = { id: 'room1', name: 'Inception', capacity: 22 };
        
        roomService.updateRoom.mockResolvedValue(mockRoom);
        req.params.roomId = 'room1';
        req.body = { title: "yeah bro" };
        await roomController.updateRoom(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockRoom);

    });

    test('delete room must return a status of 200', async () => {
        roomService.deleteRoom.mockResolvedValue({ msg: 'Room deleted successfully' });
        req.params.roomId = 'room1';
        await roomController.deleteRoom(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual({ msg: 'Room deleted successfully' });

    })
    
    
    
    
        




















});
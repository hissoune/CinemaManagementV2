const reservationController = require('../controllers/reservationController');
const reservationService = require('../services/reservationService');

jest.mock('../services/reservationService');



describe('reservation tests ', () => {
    let req, res;


    beforeEach(() => {
        
        req = {
            user: { id: 'userTest' },
            body: {
                session: "66f415606071a2e7f0d23ba4",
                seats: 5
            },
            params: { reservationId: 'reservationId' }
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

    test('create reservation must return a status code 200', async () => {
        const mockResavation = { id: "rhe", session: "^pskjhgcdjzkamdljdj", seats: 4 };

        reservationService.createReservation.mockResolvedValue(mockResavation);

        await reservationController.createReservation(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.data).toEqual(mockResavation);
      
    });
    
    test('get all reservations for specific user must return a status with 200', async () => {
        const mokReaservations = [
            { id: "rhe", session: "^pskjhgcdjzkamdljdj", seats: 4 },
            { id: "rhe", session: "^pskjhgcdjzkamdljdj", seats: 4 }
        ];

        reservationService.getAllReservations.mockResolvedValue(mokReaservations);

        await reservationController.getAllReservations(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mokReaservations)
    });

    test('get one reservation must return a value with 200', async () => {
        const mockResavation = { id: "rhe", session: "^pskjhgcdjzkamdljdj", seats: 4 };
        reservationService.getReservationById.mockResolvedValue(mockResavation);

        await reservationController.getReservationById(req,res)
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockResavation);
    });
    
    test('the update reservation must return a statusCode 200', async () => {
        const mockResavation = { id: "rhe", session: "^pskjhgcdjzkamdljdj", seats: 4 };
        reservationService.updateReservation.mockResolvedValue(mockResavation);

        req.params.reservationId = 'reservationId';
        req.body = {
            session: "sdfgfhntghdsqfdds",
        }
        await reservationController.updateReservation(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockResavation);

      
    });

    test('delet reservation must return a statusCode 200', async () => {
        reservationService.deleteReservation.mockResolvedValue({ msg: 'Reservation deleted and seat made available' });
        req.params.reservationId = 'reservationId';
        await reservationController.deleteReservation(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual({ msg: 'Reservation deleted and seat made available' });

      
    })
    
    
    
    


});
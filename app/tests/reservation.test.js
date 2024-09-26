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
      
    })
    


});
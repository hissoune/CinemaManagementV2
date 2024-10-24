const reservationController = require('../controllers/reservationController');
const reservationService = require('../services/reservationService');

jest.mock('../services/reservationService');

describe('Reservation Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 'userTest' },
            body: {
                session: "66f415606071a2e7f0d23ba4",
                seats: 5
            },
            params: { id: 'reservationId' }
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

    test('createReservation should return status code 201', async () => {
        const mockReservation = { id: "rhe", session: "sessionId", seats: 4 };
        reservationService.createReservation.mockResolvedValue(mockReservation);

        await reservationController.createReservation(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.data).toEqual(mockReservation);
    });

    test('getAllReservations should return status code 200', async () => {
        const mockReservations = [
            { id: "rhe", session: "sessionId1", seats: 4 },
            { id: "rhe", session: "sessionId2", seats: 5 }
        ];
        reservationService.getAllReservations.mockResolvedValue(mockReservations);

        await reservationController.getAllReservations(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockReservations);
    });

    test('getReservationById should return status code 200', async () => {
        const mockReservation = { id: "rhe", session: "sessionId", seats: 4 };
        reservationService.getReservationById.mockResolvedValue(mockReservation);

        await reservationController.getReservationById(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockReservation);
    });

    test('updateReservation should return status code 200', async () => {
        const mockUpdatedReservation = { id: "rhe", session: "sessionId", seats: 6 };
        reservationService.updateReservation.mockResolvedValue(mockUpdatedReservation);

        await reservationController.updateReservation(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockUpdatedReservation);
    });

    test('confirmeReservation should return status code 200', async () => {
        const mockConfirmedReservation = { id: "rhe", session: "sessionId", seats: 4, confirmed: true };
        reservationService.confirmeReservation.mockResolvedValue(mockConfirmedReservation);

        await reservationController.confirmeReservation(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockConfirmedReservation);
    });

    test('deleteReservation should return status code 200', async () => {
        const mockDeleteResponse = { msg: 'Reservation deleted and seat made available' };
        reservationService.deleteReservation.mockResolvedValue(mockDeleteResponse);

        await reservationController.deleteReservation(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockDeleteResponse);
    });

    test('createReservation should return 400 if user not found', async () => {
        reservationService.createReservation.mockRejectedValue(new Error('User not found'));

        await reservationController.createReservation(req, res);
        expect(res.statusCode).toBe(400);
        expect(res.data).toBe('User not found');
    });

    test('getAllReservationsAdmin should return status code 200', async () => {
        const mockAdminReservations = [
            { id: "adminRes1", session: "sessionId1", seats: 4 },
            { id: "adminRes2", session: "sessionId2", seats: 5 }
        ];
        reservationService.getAllReservationsAdmin.mockResolvedValue(mockAdminReservations);

        await reservationController.getAllReservationsAdmin(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockAdminReservations);
    });
});

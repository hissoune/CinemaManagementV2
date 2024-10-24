const sessionService = require('../services/sessionService');
const sessionController = require('../controllers/sessionController');

jest.mock('../services/sessionService');

describe('Session Controller Tests', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 'userTest' },
            body: {
                movie: 'movieId123',
                room: 'roomId123',
                dateTime: '2023-12-01T19:00:00Z',
                price: 222,
            },
            params: { id: 'sessionId123' }
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

    test('createSession should return status 201 and new session data', async () => {
        const mockSession = { id: 'session1', ...req.body };
        sessionService.createSession.mockResolvedValue(mockSession);

        await sessionController.createSession(req, res);

        expect(res.statusCode).toBe(201);
        expect(res.data).toEqual(mockSession);
    });

    test('getAllSessions should return status 200 and all sessions', async () => {
        const mockSessions = [
            { id: 'session1', ...req.body },
            { id: 'session2', ...req.body },
        ];
        sessionService.getAllSessions.mockResolvedValue(mockSessions);

        await sessionController.getAllSessions(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockSessions);
    });

    test('getSessionById should return status 200 and session data', async () => {
        const mockSession = { id: 'session1', ...req.body };
        sessionService.getSessionById.mockResolvedValue(mockSession);

        await sessionController.getSessionById(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockSession);
    });

    test('updateSession should return status 200 and updated session data', async () => {
        const mockSession = { id: 'session1', ...req.body };
        sessionService.updateSession.mockResolvedValue(mockSession);

        await sessionController.updateSession(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockSession);
    });

    test('deleteSession should return status 200 and success message', async () => {
        const successMessage = { msg: 'Session deleted successfully' };
        sessionService.deleteSession.mockResolvedValue(successMessage);

        await sessionController.deleteSession(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(successMessage);
    });

    test('createSession should return status 400 for validation errors', async () => {
        const errorMessage = 'Movie ID is required';
        sessionService.createSession.mockRejectedValue(new Error(errorMessage));

        await sessionController.createSession(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.data).toEqual({ error: errorMessage });
    });

    test('getSessionById should handle session not found error', async () => {
        const errorMessage = 'Session not found';
        sessionService.getSessionById.mockRejectedValue(new Error(errorMessage));

        await sessionController.getSessionById(req, res);

        expect(res.statusCode).toBe(500);
        expect(res.data).toEqual({ msg: errorMessage });
    });
});

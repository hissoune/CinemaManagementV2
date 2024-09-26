const sessionService = require('../services/sessionService');
const sessionController = require('../controllers/sessionController');

jest.mock('../services/sessionService');



describe('session test', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 'userTest' },
            body: {
                movie: 'dsfghjfdrsezzeqruj',
                room: 'dfghfjkljjhgdfsqsdfg',
                dateTime: '12-02-2000',
                price: 222
            },
            params: { sessionId: 'sessionId' }

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
        }
    });


    test('create session must return a status of 201', async () => {
        const mocksession = { id: 'session1', movie: 'dsfghjfdrsezzeqruj', room: 'dfghfjkljjhgdfsqsdfg', dateTime: '12-02-2000', price: 222 };

        sessionService.createSession.mockResolvedValue(mocksession);

        await sessionController.createSession(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.data).toEqual(mocksession);

    });
    

    test('get all sessions must return a status code with 200', async () => {
        const mokServices = [
            { id: 'session1', movie: 'dsfghjfdrsezzeqruj', room: 'dfghfjkljjhgdfsqsdfg', dateTime: '12-02-2000', price: 222 },
            { id: 'session2', movie: 'dsfghjfdrsezzeqruj', room: 'dfghfjkljjhgdfsqsdfg', dateTime: '12-02-2000', price: 222 },
        ];

        sessionService.getAllSessions.mockResolvedValue(mokServices);

        await sessionController.getAllSessions(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mokServices);


    });
    test('get one session must return a statuscode with 200 ', async () => {
        const mocksession = { id: 'session1', movie: 'dsfghjfdrsezzeqruj', room: 'dfghfjkljjhgdfsqsdfg', dateTime: '12-02-2000', price: 222 };

        sessionService.getSessionById.mockResolvedValue(mocksession);

        await sessionController.getSessionById(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mocksession);
    });
    test('update session must return a status code  with 200', async () => {
        const mocksession = { id: 'session1', movie: 'dsfghjfdrsezzeqruj', room: 'dfghfjkljjhgdfsqsdfg', dateTime: '12-02-2000', price: 222 };
        sessionService.updateSession.mockResolvedValue(mocksession);

        req.params.sessionId = 'sessionId';
        req.body = { price: 322 };
        await sessionController.updateSession(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mocksession)

    });
    
    
    
});
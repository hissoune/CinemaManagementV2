const movieService = require('../services/movieService');
const movieController = require('../controllers/movieController'); 
jest.mock('../services/movieService'); 

describe('Movie Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 'testUserId' }, 
            body: {
                title: "hhh",
                description: "A mind-bending thriller about dream invasion.",
                releaseDate: "2010-07-16",
                genre: "Sci-Fi",
                duration: 148,
                rating: 8.8
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
            },
        };

        movieService.createMovie.mockResolvedValue({
            id: 'newMovieId', 
            ...req.body
        });
    });

    test('createMovie should return status 201', async () => {
        await movieController.createMovie(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.data).toEqual({
            id: 'newMovieId', 
            ...req.body
        });
    });
});

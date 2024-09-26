const movieService = require('../services/movieService');
const movieController = require('../controllers/movieController');
jest.mock('../services/movieService'); 

describe('Movie Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { id: 'testUserId' }, 
            body: {
                title: "Inception",
                description: "A mind-bending thriller about dream invasion.",
                releaseDate: "2010-07-16",
                genre: "Sci-Fi",
                duration: 148,
                rating: 8.8
            },
            params: { movieId: 'testMovieId' }
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

    // Testing createMovie
    test('createMovie should return status 201 and the new movie data', async () => {
        movieService.createMovie.mockResolvedValue({
            id: 'newMovieId',
            ...req.body
        });

        await movieController.createMovie(req, res);
        expect(res.statusCode).toBe(201);
        expect(res.data).toEqual({
            id: 'newMovieId',
            ...req.body
        });
    });

    // Testing getMovies
    test('getMovies should return status 200 and the list of movies', async () => {
        const mockMovies = [
            { id: 'movie1', title: 'Inception', genre: 'Sci-Fi' },
            { id: 'movie2', title: 'The Dark Knight', genre: 'Action' }
        ];
        movieService.getMovies.mockResolvedValue(mockMovies);

        await movieController.getMovies(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockMovies);
    });

    // Testing getMovieById
    test('getMovieById should return status 200 and the movie details', async () => {
        const mockMovie = { id: 'movie1', title: 'Inception', genre: 'Sci-Fi' };
        movieService.getMovieById.mockResolvedValue(mockMovie);

        req.params.movieId = 'movie1';
        await movieController.getMovieById(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(mockMovie);
    });

    // Testing updateMovie
    test('updateMovie should return status 200 and the updated movie', async () => {
        const updatedMovie = { id: 'movie1', title: 'Updated Inception', genre: 'Sci-Fi' };
        movieService.updateMovie.mockResolvedValue(updatedMovie);

        req.params.movieId = 'movie1';
        req.body = { title: 'Updated Inception' };
        await movieController.updateMovie(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual(updatedMovie);
    });

    // Testing deleteMovie
    test('deleteMovie should return status 200 and success message', async () => {
        movieService.deleteMovie.mockResolvedValue({ msg: 'Movie deleted successfully' });

        req.params.movieId = 'movie1';
        await movieController.deleteMovie(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.data).toEqual({ msg: 'Movie deleted successfully' });
    });
});

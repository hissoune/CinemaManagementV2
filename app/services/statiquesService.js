const User = require('../models/User');
const Session = require('../models/Session');
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');


exports.statiques = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSessions = await Session.countDocuments();
        const totalMovies = await Movie.countDocuments();
        const totalRooms = await Room.countDocuments();
        const totalReservations = await Reservation.countDocuments();

        return {
            totalUsers,
            totalSessions,
            totalMovies,
            totalRooms,
            totalReservations
        };
    } catch (error) {
        throw new Error('Error fetching statistics: ' + error.message);
    }
};

const sessionService = require('../services/sessionService');
const sessionValidation = require('../utils/validations/sessionValidation');

exports.createSession = async (req, res) => {
  const { error } = sessionValidation.validatSession(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { movie, room, dateTime, price } = req.body;
    
    const creator = req.user.id;

    const newSession = await sessionService.createSession(movie, room, dateTime, price, creator);
    
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllSessions = async (req, res) => {
  try {

    const sessions = await sessionService.getAllSessions();
    
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const session = await sessionService.getSessionById(sessionId);
    
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateSession = async (req, res) => {
  const { error } = sessionValidation.validatSession(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { movie, room, dateTime, price } = req.body;
    const userId = req.user.id;
    const sessionId = req.params.id;

    const updatedSession = await sessionService.updateSession(sessionId, movie, room, dateTime, price, userId);
    
    res.status(200).json(updatedSession);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;
    
    const result = await sessionService.deleteSession(sessionId, userId);
    
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getSessionsPublic = async (req, res) => {
  
  try {

    const sessions = await sessionService.getAllSessionsPublic();
    
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

exports.getSessionsForMovie =async (req, res) => {
  const moviId = req.params.id;
  
   try {

     const sessions = await sessionService.getSessionsForMovie(moviId);
     res.status(200).json(sessions);
    
   
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

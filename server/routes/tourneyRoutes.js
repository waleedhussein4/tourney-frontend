const express = require('express');
const {createTournament, getTournamentById, getAllTournaments, updateTournament, deleteTournament, getTournamentDisplayData, handleApplicationSubmission, handleJoinAsSolo, handleJoinAsTeam, editTitle, editDescription, editStartDate, editEndDate, getManageTournamentDisplayData,getTrendingTournaments, getTournamentCategories,updateScores, acceptApplication, rejectApplication, postUpdate, editSoloParticipants, editTeamParticipants} = require('../controller/tourneyController');
const router = express();
const { auth, getAuth } = require("../middleware/requireAuth")


//tournaments
router.get('/', auth, getAllTournaments);


//new tourney
router.post('/', auth, createTournament);


router.get('/tournament', getAuth, getTournamentDisplayData)


router.get('/tournament/manage', auth, getManageTournamentDisplayData)


router.post('/tournament/submitApplication', auth, handleApplicationSubmission)


router.post('/tournament/joinAsSolo', auth, handleJoinAsSolo)


router.post('/tournament/joinAsTeam', auth, handleJoinAsTeam)


router.post('/tournament/editTitle', auth, editTitle)


router.post('/tournament/editDescription', auth, editDescription)


router.post('/tournament/editStartDate', auth, editStartDate)


router.post('/tournament/editEndDate', auth, editEndDate)


router.get('/getTrendingTournaments', getTrendingTournaments)


router.get('/getTournamentCategories', getTournamentCategories)


router.post('/tournament/acceptApplication', auth, acceptApplication)


router.post('/tournament/rejectApplication', auth, rejectApplication)


router.post('/tournament/postUpdate', auth, postUpdate)


router.post('/updateScores', auth, updateScores)


router.post('/editSoloParticipants', auth, editSoloParticipants)


router.post('/editTeamParticipants', auth, editTeamParticipants)


//delete
router.delete('/',deleteTournament);


//update
router.patch('/', updateTournament);


module.exports = router;

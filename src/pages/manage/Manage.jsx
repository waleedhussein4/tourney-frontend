/* eslint-disable react/prop-types */
import Nav from '/src/components/Nav.jsx'

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './Manage.css'
import pencil from '/src/assets/pencil.svg'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import sanitizeHtml from 'sanitize-html';

function Manage() {
  const [editTeamParticipantsPopupOpen, setEditTeamParticipantsPopupOpen] = useState(false)

  const [editSoloBracketsParticipantsPopupOpen, setEditSoloBracketsParticipantsPopupOpen] = useState(false)
  const [editTeamBracketsParticipantsPopupOpen, setEditTeamBracketsParticipantsPopupOpen] = useState(false)
  const [showEditDescriptionModal, setShowEditDescriptionModal] = useState(false);
  const [showEditRulesModal, setShowEditRulesModal] = useState(false);
  const [showEditContactInfoModal, setShowEditContactInfoModal] = useState(false);

  const { UUID } = useParams();

  const navigate = useNavigate();

  const [tournament, setTournament] = useState({});
  const [tournamentType, setTournamentType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTournamentData = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/manage`
    await fetch(
      URL +
      "?" +
      new URLSearchParams({
        UUID: UUID,
      }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) {
          navigate('/page-not-found')
        }
        return res.json()
      })
      .then((data) => {
        setTournament(data);
        setTournamentType(data.type);
        setIsLoading(false);
        console.log(data)
      });
  };

  useEffect(() => {
    fetchTournamentData();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);

    // Get month abbreviation
    const monthAbbreviation = date.toLocaleString('default', { month: 'short' });

    // Get day of the month
    const day = date.getDate();

    // Get hour (12-hour format)
    let hour = date.getHours();
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12 || 12; // Convert 0 to 12

    // Get minutes
    const minutes = date.getMinutes();

    // Format the string
    const formattedDate = `${monthAbbreviation} ${day} ${date.getFullYear()} @${hour}:${minutes < 10 ? '0' : ''}${minutes}${ampm}`;

    return formattedDate;
  }

  function EditButton({ canBeEditedAfterStart, onclick }) {
    return (
      <>
        {tournament.hasStarted && !canBeEditedAfterStart
          ? <div className="pencil-placeholder"></div>
          : <img className='pencil' src={pencil} onClick={onclick} />
        }
      </>
    )
  }

  const handleEditTitle = async () => {
    const newTitle = document.getElementById('newTitle').value;
    const popup = document.getElementById('editTitlePopup');
    popup.remove();

    if (newTitle) {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/editTitle`
      await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          UUID: UUID,
          title: newTitle,
        }),
      })
        .then((res) => {
          if (res.ok) {
            navigate(0)
          }
        })
    }
  }

  const handleEditTitleInputChange = () => {
    const newTitle = document.getElementById('newTitle').value;
    if (newTitle.length < 3) {
      document.querySelector('#editTitlePopup .error').innerText = 'Title must be at least 3 characters long';
      document.getElementById('newTitle').value = '';
    } else {
      document.querySelector('#editTitlePopup .error').innerText = '';
    }
  }

  const showEditTitlePopup = () => {
    let popup = document.createElement('div');
    popup.id = 'editTitlePopup';
    popup.classList.add('popup');

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Edit Title';
    let input = document.createElement('input');
    input.type = 'text';
    input.id = 'newTitle';
    input.onchange = handleEditTitleInputChange
    let button = document.createElement('button');
    button.innerHTML = 'Confirm';
    button.onclick = handleEditTitle;
    let cancel = document.createElement('button');
    cancel.innerHTML = 'Cancel';
    cancel.onclick = () => popup.remove();
    let error = document.createElement('span')
    error.classList.add('error')

    popup.appendChild(h2);
    popup.appendChild(input);
    popup.appendChild(button);
    popup.appendChild(cancel);
    popup.appendChild(error);

    document.getElementById('Manage').appendChild(popup);
  }

  const handleEditStartDate = async () => {
    const newStartDate = document.getElementById('newStartDate').value;
    const popup = document.getElementById('editStartDatePopup');
    popup.remove();

    if (newStartDate) {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/editStartDate`
      await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          UUID: UUID,
          startDate: newStartDate,
        }),
      })
        .then((res) => {
          if (res.ok) {
            navigate(0)
          }
        })
    }
  }

  const handleEditStartDateInputChange = () => {
    const newStartDate = document.getElementById('newStartDate').value;
    // make sure the date is in the future
    if (new Date(newStartDate) < new Date()) {
      document.querySelector('#editStartDatePopup .error').innerText = 'Start date must be in the future';
      document.getElementById('newStartDate').value = '';
    }

    // make sure the date is before the end date
    if (new Date(newStartDate) > new Date(tournament.endDate)) {
      document.querySelector('#editStartDatePopup .error').innerText = 'Start date must be before the end date';
      document.getElementById('newStartDate').value = '';
    }

    // clear error message if date is valid
    if (new Date(newStartDate) > new Date() && new Date(newStartDate) < new Date(tournament.endDate)) {
      document.querySelector('#editStartDatePopup .error').innerText = '';
    }
  }


  const showEditStartDatePopup = () => {
    let popup = document.createElement('div');
    popup.id = 'editStartDatePopup';
    popup.classList.add('popup');

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Edit Start Date';
    let input = document.createElement('input');
    input.type = 'datetime-local';
    input.id = 'newStartDate';
    input.onchange = handleEditStartDateInputChange
    let button = document.createElement('button');
    button.innerHTML = 'Confirm';
    button.onclick = handleEditStartDate;
    let cancel = document.createElement('button');
    cancel.innerHTML = 'Cancel';
    cancel.onclick = () => popup.remove();
    let error = document.createElement('span')
    error.classList.add('error')

    popup.appendChild(h2);
    popup.appendChild(input);
    popup.appendChild(button);
    popup.appendChild(cancel);
    popup.appendChild(error);

    document.getElementById('Manage').appendChild(popup);
  }

  const handleEditEndDate = async () => {
    const newEndDate = document.getElementById('newEndDate').value;
    const popup = document.getElementById('editEndDatePopup');
    popup.remove();

    if (newEndDate) {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/editEndDate`
      await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          UUID: UUID,
          endDate: newEndDate,
        }),
      })
        .then((res) => {
          if (res.ok) {
            navigate(0)
          }
        })
    }
  }

  const handleEditEndDateInputChange = () => {
    const newEndDate = document.getElementById('newEndDate').value;
    // make sure the date is in the future
    if (new Date(newEndDate) < new Date()) {
      document.querySelector('#editEndDatePopup .error').innerText = 'End date must be in the future';
      document.getElementById('newEndDate').value = '';
    }

    // make sure the date is after the start date
    if (new Date(newEndDate) < new Date(tournament.startDate)) {
      document.querySelector('#editEndDatePopup .error').innerText = 'End date must be after the start date';
      document.getElementById('newEndDate').value = '';
    }

    // clear error message if date is valid
    if (new Date(newEndDate) > new Date() && new Date(newEndDate) > new Date(tournament.startDate)) {
      document.querySelector('#editEndDatePopup .error').innerText = '';
    }
  }

  const showEditEndDatePopup = () => {
    let popup = document.createElement('div');
    popup.id = 'editEndDatePopup';
    popup.classList.add('popup');

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Edit End Date';
    let input = document.createElement('input');
    input.type = 'datetime-local';
    input.id = 'newEndDate';
    input.onchange = handleEditEndDateInputChange
    let button = document.createElement('button');
    button.innerHTML = 'Confirm';
    button.onclick = handleEditEndDate;
    let cancel = document.createElement('button');
    cancel.innerHTML = 'Cancel';
    cancel.onclick = () => popup.remove();
    let error = document.createElement('span')
    error.classList.add('error')

    popup.appendChild(h2);
    popup.appendChild(input);
    popup.appendChild(button);
    popup.appendChild(cancel);
    popup.appendChild(error);

    document.getElementById('Manage').appendChild(popup);
  }

  const showPostUpdatePopup = () => {
    let popup = document.createElement('div');
    popup.id = 'postUpdatePopup';
    popup.classList.add('popup');

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Post Update';
    let input = document.createElement('input');
    input.type = 'text';
    input.id = 'newUpdate';
    let button = document.createElement('button');
    button.innerHTML = 'Confirm';
    button.onclick = handlePostUpdate;
    let cancel = document.createElement('button');
    cancel.innerHTML = 'Cancel';
    cancel.onclick = () => popup.remove();
    let error = document.createElement('span')
    error.classList.add('error')

    popup.appendChild(h2);
    popup.appendChild(input);
    popup.appendChild(button);
    popup.appendChild(cancel);
    popup.appendChild(error);

    document.getElementById('Manage').appendChild(popup);
  }

  const handlePostUpdate = async () => {
    const newUpdate = document.getElementById('newUpdate').value;
    if (newUpdate.length < 1) {
      document.querySelector('#postUpdatePopup .error').innerText = 'You must enter an update';
      return
    }

    const popup = document.getElementById('postUpdatePopup');
    popup.remove();

    if (newUpdate) {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/postUpdate`
      await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          UUID: UUID,
          update: newUpdate,
        }),
      })
        .then((res) => {
          if (res.ok) {
            navigate(0)
          }
        })
    }
  }

  function showButton(event) {
    console.log(event.target)
    let buttons = event.target.querySelectorAll('.buttonsWrapper button')
    Array.from(buttons).forEach(btn => btn.style.display = 'inline-block')
  }

  function hideButton(event) {
    console.log(event.target)
    let buttons = event.target.querySelectorAll('.buttonsWrapper button')
    Array.from(buttons).forEach(btn => btn.style.display = 'none')
  }

  const handleViewApplication = async (event) => {
    let popup = document.createElement('div');
    popup.id = 'viewApplicationPopup';
    popup.classList.add('popup');

    const parent = event.target.parentElement.parentElement
    const application = tournament.applications.map(app => app.UUID === parent.dataset.uuid ? app : null).filter(app => app !== null)[0]
    console.log(application)

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Application';
    let button = document.createElement('button');
    button.innerHTML = 'Accept';
    button.onclick = () => handleAcceptApplication(event);
    let button2 = document.createElement('button');
    button2.innerHTML = 'Reject';
    button2.onclick = () => handleRejectApplication(event);
    let cancel = document.createElement('button');
    cancel.innerHTML = 'Cancel';
    cancel.onclick = () => popup.remove();
    let buttons = document.createElement('div');
    buttons.classList.add('buttons');
    buttons.appendChild(button);
    buttons.appendChild(button2);
    buttons.appendChild(cancel);

    let content = document.createElement('div');
    content.classList.add('content');
    content.innerHTML = `
      <p>${application.teamName}</p>
      <ul>
        ${application.application.map(app => `<li>${app.label}: ${app.input}</li>`).join('')}
      </ul>
    `
    popup.appendChild(h2);
    popup.appendChild(content)
    popup.appendChild(buttons);
    document.getElementById('Manage').appendChild(popup);
  }

  const handleAcceptApplication = async (event) => {
    const parent = event.target.parentElement.parentElement
    const application = tournament.applications.map(app => app.UUID === parent.dataset.uuid ? app : null).filter(app => app !== null)[0]
    const uuid = application.UUID
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/acceptApplication`
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tournamentUUID: UUID,
        applicationUUID: uuid,
      }),
    })
      .then((res) => {
        if (res.ok) {
          navigate(0)
        }
      })
  }

  const handleRejectApplication = async (event) => {
    const parent = event.target.parentElement.parentElement
    const application = tournament.applications.map(app => app.UUID === parent.dataset.uuid ? app : null).filter(app => app !== null)[0]
    const uuid = application.UUID
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/rejectApplication`
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tournamentUUID: UUID,
        applicationUUID: uuid,
      }),
    })
      .then((res) => {
        if (res.ok) {
          navigate(0)
        }
      })
  }

  const SoloParticipants = () => {
    return (
      <>
        {
          tournament.enrolledUsers.map((participant, i) =>
            <div className='participant' key={i}>
              <span className='name'>
                {participant.username}
              </span>
              <span className="score">
                Score: {participant.score}
              </span>
              {tournament.type == 'battle royale' && <span className="eliminationStatus">
                {participant.eliminated ? 'Eliminated' : 'Active'}
              </span>}
            </div>
          )
        }
      </>
    )
  }

  const TeamParticipants = () => {
    return (
      <>
        {
          tournament.enrolledTeams.map((team, i) =>
            <div className='participant' key={i}>
              <span className='name'>
                {team.teamName}
              </span>
              <span className="score">
                Score: {team.score}
              </span>
              <span className="eliminationStatus">
                {team.eliminated ? 'Eliminated' : 'Active'}
              </span>
            </div>
          )
        }
      </>
    )
  }

  const showEditSoloParticipantsPopup = () => {
    let popup = document.createElement('div');
    popup.id = 'editParticipantsPopup';
    popup.classList.add('popup');

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Edit Participants';

    const participantsContainer = document.createElement('div');
    participantsContainer.classList.add('participants-container');

    tournament.enrolledUsers.forEach(user => {
      const participantDiv = document.createElement('div');
      participantDiv.classList.add('participant');

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('participant-name');
      nameDiv.textContent = user.username;

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('participant-info');
      infoDiv.textContent = `Score: ${user.score}, Eliminated: ${user.eliminated ? 'Yes' : 'No'}`;

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit-button');
      editButton.onclick = () => editSolo(user);


      participantDiv.appendChild(nameDiv);
      participantDiv.appendChild(infoDiv);
      participantDiv.appendChild(editButton);

      participantsContainer.appendChild(participantDiv);
    });

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.classList.add('confirm-button');
    confirmButton.onclick = () => handleEditSoloParticipants();

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('cancel-button');
    cancelButton.onclick = () => popup.remove();

    popup.appendChild(h2);
    popup.appendChild(participantsContainer);
    popup.appendChild(confirmButton);
    popup.appendChild(cancelButton);

    document.getElementById('Manage').appendChild(popup);
  }

  const handleEditSoloParticipants = async () => {
    const popup = document.getElementById('editParticipantsPopup');
    popup.remove();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/editSoloParticipants`
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        UUID: UUID,
        participants: tournament.enrolledUsers,
      }),
    })
      .then((res) => {
        if (res.ok) {
          navigate(0)
        }
      })
  }

  function editSolo(user) {
    // Here you can implement your logic to edit the user's score and elimination status
    const newScore = prompt(`Enter new score for ${user.username}:`, user.score);
    const newEliminated = confirm(`Is ${user.username} eliminated?`);

    // Update user object with new values
    user.score = parseInt(newScore);
    user.eliminated = newEliminated;

    // remove the popup
    document.getElementById('editParticipantsPopup').remove();

    // Re-render users with updated data
    showEditSoloParticipantsPopup();
  }

  const EditTeamParticipantsPopup = () => {
    const handleConfirm = async () => {
      const updatedTeams = tournament.enrolledTeams.map((team, teamIndex) => {
        const teamScoreInput = document.getElementById(`team-score-${teamIndex}`);
        const teamEliminatedInput = document.getElementById(`team-eliminated-${teamIndex}`);

        const updatedTeam = {
          ...team,
          score: parseInt(teamScoreInput.value),
          eliminated: teamEliminatedInput.checked,
          players: team.players.map((player, playerIndex) => {
            const playerScoreInput = document.getElementById(`player-score-${teamIndex}-${playerIndex}`);
            const playerEliminatedInput = document.getElementById(`player-eliminated-${teamIndex}-${playerIndex}`);

            console.log("playerScoreInput", playerScoreInput.value, "playerEliminatedInput", playerEliminatedInput.checked);

            return {
              ...player,
              score: parseInt(playerScoreInput.value),
              eliminated: playerEliminatedInput.checked
            };
          })
        };

        return updatedTeam;
      });

      // Update the tournament state
      setTournament({ ...tournament, enrolledTeams: updatedTeams });

      // Close the popup
      setEditTeamParticipantsPopupOpen(false);

      // Send the updated data to the backend
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/editTeamParticipants`;
      await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UUID: UUID, participants: updatedTeams }),
      })
        .then((res) => {
          if (res.ok) {
            navigate(0);
          }
        });
    };

    return (
      <div id='editParticipantsPopup' className='popup'>
        <h2>Edit Participants</h2>
        <div className='teams-container'>
          {tournament.enrolledTeams.map((team, teamIndex) => (
            <div className="team" key={team.teamName}>
              <Accordion className='team'>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  {team.teamName}
                </AccordionSummary>
                <AccordionDetails className='team-details-accordian'>
                  <div className="team-info">
                    <div className='team-info-item'>
                      <span>Score:</span>
                      <input
                        type="number"
                        id={`team-score-${teamIndex}`}
                        defaultValue={team.score}
                      />
                    </div>
                    <div className='team-info-item'>
                      <span>Eliminated:</span>
                      <input
                        type="checkbox"
                        id={`team-eliminated-${teamIndex}`}
                        defaultChecked={team.eliminated}
                      />
                    </div>
                  </div>
                  <Accordion className='team-members'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      Team Members
                    </AccordionSummary>
                    <AccordionDetails>
                      {team.players.map((member, playerIndex) => (
                        <div key={playerIndex} className='participant'>
                          <span>{member.username}</span>
                          <div>
                            <span>Score:</span>
                            <input
                              type="number"
                              id={`player-score-${teamIndex}-${playerIndex}`}
                              defaultValue={member.score}
                            />
                          </div>
                          <div>
                            <span>Eliminated:</span>
                            <input
                              type="checkbox"
                              id={`player-eliminated-${teamIndex}-${playerIndex}`}
                              defaultChecked={member.eliminated}
                            />
                          </div>
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </div>
        <button className='confirm-button' onClick={handleConfirm}>Confirm</button>
        <button className='cancel-button' onClick={() => setEditTeamParticipantsPopupOpen(false)}>Cancel</button>
      </div>
    );
  };

  const Applications = () => {
    if (tournament.applications.length === 0) {
      return <span>No applications yet</span>
    }
    return (
      tournament.applications.map((application, i) =>
        <div data-uuid={application.UUID} className={`application ${application.UUID}`} onMouseEnter={showButton} onMouseLeave={hideButton} key={i}>
          <span className='name'>
            {application.teamName || application.username}
          </span>
          <div className="buttonsWrapper">
            <button className="viewApplicationButton" onClick={handleViewApplication}>View</button>
            <button className="acceptApplicationButton" onClick={handleAcceptApplication}>Accept</button>
            <button className="rejectApplication" onClick={handleRejectApplication}>Reject</button>
          </div>
        </div>
      )
    )
  }

  const Updates = () => {
    if (tournament.updates.length === 0) {
      return <span>No updates yet</span>
    }
    return (
      tournament.updates.map((update, i) => (
        <div key={i}>
          <h4>{formatDate(update.date)}</h4>
          <p>{update.content}</p>
        </div>
      ))
    )
  }

  const MatchesEditor = () => {

    var matchesInFirstRound = Math.ceil(Math.max(tournament.enrolledTeams?.length / 2, tournament.enrolledUsers?.length / 2));
    var totalMatches = matchesInFirstRound;

    const teamsEnrolledYet = matchesInFirstRound > 0

    // Calculate the total number of matches
    while (matchesInFirstRound > 1) {
      matchesInFirstRound = Math.ceil(matchesInFirstRound / 2);
      totalMatches += matchesInFirstRound;
    }

    console.log('totalMatches: ', totalMatches)
    console.log(totalMatches)
    let matches = tournament.matches
    for (let i = 0; i < totalMatches; i++) {
      if (matches[i] === undefined) {
        matches[i] = 'n/a'
      }
    }

    const [editedMatches, setEditedMatches] = useState([...tournament.matches]);

    const handleEdit = (index) => {
      const newEditedMatches = [...editedMatches];
      const editedMatch = prompt('Edit the string:', editedMatches[index]);
      if (editedMatch !== null) {
        newEditedMatches[index] = editedMatch;
        setEditedMatches(newEditedMatches);
      }
    };

    const handleSaveAll = async () => {
      // Implement logic to save all edited strings
      console.log('Save all edited strings:', editedMatches);

      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/editMatches`
      await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          UUID: UUID,
          matches: editedMatches,
        }),
      })
        .then((res) => {
          if (res.ok) {
            navigate(0)
          }
          else {
            res.json().then(data => {
              document.querySelector('#matchesEditor .error').innerText = data.error
            })
          }
        })
    };

    return (
      <div id='matchesEditor' className='attribute'>
        <h3>Match Winners</h3>
        {!teamsEnrolledYet ?
          <span>After enough players have enrolled in the tournament, you will be able to start the tournament and access the match editor</span>
          :
          <>
            <div className="matches">
              {
                editedMatches.map((match, i) =>
                  <div className='match' key={i}>
                    <span className="matchNumber">Match {i}</span>
                    <span className="matchWinner">{match}</span>
                    <button onClick={() => handleEdit(i)}>Edit</button>
                  </div>
                )
              }
            </div>
            {tournament.hasStarted && <button onClick={handleSaveAll}>Save All</button>}
          </>
        }
        <span className="error"></span>
      </div>
    )
  }

  const startTournament = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/startTournament`
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        UUID: UUID,
      }),
    })
      .then((res) => {
        if (res.ok) {
          navigate(0)
        }
        else {
          return res.json()
        }
      })
      .then((data) => {
        console.log(data)
        document.querySelector('.controlButtons .error').innerText = data.error
      })
  }

  const endTournament = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/endTournament`
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        UUID: UUID,
      }),
    })
      .then((res) => {
        if (res.ok) {
          navigate(0)
        }
        else {
          return res.json()
        }
      })
      .then((data) => {
        console.log(data)
        document.querySelector('.controlButtons .error').innerText = data.error
      })
  }

  const Earnings = () => {
    if (tournament.type === 'brackets') {
      return (
        <>
          {tournament.earnings}
        </>
      )
    }
    else {
      return (
        <>
          {Array.from(tournament.earnings).map((earning, i) =>
            <div key={i}>
              <span>{earning.rank}. {earning.prize} credits</span>
            </div>
          )}
        </>
      )
    }
  }

  const Bank = () => {
    const maxEarnings = tournament.type == 'brackets' ? tournament.earnings : tournament.earnings.reduce((acc, curr) => acc + curr.prize, 0)

    const percentage = Math.min(100, Math.floor((tournament.bank / maxEarnings) * 100))

    return (
      <div id="bank" className='attribute'>
        <h3>Bank</h3>
        <div className="info">
          In order to start the tournament, the bank must have enough credits to pay out the earnings.
          You can either wait for more entry fees to be paid, or you can directly deposit credits into the bank.
          Earnings will be given out from the bank after the tournament has ended, and any leftover amount will be given to you, the host.
        </div>
        <div className="balance">
          <span className='balance-header'>Balance:</span>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${percentage}%`, padding: `0 0 0 ${Math.min(percentage, 94)}%` }}>{`${percentage}%`}</div>
          </div>
          <div className="amount">{`${tournament.bank}/${maxEarnings} credits`}</div>
        </div>
        {percentage == 100 ? <span>Bank is full. You may now start the tournament.</span> : <button onClick={handleDepositeCredits}>Deposit credits</button>}
        <span className="error"></span>
      </div>
    )
  }

  const handleDepositeCredits = async () => {
    const maxEarnings = tournament.type == 'brackets' ? tournament.earnings : tournament.earnings.reduce((acc, curr) => acc + curr.prize, 0)

    let popup = document.createElement('div');
    popup.id = 'depositCreditsPopup';
    popup.classList.add('popup');

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Deposit Credits';

    let input = document.createElement('input');
    input.type = 'number';
    input.id = 'depositAmount';
    input.oninput = (e) => {
      const field = document.getElementById('depositAmount');
      field.value = field.value.replace(/[^0-9]/g, '');

      const depositAmount = field.value;
      const currentBank = tournament.bank;
      const maxDeposit = currentBank + parseInt(depositAmount);
      if (depositAmount < 1) {
        document.querySelector('#depositCreditsPopup .error').innerText = 'Deposit amount must be greater than 0';
        field.value = '';
      } else if (maxDeposit > maxEarnings) {
        document.querySelector('#depositCreditsPopup .error').innerText = `Deposit amount cannot exceed the maximum earnings of ${maxEarnings}`;
        field.value = maxEarnings - currentBank;
      } else {
        document.querySelector('#depositCreditsPopup .error').innerText = '';
      }
    }

    let button = document.createElement('button');
    button.innerHTML = 'Confirm';
    button.onclick = async () => {
      console.log('hi');
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tournement/depositIntoTournamentBank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          UUID: UUID,
          amount: document.getElementById('depositAmount').value
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            document.querySelector('#depositCreditsPopup .error').innerText = data.error;
          } else {
            navigate(0);
          }
        });
    }

    let cancel = document.createElement('button');
    cancel.innerHTML = 'Cancel';
    cancel.onclick = () => popup.remove();

    let error = document.createElement('span')
    error.classList.add('error')

    popup.appendChild(h2);
    popup.appendChild(input);
    popup.appendChild(button);
    popup.appendChild(cancel);
    popup.appendChild(error);

    document.getElementById('Manage').appendChild(popup);
  }

  const EditSoloBracketsParticipantsPopup = () => {
    const handleConfirm = async () => {
      const updatedParticipants = tournament.enrolledUsers.map((participant, participantIndex) => {
        const scoreInput = document.getElementById(`participant-score-${participantIndex}`);

        return {
          ...participant,
          score: parseInt(scoreInput.value),
        };
      });

      // Update the tournament state
      setTournament({ ...tournament, enrolledUsers: updatedParticipants });

      // Close the popup
      setEditSoloBracketsParticipantsPopupOpen(false);

      // Send the updated data to the backend
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/editSoloParticipants`;
      await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UUID: UUID, participants: updatedParticipants }),
      })
        .then((res) => {
          if (res.ok) {
            navigate(0);
          }
        });
    };

    return (
      <div id='editParticipantsPopup' className='popup'>
        <h2>Edit Participants</h2>
        <div className='participants'>
          {tournament.enrolledUsers.map((participant, participantIndex) => (
            <div className='participant' key={participant.username}>
              <span>{participant.username}</span>
              <div>
                <span>Score:</span>
                <input
                  type="number"
                  id={`participant-score-${participantIndex}`}
                  defaultValue={participant.score}
                />
              </div>
            </div>
          ))}
        </div>
        <button className='confirm-button' onClick={handleConfirm}>Confirm</button>
        <button className='cancel-button' onClick={() => setEditSoloBracketsParticipantsPopupOpen(false)}>Cancel</button>
      </div>
    );
  };

  const EditTeamBracketsParticipantsPopup = () => {
    const handleConfirm = async () => {
      const updatedTeams = tournament.enrolledTeams.map((team, teamIndex) => {
        const teamScoreInput = document.getElementById(`team-score-${teamIndex}`);

        const updatedTeam = {
          ...team,
          score: parseInt(teamScoreInput.value),
          players: team.players.map((player, playerIndex) => {
            const playerScoreInput = document.getElementById(`player-score-${teamIndex}-${playerIndex}`);

            return {
              ...player,
              score: parseInt(playerScoreInput.value),
            };
          })
        };

        return updatedTeam;
      });

      // Update the tournament state
      setTournament({ ...tournament, enrolledTeams: updatedTeams });

      // Close the popup
      setEditTeamBracketsParticipantsPopupOpen(false);

      // Send the updated data to the backend
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/editTeamParticipants`;
      await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UUID: UUID, participants: updatedTeams }),
      })
        .then((res) => {
          if (res.ok) {
            navigate(0);
          }
        });
    };

    return (
      <div id='editParticipantsPopup' className='popup'>
        <h2>Edit Participants</h2>
        <div className='teams-container'>
          {tournament.enrolledTeams.map((team, teamIndex) => (
            <div className="team" key={team.teamName}>
              <Accordion className='team'>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  {team.teamName}
                </AccordionSummary>
                <AccordionDetails className='team-details-accordian'>
                  <div className="team-info">
                    <div className='team-info-item'>
                      <span>Score:</span>
                      <input
                        type="number"
                        id={`team-score-${teamIndex}`}
                        defaultValue={team
                          .score}
                      />
                    </div>
                  </div>
                  <Accordion className='team-members'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      Team Members
                    </AccordionSummary>
                    <AccordionDetails>
                      {team.players.map((member, playerIndex) => (
                        <div key={playerIndex} className='participant'>
                          <span>{member.username}</span>
                          <div>
                            <span>Score:</span>
                            <input
                              type="number"
                              id={`player-score-${teamIndex}-${playerIndex}`}
                              defaultValue={member.score}
                            />
                          </div>
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </div>
        <button className='confirm-button' onClick={handleConfirm}>Confirm</button>
        <button className='cancel-button' onClick={() => setEditTeamBracketsParticipantsPopupOpen(false)}>Cancel</button>
      </div>
    );
  };

  const EditDescriptionModal = () => {
    const [description, setDescription] = useState(tournament.description);

    const handleSave = async () => {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/editDescription`;
      await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UUID: UUID, description }),
      }).then((res) => {
        if (res.ok) navigate(0);
      });
      setShowEditDescriptionModal(false);
    };

    return (
      <div className="popup">
        <h2>Edit Description</h2>
        <ReactQuill value={description} onChange={setDescription} />
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setShowEditDescriptionModal(false)}>Cancel</button>
      </div>
    );
  };

  const EditRulesModal = () => {
    const [rules, setRules] = useState(tournament.rules);

    const handleSave = async () => {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/editRules`;
      await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UUID: UUID, rules }),
      }).then((res) => {
        if (res.ok) navigate(0);
      });
      setShowEditRulesModal(false);
    };

    return (
      <div className="popup">
        <h2>Edit Rules</h2>
        <ReactQuill value={rules} onChange={setRules} />
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setShowEditRulesModal(false)}>Cancel</button>
      </div>
    );
  };

  const EditContactInfoModal = () => {
    const [contactInfo, setContactInfo] = useState({
      email: tournament.contactInfo?.email || '',
      phone: tournament.contactInfo?.phone || '',
      socialMedia: {
        discord: tournament.contactInfo?.socialMedia?.discord || '',
        instagram: tournament.contactInfo?.socialMedia?.instagram || '',
        twitter: tournament.contactInfo?.socialMedia?.twitter || '',
        facebook: tournament.contactInfo?.socialMedia?.facebook || ''
      }
    });

    const handleSave = async () => {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/tournament/editContactInfo`;
      await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UUID: tournament.UUID, contactInfo }),
      }).then((res) => {
        if (res.ok) navigate(0);
      });
      setShowEditContactInfoModal(false);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.startsWith('socialMedia')) {
        const [, platform] = name.split('.');
        setContactInfo((prev) => ({
          ...prev,
          socialMedia: { ...prev.socialMedia, [platform]: value }
        }));
      } else {
        setContactInfo((prev) => ({ ...prev, [name]: value }));
      }
    };

    return (
      <div className="popup">
        <h2>Edit Contact Information</h2>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          value={contactInfo.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          name="phone"
          value={contactInfo.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <label htmlFor="socialMedia.discord">Discord</label>
        <input
          type="text"
          name="socialMedia.discord"
          value={contactInfo.socialMedia.discord}
          onChange={handleChange}
          placeholder="Discord"
        />
        <label htmlFor="socialMedia.instagram">Instagram</label>
        <input
          type="text"
          name="socialMedia.instagram"
          value={contactInfo.socialMedia.instagram}
          onChange={handleChange}
          placeholder="Instagram"
        />
        <label htmlFor="socialMedia.twitter">Twitter</label>
        <input
          type="text"
          name="socialMedia.twitter"
          value={contactInfo.socialMedia.twitter}
          onChange={handleChange}
          placeholder="Twitter"
        />
        <label htmlFor="socialMedia.facebook">Facebook</label>
        <input
          type="text"
          name="socialMedia.facebook"
          value={contactInfo.socialMedia.facebook}
          onChange={handleChange}
          placeholder="Facebook"
        />
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setShowEditContactInfoModal(false)}>Cancel</button>
      </div>
    );
  };

  return (
    <div id="Manage">
      {editTeamParticipantsPopupOpen && <EditTeamParticipantsPopup />}
      {editSoloBracketsParticipantsPopupOpen && <EditSoloBracketsParticipantsPopup />}
      {editTeamBracketsParticipantsPopupOpen && <EditTeamBracketsParticipantsPopup />}
      {showEditDescriptionModal && <EditDescriptionModal />}
      {showEditRulesModal && <EditRulesModal />}
      {showEditContactInfoModal && <EditContactInfoModal />}
      <Nav />
      <div id="container">
        {isLoading
          ? (
            <h1 className="loadingText">Loading tournament ...</h1>
          )
          : (
            <>
              <h1>{`${tournament.title}`}</h1>
              <div className="attributes">
                {/* <h2>Attributes</h2> */}
                <div className="attribute editable title">
                  <h3>Title</h3>
                  <div className='content'>{tournament.title}</div>
                  <EditButton onclick={showEditTitlePopup} />
                </div>
                <div className="attribute editable description">
                  <h3>Description</h3>
                  <div className='content' dangerouslySetInnerHTML={{ __html: sanitizeHtml(tournament.description) }}></div>
                  <EditButton canBeEditedAfterStart={false} onclick={() => setShowEditDescriptionModal(true)} />
                </div>
                <div className="attribute editable rules">
                  <h3>Rules</h3>
                  <div className='content' dangerouslySetInnerHTML={{ __html: sanitizeHtml(tournament.rules) }}></div>
                  <EditButton canBeEditedAfterStart={false} onclick={() => setShowEditRulesModal(true)} />
                </div>
                <div className="attribute editable contact-info">
                  <h3>Contact Info</h3>
                  <div className='content'>
                    <p>Email: {tournament.contactInfo?.email}</p>
                    <p>Phone: {tournament.contactInfo?.phone}</p>
                    <p>Discord: {tournament.contactInfo?.socialMedia?.discord}</p>
                    <p>Instagram: {tournament.contactInfo?.socialMedia?.instagram}</p>
                    <p>Twitter: {tournament.contactInfo?.socialMedia?.twitter}</p>
                    <p>Facebook: {tournament.contactInfo?.socialMedia?.facebook}</p>
                  </div>
                  <EditButton canBeEditedAfterStart={false} onclick={() => setShowEditContactInfoModal(true)} />
                </div>
                <div className="attribute category">
                  <h3>Category</h3>
                  <div className='content'>{tournament.category}</div>
                  <div className="pencil-placeholder"></div>
                </div>
                <div className="attribute editable startDate">
                  <h3>Start Date</h3>
                  <div className='content'>{formatDate(tournament.startDate)}</div>
                  <EditButton onclick={showEditStartDatePopup} />
                </div>
                <div className="attribute editable endDate">
                  <h3>End Date</h3>
                  <div className='content'>{formatDate(tournament.endDate)}</div>
                  <EditButton onclick={showEditEndDatePopup} />
                </div>
                <div className="attribute earnings">
                  <h3>Earnings</h3>
                  <div className='content'><Earnings /></div>
                  <div className="pencil-placeholder"></div>
                </div>
                <div className="attribute maxCapacity">
                  <h3>Max Capacity</h3>
                  <div className='content'>{tournament.maxCapacity}</div>
                  <div className="pencil-placeholder"></div>
                </div>
                {tournamentType === 'battle royale' && (
                  <div className="attribute editable participants">
                    <h3>Participants</h3>
                    <div className='content'>
                      {tournament.teamSize > 1 && <TeamParticipants />}
                      {tournament.teamSize == 1 && <SoloParticipants />}
                      {tournament.enrolledTeams.length === 0 && tournament.enrolledUsers.length === 0 && <span>No participants yet</span>}
                      {/* <SoloParticipants /> */}
                    </div>
                    <EditButton canBeEditedAfterStart={true} onclick={() => { tournament.teamSize == 1 ? showEditSoloParticipantsPopup() : setEditTeamParticipantsPopupOpen(true) }} />
                  </div>)}
                {tournamentType === 'brackets' && (
                  <div className="attribute editable participants">
                    <h3>Participants</h3>
                    <div className='content'>
                      {tournament.teamSize > 1 && <TeamParticipants />}
                      {tournament.teamSize == 1 && <SoloParticipants />}
                      {tournament.enrolledTeams.length === 0 && tournament.enrolledUsers.length === 0 && <span>No participants yet</span>}
                      {/* <SoloParticipants /> */}
                    </div>
                    <EditButton canBeEditedAfterStart={true} onclick={() => { tournament.teamSize == 1 ? setEditSoloBracketsParticipantsPopupOpen(true) : setEditTeamBracketsParticipantsPopupOpen(true) }} />
                  </div>)}
                <div className="attribute accessibility">
                  <h3>Accessibility</h3>
                  <div className='content'>{tournament.accessibility}</div>
                  <div className="pencil-placeholder"></div>
                </div>
                <div className="attribute editable applications">
                  <h3>Applications</h3>
                  <div className='content'>
                    <Applications />
                  </div>
                  <div className="pencil-placeholder"></div>
                </div>
                <div className="attribute editable updates">
                  <h3>Updates</h3>
                  <div className="wrapper">
                    <div className='content updates-wrapper'>
                      <Updates />
                    </div>
                    <button className='postUpdateButton' onClick={showPostUpdatePopup}>Post Update</button>
                  </div>
                  <div className="pencil-placeholder"></div>
                </div>
              </div>
              {tournament.type === 'brackets' && <MatchesEditor />}
              {!tournament.hasStarted && tournament.earnings > 0 && <Bank />}
              <div className="controlButtons">
                {tournament.hasStarted
                  ? <button onClick={endTournament} className="endTournament">End Tournament</button>
                  : <button onClick={startTournament} className="startTournament">Start Tournament</button>
                }
                <div className="error"></div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}

export default Manage
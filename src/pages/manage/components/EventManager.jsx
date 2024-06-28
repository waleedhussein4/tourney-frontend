import { createSavingToast, createDeletingToast, setToastSuccess, setToastError } from '/src/lib/NotifUtils';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import bin from '/src/assets/delete.svg';
import pencil from '/src/assets/pencil.svg';
import { stripHtml } from '/src/lib/HTMLUtils';
import { Autocomplete, TextField } from '@mui/material';
import { formatDate } from '/src/lib/DateUtils';

import './EventManager.css';

const EventManager = ({ tournament, setTournament, UUID }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    teams: [],
    users: []
  });

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [dateError, setDateError] = useState("");
  const [participantsError, setParticipantsError] = useState("");
  const [descriptionWordCount, setDescriptionWordCount] = useState(0);

  const handleAddEvent = async (e) => {
    console.log("NEW EVENT: ", newEvent);

    e.preventDefault();

    if (!newEvent.title) {
      setTitleError("Title is required.");
      return;
    } else {
      setTitleError("");
    }

    if (stripHtml(newEvent.description).length > 500) {
      setDescriptionError("Description must be less than 500 characters.");
      return;
    } else {
      setDescriptionError("");
    }

    if (!newEvent.start || !newEvent.end) {
      setDateError("Start and end date are required.");
      return;
    } else {
      setDateError("");
    }

    // make sure start date is before end date and start date is in the future
    if (new Date(newEvent.start) > new Date(newEvent.end)) {
      setDateError("Start date must be before end date.");
      return;
    } else if (new Date(newEvent.start) < new Date()) {
      setDateError("Start date must be in the future.");
      return;
    } else {
      setDateError("");
    }

    const toastId = createSavingToast();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/createEvent`;
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ UUID, event: newEvent }),
    });
    const data = await response.json();

    if (response.ok) {
      setTournament(prevTournament => ({
        ...prevTournament,
        events: [...prevTournament.events, data.event]
      }));
      setToastSuccess(toastId, "Event added successfully.");
      setIsAdding(false);
      setNewEvent({
        title: "",
        description: "",
        start: "",
        end: "",
        teams: [],
        users: []
      });
    } else {
      setToastError(toastId, `Error: ${data.error}`);
    }
  };

  const handleChange = (field, value) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value,
    }));

    if (field === "description") {
      const text = stripHtml(value);
      setDescriptionWordCount(text.length);
      if (text.length > 500) {
        setDescriptionError("Description must be less than 500 characters.");
      } else {
        setDescriptionError("");
      }
    }
  };

  const Event = ({ event }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEvent, setEditedEvent] = useState(event);

    const handleEditEvent = async () => {
      const toastId = createSavingToast();

      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/editEvent`;
      const eventId = event._id;
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UUID, eventId, editedEvent }),
      });

      if (response.ok) {
        setToastSuccess(toastId, "Event edited successfully.");
        setTournament(prevTournament => ({
          ...prevTournament,
          events: prevTournament.events.map(e => (e._id === eventId ? editedEvent : e))
        }));
        setIsEditing(false);
      } else {
        const data = await response.json();
        setToastError(toastId, `Error: ${data.error}`);
      }
    };

    const handleDeleteEvent = async () => {
      const toastId = createDeletingToast();

      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/tournement/deleteEvent`;
      const eventId = event._id;
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ UUID, eventId }),
      });

      if (response.ok) {
        setToastSuccess(toastId, "Event deleted successfully.");
        setTournament(prevTournament => ({
          ...prevTournament,
          events: prevTournament.events.filter(e => e._id !== eventId)
        }));
      } else {
        const data = await response.json();
        setToastError(toastId, `Error: ${data.error}`);
      }
    };

    const handleChange = (field, value) => {
      setEditedEvent((prevEvent) => ({
        ...prevEvent,
        [field]: value,
      }));
    };

    const handleEditParticipantsChange = (value) => {
      if (tournament.teamSize === 1) {
        setEditedEvent((prevEvent) => ({
          ...prevEvent,
          users: value.map((user) => user.username),
        }));
      } else {
        setEditedEvent((prevEvent) => ({
          ...prevEvent,
          teams: value.map((team) => team.name),
        }));
      }
    };

    return (
      <div className="event">
        <div className="modify-buttons">
          {!isEditing && <img className='pencil' src={pencil} onClick={() => setIsEditing(true)} />}
          {!isEditing && <img className='bin' src={bin} onClick={handleDeleteEvent} />}
        </div>
        {isEditing ? (
          <div className='editor'>
            <div className="fields">
              <div className='field'>
                <label htmlFor="title">Title</label>
                <input
                  id='title'
                  type="text"
                  value={editedEvent.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>
              <div className='field'>
                <label htmlFor="description">Description</label>
                <ReactQuill
                  id='description'
                  value={editedEvent.description}
                  onChange={(value) => handleChange("description", value)}
                />
              </div>
              <div className='field'>
                <label htmlFor="start">Start Date</label>
                <input
                  id='start'
                  type="datetime-local"
                  value={editedEvent.start}
                  onChange={(e) => handleChange("start", e.target.value)}
                />
              </div>
              <div className='field'>
                <label htmlFor="end">End Date</label>
                <input
                  id='end'
                  type="datetime-local"
                  value={editedEvent.end}
                  onChange={(e) => handleChange("end", e.target.value)}
                />
              </div>
              <div className='field'>
                <label htmlFor="participants">Participants (optional)</label>
                <Autocomplete
                  className='participants-picker'
                  multiple
                  options={tournament.teamSize == 1 ? (tournament.enrolledUsers || []) : (tournament.enrolledTeams || [])}
                  getOptionLabel={(option) => option.username || option.name}
                  value={tournament.teamSize == 1
                    ? tournament.enrolledUsers.filter(user => editedEvent.users.includes(user.username))
                    : tournament.enrolledTeams.filter(team => editedEvent.teams.includes(team.name))
                  }
                  onChange={(e, value) => handleEditParticipantsChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={tournament.teamSize == 1 ? "Users" : "Teams"}
                      placeholder={tournament.teamSize == 1 ? "Add Users" : "Add Teams"}
                    />
                  )}
                />
              </div>
            </div>
            <div className="buttons">
              <button onClick={handleEditEvent}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="details">
            <span className='title'>{event.title}</span>
            <span>{formatDate(event.start)}</span>
            <span>{formatDate(event.end)}</span>
          </div>
        )}
        <div className="participants">
          {event.teams &&
            event.teams.map((team, i) => (
              <span key={i}>{team.name}</span>
            ))}
          {event.users &&
            event.users.map((user, i) => (
              <span key={i}>{user.username}</span>
            ))}
        </div>
      </div >
    );
  };

  const handleParticipantsChange = (value) => {
    if (tournament.teamSize === 1) {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        users: value.map((user) => user.username),
      }));
    } else {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        teams: value.map((team) => team.name),
      }));
    }
  };

  return (
    <div id="event-manager" className="attribute">
      <h3>Schedule Events</h3>
      <div className="events">
        {tournament.events && tournament.events.map((event, i) => (
          <Event key={i} event={event} />
        ))}
      </div>
      {isAdding ? (
        <div className='new-event'>
          <div className='field'>
            <label htmlFor="title">Title</label>
            <input
              id='title'
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <span className="error">{titleError}</span>
          </div>
          <div className='field'>
            <label htmlFor="description">Description</label>
            <ReactQuill
              value={newEvent.description}
              onChange={(value) => handleChange("description", value)}
            />
          </div>
          <span className='descriptionWordCount'>{descriptionWordCount}/500 characters</span>
          <span className="error">{descriptionError}</span>
          <div className='field'>
            <label htmlFor="start">Start Date</label>
            <input
              type="datetime-local"
              placeholder="Start Date"
              value={newEvent.start}
              onChange={(e) => handleChange("start", e.target.value)}
            />
          </div>
          <div className='field'>
            <label htmlFor="end">End Date</label>
            <input
              type="datetime-local"
              placeholder="End Date"
              value={newEvent.end}
              onChange={(e) => handleChange("end", e.target.value)}
            />
          </div>
          <span className="error">{dateError}</span>
          <div className='field'>
            <label htmlFor="participants">Participants (optional)</label>
            <Autocomplete
              className='participants-picker'
              multiple
              options={tournament.teamSize == 1 ? (tournament.enrolledUsers || []) : (tournament.enrolledTeams || [])}
              getOptionLabel={(option) => option.username || option.name}
              onChange={(e, value) => handleParticipantsChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={tournament.teamSize == 1 ? "Users" : "Teams"}
                  placeholder={tournament.teamSize == 1 ? "Add Users" : "Add Teams"}
                />
              )}
            />
            <span className="error">{participantsError}</span>
          </div>
          <div className="buttons">
            <button onClick={handleAddEvent}>Save</button>
            <button onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className='new-event-btn' onClick={() => setIsAdding(true)}>New Event</button>
      )}
      <span className="error"></span>
    </div>
  );
};

export default EventManager;
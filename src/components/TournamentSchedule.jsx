import { Scheduler } from "@aldabil/react-scheduler";

import './styles/TournamentSchedule.css'

const Schedule = ({ tournament, view = 'week', agenda = false, editable = false, styles }) => {
  if (!tournament.events) {
    return null;
  }

  const mappedEvents = tournament.events.map(event => ({
    event_id: event._id,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    description: event.description,
    users: event.users,
    teams: event.teams,
  }));

  return (
    <div style={{ color: 'black', ...styles }} className="tournament-schedule">
      <Scheduler
        view={view}
        agenda={agenda}
        editable={editable}
        deletable={editable}
        draggable={editable}
        events={mappedEvents}
        fields={[
          {
            name: "description",
            type: "input",
            config: {
              label: "Description",
            }
          },
          {
            name: "users",
            type: "input",
            config: {
              label: "Participants",
              placeholder: "Enter participants separated by comma",
            }
          },
          {
            name: "teams",
            type: "input",
            config: {
              label: "Teams",
              placeholder: "Enter teams separated by comma",
            }
          }
        ]}
        viewerExtraComponent={(fields, event) => {
          return (
            <div className="schedule-popover">
              {(event.users.length > 0 || event.teams.length > 0) &&
                <div className="participants">
                  <h3 className="section-header">Participants</h3>
                  <div>
                    {tournament.teamSize == 1 ?
                      event.users.map(user => <div key={user} onClick={() => navigate(`/profile/${user}`)} className="participant">{user}</div>) :
                      event.teams.map(team => <div key={team} onClick={() => navigate(`/team/view/${team}`)} className="participant">{team}</div>)
                    }
                  </div>
                </div>
              }
              {event.description &&
                <div>
                  <h3 className="section-header">About</h3>
                  <div className='description' dangerouslySetInnerHTML={{ __html: event.description }}></div>
                </div>
              }

            </div>
          );
        }}
      />
    </div>
  );
};

export default Schedule;

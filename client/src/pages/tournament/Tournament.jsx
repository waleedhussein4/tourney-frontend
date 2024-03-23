import { useEffect, useState } from "react";
import "./styles/App.css";
import Nav from "/src/components/Nav.jsx";
import alpha_x from '/src/assets/alpha-x.svg';

const tournamentURL = 'https://api.npoint.io/c9523c0ef25065fec8c2';
const teamsURL = 'https://api.npoint.io/06c398320417bddefa14'
const paramUUID = new URLSearchParams(window.location.search).get('UUID')

function Tournament() {

  const [tournament, setTournament] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isHost, setIsHost] = useState(false);
  const [applicationAccepted, setApplicationAccepted] = useState(false);
  const [teams, setTeams] = useState([])
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)

  const handleJoin = () => {
    console.log("Joining tournament");
    displayJoinPopup()
    // Implement joining logic here, e.g., update backend, redirect to 'join tournament' page
  };

  const handleApply = () => {
    console.log("Applying for tournament");
    // Implement apply logic here, e.g., display form, send data to backend
  };

  // const fetchTournamentData = async () => {
  //   await fetch(url + new URLSearchParams({
  //     UUID: paramUUID
  //   }))
  //   .then(res => res.json())
  //   .then(data => {tournament = JSON.parse(data)})
  // };

  const fetchTournamentData = async () => {
    await fetch(tournamentURL)
    .then(res => res.json())
    .then(data => {
      setTournament(data)
      setIsLoading(false)
      // setIsHost(data.host == user.UUID)
      // setApplicationAccepted(tournament.isAccepted)
    })
  }

  const fetchTeams = async () => {
    await fetch(teamsURL)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setTeams(data)
      setIsLoadingTeams(false)
    })
  }

  useEffect(() => {
    fetchTournamentData()
    fetchTeams()
  }, [])

  function displayJoinPopup() {
    document.querySelector('.joinPopup').style.display = 'flex'
  }

  function hideJoinPopup() {
    document.querySelector('.joinPopup').style.display = 'none'
  }

  let button

  if(!isHost) {
    if(!tournament.hasStarted && tournament.accessibility === "open") {
      button = <button className="btn btn-primary" onClick={handleJoin}>Join</button>
    }
    else if(!tournament.hasStarted && !applicationAccepted) {
      button = <button className="btn btn-secondary" onClick={handleApply}>Apply</button>
    }
    else if(!tournament.hasStarted && applicationAccepted) {
      button = <button className="btn btn-primary" onClick={handleJoin}>Join</button>
    }
    else {
      button = <></>
    }
  }
  else {
    button = <button className="btn btn-manage" onClick={() => console.log("Manage tournament")}>Manage</button>
  }

  function SoloPopup() {
    return (
      <div className="joinPopup">
        <img onClick={hideJoinPopup} src={alpha_x} alt="" />
        <h1>Join Tournament</h1>
        <div className="joinPopup-details">
          Are you sure you want to join this tournament?
        </div>
        <button className="btn btn-primary joinPopup-confirm">Confirm</button>
      </div>
    )
  }

  function TeamPopup() {
    return (
      <div className="joinPopup">
        <img onClick={hideJoinPopup} src={alpha_x} alt="" />
        <h1>Choose Team</h1>
        <div className="joinPopup-teams">
          { isLoadingTeams ? <div>Loading teams ...</div> : teams.map(team => <div key={team.UUID}>{team.name}</div>) }
        </div>
        <button className="btn btn-primary joinPopup-confirm">Confirm</button>
      </div>
    )
  }

  return (
    <div id="Tournament">
      <Nav />
      <div className="tournament-container">
      { isLoading ? <h1 className="loadingText">Loading tournament ...</h1> : 
      <>
        <div className="tournament-info">
          <div className="tournament-specs">
            <h1 className="tournament-title">{tournament.title}</h1>
            <p className="tournament-description">{tournament.description}</p>
            <p className="tournament-category">Category: {tournament.category.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</p>
            <p className="tournament-type">Format: {tournament.type.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</p>
            <p className="tournament-teamSize">{tournament.teamSize != 1 ? (`Team size: ${tournament.teamSize} players`) : "Team size: Solo"}</p>
            <p className="tournament-capacity">Capacity: {tournament.enrolledUsers.length}/{tournament.maxCapacity}</p>
            <p className="tournament-entryFee">Entry Fee: ${tournament.entryFee}</p>
            <div className="tournament-earnings">Earnings:
              <p>1st: ${tournament.earnings[1]}</p>
              <p>2nd: ${tournament.earnings[2]}</p>
              <p>3rd: ${tournament.earnings[3]}</p>
            </div>
            <p className="tournament-accessibility">{tournament.accessibility != 'open' ? tournament.accessibility.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""}</p>
          </div>

          {button}
        </div>

        <div className="tournament-content">

          {tournament.type === "brackets" ? (
            <div className="brackets">Brackets Display</div>
          ) : (
            <div className="battle-royale">Battle Royale List</div>
          )}

          <div className="tournament-updates">
            <h3>Updates</h3>
            {tournament.updates.map((update) => <p key={update.date}>[{(new Date(update.date)).toDateString()}] {update.content}</p>)}
          </div>
        </div>
      </>
      }
      </div>
      { tournament.teamSize == 1 ? <SoloPopup /> : <TeamPopup /> }
    </div>
  );
}

export default Tournament;

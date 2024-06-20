import React, { useContext, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import "./app.css";
import Nav from "../../components/Nav";
import { AuthContext } from "../../context/AuthContext";


export default function Host() {

  const { loggedIn } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [additionalInfoData, setAdditionalInfoData] = useState([]);
  const [submitErrors, setSubmitErrors] = useState([]);

  const [isDisplayed, setIsDisplayed] = useState(true);
  const [btnIsDisplayed, setBtnIsDisplayed] = useState(true);
  const [specIsDisplayed, setSpecIsDisplayed] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [typeSpec, setTypeSpec] = useState(false);
  const [describeVal, setDescribeVal] = useState('');
  const [describeError, setDescribeError] = useState(false);
  const [describeError2, setDescribeError2] = useState(false);
  const describeRef = useRef(null);
  const [selectedGame, setSelectedGame] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [stringPerTeam, setStringPerTeam] = useState("");
  const [inputPrizes, setInputPrizes] = useState([]);
  const [rankCounter, setRankCounter] = useState(0);
  const [numberOfBrackets, setNumberOfBrackets] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(0);
  const maxParticipantsRef = useRef(null);
  const [entryFee, setEntryFee] = useState('');
  const [entryFeeError, setEntryFeeError] = useState(false);
  const entryFeeRef = useRef(null);
  const [winnerPrize, setWinnerPrize] = useState("");
  const [winnerPrizeError, setWinnerPrizeError] = useState(false);
  const winnerPrizeRef = useRef(null);
  const [isValidated, setIsValidated] = useState(true);
  const [selectedEntryMode, setSelectedEntryMode] = useState("");
  const [additionalInfoRequired, setAdditionalInfoRequired] = useState(false);
  const [additionalInfoList, setAdditionalInfoList] = useState([]);
  const [infoCounter, setInfoCounter] = useState(1);
  const additionalInfoRef = useRef(null);
  const [teamTypeError, setTeamTypeError] = useState(false);
  const teamTypeRef = useRef(null);
  const [bracketsError, setBracketsError] = useState(false);
  const bracketRef = useRef(null);
  const [participantsError, setParticipantsError] = useState(false);
  const [selectGameError, setSelectGameError] = useState(false);
  const selectedGameRef = useRef(null);
  const divPrizeRankRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedEntryError, setSelectedEntryError] = useState(false);
  const [isValidated2, setIsValidated2] = useState(true);
  const [titleError, setTitleError] = useState(false);
  const [titleVal, setTitleVal] = useState('');
  const titleRef = useRef(null)
  const [prizeRankError, setPrizeRankError] = useState(false);

  useEffect(() => {

    console.log("hello");
    console.log('hi')

    const checkHostStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/isHost`, { credentials: 'include' });
        const data = await response.json();
        if(!data){
          navigate('/become-host')
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking host status:', error);
        setIsLoading(false);
      }
    };

    checkHostStatus();
  }, []);

  useEffect(() => {
    if (loggedIn === undefined) return
    if (!loggedIn) {
      navigate('/signin')
    }
  }, [loggedIn]);

  const handleTitleChange = (e) => {
    setTitleVal(e.target.value);
    setTitleError(false);
    titleRef.current.style.border = "";
  }

  const handleAddInfo = () => {
    if (infoCounter <= 5) {
      const newInfo = (
        <div key={infoCounter}>
          * <input
            type="text"
            value={additionalInfoData[infoCounter] || ''}  // Use stored data if available
            onChange={(e) => handleAdditionalInfoChange(infoCounter, e.target.value)}  // Update data on change
          />
          <button type="button" onClick={() => handleRemoveInfo(infoCounter)}>
            Delete
          </button>
        </div>
      );
      setAdditionalInfoData([...additionalInfoData, '']);  // Add a new empty string to the data array
      setInfoCounter(infoCounter + 1);
    }
  };

  const handleAdditionalInfoChange = (index, value) => {
    const updatedInfoData = [...additionalInfoData];
    updatedInfoData[index] = value;  // Update the data at the specified index
    setAdditionalInfoData(updatedInfoData);
  };

  const handleRemoveInfo = (indexToRemove) => {
    const newList = additionalInfoData.filter((_, index) => index !== indexToRemove);
    setAdditionalInfoData(newList);
    setInfoCounter(infoCounter - 1);
  };

  const handleAddRank = () => {
    if (rankCounter < maxParticipants / teamSize) {
      if (!isValidated) {
        setIsValidated(true);
      }
      const demoRankCounter = rankCounter + 1;
      const newPrize = {
        rank: demoRankCounter,
        prize: '' // Initialize prize as an empty string
      };
      setInputPrizes([...inputPrizes, newPrize]);
      setRankCounter(rankCounter + 1);
    } else {
      console.log('Rank counter exceeded max number');
      setIsValidated(false);
    }
    setIsValidated2(true);
    setPrizeRankError(false);
    divPrizeRankRef.current.style.border = '';
  };

  const handleRemoveRank = () => {
    if (rankCounter >= 2) {
      const newList = [...inputPrizes];
      newList.pop();
      setInputPrizes(newList);
      setRankCounter(rankCounter - 1);
      if (!isValidated) {
        setIsValidated(true);
      }

    }
    setIsValidated2(true);
  };

  const handlePrizeChange = (index, value) => {
    const updatedPrizes = [...inputPrizes];
    updatedPrizes[index].prize = value;
    setInputPrizes(updatedPrizes);
  };

  const handleDescribeChange = (event) => {
    setDescribeVal(event.target.value);
    setDescribeError(false);
    describeRef.current.style.border = "";
    const inputText = event.target.value;


    if (inputText.length <= 200) {
      setDescribeVal(inputText);
      setDescribeError2(false);
    } else {

      const truncatedText = inputText.slice(0, 200);
      setDescribeVal(truncatedText);
      setDescribeError2(true);
    }
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setTypeSpec(event.target.value === "Bracket");
    setSpecIsDisplayed(true);
  };

  const handleSelectChange = (event) => {
    setSelectedGame(event.target.value);
    setSelectGameError(false);
    selectedGameRef.current.style.border = "";
  };

  const handleNbBracketsChange = (event) => {
    setNumberOfBrackets(event.target.value);
    setBracketsError(false);
    bracketRef.current.style.border = "";
  };

  const handleTeamChange = (event) => {
    setTeamSize(event.target.value);
    setTeamTypeError(false);
    teamTypeRef.current.style.border = '';
    if (event.target.value > "1") {
      setStringPerTeam("(per team)");
    } else {
      setStringPerTeam("");
    }
  };
  useEffect(() => {
    if (isLoading) return;
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tournement/getTournamentCategories`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [isLoading]);

  const handleMaxParticipants = (event) => {
    setMaxParticipants(event.target.value);
    setParticipantsError(false);
    maxParticipantsRef.current.style.border = "";

  };

  useEffect(() => {
    if (isLoading) return;
    if (!isValidated) {
      maxParticipantsRef.current.style.border = '2px solid red';
      const timer = setTimeout(() => {
        maxParticipantsRef.current.style.border = '';
      }, 4000);
    } else {
      maxParticipantsRef.current.style.border = '';
    }
  }, [isValidated]);

  const handleEntryFeeChange = (event) => {
    setEntryFee(event.target.value);
    setEntryFeeError(false);
    entryFeeRef.current.style.border = '';
  }
  const handleWinningPrize = (event) => {
    setWinnerPrize(event.target.value);
    setWinnerPrizeError(false);
    winnerPrizeRef.current.style.border = '';
  }

  const handleEntry = (event) => {
    setSelectedEntryMode(event.target.value);
    setAdditionalInfoRequired(event.target.value === "Application Required");
    setSelectedEntryError(false);

    // Scroll to the bottom of the page if additional info is required
    if (event.target.value === "Application Required") {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This stops the form from submitting traditionally
    console.log("handleSubmit is triggered");
    if (describeVal === "") {
      e.preventDefault();
      setDescribeError(true);
      describeRef.current.style.border = '2px solid red';
    }
    if (selectedGame === "") {
      e.preventDefault();
      setSelectGameError(true);
      selectedGameRef.current.style.border = "2px solid red";
    }
    if (teamSize === "") {
      e.preventDefault();
      setTeamTypeError(true);
      teamTypeRef.current.style.border = '2px solid red';
    }

    if (numberOfBrackets === "") {
      setBracketsError(true);
      bracketRef.current.style.border = '2px solid red';
    }
    if (maxParticipants === "" || maxParticipants === 0) {
      setParticipantsError(true);
      maxParticipantsRef.current.style.border = "2px solid red";
    } if (numberOfBrackets === "" && maxParticipants === "") {
      e.preventDefault();
    }
    if (entryFee === "") {
      e.preventDefault();
      setEntryFeeError(true);
      entryFeeRef.current.style.border = "2px solid red";
    }
    if (winnerPrize === "") {
      setWinnerPrizeError(true);
      winnerPrizeRef.current.style.border = "2px solid red";

    }
    if (inputPrizes.length === 0) {
      divPrizeRankRef.current.style.border = "2px solid red";
      setPrizeRankError(true);
    } if (winnerPrize === "" && inputPrizes.length === 0) {
      e.preventDefault();
    }
    if (selectedEntryMode === "") {
      e.preventDefault();
      setSelectedEntryError(true);
    }
    if (rankCounter > maxParticipants) {
      e.preventDefault();
      setIsValidated2(false);

    }
    if (titleVal === "") {
      e.preventDefault();
      setTitleError(true);
      titleRef.current.style.border = "2px solid red";
    }
    else {

      if (selectedType === "Bracket") {
        var formData = {
          title: titleVal,
          teamSize: teamSize,
          description: describeVal,
          type: selectedType,
          category: selectedGame,
          entryFee: entryFee,
          earnings: winnerPrize,
          accessibility: selectedEntryMode,
          maxCapacity: numberOfBrackets,
          applications: additionalInfoData
        };
      }
      else {
        formData = {
          title: titleVal,
          description: describeVal,
          type: selectedType,
          category: selectedGame,
          teamSize: teamSize,
          entryFee: entryFee,
          earnings: inputPrizes,
          accessibility: selectedEntryMode,
          maxCapacity: maxParticipants,
          applications: additionalInfoData
        }
      }
      try {
        console.log("hi");
        console.log(formData);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tournement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include'
        });
        if (!response.ok) {
          const errors = await response.json();
          setSubmitErrors(errors.errors);
          throw new Error('Failed to create tournament');
        }

        if (response.ok) {
          const data = await response.json()
          navigate("/tournament/" + data.UUID)
        }

        // Handle successful response (optional)
        console.log('Tournament created successfully!');
      } catch (error) {
        console.error('Error creating tournament:', error);
        // Handle error (e.g., show error message to the user)
      }
    }
  };
  return (
    <>
      {
        isLoading
          ? <h1>Loading...</h1>
          : <div id="Host">
            <Nav />
            <div id="container">
              <div className="content-container">
                <h1>Create a Tournament</h1>
                <div id="page-description">
                  Create and manage thrilling tournaments on our platform. Choose between classic bracket-style tournaments or action-packed battle royals. Customize rules, seeding, and formats for an unforgettable gaming experience!
                </div>
                <hr className="custom-line" />
              </div>
              <div id="main" style={{ display: isDisplayed ? "block" : "none" }}>
                <form onSubmit={handleSubmit}>
                  <div id="type">
                    <h2>Choose tourney type</h2>
                    <div id="chooseType">
                      <label>
                        Bracket:
                        <input
                          type="radio"
                          id="Bracket"
                          name="type"
                          value="Bracket"
                          checked={selectedType === "Bracket"}
                          onChange={handleTypeChange}
                        />
                      </label>
                      <label>
                        Battle Royale:
                        <input
                          type="radio"
                          id="battleRoyale"
                          name="type"
                          value="BattleRoyale"
                          checked={selectedType === "BattleRoyale"}
                          onChange={handleTypeChange}
                        />
                      </label>
                    </div>
                  </div>
                  <hr className="custom-line" />
                  <div id="specification" style={{ display: specIsDisplayed ? 'block' : 'none' }}>
                    <div className="form-group">
                      <h2>Title:</h2>
                      <span id="teamTypeError" style={{ display: titleError ? 'block' : 'none' }}>
                        Please fill out this field</span>
                      <input type="text" ref={titleRef} onChange={handleTitleChange} value={titleVal} placeholder="Please add a title" />
                    </div>
                    <div className="form-group">
                      <div id="divDesc"> <h2>Description:</h2>(up to 200 characters)</div>
                      <span id="teamTypeError" style={{ display: describeError ? 'block' : 'none' }}>
                        Please fill out this field</span>
                      <textarea ref={describeRef} onChange={handleDescribeChange} value={describeVal} placeholder="Please describe your tournament.Include any unique rules, what participants can expect, and why they should join. Be as detailed as possible to attract the right participants."></textarea>
                      {describeError2 ? <p style={{ color: 'red' }}>Maximum word limit exceeded (200 characters).</p> : <p>{describeVal.length}/200</p>}
                    </div>
                    <hr
                      className="custom-line"></hr>
                    <div className="form-group">
                      <h2>Choose category:</h2>
                      <span id="teamTypeError" style={{ display: selectGameError ? 'block' : 'none' }}>
                        Please fill out this field</span>
                      <select
                        ref={selectedGameRef}
                        id="selectGame"
                        name="game"
                        value={selectedGame}
                        onChange={handleSelectChange}
                      >
                        <option value="" disabled hidden>Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" id="participantNumber" style={{ display: typeSpec ? 'none' : 'block' }}>
                      <h2>Maximum Number of Participants:</h2>
                      <span id="teamTypeError" style={{ display: participantsError ? 'block' : 'none' }}>
                        Please fill out this field
                      </span>
                      <input type="number" id="capacity" name="capacity" value={maxParticipants} onChange={handleMaxParticipants} ref={maxParticipantsRef} min={0} />
                    </div>
                    <div className="form-group" id="bracketNumber" style={{ display: typeSpec ? 'block' : 'none' }}>
                      <h2>Number of brackets:</h2>
                      <span id="teamTypeError" style={{ display: bracketsError ? 'block' : 'none' }}>
                        Please fill out this field
                      </span>
                      <select ref={bracketRef} id="selectBracket" name="nbofbrackets" defaultValue="" onChange={handleNbBracketsChange}>
                        <option value="" disabled hidden>Select a number</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="32">32</option>
                        <option value="64">64</option>
                        <option value="128">128</option>
                        <option value="256">256</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <h2>Teams size:</h2>
                      <span id="teamTypeError" style={{ display: teamTypeError ? 'block' : 'none' }}>
                        Please fill out this field
                      </span>
                      <input type="number" ref={teamTypeRef} value={teamSize} onChange={handleTeamChange} min={0} />
                    </div>

                    <div className="form-group">
                      <h2>Entry fee ($) {stringPerTeam}:</h2>
                      <span id="teamTypeError" style={{ display: entryFeeError ? 'block' : 'none' }}>
                        Please fill out this field</span>
                      <input type="number" id="entryFee" name="entryFee" value={entryFee} onChange={handleEntryFeeChange} ref={entryFeeRef} min={0} />
                    </div>

                    <div className="form-group" style={{ display: typeSpec ? 'block' : 'none' }}>
                      <h2>Winner Prize:</h2>
                      <span id="teamTypeError" style={{ display: winnerPrizeError ? 'block' : 'none' }}>
                        Please fill out this field</span>
                      <input type="number" id="earning" name="earnings" placeholder="Enter a prize" value={winnerPrize} onChange={handleWinningPrize} ref={winnerPrizeRef} min={0} />
                    </div>
                    <div ref={divPrizeRankRef} id="form-rank" style={{ display: typeSpec ? 'none' : 'block' }}>
                      <h2>Prize by rank :</h2>
                      {inputPrizes.map((input, index) => (
                        <div key={index}>
                          {input.rank} <input
                            type="number"
                            placeholder="Enter a prize"
                            value={input.prize}
                            onChange={(e) => handlePrizeChange(index, e.target.value)}
                          />
                        </div>
                      ))}
                      <input type="button" className="submitRank-App" onClick={(event) => { event.preventDefault(); handleAddRank() }} value="Add Rank" />
                      <input type="button" className="submitRank-App" onClick={(event) => { event.preventDefault(); handleRemoveRank() }} value="Remove Rank" />
                      {isValidated ? null : <div id="rankError">if you wish to add more prize ranks, you should increase the number of participants above!</div>}
                      {isValidated2 ? null : <div id="rankError">If you wish to continue, you should remove ranks until they equal the number of participants.</div>}
                      {prizeRankError ? <div id="rankError">If you wish to continue, you should at least offer a prize to the first-place winner.</div> : null}
                    </div>
                    <div id="form-app">
                      <h2>Tourney entry mode:</h2>
                      <span id="teamTypeError" style={{ display: selectedEntryError ? 'block' : 'none' }}>
                        Please fill out this field</span>
                      <label>
                        <input type="radio"
                          id="openField"
                          name="publicity"
                          value="Open"
                          checked={selectedEntryMode === "Open"}
                          onChange={handleEntry}
                        />
                        Open
                      </label>
                      <label>
                        <input
                          type="radio"
                          id="applicationRequired"
                          name="publicity"
                          value="Application Required"
                          checked={selectedEntryMode === "Application Required"}
                          onChange={handleEntry}
                        />
                        Application Required
                      </label>
                    </div>
                    <div id="form-app" style={{ display: additionalInfoRequired ? 'block' : 'none' }}>
                      <h4>Please fill in any additional questions or information requests you have for applicants</h4>
                      {additionalInfoData.map((info, index) => (
                        <div key={index}>
                          * <input
                            type="text"
                            value={info}
                            onChange={(e) => handleAdditionalInfoChange(index, e.target.value)}
                          />
                          <button type="button" onClick={() => handleRemoveInfo(index)}>
                            Delete
                          </button>
                        </div>
                      ))}
                      <input type="button" onClick={handleAddInfo} value="Add question/request" />


                      <input type="submit" className="submitRank-App" onClick={(event) => { event.preventDefault(); handleAddInfo() }} value="Add question/request" />

                    </div>
                    <div className="submit-errors">
                      {submitErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))}
                    </div>
                    <footer>
                      <input type="submit" value="Create" />
                    </footer>
                  </div>
                </form>
              </div>
            </div>
          </div>
      }
    </>
  )
}
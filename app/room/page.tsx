"use client"
import Grid from "@/components/grid";
import ScoreBoard from "@/components/score-board";
import Modal from "@/components/modal";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-localstorage";

type GameState = "idle" | "playing" | "paused" | "gameover";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [gameOverReason, setGameOverReason] = useState<string>("");
  const [snakeSpeed, setSnakeSpeed] = useState(250);
  const [randomFruitIcon, setRandomFruitIcon] = useState<null | string>("");
  const [finalScore, setFinalScore] = useState(0);
  const [name, setName] = useState<string | null>(null)
  const [tempName, setTempName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);
  const {get,set} = useLocalStorage();

  const FRUITS = [
    "🍎", "🍏", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", 
  ];

  useLayoutEffect(()=>{
    const username = get("username")
    setName(username || "")
    setTempName(username || "")
  },[]);

  const handleSaveName = useCallback(() => {
    if (tempName.trim()) {
      set("username", tempName.trim());
      setName(tempName.trim());
      setIsEditingName(false);
    }
  }, [tempName, set]);

  const handleEditName = useCallback(() => {
    setTempName(name || "");
    setIsEditingName(true);
  }, [name]);

  const handleCancelEditName = useCallback(() => {
    setTempName(name || "");
    setIsEditingName(false);
  }, [name]);

  const handleStartGame = useCallback(() => {
    if (!name && tempName.trim()) {
      set("username", tempName.trim());
      setName(tempName.trim());
    }
    setScore(0);
    setSnakeSpeed(250);
    setError(null);
    setGameOverReason("");
    setGameState("playing");
  }, [name, tempName, set]);

  const startGame = useCallback(()=>{
    setScore(0);
    setSnakeSpeed(250);
    setError(null);
    setGameOverReason("");
    setGameState("playing");
  }, []);
  const pauseGame = useCallback(()=>{
    setGameState("paused");
  }, []);

  const resumeGame = useCallback(()=>{
    setGameState("playing");
  }, []);

  const handleGameOver = useCallback((reason: string)=>{
    setGameOverReason(reason);
    setError(reason);
    setGameState("gameover");
    setFinalScore(score);
  }, [score]);


  const handleRetry = useCallback(()=>{
    startGame();
  }, [startGame]);

  const handleClearError = useCallback(()=>{
    setError(null);
  }, []);

  // Set initial fruit icon
  useEffect(()=>{
    const randomFruitIdx = Math.floor(Math.random() * FRUITS.length);
    setRandomFruitIcon(FRUITS[randomFruitIdx]);
  }, []);


  return (
    <div className="w-full h-screen flex font-inter">
      {/* Start Game Modal - shows on idle state */}
      <Modal
        isOpen={gameState === "idle"}
        title={name ? "🐍 Snake Game" : "🐍 Snake Game"}
        description={name ? "Eat fruits, grow longer, and avoid hitting walls or yourself!" : "Enter your name to get started!"}
        primaryBtnText="Start Game"
        onPrimaryClick={handleStartGame}
        disabled={!name && !tempName.trim()}
        nameInput={!name ? {
          value: tempName,
          onChange: setTempName,
          placeholder: "Enter your name"
        } : undefined}
      />

      {/* Edit name modal */}
      <Modal
        isOpen={isEditingName}
        title="Edit Name"
        primaryBtnText="Save"
        onPrimaryClick={handleSaveName}
        secondaryBtnText="Cancel"
        onSecondaryClick={handleCancelEditName}
        disabled={!tempName.trim()}
        nameInput={{
          value: tempName,
          onChange: setTempName,
          placeholder: "Enter your name"
        }}
      />

      {/* Game over modal */}
      <Modal
        isOpen={gameState === "gameover"}
        title="Game Over"
        description={gameOverReason}
        score={finalScore}
        primaryBtnText="Retry"
        onPrimaryClick={() => {
          setScore(0);
          setSnakeSpeed(250);
          setError(null);
          setGameOverReason("");
          setGameState("idle");
        }}
      />

      <Grid
        score={score}
        setScore={setScore}
        setMessage={setMessage}
        setError={setError}
        snakeSpeed={snakeSpeed}
        randomFruitIcon={randomFruitIcon}
        isGameActive={gameState === "playing"}
        onGameOver={handleGameOver}
      />
      
      <ScoreBoard
        error={error}
        message={message}
        score={score}
        username={name}
        onEditName={handleEditName}
        baseSpeed={250}
        snakeSpeed={snakeSpeed}
        randomFruitIcon={randomFruitIcon}
        onClearError={handleClearError}
        gameState={gameState}
        onPause={pauseGame}
        onResume={resumeGame}
      />
    </div>
  );
}

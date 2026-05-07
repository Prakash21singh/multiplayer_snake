"use client"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type Props = {
  score: number,
  snakeSpeed: number,
  randomFruitIcon: string | null,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  isGameActive: boolean,
  onGameOver: (reason: string) => void,
}

const INITIAL_POS = [
  { x: 3, y: 3 },
  { x: 2, y: 3 },
  { x: 1, y: 3 },
]

function Grid({
  score,
  snakeSpeed,
  randomFruitIcon,
  setScore,
  setMessage,
  setError,
  isGameActive,
  onGameOver,
}: Props) {
  const GRID_SIZE = 20;
  const GRID_CELL = 30;
  const dirRef = useRef<"R"| "L" | "T" |"B">("B");
  const fruitPositionRef = useRef<null | number>(null);
  const gameEndedRef = useRef(false);
  const prevIsGameActiveRef = useRef(false);
  const [fruitPosition, setFruitPosition]= useState<null | number>(null);
  const [snakePos, setSnakePos] = useState(INITIAL_POS);

  // Update ref whenever fruitPosition changes
  useEffect(() => {
    fruitPositionRef.current = fruitPosition;
  }, [fruitPosition]);
  
  const getRandomFruitPos = useCallback(()=>{
    const randX = Math.floor(Math.random() * GRID_SIZE);
    const randY = Math.floor(Math.random() * GRID_SIZE);
    return { randX, randY }
  },[]);

  const regenerateFruit = useCallback((currentSnake = snakePos) => {
    let pos = getRandomFruitPos();
    let isFruitOverlappingSnake = currentSnake.some(({x, y})=> x === pos.randX && y === pos.randY);

    while(isFruitOverlappingSnake){
      pos = getRandomFruitPos()
      isFruitOverlappingSnake = currentSnake.some(({x, y})=> x === pos.randX && y === pos.randY);
    }
    const index = (pos.randY * GRID_SIZE) + pos.randX;
    setFruitPosition(index);
  }, [getRandomFruitPos]);

  const MoveRight = useCallback(()=>{
    setSnakePos((prev)=>{
      const newHeadX = prev[0].x + 1;
      const newHeadY = prev[0].y;
      const newHeadPos = (newHeadY * GRID_SIZE) + newHeadX;
      
      const snakePos = [...prev];
      if (newHeadPos !== fruitPositionRef.current) {
        snakePos.pop();
      }
      snakePos.unshift({ x: newHeadX, y: newHeadY });
      return snakePos;
    })
  },[]);

  const MoveLeft = useCallback(()=>{
    setSnakePos((prev)=>{
      const newHeadX = prev[0].x - 1;
      const newHeadY = prev[0].y;
      const newHeadPos = (newHeadY * GRID_SIZE) + newHeadX;
      
      const snakePos = [...prev]
      if (newHeadPos !== fruitPositionRef.current) {
        snakePos.pop();
      }
      snakePos.unshift({ x: newHeadX, y: newHeadY });
      return snakePos;
    })
  },[]);

  const MoveBottom = useCallback(()=>{
    setSnakePos((prev)=> {
      const newHeadX = prev[0].x;
      const newHeadY = prev[0].y + 1;
      const newHeadPos = (newHeadY * GRID_SIZE) + newHeadX;
      
      const snakePos = [...prev]
      if (newHeadPos !== fruitPositionRef.current) {
        snakePos.pop();
      }
      snakePos.unshift({ y: newHeadY, x: newHeadX });
      return snakePos;
    })
  },[]);

  const MoveTop = useCallback(()=>{
    setSnakePos((prev)=> {
      const newHeadX = prev[0].x;
      const newHeadY = prev[0].y - 1;
      const newHeadPos = (newHeadY * GRID_SIZE) + newHeadX;
      
      const snakePos = [...prev]
      if (newHeadPos !== fruitPositionRef.current) {
        snakePos.pop();
      }
      snakePos.unshift({ y: newHeadY, x: newHeadX });
      return snakePos;
    })
  },[]);

  // Keyboard controls
  useEffect(()=>{
    function handleKeyDown(e: KeyboardEvent){
      const currentDir = dirRef.current;

      if(e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return 
      
      switch (e.key) {
        case "ArrowUp": 
          if(currentDir === "B") return;
          dirRef.current = "T";
          break;
        case "ArrowDown":
          if(currentDir === "T") return;
          dirRef.current = "B"
          break;
        case "ArrowLeft":
          if(currentDir === "R") return;
          dirRef.current = "L"
          break;
        case "ArrowRight":
          if(currentDir === "L") return;
          dirRef.current = "R"
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return ()=> window.removeEventListener("keydown", handleKeyDown)
  },[]);

  const isSnake = useCallback((i:number)=>{
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE)
    return snakePos.some((snake)=> snake.x === x && snake.y === y)
  }, [snakePos]);

  

  // Initialize fruit on component mount
  useLayoutEffect(()=>{
    regenerateFruit(INITIAL_POS);
  }, [regenerateFruit]);

  // Game loop - only runs when isGameActive is true
  useEffect(()=>{
    if(!dirRef.current || !isGameActive) return;
    
    const timer = setInterval(()=>{
      const direction = dirRef.current;

      switch (direction) {
        case "R": MoveRight(); break;
        case "B": MoveBottom(); break;
        case "L": MoveLeft(); break;
        case "T": MoveTop(); break;
      }
    }, snakeSpeed)

    return ()=> clearTimeout(timer)
  }, [MoveRight, MoveLeft, MoveBottom, MoveTop, snakeSpeed, isGameActive]);

  // Detect fruit eating
  useEffect(()=>{
    if(fruitPosition === null) return;
    
    const head = snakePos[0];
    const headPos = (head.y * GRID_SIZE) + head.x;
    
    if(headPos === fruitPosition){
      setScore((prev) => prev + 10);
      regenerateFruit(snakePos);
    }
  }, [snakePos, fruitPosition, regenerateFruit]);

  // Self-collision detection
  useEffect(()=>{
    if(!isGameActive || snakePos.length <= 1) return;
    
    const head = snakePos[0];
    const bodyWithoutHead = snakePos.slice(1);
    
    const hitSelf = bodyWithoutHead.some(segment => segment.x === head.x && segment.y === head.y);
    if(hitSelf && !gameEndedRef.current){
      gameEndedRef.current = true;
      onGameOver("You collided with yourself");
    }
  }, [snakePos, isGameActive, onGameOver]);

  // Boundary collision detection
  useEffect(()=>{
    if(!isGameActive) return;
    
    const head = snakePos[0];
    if((head.y < 0 || head.y === GRID_SIZE || head.x < 0 || head.x === GRID_SIZE) && !gameEndedRef.current){
      gameEndedRef.current = true;
      onGameOver("You hit the boundary");
    }
  }, [snakePos, isGameActive, onGameOver]);

  // Reset on game start (retry) - only reset if game just ended
  useEffect(()=>{
    if(isGameActive && gameEndedRef.current){
      gameEndedRef.current = false;
      setSnakePos(INITIAL_POS);
      dirRef.current = "B";
    }
    
    prevIsGameActiveRef.current = isGameActive;
  }, [isGameActive]);

  // Don't render while not playing
  if(!isGameActive) return null;

  return (
    <div className="w-full max-w-3xl h-full flex items-center justify-center bg-[#131313] p-8">
       <div 
        className="w-full h-full"
        style={{
          display:"grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${GRID_CELL}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${GRID_CELL}px)`,
          width: GRID_CELL * GRID_SIZE,
          height: GRID_CELL * GRID_SIZE,
        }}
        >
          {
            Array.from({length: GRID_SIZE * GRID_SIZE}).map((_,i)=>{
              return ( 
                <div
                  key={i}
                  style={{
                    width: GRID_CELL,
                    height: GRID_CELL,
                    border: "1px solid #222",
                    boxSizing: "border-box",
                    backgroundColor: isSnake(i) ? "lime" : "#111",
                  }}
                  className={`flex items-center justify-center`}
                >
                  {fruitPosition === i && randomFruitIcon}
                </div>
              )
            })
          }
       </div>
    </div>
  )
}

export default Grid
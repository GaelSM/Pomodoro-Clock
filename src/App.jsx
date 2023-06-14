import React, { useRef, useState } from 'react'
import Length from './Length'
import './App.css'

export default function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60)
  const [breakTime, setBreakTime] = useState(5 * 60)
  const [sessionTime, setSessionTime] = useState(25 * 60)
  const [timerActive, setTimerActive] = useState(false)
  const [onBreak, setOnBreak] = useState(false)

  const audioRef = useRef()

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60)
    let seconds = time % 60
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
  }

  const changeTime = (amount, type) => {
    if(timerActive) return
    if(type === "break"){
      if((breakTime <= 60 && amount < 0) || (breakTime >= 3600 && amount > 0)) return
      setBreakTime(breakTime + amount)
    }
    else{
      if((sessionTime <= 60 && amount < 0) || (sessionTime >= 3600 && amount > 0)) return
      setSessionTime(sessionTime + amount)
      setDisplayTime(displayTime + amount)
    }
  }

  const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"))
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setDisplayTime(25 * 60)
    setSessionTime(25 * 60)     
    setBreakTime(5 * 60)
    setTimerActive(false)
    setOnBreak(false)
  }

  const controlTime = () => {
    let onBreakVariable = onBreak
    let time = displayTime

    if(!timerActive){
      let interval = setInterval(() => {
        if(time <= 0 && !onBreakVariable){
          onBreakVariable = true
          setOnBreak(onBreakVariable)
          time = breakTime
          setDisplayTime(time)
          audioRef.current.play()
        }else if(time <= 0 && onBreakVariable){
          onBreakVariable = false
          setOnBreak(onBreakVariable)
          time = sessionTime
          setDisplayTime(time)
          audioRef.current.play()
        }else{
          time -= 1
          setDisplayTime(time)
        }
        localStorage.clear()
        localStorage.setItem("interval-id", interval)
      }, 1000)
    }

    if(timerActive) clearInterval(localStorage.getItem("interval-id"))
    setTimerActive(!timerActive)
  }

  return (
    <>
      <h1> Pomodoro Clock </h1>
      <main>
        <div className="settings">
          <Length 
            title={"Break Length"} 
            changeTime={changeTime} 
            type={"break"} 
            time={breakTime} 
          />

          <Length 
            title={"Session Length"} 
            changeTime={changeTime} 
            type={"session"} 
            time={sessionTime} 
          />
        </div>

        <div id="timer-label">
          <h3> {onBreak ? "Break" : "Session"} </h3>
          <h2 id="time-left"> {formatTime(displayTime)} </h2>
          <div>
            <button id="start_stop" onClick={controlTime}> {timerActive ? "Pause" : "Start"} </button>
            <button id="reset" onClick={resetTime}> Reset </button>
          </div>
        </div>

        <audio  ref={audioRef} src="https://www.soundjay.com/misc/sounds/censor-beep-4.mp3" id="beep"></audio>
      </main>
    </>
  )
}
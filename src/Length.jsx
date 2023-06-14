export default function Length({title, changeTime, type, time}){
  return(
    <div id={`${type}-label`}>
      <p>{title}</p>
      <div className="length-controls">
        <button id={`${type}-decrement`}onClick={() => changeTime(-60, type)}> - </button>
        <p id={`${type}-length`}> {Math.floor(time / 60)} </p>
        <button id={`${type}-increment`}onClick={() => changeTime(60, type)}> + </button>
      </div>
    </div>
  )
}
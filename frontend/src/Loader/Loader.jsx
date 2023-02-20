import React from 'react'
import './Loader.css'

const Loader = ({ loading, success, error, currentChainId}) => {
  return (
    <div>
      {
        loading && !error && !success && (
          <div className='loader'>Be patient this will take a few seconds</div>
        )
      }

      {
        success &&  !error && (
          <div className='loader success' >Success!</div>
        )
      }

      {
        error && !success &&  (
          <div className='loader error'>Error! Try again</div>
        )
      }
    </div>
  )
}

export default Loader
import React from 'react'
import './Loader.css'

const Loader = ({ loading, success, error}) => {
  return (
    <div>
      {
        loading && !error && !success && (
          <div className='loader'>Loading...</div>
        )
      }

      {
        success && (
          <div className='loader success' >Success!</div>
        )
      }

      {
        error && (
          <div className='loader error'>Error! Try again</div>
        )
      }
    </div>
  )
}

export default Loader
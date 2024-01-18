import React from 'react'

const Periods = () => {
  return (
    <div className='mt-4 mx-4'>
      <div className="row g-3 ">
        <div className="col-sm px-4">
          <input type="text" className="form-control" placeholder="Room Name" aria-label="Room"/>
        </div>
        <div className="col-sm px-4">
          <input type="number" className="form-control" placeholder="Capacity" aria-label="Capacity" />
        </div>
        <div className="col-sm px-4">
          <button type="submit"  className="btn btn-primary font-weight-bold ">Submit</button>
        </div>
      </div>
    </div>
  )
}

export default Periods
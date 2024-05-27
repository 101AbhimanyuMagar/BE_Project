import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/login');
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-dark text-center"
      style={{
        position: 'relative',
        backgroundImage: 'url(https://i.ibb.co/19qw3tL/4584.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(128, 128, 128, 0.5)',  // Gray overlay
          zIndex: 1,
        }}
      />
      <div className="container" style={{ zIndex: 2 }}>
        <div className="row">
          <div className="col-12">
            <h1 className="display-4 fw-bold mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Welcome to College Timetable Scheduler</h1>
            <p className="lead mb-4" style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.5rem', lineHeight: '1.6' }}>
              Efficiently manage and generate optimized college timetables using advanced genetic algorithms.
            </p>
          </div>
          <div className="col-12">
            <button className="btn btn-success btn-lg mt-3" onClick={handleButtonClick}>
              Let's Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

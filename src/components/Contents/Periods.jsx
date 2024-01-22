import React, { useState, useEffect } from 'react';
import { db } from '../../../src/firebase.jsx';
import { onSnapshot, collection, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const Periods = () => {
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [Periods, setPeriods] = useState([]);

  const PeriodsCollectionRef = collection(db, 'Periods');

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    let formattedHours = parseInt(hours, 10);

    if (formattedHours >= 12) {
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    } else if (formattedHours === 0) {
      formattedHours = 12;
    }

    return `${formattedHours.toString().padStart(2, '0')}:${minutes}`;
  };

  const createLecturePeriod = async () => {
    // Check if both start and end times are provided
    if (!newStartTime || !newEndTime) {
      alert('Please fill in both start time and end time.');
      return;
    }

    // Convert the entered time to a 12-hour format
    const formattedStartTime = formatTime(newStartTime);
    const formattedEndTime = formatTime(newEndTime);

    // Add a new lecture period
    await addDoc(PeriodsCollectionRef, {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });

    // Clear form fields after creating lecture period
    setNewStartTime('');
    setNewEndTime('');
  };

  const deleteLecturePeriod = async (id) => {
    const lecturePeriodDoc = doc(db, 'Periods', id);
    await deleteDoc(lecturePeriodDoc);
  };

  useEffect(() => {
    // Subscribe to real-time updates using onSnapshot
    const unsubscribePeriods = onSnapshot(
      query(collection(db, 'Periods'), orderBy('startTime', 'asc')),
      (snapshot) => {
        setPeriods(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );

    // Cleanup on component unmount
    return () => unsubscribePeriods();
  }, []);

  return (
    <div className='mt-4 mx-4'>
      <div className='row g-3 '>
        <div className='col-sm px-2'>
          <input
            type='time'
            className='form-control'
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            placeholder='Start Time'
            aria-label='Start Time'
          />
        </div>
        <div className='col-sm px-2'>
          <input
            type='time'
            className='form-control'
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            placeholder='End Time'
            aria-label='End Time'
          />
        </div>
        <div className='col-sm px-4'>
          <button
            type='button'
            onClick={createLecturePeriod}
            className='btn btn-primary font-weight-bold '
          >
            Submit
          </button>
        </div>
      </div>
      <div>
        <table className='table table-hover table-sm mt-4 rounded-circle'>
          <thead className='thead-dark '>
            <tr>
              <th scope='col'>id</th>
              <th scope='col'>Start Time</th>
              <th scope='col'>End Time</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Periods.map((period, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{formatTime(period.startTime)}</td>
                <td>{formatTime(period.endTime)}</td>
                <td>
                  <button
                    className='btn btn-danger'
                    type='button'
                    onClick={() => deleteLecturePeriod(period.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Periods;

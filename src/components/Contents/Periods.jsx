import React, { useState, useEffect } from 'react';
import { db } from '../../../src/firebase.jsx';
import { onSnapshot, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Periods = () => {
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [lectureSequence, setLectureSequence] = useState('');
  const [periods, setPeriods] = useState([]);

  const periodsCollectionRef = collection(db, 'Periods');

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    let formattedHours = parseInt(hours, 10);
    let period = 'AM';

    if (formattedHours >= 12) {
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
      period = 'PM';
    } else if (formattedHours === 0) {
      formattedHours = 12;
    }

    return `${formattedHours.toString().padStart(2, '0')}:${minutes} ${period}`;
  };

  const createLecturePeriod = async () => {
    if (!newStartTime || !newEndTime || !lectureSequence || isNaN(lectureSequence) || lectureSequence <= 0) {
      alert('Please fill in all fields with a positive numerical value for Lecture Sequence.');
      return;
    }

    const formattedStartTime = formatTime(newStartTime);
    const formattedEndTime = formatTime(newEndTime);

    const newPeriod = {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      lectureSequence: parseInt(lectureSequence),
    };

    setPeriods([...periods, newPeriod]);

    await addDoc(periodsCollectionRef, newPeriod);

    setNewStartTime('');
    setNewEndTime('');
    setLectureSequence('');
  };

  const deleteLecturePeriod = async (id) => {
    const lecturePeriodDoc = doc(db, 'Periods', id);
    await deleteDoc(lecturePeriodDoc);
  };

  useEffect(() => {
    const unsubscribePeriods = onSnapshot(
      periodsCollectionRef,
      (snapshot) => {
        const fetchedPeriods = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const sortedPeriods = fetchedPeriods.sort((a, b) => a.lectureSequence - b.lectureSequence);
        setPeriods(sortedPeriods);
      }
    );

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
        <div className='col-sm px-2'>
          <input
            type='number'
            className='form-control'
            value={lectureSequence}
            onChange={(e) => setLectureSequence(e.target.value)}
            placeholder='Lecture Sequence'
            aria-label='Lecture Sequence'
            min="1" // Ensure only positive values
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
              <th scope='col'>Lecture Sequence</th>
              <th scope='col'>Start Time</th>
              <th scope='col'>End Time</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period, index) => (
              <tr key={index}>
                <td>{period.lectureSequence}</td>
                <td>{period.startTime}</td>
                <td>{period.endTime}</td>
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

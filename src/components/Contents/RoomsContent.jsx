import React, { useEffect, useState } from 'react';
import { db } from '../../../src/firebase.jsx';
import { onSnapshot, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';


const RoomsContent = () => {
  const [newRoom, setNewRoom] = useState('');
  const [newCapacity, setNewCapacity] = useState(0);
  const [rooms, setRooms] = useState([]);
  const roomsCollectionRef = collection(db, 'Rooms');

  const createRoom = async () => {
    await addDoc(roomsCollectionRef, { roomName: newRoom, Capacity: newCapacity });
  };

  // Debounce the createRoom function


  const deleteRoom = async (id) => {
    const roomDoc = doc(db, 'Rooms', id);
    await deleteDoc(roomDoc);
  };

  useEffect(() => {
    // Subscribe to real-time updates using onSnapshot
    const unsubscribe = onSnapshot(roomsCollectionRef, (snapshot) => {
      setRooms(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array for initial mount

  return (
    <div className='mt-4 mx-4'>
      <div className='row g-3 '>
        <div className='col-sm px-4'>
          <input
            type='text'
            className='form-control'
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder='Room Name'
            aria-label='Room'
          />
        </div>
        <div className='col-sm px-4'>
          <input
            type='number'
            className='form-control'
            onChange={(e) => setNewCapacity(e.target.value)}
            placeholder='Capacity'
            min='0'
            aria-label='Capacity'
          />
        </div>
        <div className='col-sm px-4'>
          {/* Use the debouncedCreateRoom function instead of createRoom */}
          <button type='submit' onClick={createRoom} className='btn btn-primary font-weight-bold'>
            Submit
          </button>
        </div>
      </div>
      <div>
        <table className='table table-hover table-sm mt-4 rounded-circle'>
          <thead className='thead-dark '>
            <tr>
              <th scope='col'>id</th>
              <th scope='col'>Room Name</th>
              <th scope='col'>Capacity</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{room.roomName}</td>
                <td>{room.Capacity}</td>
                <td>
                  <button className='btn btn-danger' type='submit' onClick={() => deleteRoom(room.id)}>
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

export default RoomsContent;

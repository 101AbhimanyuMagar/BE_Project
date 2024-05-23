import React, { useEffect, useState } from 'react';
import { db } from '../../../src/firebase.jsx';
import Select from 'react-select';
import { onSnapshot, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Professor = () => {
  const [newProfessor, setNewProfessor] = useState('');
  const [newCourses, setNewCourses] = useState([]);
  const [newLoad, setNewLoad] = useState('');
  const [professor, setProfessor] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const coursesCollectionRef = collection(db, 'Courses');
  const professorsCollectionRef = collection(db, 'Professors');

  const createProfessor = async () => {
    // Get document references for selected courses
    const coursesReferences = selectedCourses.map((selectedCourse) =>
      doc(db, 'Courses', selectedCourse.value)
    );

    // Add a new professor with references to selected courses
    await addDoc(professorsCollectionRef, {
      professorName: newProfessor,
      courses: coursesReferences,
      Load: newLoad,
    });

    // Clear form fields after creating professor
    setNewProfessor('');
    setNewCourses([]);
    setNewLoad('');
    setSelectedCourses([]);
  };

  const deleteProf = async (id) => {
    const professorDoc = doc(db, 'Professors', id);
    await deleteDoc(professorDoc);
  };

  useEffect(() => {
    // Subscribe to real-time updates using onSnapshot
    const unsubscribeProfessors = onSnapshot(professorsCollectionRef, (snapshot) => {
      setProfessor(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    // Cleanup on component unmount
    return () => unsubscribeProfessors();
  }, []);

  useEffect(() => {
    // Subscribe to real-time updates using onSnapshot
    const unsubscribeCourses = onSnapshot(coursesCollectionRef, (snapshot) => {
      setCourses(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    // Cleanup on component unmount
    return () => unsubscribeCourses();
  }, []); // Empty dependency array for initial mount

  return (
    <div className='mt-4 mx-4'>
      <div className='row g-3 '>
        <div className='col-sm px-2'>
          <input
            type='text'
            className='form-control'
            value={newProfessor}
            onChange={(e) => setNewProfessor(e.target.value)}
            placeholder='Prof Name'
            aria-label='Prof'
          />
        </div>
        <div className='col-md px-2'>
          <Select
            isMulti
            options={courses.map((course) => ({ value: course.id, label: course.courseName }))}
            value={selectedCourses}
            onChange={(selectedOptions) => setSelectedCourses(selectedOptions)}
            placeholder='Select Courses'
          />
        </div>
        <div className='col-sm px-4'>
          <input
            type='number'
            className='form-control'
            value={newLoad}
            onChange={(e) => setNewLoad(e.target.value)}
            placeholder='Load'
            min='0'
            aria-label='Load'
          />
        </div>
        <div className='col-sm px-4'>
          <button type='submit' onClick={createProfessor} className='btn btn-primary font-weight-bold '>
            Submit
          </button>
        </div>
      </div>
      <div>
        <table className='table table-hover table-sm mt-4 rounded-circle'>
          <thead className='thead-dark '>
            <tr>
              <th scope='col'>id</th>
              <th scope='col'>Prof Name</th>
              <th scope='col'>Courses</th>
              <th scope='col'>Load</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {professor.map((prof, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{prof.professorName}</td>
                <td>
                  {prof.courses.map((courseRef, index) => {
                    const courseData = courses.find((course) => course.id === courseRef.id);
                    return (
                      <React.Fragment key={index}>
                        {index > 0 && <br />} {/* Create a line break after the first course */}
                        <span>{courseData?.courseName}</span>
                      </React.Fragment>
                    );
                  })}
                </td>
                <td>{prof.Load}</td>
                <td>
                  <button className='btn btn-danger' type='submit' onClick={() => deleteProf(prof.id)}>
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

export default Professor;

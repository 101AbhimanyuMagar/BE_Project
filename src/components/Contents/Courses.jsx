import React, { useEffect, useState } from 'react'
import { db } from '../../../src/firebase.jsx'
import { onSnapshot, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';


const Courses = () => {
  const [newCourse, setNewCourse] = useState("")
  const [newProfessors, setNewProfessor] = useState("")
  const [newCourseCode, setNewCourseCode] = useState("")
  const [courses, setCourse] = useState([]);
  const coursesCollectionRef = collection(db, "Courses")

  const createCourse = async() =>{
      await addDoc(coursesCollectionRef, {courseName: newCourse,courseCode: newCourseCode,professors: newProfessors })
  }

  


  const deleteCourse = async(id)=>{
    const courseDoc = doc(db, "Courses", id)
    await deleteDoc(courseDoc)
  }

  useEffect(() => {
    // Subscribe to real-time updates using onSnapshot
    const unsubscribe = onSnapshot(coursesCollectionRef, (snapshot) => {
      setCourse(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array for initial mount

  return (
    <div className='container mt-4 mx-4'>
      <div className="row g-3">
        <div className="col-sm  px-4">
          <input
            type="text"
            className="form-control"
            onChange={(e) => setNewCourse(e.target.value)}
            placeholder="Course Name"
            aria-label="Course"
          />
        </div>
        <div className="col-sm  px-4">
          <input
            type="text"
            className="form-control"
            onChange={(e) => setNewCourseCode(e.target.value)}
            placeholder="Course Code"
            aria-label="Code"
          />
        </div>
        <div className="col-sm  px-4">
          <input
            type="text"
            className="form-control"
            onChange={(e) => setNewProfessor(e.target.value)}
            placeholder="Professors"
            aria-label="Professors"
          />
        </div>
        <div className="col-sm px-4">
          <button
            type="submit"
            onClick={createCourse}
            className="btn btn-primary font-weight-bold"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover table-sm mt-4 rounded-circle">
          <thead className='thead-dark'>
            <tr>
              <th scope="col">id</th>
              <th scope="col">Course Name</th>
              <th scope="col">Course Code</th>
              <th scope="col">Professors</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{course.courseName}</td>
                <td>{course.courseCode}</td>
                <td>{course.professors}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    type="submit"
                    onClick={() => deleteCourse(course.id)}
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
  
}

export default Courses
import React, { useEffect, useState } from 'react'
import { db } from '../../../src/firebase.jsx'
import { onSnapshot, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Professor = () => {
  const [newProfessor, setNewProfessor] = useState("")
  const [newCourses, setNewCourses] = useState("")
  const [newLoad, setNewLoad] = useState("")
  const [professor, setProfessor] = useState([]);
  const professorsCollectionRef = collection(db, "Professors")

  const createProfessor = async() =>{
      await addDoc(professorsCollectionRef, {professorName: newProfessor,courses: newCourses,Load: newLoad })
  }


  const deleteProf = async(id)=>{
    const professorDoc = doc(db, "Professors", id)
    await deleteDoc(professorDoc)
  }

  useEffect(() => {
    // Subscribe to real-time updates using onSnapshot
    const unsubscribe = onSnapshot(professorsCollectionRef, (snapshot) => {
      setProfessor(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array for initial mount
  return (
    <div className='mt-4 mx-4'>
      <div className="row g-3 ">
        <div className="col-sm px-4">
          <input type="text" className="form-control" onChange={(e)=>(setNewProfessor(e.target.value))} placeholder="Prof Name" aria-label="Prof"/>
        </div>
        <div className="col-sm px-4">
          <input type="text" className="form-control" onChange={(e)=>(setNewCourses(e.target.value))} placeholder="Courses" aria-label="Code" />
        </div>
        <div className="col-sm px-4">
          <input type="number" className="form-control" onChange={(e)=>(setNewLoad(e.target.value))} placeholder="Load" min="0" aria-label="Load" />
        </div>
        <div className="col-sm px-4">
          <button type="submit" onClick={createProfessor} className="btn btn-primary font-weight-bold ">Submit</button>
        </div>
      </div>
      <div>
      <table className="table table-hover table-sm mt-4 rounded-circle">
        <thead className='thead-dark '>
          <tr>
            <th scope="col">id</th>
            <th scope="col">Prof Name</th>
            <th scope="col">Courses</th>
            <th scope="col">Load</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {professor.map((prof, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{prof.professorName}</td>
              <td>{prof.courses}</td>
              <td>{prof.Load}</td>
              <td>
                <button className="btn btn-danger" type="submit" onClick={() => deleteProf(prof.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default Professor
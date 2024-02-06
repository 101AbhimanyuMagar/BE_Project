import React, { useState, useEffect } from 'react';
import { db } from '../../../src/firebase.jsx';
import Select from 'react-select';
import { onSnapshot, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const Years = () => {
  const [selectedYear1, setSelectedYear1] = useState(null);
  const [selectedYear2, setSelectedYear2] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tableData, setTableData] = useState([]);

  const yearsCollectionRef = collection(db, 'Years');
  const coursesCollectionRef = collection(db, 'Courses');

  const semesterOptions = [
    { value: '1st', label: '1st Semester' },
    { value: '2nd', label: '2nd Semester' },
  ];

  useEffect(() => {
    const unsubscribeYears = onSnapshot(yearsCollectionRef, (snapshot) => {
      setYears(snapshot.docs.map((doc) => ({ id: doc.id, yearName: doc.data().yearName })));
    });

    return () => unsubscribeYears();
  }, []);

  useEffect(() => {
    const unsubscribeCourses = onSnapshot(coursesCollectionRef, (snapshot) => {
      setCourses(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribeCourses();
  }, []);

  const handleYearChange1 = (selectedOption) => {
    setSelectedYear1(selectedOption);
  };

  const handleYearChange2 = (selectedOption) => {
    setSelectedYear2(selectedOption);
  };

  const handleSemesterChange = (selectedOption) => {
    setSelectedSemester(selectedOption);
  };

  const handleCourseChange = (selectedOptions) => {
    setSelectedCourses(selectedOptions);
  };

  const createYear = async () => {
    if (!selectedYear1 || !selectedSemester) {
      alert('Please select both year and semester.');
      return;
    }

    const yearRef = doc(db, 'Years', selectedYear1.value);
    const semesterRef = collection(yearRef, 'Semesters');
    const semesterDoc = await addDoc(semesterRef, { semester: selectedSemester.value });
    const courseIds = selectedCourses.map((course) => course.value);

    await updateDoc(semesterDoc, {
      courses: courseIds,
    });

    setSelectedYear1(null);
    setSelectedSemester(null);
    setSelectedCourses([]);
  };

  const viewTableData = async () => {
    if (!selectedYear2) {
      alert('Please select a year.');
      return;
    }
    
    const yearDocRef = doc(db, 'Years', selectedYear2.value);
    const semestersSnapshot = await onSnapshot(collection(yearDocRef, 'Semesters'), (snapshot) => {
      const yearData = snapshot.docs.map((doc) => ({
        id: doc.id,
        semester: doc.data().semester,
        courses: doc.data().courses || [], // Provide a default empty array if courses is undefined
      }));
      setTableData(yearData);
    });
  };
  
  
  

  const deleteSemester = async (semesterId) => {
    try {
      // Delete the semester document from Firestore
      const semesterDocRef = doc(db, 'Years', selectedYear2.value, 'Semesters', semesterId);
      await deleteDoc(semesterDocRef);
  
      // Update the local state to remove the deleted semester
      setTableData(tableData.filter((semester) => semester.id !== semesterId));
    } catch (error) {
      console.error('Error deleting semester:', error);
    }
  };
  

  return (
    <div className='mt-4 mx-4'>
      <div className='row g-3 '>
        <div className='col-sm px-4'>
          <Select
            value={selectedYear1}
            onChange={handleYearChange1}
            options={years.map((year) => ({ value: year.id, label: year.yearName }))}
            placeholder='Select Year 1'
          />
        </div>
        <div className='col-sm px-4'>
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            options={semesterOptions}
            placeholder='Select Semester'
          />
        </div>
        <div className='col-sm px-4'>
          <Select
            isMulti
            value={selectedCourses}
            onChange={handleCourseChange}
            options={courses.map((course) => ({ value: course.id, label: course.courseName }))}
            placeholder='Select Courses'
          />
        </div>
        <div className='col-sm px-4'>
          <button type='submit' onClick={createYear} className='btn btn-primary font-weight-bold '>
            Submit
          </button>
        </div>
      </div>

      <div className='row g-3 m-4'>
        <div className='col-sm px-4'>
          <Select
            value={selectedYear2}
            onChange={handleYearChange2}
            options={years.map((year) => ({ value: year.id, label: year.yearName }))}
            placeholder='Select Year 2'
          />
        </div>
        <div className='col-sm px-4'>
          <button type='submit' onClick={viewTableData} className='btn btn-primary font-weight-bold '>
            View Table
          </button>
        </div>
      </div>

      {tableData && tableData.length > 0 && (
  <div className='mt-4'>
    <table className='table table-hover table-sm mt-4 rounded-circle'>
      <thead className='thead-dark '>
        <tr>
          <th scope='col'>Semester</th>
          <th scope='col'>Courses</th>
          <th scope='col'>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((semester) => (
          <tr key={semester.id}>
            <td>{semester.semester}</td>
            <td>
              {semester.courses.map((courseId) => {
                const course = courses.find((c) => c.id === courseId);
                return <div key={courseId}>{course ? course.courseName : 'Unknown Course'}</div>;
              })}
            </td>
            <td>
              <button
                className='btn btn-danger'
                onClick={() => deleteSemester(semester.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default Years;

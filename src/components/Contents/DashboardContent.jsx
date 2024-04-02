import React, { useState, useEffect } from "react";
import Select from "react-select";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.jsx";
import GeneticAlgo from "./GeneticAlgo"; // Import the GeneticAlgo module

const DashboardContent = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [showTimetable, setShowTimetable] = useState(false);

  useEffect(() => {
    // Fetch years data from Firestore
    const fetchYears = async () => {
      try {
        const yearsCollectionRef = collection(db, "Years");
        const yearsSnapshot = await getDocs(yearsCollectionRef);
        const yearsData = yearsSnapshot.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().yearName,
        }));
        setYears(yearsData);
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  }, []);

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption);
  };

  const generateTimetable = async () => {
    if (!selectedYear) {
      alert("Please select a year.");
      return;
    }

    try {
      const generatedTimetables = await GeneticAlgo.generateTimetables(); // Generate timetables using the Genetic Algorithm
      setTimetables(generatedTimetables);
      setShowTimetable(true);
      alert("Timetables generated successfully!");
    } catch (error) {
      console.error("Error generating timetables:", error);
      // alert('An error occurred while generating the timetables. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Weekly Timetable</h1>
      <div className="row g-3 justify-content-center">
        <div className="col-sm px-4">
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            options={years}
            placeholder="Select Year"
          />
        </div>
        <div className="col-sm px-4">
          <button
            type="submit"
            onClick={generateTimetable}
            className="btn btn-primary btn-lg"
          >
            Generate Timetables
          </button>
        </div>
      </div>
      {showTimetable && (
        <div className="mt-4">
          <h4>Generated Timetables</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Timetable</th>
              </tr>
            </thead>
            <tbody>
              {timetables.map(({ id, timetable }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Time Period</th>
                          <th>Monday</th>
                          <th>Tuesday</th>
                          <th>Wednesday</th>
                          <th>Thursday</th>
                          <th>Friday</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(timetable).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>
                                {typeof cell === "object" ? (
                                  <React.Fragment>
                                    <div>{cell.courseName}</div>
                                    <div>{cell.professorName}</div>
                                    <div>{cell.roomName}</div>
                                  </React.Fragment>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default DashboardContent;

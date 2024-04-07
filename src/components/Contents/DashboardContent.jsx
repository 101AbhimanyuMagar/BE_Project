import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.jsx";
import { GeneticAlgo, timetableComponent } from "./GeneticAlgo";

var semlist = [
  '2nd year Sem I',
  '2nd year Sem II',
  '3rd year Sem I',
  '3rd year Sem II',
  '4th year Sem I',
  '4th year Sem II',
];

const DashboardContent = () => {
  const [timetables, setTimetables] = useState([]);
  const [showTimetable, setShowTimetable] = useState(false);
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    // Fetch periods data from Firestore
    const fetchPeriods = async () => {
      try {
        const periodsCollectionRef = collection(db, "Periods");
        const periodsSnapshot = await getDocs(periodsCollectionRef);
        const periodsData = periodsSnapshot.docs.map((doc) => doc.data());
        setPeriods(periodsData);
      } catch (error) {
        console.error("Error fetching periods:", error);
      }
    };

    fetchPeriods();
  }, []);

  const convertTo2DArray = (flatTimetable) => {
    const slotsPerDay = 6;
    return Array.from({ length: 5 }, (_, dayIndex) =>
      flatTimetable.slice(dayIndex * slotsPerDay, (dayIndex + 1) * slotsPerDay)
    );
  };

  const generateTimetable = async () => {
    try {
      const generatedTimetables = await GeneticAlgo.generateTimetables(); // Generate timetables using the Genetic Algorithm
      setTimetables(generatedTimetables);
      setShowTimetable(true);
      alert("Timetables generated successfully!");
    } catch (error) {
      console.error("Error generating timetables:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center text-white">Weekly Timetable</h2>
      <div className="row justify-content-center pt-2">
        <div className="col-sm-6 text-center">
          <button
            type="submit"
            onClick={generateTimetable}
            className="btn btn-primary btn-lg "
          >
            Generate Timetables
          </button>
        </div>
      </div>
      {showTimetable && (
        <div className="">
          <h4 className="text-success">Generated Timetables</h4>
          {timetableComponent.map((timetable, timetableIndex) => {
            const timetable2D = convertTo2DArray(timetable);
            // Sort periods by lecture sequence
            const sortedPeriods = [...periods].sort((a, b) => a.lectureSequence - b.lectureSequence);
            return (
              <div key={timetableIndex}>
                <h5 className="text-white">Timetable for {semlist[timetableIndex]}</h5>
                <table className="table table-hover table-sm mt-4 rounded-circle table-bordered">
                  <thead className="thead-dark ">
                    <tr>
                      <th>Lecture / Day</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPeriods.map((period, slotIndex) => (
                      <tr key={slotIndex}>
                        <th>{period.startTime} - {period.endTime}</th>
                        {Array.from({ length: 5 }).map((_, dayIndex) => (
                          <td key={dayIndex}>
                            {/* Adjust this to fetch the correct slot data for the day */}
                            {Object.entries(timetable2D[dayIndex][slotIndex] || {}).map(([subjectName, professorName]) => (
                              <React.Fragment key={subjectName}>
                                <div>{subjectName}</div>
                                <div>{professorName}</div>
                              </React.Fragment>
                            ))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardContent;

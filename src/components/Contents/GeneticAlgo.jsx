import { db } from "../../firebase.jsx";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Genetic from "genetic-js";

const GeneticAlgo = {
  generateTimetables: async () => {
    try {
      // Retrieve data from Firestore collections
      const coursesSnapshot = await getDocs(collection(db, "Courses"));
      const professorsSnapshot = await getDocs(collection(db, "Professors"));
      const roomsSnapshot = await getDocs(collection(db, "Rooms"));

      const courses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const professors = professorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const rooms = roomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(typeof courses)
      const generatedTimetables = [];

      // No need to iterate over years and semesters here
      
    
      const timetable = generateWeeklyScheduleTemplate(courses, professors, rooms);
      
      
      const fitRate = fitnessFunction(timetable); // Calculate initial fitness
      

      // Genetic Algorithm configuration
      const genetic = Genetic.create();
      genetic.optimize = Genetic.Optimize.Maximize;
      genetic.select1 = selection(timetable);
      genetic.select2 = selection(timetable);
      genetic.generate = generateInitialPopulation(timetable, courses, professors, rooms);
      genetic.fitness = fitnessFunction;

      const config = {
        iterations: 10,
        crossover: 0.8,
        mutation: 0.1,
        skip: 10,
      };

      const result = genetic.evolve(config);

      if (!result) {
        throw new Error("Genetic algorithm did not return a valid result.");
      }

      const formattedResult = result.map((timetable, index) => ({
        id: index, // Add an ID for each timetable
        timetable: JSON.stringify(timetable), // Convert timetable to a string
      }));

      // Store the generated timetable back into Firestore (optional)
      await GeneticAlgo.storeGeneratedTimetables(formattedResult);

      return formattedResult;
    } catch (error) {
      console.error("Error generating timetables:", error);
      throw error;
    }
  },

  async storeGeneratedTimetables(formattedResult) {
    try {
      const timetablesRef = collection(db, "Timetables");
      for (const timetable of formattedResult) {
        await addDoc(timetablesRef, timetable);
      }
      console.log("Timetables successfully stored in Firestore!");
    } catch (error) {
      console.error("Error storing timetables:", error);
    }
  },
};

function generateWeeklyScheduleTemplate(courses, professors, rooms) {
  const startTime = "09:15"; // Adjust start time as needed
  const endTime = "17:30"; // Adjust end time as needed
  const interval = 1; // Interval in hours (30 minutes)

  const timePeriods = [];
  let currentTime = startTime;
  while (currentTime < endTime) {
    timePeriods.push(currentTime);
    currentTime = (parseFloat(currentTime) + interval).toFixed(2);
  }

  const timetable = [];
  timetable.push(["Time Period", "Mon", "Tue", "Wed", "Thu", "Fri"]);

  timePeriods.forEach((timePeriod) => {
    const row = [timePeriod];
    for (let i = 0; i < 5; i++) {
      // Add empty slots for each day (courseName, professorName, roomName)
      row.push({ courseName: "", professorName: "", roomName: "" });
    }
    timetable.push(row);
  });

  return timetable;
}

// Selection function
const selection = (timetable) => {
  const selected = [];
  for (let i = 0; i < 10; i++) {
    selected.push(randomTimetable(timetable)); // Select based on fitness
  }
  return selected;
};

// Function to randomly select a valid timetable based on fitness
// ... previous code

// Function to randomly select a valid timetable based on fitness
function randomTimetable(timetable) {
  const fitnessScores = timetable.map(fitnessFunction); // Calculate fitness for each timetable
  const totalFitness = fitnessScores.reduce((sum, score) => sum + score, 0);

  // Weighted random selection based on fitness
  let randomValue = Math.random() * totalFitness;
  let selectedIndex = 0;
  while (randomValue > 0) {
    randomValue -= fitnessScores[selectedIndex];
    selectedIndex++;
  }

  return timetable[selectedIndex - 1]; // Account for 0-based indexing
}

// Generate function (creates initial population)
const generateInitialPopulation = (timetable, courses, professors, rooms) => {
  const population = [];
  for (let i = 0; i < 10; i++) {
    const newTimetable = [...timetable]; // Create a copy of the template

    // Assign courses, professors, and rooms with constraints and limited attempts
    for (let dayIndex = 0; dayIndex < newTimetable.length; dayIndex++) {
      for (let periodIndex = 0; periodIndex < newTimetable[dayIndex].length - 1; periodIndex++) {
        let validAssignment = false;
        let attempts = 0;
        const maxAttempts = 10; // Adjust as needed

        while (!validAssignment && attempts < maxAttempts) {
          const randomCourse = courses[Math.floor(Math.random() * courses.length)];
          let randomProfessor = professors.find((professor) => professor.courses.includes(randomCourse.id));

          if (!randomProfessor) {
            console.warn("No professor found qualified for", randomCourse.courseName);
            randomProfessor = professors[Math.floor(Math.random() * professors.length)]; // Assign a random professor as fallback
          }

          const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];

          // Check for conflicts before assigning
          const isProfessorAvailable = !newTimetable.some(
            (day) => day[periodIndex + 1].professorName === randomProfessor.professorName
          );
          const isRoomAvailable = !newTimetable.some(
            (day) => day[periodIndex + 1].roomNumber === randomRoom.number
          );

          if (randomProfessor && randomRoom && isProfessorAvailable && isRoomAvailable) {
            newTimetable[dayIndex][periodIndex + 1].courseName = randomCourse.courseName;
            newTimetable[dayIndex][periodIndex + 1].professorName = randomProfessor.professorName;
            newTimetable[dayIndex][periodIndex + 1].roomName = randomRoom.roomName;
            validAssignment = true;
          }

          attempts++;
        }

        if (!validAssignment) {
          console.warn("Failed to find valid assignment after", maxAttempts, "attempts for slot:", dayIndex + 1, ",", periodIndex + 1);
          // Handle the case where a valid assignment couldn't be found (e.g., skip the slot or assign a placeholder)
        }
      }
    }

    population.push(newTimetable);
  }

  return population;
};

const fitnessFunction = (timetable) => {
  let fitness = 0;

  // Track professor and room usage
  const professorRooms = new Map();
  const roomPeriods = new Map();

  // Iterate through each day in the timetable
  timetable.forEach((day) => {
    if (!Array.isArray(day)) {
      console.error("Invalid timetable structure. Day should be an array.");
      return; // Skip this day if it's not an array
    }

    day.forEach((slot, periodIndex) => {
      const { professorName, roomNumber } = slot;

      // Check if the slot is empty or not
      if (professorName && roomNumber) {
        // Check for professor conflicts
        if (
          professorRooms.has(professorName) &&
          professorRooms.get(professorName).some((usedPeriod) => usedPeriod !== periodIndex)
        ) {
          fitness -= 2; // Higher penalty for professor conflicts
        } else {
          professorRooms.set(professorName, [...(professorRooms.get(professorName) || []), periodIndex]);
        }

        // Check for room conflicts
        if (
          roomPeriods.has(roomNumber) &&
          roomPeriods.get(roomNumber).includes(periodIndex)
        ) {
          fitness -= 1;
        } else {
          roomPeriods.set(roomNumber, [...(roomPeriods.get(roomNumber) || []), periodIndex]);
        }
      }
    });
  });

  return fitness;
};


export default GeneticAlgo;

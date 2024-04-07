import { db } from "../../firebase.jsx";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Genetic from "genetic-js";


const DAYS=5
const LECTURES_PER_DAY=6
let courseList=[]

var timetableComponent=[]

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

      var courseToProfessor={}

        for (const prof of professors) {
          for (const course of prof.courses) {
            var id =course.id;

            const matchingCourse = courses.find(ccourse => ccourse.id === id);
            if (matchingCourse && matchingCourse.courseCode) {
              courseToProfessor[matchingCourse.courseCode] = prof.professorName;
            }

          }
        }


        generate(courses,2,7,courseToProfessor)

        courseList=[]
        generate(courses,2,6,courseToProfessor)

        courseList=[]
        generate(courses,3,7,courseToProfessor)
        courseList=[]


        generate(courses,3,6,courseToProfessor)
        courseList=[]
        generate(courses,4,7,courseToProfessor)
        courseList=[]
        generate(courses,4,6,courseToProfessor)
        courseList=[]


      const rooms = roomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

  }catch(e){
    console.log("Failed to fetch data")
  }
}
}

function generate(courses,selectedYear,sem,courseToProfessor){
  for(let course of courses){
    if(course.courseCode.charAt(0)==selectedYear  && course.courseCode.charAt(2)==sem){
      courseList.push(course)
    }
  }

  // Example usage
  try{
  const populationSize = 100;
  const generations = 1000;
  const bestTimetable = geneticAlgorithm(populationSize, generations,courseList);

  const timeTableWithProfName=[]

  for(var subject of bestTimetable){
    timeTableWithProfName.push({
      [subject.courseName] : courseToProfessor[subject.courseCode]
    })
  }

  timetableComponent.push(timeTableWithProfName)

  }catch(e){
    console.log(e)
  }
}
// Function to generate a random timetable based on the courseList
function generateRandomTimetable(courseList) {
  let timetable = [];
  for (let day = 0; day < DAYS; day++) {
      let dayCourses = [];
      let shuffledCourses = courseList.sort(() => 0.5 - Math.random());
      for (let lecture = 0; lecture < LECTURES_PER_DAY; lecture++) {
          dayCourses.push(shuffledCourses[lecture % shuffledCourses.length]);
      }
      timetable = timetable.concat(dayCourses);
  }
  return timetable;
}



function initializePopulation(populationSize, courseList) {
  let population = [];
  for (let i = 0; i < populationSize; i++) {
      population.push(generateRandomTimetable(courseList));
  }
  return population;
}


// Fitness Function: Simplified to count the number of unique courses per day.
function evaluateFitness(timetable) {
  let fitness = 0;
  for (let i = 0; i < timetable.length; i += LECTURES_PER_DAY) {
      const dayCourses = timetable.slice(i, i + LECTURES_PER_DAY);
      const uniqueCourses = new Set(dayCourses).size;
      fitness += uniqueCourses;
  }
  return fitness;
}

// Selection Function: Select two timetables based on their fitness.
function selectTwo(population) {
  // Simplified selection: randomly select but favor higher fitness
  population.sort((a, b) => evaluateFitness(b) - evaluateFitness(a));
  return [population[0], population[1]]; // This is a simplification
}

// Crossover Function: Combine two timetables into a new one.
function crossover(parent1, parent2) {
  let child = [];
  // Simple one-point crossover
  const crossoverPoint = Math.floor(Math.random() * parent1.length);
  child = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
  return child;
}

// Mutation Function: Randomly change a course in the timetable.
function mutate(timetable) {
  let mutatedTimetable = [...timetable];
  const mutationPoint = Math.floor(Math.random() * mutatedTimetable.length);
  mutatedTimetable[mutationPoint] = courseList[Math.floor(Math.random() * courseList.length)];
  return mutatedTimetable;
}

// Main Genetic Algorithm Loop
function geneticAlgorithm(populationSize, generations,courseList) {
  let population = initializePopulation(populationSize, courseList);

  for (let generation = 0; generation < generations; generation++) {
      let newPopulation = [];

      while (newPopulation.length < populationSize) {
          const [parent1, parent2] = selectTwo(population);
          let child = crossover(parent1, parent2);
          child = mutate(child);
          newPopulation.push(child);
      }

      population = newPopulation;

      // Evaluate the fitness of the new population and find the best
      const bestTimetable = population.reduce((prev, current) => {
          return (evaluateFitness(prev) > evaluateFitness(current)) ? prev : current;
      });

      var SOME_FITNESS_THRESHOLD = 20
      // Simplified termination check: arbitrary fitness threshold
      if (evaluateFitness(bestTimetable) >= SOME_FITNESS_THRESHOLD) {
          console.log('Satisfactory timetable found at generation ' + generation);
          return bestTimetable;
      }
  }

  // Returning the best found if no satisfactory solution is found within the given generations
  return population.reduce((prev, current) => {
      return (evaluateFitness(prev) > evaluateFitness(current)) ? prev : current;
  });
}




export {GeneticAlgo,timetableComponent};

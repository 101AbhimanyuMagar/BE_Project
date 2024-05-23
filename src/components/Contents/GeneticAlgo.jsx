
const DAYS=5
const LECTURES_PER_DAY=6
let courseList=[]

var timetableComponent=[]
var courseToProfessor={}
var courseToProfessorDiv2={}
const GeneticAlgo = {
  generateTimetables: async (CourseSnapshot,ProfessorsSnapshot,RoomsSnapshot,semester) => {
    try {
      // Retrieve data from Firestore collections
      const coursesSnapshot = CourseSnapshot;
      const professorsSnapshot = ProfessorsSnapshot;
      const roomsSnapshot = RoomsSnapshot;

      const courses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const professors = professorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

        for (const prof of professors) {
          for (const course of prof.courses) {
            var id =course.id;

            const matchingCourse = courses.find(ccourse => ccourse.id === id);
            if (matchingCourse && matchingCourse.courseCode) {
              courseToProfessor[matchingCourse.courseCode] = prof.professorName;
            }

           // Find all matching courses
           const matchingCourses = courses.filter(ccourse => ccourse.id === id);

           // Assign the last matching professor to courseToProfessorDiv2
           matchingCourses.forEach(matchingCourse => {
             if (matchingCourse.courseCode) {
               courseToProfessorDiv2[matchingCourse.courseCode] = prof.professorName;
             }
           });
          }
        }



        generate(courses,2,semester,courseToProfessor)

        courseList=[]

        generate(courses,3,semester,courseToProfessor)
        courseList=[]

        generate(courses,4,semester,courseToProfessor)
        courseList=[]


        return timetableComponent;

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
  const generations = 1000000;
  let bestTimetable = geneticAlgorithm(populationSize, generations,courseList);
  let bestTimetableDiv2=geneticAlgorithm(populationSize, generations,courseList);
  // let bestTimetableDiv2=geneticAlgorithm(populationSize, generations,courseList)



  while(!checkConditions(bestTimetable)){
    bestTimetable=geneticAlgorithm(populationSize, generations,courseList)
  }

  // while(!checkConditions(bestTimetableDiv2)){
  //   bestTimetableDiv2=geneticAlgorithm(populationSize, generations,courseList)
  // }

  // while(checkLabLec(bestTimetable,bestTimetableDiv2)){
  //   bestTimetable= geneticAlgorithm(populationSize, generations,courseList)
  //   bestTimetableDiv2 =geneticAlgorithm(populationSize, generations,courseList)
  // }
  const timeTableWithProfName=[]
  const timeTableWithProfNameDiv2=[]


  for(var subject of bestTimetable){


    if(subject.courseName.includes("EMPTY")){
      subject.courseName="";
    }
    if(subject.courseName.includes("STP-LAB")){
      subject.courseName="STP-1";
    }
    timeTableWithProfName.push({
      [subject.courseName] : courseToProfessor[subject.courseCode]
    });
}

  for(var subject of bestTimetableDiv2){
    if(subject.courseName.includes("STP-LAB")){
      subject.courseName="STP-1";
    }
      timeTableWithProfNameDiv2.push({
        [subject.courseName] : courseToProfessorDiv2[subject.courseCode]
      });
  }

  timetableComponent.push(timeTableWithProfName)
  timetableComponent.push(timeTableWithProfNameDiv2)


  }catch(e){
    console.log(e)
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}
function generateDivision2Timetable(division1Timetable) {
  let division2Timetable = new Array(division1Timetable.length);
  let labs = [];
  let lectures = [];

  lectures=lectures.sort(() => 0.5 - Math.random())

  // First pass to categorize labs and lectures
  for (let i = 0; i < division1Timetable.length; i++) {
      const course = division1Timetable[i];
      if(course.courseName.includes("EMPTY")){
        course.courseName="";
      }
      if (course.courseName.includes("LAB")) {
          labs.push(course);
      } else {
          lectures.push(course);
      }
  }

  lectures=lectures.sort(() => 0.5 - Math.random());
  // Second pass to assign labs and lectures inversely
  for (let i = 0; i < division1Timetable.length; i++) {
      const course = division1Timetable[i];
      if (course.courseName.includes("LAB")) {
          // If the original is a lab, place a lecture here
          if (lectures.length > 0) {
              division2Timetable[i] = lectures.shift(); // Take the first available lecture
          } else {
              division2Timetable[i] = course; // Fallback to the same lab if no lectures are left
          }
      } else {
          // If the original is a lecture, place a lab here
          if (labs.length > 0) {
              division2Timetable[i] = labs.shift(); // Take the first available lab
          } else {
              division2Timetable[i] = course; // Fallback to the same lecture if no labs are left
          }
      }
  }

  return division2Timetable;
}



function checkConditions(timetable){
    var isValid = true;
    var errors = [];

    timetable.forEach((day, dayIndex) => {
      if (day.courseName.includes("LAB") && dayIndex%2 ==0) {
          if (timetable[dayIndex].courseName != timetable[dayIndex+1].courseName) {
              isValid = false;
              return isValid;
          }
      }
    });
    return isValid
}
// Function to generate a random timetable based on the courseList
function generateRandomTimetable(courseList) {
  let timetable = [];
  for (let day = 0; day < DAYS; day++) {
    let dayCourses = [];
    let shuffledCourses = courseList.sort(() => 0.5 - Math.random());
    
    for (let lecture = 0; lecture < LECTURES_PER_DAY; lecture++) {
        // Check if the course is a lab and there's enough space in the day for two slots
        if (lecture % 2==0 & shuffledCourses[lecture % shuffledCourses.length].courseName.includes("LAB") && lecture < LECTURES_PER_DAY - 1) {
            dayCourses.push(shuffledCourses[lecture % shuffledCourses.length]);
            dayCourses.push(shuffledCourses[lecture % shuffledCourses.length]); // Add the lab again for the consecutive slot
            lecture++; // Increment lecture to account for the second slot used by the lab
        } else {

          var random=Math.floor(Math.random() * (courseList.length))

          while(shuffledCourses[random].courseName.includes("LAB")){
            random=Math.floor(Math.random() * (courseList.length))
          }
          dayCourses.push(shuffledCourses[random]);
        }
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
    let labCounts = {};
    let lecCounts={};
    let professorSchedule = {};



    for (const previousTimetable of timetableComponent) {
      for (const [index, entry] of previousTimetable.entries()) {
          const courseName = Object.keys(entry)[0];
          const professorName = entry[courseName];
          const day = Math.floor(index / LECTURES_PER_DAY);
          const lectureTime = index % LECTURES_PER_DAY;

          if (!professorSchedule[professorName]) {
              professorSchedule[professorName] = Array(DAYS).fill().map(() => Array(LECTURES_PER_DAY).fill(false));
          }
          professorSchedule[professorName][day][lectureTime] = true;
      }
  }


    //if timetable is for second year sem 1 ldco count is 3 fitness ++
    // if timetable is for second year sem  1 dm count is 4 fitness ++
    //if time table is second year sem 1 bcn count is 3 fitness ++
    //if timetable is second year 
    for (let i = 0; i < timetable.length; i += LECTURES_PER_DAY) {
        const dayCourses = timetable.slice(i, i + LECTURES_PER_DAY);
        const uniqueCourses = new Set(dayCourses.map(course => course.courseCode)).size;
        fitness += uniqueCourses * 2;
        let labCount=0;
        for (let j = 0; j < dayCourses.length; j++) {
            const course = dayCourses[j];

            // Check for professor schedule conflicts
            const professorName = courseToProfessor[course.courseCode];
            if (professorSchedule[professorName] && professorSchedule[professorName][i / LECTURES_PER_DAY][j % LECTURES_PER_DAY]) {
                fitness -= 15; // Penalize for scheduling conflict
            }
            if (course.courseName.includes("LAB")) {
              labCount++;
                if (!labCounts[course.courseCode]) {
                    labCounts[course.courseCode] = 0;
                }
                labCounts[course.courseCode]++;
                // Check for consecutive placement of the same lab
                if (j < dayCourses.length - 1 && course.courseCode === dayCourses[j + 1].courseCode) {
                    fitness+=2; // Increase fitness for correctly placed consecutive labs
                }
            }else{
              if (!lecCounts[course.courseCode]) {
                lecCounts[course.courseCode] = 0;
            }
            lecCounts[course.courseCode]++;
            }

            const professor = courseToProfessor[course.courseCode];

            if (!professorSchedule[professor]) {
              professorSchedule[professor] = new Array(DAYS * LECTURES_PER_DAY).fill(false);
            }
      
            // Check for double-booking
            if (professorSchedule[professor][i + j]) {
              fitness -= 10; // Penalize heavily for double-booking
            } else {
              professorSchedule[professor][i + j] = true;
            }
        }
        if(labCount==6){
          fitness-=6;
        }
    }

    // Check for labs that exactly occupy 4 slots in total
    Object.keys(labCounts).forEach(labCode => {
        if (labCounts[labCode] === 4) {
            fitness += 5;  // Increase fitness significantly for labs that are used exactly 4 times
        }
    });

    Object.keys(lecCounts).forEach(code => {
      if (lecCounts[code] === 3) {
          fitness += 5;  // Increase fitness significantly for labs that are used exactly 4 times
      }
  });

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

          return bestTimetable;
      }
  }

  // Returning the best found if no satisfactory solution is found within the given generations
  return population.reduce((prev, current) => {
      return (evaluateFitness(prev) > evaluateFitness(current)) ? prev : current;
  });
}




export {GeneticAlgo,timetableComponent};

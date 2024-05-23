import { GeneticAlgo } from './GeneticAlgo.jsx'; 
import { db } from "../../firebase.jsx";
import { collection, getDocs, addDoc } from "firebase/firestore";
self.onmessage = async (e) => {
    const coursesSnapshot = await getDocs(collection(db, "Courses"));
      const professorsSnapshot = await getDocs(collection(db, "Professors"));
      const roomsSnapshot = await getDocs(collection(db, "Rooms"));
    let result = await GeneticAlgo.generateTimetables(coursesSnapshot,professorsSnapshot,roomsSnapshot,6);
    
    // while(checkMatchingValues(result)){
    //     result=await GeneticAlgo.generateTimetables();
    // }
    postMessage(result);
};

function checkMatchingValues(arrays) {
    // Assume each sub-array at the same index across the arrays is of the same length
    if (arrays.length < 2) return false; // Less than two arrays, no comparison needed

    // Determine the length of inner arrays (assuming all inner arrays are the same length)
    const innerLength = arrays[0].length;

    // Iterate over each index of the inner arrays
    for (let index = 0; index < innerLength; index++) {
        // Use a Set to track seen values for this particular index across all arrays
        let seenValues = new Set();

        // Check each of the main arrays for this index
        for (let arrIndex = 0; arrIndex < arrays.length; arrIndex++) {
            const value = arrays[arrIndex][index];

            const name = value[Object.keys(value)[0]];
            // If the value has already been seen, return true
            if (seenValues.has(name)) {
                return true;
            }

            // Otherwise, add this value to the set of seen values
            seenValues.add(name);
        }
    }

    // If no match was found across any index, return false
    return false;
}

self.onerror = function(e) {
    postMessage({ error: `Worker error: Line ${e}` });
};
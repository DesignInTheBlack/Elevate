import { elevateCompiler } from './elevate/parser';
import findClassAttributes from './elevate/scan';
import { breakpoints, BreakpointToken } from './elevate/design/breakpoints';



//Scan Files and Retrieve Class Lists.
const scannedClasses = findClassAttributes('./', ['html']);

//Define Compiled Classes Type Interface - Need to Specify In Future
let compiledClasses: any[] = [];

//Breakpoint Sorting Function
function getBreakpointPriority(breakpoint: string): number {
  // Remove the slashes from the breakpoint string (e.g., "/sm/" -> "sm")
  const clean = breakpoint.replace(/\//g, '') as BreakpointToken;
  
  // Get the index from the breakpoints object
  return Object.keys(breakpoints).indexOf(clean);
}


function structureClasses(instance) {
  let lastBreak = '';
  let classList = instance.classes;

  classList.forEach(function(classString) {
    const regex = /\/[a-zA-Z]+\//;
    //Mobile First Breakpoint Processing
    if (regex.test(classString)) {
      lastBreak=classString
      return
    }
    
    let classObject = elevateCompiler(classString)
    classObject.breakpoint = lastBreak;
    compiledClasses.push(classObject)
  })
}

scannedClasses.map(structureClasses)

//Apply the Breakpoint Sorting Function to the Compiled Classes
compiledClasses.sort((a, b) => {
  // Handle empty breakpoints (put them first)
  if (!a.breakpoint) return -1;
  if (!b.breakpoint) return 1;
  
  return getBreakpointPriority(a.breakpoint) - getBreakpointPriority(b.breakpoint);
});

console.log(compiledClasses)



  
// let x = elevateCompiler('text:purple:small');
// console.log(x);
// console.log("Compiled Class:" + '\n' + compileToCSS(x));


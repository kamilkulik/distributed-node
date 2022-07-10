const sleep_st = (t) => new Promise((r) => setTimeout(r, t));
const sleep_im = () => new Promise((r) => setImmediate(r)); 

// PHASES:
// POLL - IO operations
// CHECK - setImmediate
// CLOSE - Event Emitter close events
// TIMERS - callbacks scheduled using setTimeout() setInterval()
// PENDING - special system events

// MICROTASK QUEUEs
// process.nextTick()
// Promises that reject or resolve

// AFTER 1. POLL is done, nextTick() and then promises microtask queue runs
// AFTER 1. pre-CHECK promises microtask queue is emptied, CHECK phase runs

// (async () => {
//     setImmediate(() => console.log(1)); // 1. callback added to the CHECK queue 1. PRINTS 1
//     console.log(2); // 1. PRINTS 2 immediately
//     await sleep_st(0); // 1. add RESOLVED promise callback to Promises microtask queue 1. Callback added to TIMERS phase
//     setImmediate(() => console.log(3)); // 1. callback added to CHECK phase, PRINTS 3
//     console.log(4); // 1. PRINTS 4 immediately
//     await sleep_im(); // 1. add RESOLVED promise callback to Promises microtask queue 1. Callback added to CHECK phase 1. No callback
//     setImmediate(() => console.log(5)); // 1. callback added to CHECK phase, 1. CHECK PRINTS 5
//     console.log(6); // 1. PRINTS 6 immediately
//     await 1; // 1. resolved PROMISE, no callback
//     setImmediate(() => console.log(7)); // 1. callback added to CHECK phase, 1. CHECK PRINTS 7
//     console.log(8); // 1. PRINTS 8 immediately
// })();

// ORDER: 2, 4, 6, 8, 1, 3, 5, 7
// CORRECT: 2, 4, 1, 3, 6, 8, 5, 7


// 1. CYCLE: 

// POLL: setImmediate add callback to CHECK PHASE, execute console.log(2) immediately, add Promise to promise microtask queue
// nextTick() microtask queue: empty
// PROMISE mircotask queue: Promise resolves, setTimeout() is added to the TIMERS phase
// CHECK: console.log(1)
// CLOSE            
// TIMERS setTimeout from sleep_st
// PENDING

// 2. CYCLE: 

// POLL: 
// nextTick() microtask queue: empty
// PROMISE mircotask queue: 
// CHECK: console.log(3)
// CLOSE            
// TIMERS 
// PENDING

const noSugar = () => {
    setImmediate(() => console.log(1)); // 1. callback added to the CHECK queue 1. PRINTS 1
    console.log(2); // 1. PRINTS 2 immediately
    Promise.resolve().then(() => setTimeout(() => {
        setImmediate(() => console.log(3));
        console.log(4);
        Promise.resolve().then(() => setImmediate(() => {
            setImmediate(() => console.log(5));
            console.log(6);
            Promise.resolve().then(() => {
                setImmediate(() => console.log(7));
                console.log(8);
            })
        }))
    }))
}

// order: 2, 1, 4, 3, 6, 8, 5, 7
// order: 2, 4, 1, 3, 6, 8, 5, 7

noSugar();
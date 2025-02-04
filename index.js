//PROB 1 HELLO WORLD

// function upperCaser(input) {
//     // SOLUTION GOES HERE

//     return input.toUpperCase();
//   }

//   module.exports = upperCaser


  // prob 2
  
  // function repeat(operation, num) {
  //   // SOLUTION GOES HERE
  //   for(let i=0;i<num;i++)
  //   {
  //     operation();
  //   }
  // }

  // // Do not remove the line below
  // module.exports = repeat

  // prob 3 
  
  // function doubleAll(numbers) {
  //   // SOLUTION GOES HERE
  //   return numbers.map((num => num*2))
  // }

  // module.exports = doubleAll

//prob 4

// function getShortMessages(messages) {
//   // SOLUTION GOES HERE
//    return messages.filter((msg) => msg.message.length < 50)
//    .map((msg)=>msg.message);
// }

// module.exports = getShortMessages

//prob 5

function checkUsersValid(goodUsers) {
   // SOLUTION GOES HERE
  return function allUsersValid(submittedUsers) {
    return submittedUsers.every(submittedUser =>
      goodUsers.some(goodUser => goodUser.id === submittedUser.id)
    );
  };
}

module.exports = checkUsersValid

// prob 6

function countWords(inputWords) {
  return inputWords.reduce((wordCount, word) => {
    if (wordCount[word]) {
      wordCount[word] += 1; // Increment the count if the word already exists
    } else {
      wordCount[word] = 1; // Initialize the count to 1 if the word doesn't exist
    }
    return wordCount;
  }, {});
}

module.exports = countWords


// function loadUsers(userIds, load, done) {
//   const users = [];
//   let completed = 0;

//   userIds.forEach((userId, index) => {
//     load(userId, (user) => {
//       users[index] = user; // Ensure the users are stored in the correct order
//       completed++;

//       if (completed === userIds.length) {
//         done(users); // Call the `done` callback when all users are loaded
//       }
//     });
//   });
// }

// module.exports = loadUsers;

// prob 7

function reduce(arr, fn, initial) {
  // SOLUTION GOES HERE
  if(arr.length==0)
  {
    return initial;
  }else{
    const [head ,...tail] = arr;
    const fn2= fn(initial,head,arr.length-tail.length,arr);
    return reduce(tail,fn,fn2);
  }
}

module.exports = reduce

// prob 8
function duckCount(...args) {
  if (args.length === 0) return 0; 
  
  
  const isObject = args[0] && typeof args[0] === 'object';

  // Check if the object has the property 'quack'
  const hasQuack = isObject && Object.prototype.hasOwnProperty.call(args[0], 'quack') ? 1 : 0;
  return hasQuack + duckCount(...args.slice(1));
}

module.exports = duckCount;

// prob 9

function logger(namespace) {
  return function (...args) {
    // Use template literals and spread syntax to handle arguments easily
    console.log(namespace, ...args);
  };
}

module.exports = logger;

// prob 10
module.exports = function (namespace) {
  // Use Function#bind to create a partially applied function
  return console.log.bind(console, namespace);
};

//prob 11

module.exports = function arrayMap(arr, fn) {
  return arr.reduce((result, item) => {
    result.push(fn(item)); // Apply the function to each item and add it to the result array
    return result;
  }, []); 
};

// prob 12
function Spy(target, method) {
  const spy = { count: 0 };
  const originalMethod = target[method];

  target[method] = function(...args) {
    spy.count++; // Increment count every time the method is called
    return originalMethod.apply(this, args); // Call the original method with correct context and arguments
  };

  return spy;
}

module.exports = Spy;

// prob 13
function repeat(operation, num) {
  if (num <= 0) return;

  operation();
  setImmediate(() => repeat(operation, num - 1)); // Use setImmediate to yield control
}

module.exports = repeat;

// prob 14

function repeat(operation, num) {
  if (num <= 0) return; //
  return () => repeat(operation, --num); // Return the next step as a function
}

function trampoline(fn) {
  while (typeof fn === 'function') {
    fn = fn(); 
  }
}

module.exports = function (operation, num) {
  trampoline(() => repeat(operation, num)); 
};

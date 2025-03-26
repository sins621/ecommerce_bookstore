import databaseService from "./services/databaseService.js";

// const result = await databaseService.addSubscriber("felix@felix.com");
// console.log(result);

// if (result) {
//     console.log("Success");
// } else (
//     console.log("Fail")
// )

// const fetchResult = await fetch(
//     "http://localhost:6199/users/add-subscriber",
//     {
//         method: "POST",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({email: "tom@tom.com"})
//     }
// )

// console.log(await fetchResult.json())

// console.log(await databaseService.fetchAllUsersRoles());
// console.log(await (await fetch("http://localhost:6199/users/user-roles")).json())

// console.log(await databaseService.fetchAllRoles());
// console.log(await ((await fetch("http://localhost:6199/users/roles")).json()))

// await databaseService.deleteUser(16)

// const result = await databaseService.addBookToOrders(4, 5);
// console.log(result);

const fetchResult = await fetch(
  "http://localhost:6199/users/orders/add-order",
  {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: 4, book_ids: [1, 2, 3] }),
  }
);

console.log(await fetchResult.json());
process.exit();

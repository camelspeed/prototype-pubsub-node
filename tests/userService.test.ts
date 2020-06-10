import { userService } from '../src/services/publishers/userService';
import { User } from '../src/services/model';

test('create and find a User', () => {
    let user = {firstName: "Johnny", middleName: "S", lastName: "Mohseni", phoneNumber: "703-729-2772", email: "johnny@bah.com"};
    userService.create(user);
    let newUser: User = userService.find(user.email);
    expect(user.email).toBe(newUser.email);
});

// test('update a user', () => {
//     let user = {firstName: "Johnny", middleName: "S", lastName: "Mohseni", phoneNumber: "703-729-2772", email: "johnny@bah.com"};
//     userService.create(user);
//     let newUser: User = userService.find(user.email);
//     expect(user.email).toBe(newUser.email);

//     newUser.phoneNumber = "703-867-5309";
//     userService.update(newUser)
//     let updatedUser: User = userService.find(newUser.email);
//     expect(updatedUser.email).toBe(newUser.email);
//     expect(updatedUser.phoneNumber).toBe(newUser.phoneNumber);
// });
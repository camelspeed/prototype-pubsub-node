import { userService } from '../src/services/publishers/userService';
import { historyService } from '../src/services/subscribers/historyService';
import { History, User } from '../src/services/model';

// test('manually create and find a History', () => {
//     const userEmail =  "johnny@bah.com";
//     let user: User = {firstName: "Johnny", middleName: "S", lastName: "Mohseni", phoneNumber: "703-729-2772", email: userEmail};
//     let entity = {entityName: "user", entityId: userEmail};
//     let history: History = {entity: entity, createdDate: (new Date()).toDateString(), data: JSON.stringify(user)};
//     const newHistoryId = historyService.create(history);
    
//     let h: History = historyService.find(newHistoryId);
//     expect(newHistoryId).toBe(h.id);
//     expect(user.email).toBe(h.entity.entityId);
// });

test('create User History as topic subscriber', () => {
    const userEmail =  "johnny@bah.com";
    let user: User = {firstName: "Johnny", middleName: "S", lastName: "Mohseni", phoneNumber: "703-729-2772", email: userEmail};
    userService.create(user);
    // let entity = {entityName: "user", entityId: userEmail};
    // let history: History = {entity: entity, createdDate: (new Date()).toDateString(), data: JSON.stringify(user)};
    // const newHistoryId = historyService.create(history);
    let h: History = historyService.findByEntityId(user.email);
    expect(user.email).toBe(h.entity.entityId);
});
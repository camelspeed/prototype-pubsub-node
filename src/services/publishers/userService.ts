import { userCache } from '../../cache';
import { MessageProducer, MessageProducerConfig } from '../messenger';
import { User } from '../model';

interface IUserService {
    create(user: User);
    update(user: User);
    find(email: string): User;
    all(): string;
}

class UserService implements IUserService {
    constructor() {}

    create(user: User) {
        userCache.set(user.email, user);
        let message: string = JSON.stringify(user);
        console.log("Publishing Message for Created User: %s", message);
        MessageProducer.publish(new MessageProducerConfig('jllis.topics', 'users.create', message));
        console.log("Published Message for Created User");
    }

    update(user: User) {
        let u: User = userCache.get(user.email);
        userCache.set(user.email, user);
        console.log("Publishing Message for Updated User: %s", user.email);
        MessageProducer.publish(new MessageProducerConfig('jllis.topics', 'users.create', JSON.stringify(u)));
        console.log("Published Message for Updated User");
    }

    find(email: string): User {
        return userCache.get(email);
    }

    all(): string {
        let data = userCache.mget(userCache.keys());
        return JSON.stringify(data);
    }
}

const userService = new UserService();
export { userService, IUserService, UserService }
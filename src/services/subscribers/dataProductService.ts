import { dataProductCache } from '../../cache';
import { DataProduct, User } from '../model';
import { IMessageConsumerService, MessageProducer, MessageProducerConfig } from '../messenger';
import { v4 as uuidv4 } from 'uuid';

interface IDataProductService {
    all(): string;
    create(data: DataProduct): string;
}

class DataProductService implements IDataProductService, IMessageConsumerService {
    constructor() {
        console.log("NEW Data Product Service");
    }

    all(): string {
        let data = dataProductCache.mget(dataProductCache.keys());
        return JSON.stringify(data);
    }

    create(data: DataProduct): string {
        let id: string = uuidv4();
        data.id = id;
        dataProductCache.set(id, data);
        this.publishMessage(data, 'dataproducts.create');
        return id;
    }

    consume(message: string) {
        console.log("CONSUMER Data Product CALLBACK: Got message: %s", message);
        dataProductCache.keys().forEach(async(key) => {
            let dp: DataProduct = dataProductCache.get(key);
            let u: User = JSON.parse(message); // TODO: assumes message is always a User
            if (u.email == dp.poc.email) {
                dp.poc = u;
                console.log("Update DP: " + JSON.stringify(dp))
                dataProductCache.set(dp.id, dp);
                this.publishMessage(dp, 'dataproducts.update');
            }
        });
        console.log("CONSUMER Data Product CALLBACK: Saved Message!");
    }

    private publishMessage(data: DataProduct, topic: string) {
        let message: string = JSON.stringify(data);
        console.log("Publishing Message: %s", message);
        MessageProducer.publish(new MessageProducerConfig('jllis.topics', topic, message));
        console.log("Published Message");
    }
}

const dataProductService = new DataProductService();
export { dataProductService, IDataProductService, DataProductService }
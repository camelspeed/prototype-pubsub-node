import { dataProductCache } from '../../cache';
import { PubSubDB } from '../../datastore/couchdb';
import { DataProduct, User } from '../model';
import { IMessageConsumerService, MessageProducer, MessageProducerConfig } from '../messenger';
import { v4 as uuidv4 } from 'uuid';

interface IDataProductService {
    all(): Promise<DataProduct[]>;
    create(data: DataProduct);
}

class DataProductService implements IDataProductService, IMessageConsumerService {
    constructor() {
        console.log("NEW Data Product Service");
    }

    public async all(): Promise<DataProduct[]> {
        let result = await PubSubDB.partitionedList(this.partitionName(), { include_docs: true });
        console.log("DATA: " + JSON.stringify(result));
        return result.rows;
    }

    public async create(data: DataProduct) {
        const id = this.createPartitionKey();
        return await PubSubDB.insert({_id: id, data: data});
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

    private createPartitionKey(): string {
        return this.partitionName() + ":" + uuidv4();
    }

    private partitionName(): string {
        return 'DATAPRODUCTS';
    }
}

const dataProductService = new DataProductService();
export { dataProductService, IDataProductService, DataProductService }
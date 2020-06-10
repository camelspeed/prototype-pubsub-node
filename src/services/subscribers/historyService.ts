import { historyCache } from '../../cache';
import { History } from '../model';
import { IMessageConsumerService } from '../messenger';
import { v4 as uuidv4 } from 'uuid';

interface IHistoryService {
    create(history: History): string;
    find(id: string): History;
    findByEntityId(entityId: string): History;
    allByType(type: string): string;
    all(): string;
}

class HistoryService implements IHistoryService, IMessageConsumerService  {
    constructor() {
        console.log("NEW HISTORY Service");
    }

    create(history: History): string {
        const id = uuidv4();
        history.id = id;
        historyCache.set(id, history);
        return id;
    }

    consume(message: string) {
        console.log("CONSUMER CALLBACK: Got message: %s", message);
        const id = uuidv4();
        historyCache.set(id, message);
        console.log("CONSUMER CALLBACK: Saved Message!");
    }

    find(id: string): History {
        return historyCache.get(id);
    }

    findByEntityId(entityId: string): History {
        let data: History[] = JSON.parse(this.all());
        for (let i in data) {
            if (data[i].entity.entityId == entityId) {
                return data[i];
            }
        }
    }

    allByType(type: string): string {
        let data: History[] = JSON.parse(this.all());
        let result: History[] = new Array();
        for (let i in data) {
            if (data[i].entity.entityName == type) {
                result.push(data[i]);
            }
        }
        return JSON.stringify(result);
    }

    all(): string {
        let data = historyCache.mget(historyCache.keys());
        return JSON.stringify(data);
    }
}

const historyService = new HistoryService();
export { historyService, IHistoryService, HistoryService }
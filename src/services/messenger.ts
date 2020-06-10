import { dataProductService } from './subscribers/dataProductService';
import { historyService } from './subscribers/historyService';
const amqp = require('amqplib/callback_api');

class MessageProducerConfig {
    private _SERVER_URL = 'amqp://guest:guest@localhost:5672';
    private _topic: string;
    private _exchange: string;
    private _message: string;
    
    constructor(exchange: string, topic: string, message: string) {
        this._exchange = exchange;
        this._topic = topic;
        this._message = message;
    }

    get topic(): string {
        return this._topic;
    }

    get exchange(): string {
        return this._exchange;
    }

    get message(): string {
        return this._message;
    }

    get serverURL(): string {
        return this._SERVER_URL;
    }
}

class MessageTopicConsumer {
    private _topics: string[] = new Array();
    private _consumers: IMessageConsumerService[] = new Array();

    constructor() {
    }

    addTopic(topic: string): MessageTopicConsumer {
        this._topics.push(topic);
        return this;
    }

    get topics(): string[] {
        return this._topics;
    }

    addConsumer(consumer: IMessageConsumerService) {
        this._consumers.push(consumer);
    }

    get consumers(): IMessageConsumerService[] {
        return this._consumers;
    }
}

class MessageConsumerConfig {
    private _SERVER_URL = 'amqp://guest:guest@localhost:5672';
    private _exchange: string;
    private _topicConsumers: MessageTopicConsumer;

    constructor(exchange: string, topicConsumers: MessageTopicConsumer) {
        this._exchange = exchange;
        this._topicConsumers = topicConsumers;
    }

    get topicConsumers(): MessageTopicConsumer {
        return this._topicConsumers;
    }

    get exchange(): string {
        return this._exchange;
    }

    get serverURL(): string {
        return this._SERVER_URL;
    }
}

class MessageProducer {
    private constructor() {}

    static publish(config: MessageProducerConfig) {
        amqp.connect(config.serverURL, async (error, connection) => {
            if (error) {
                throw error;
            }
            // console.log("PRODUCER: created connection with serverUrl=%s", config.serverURL);
            connection.createConfirmChannel(async (error, channel) => {
                if (error) {
                    throw error;
                }

                console.log("PRODUCER: created channel");
                channel.assertExchange(config.exchange, "topic", {
                    durable: false
                });
                console.log("PRODUCER: asserted Exchange: %s", config.exchange);

                channel.publish(config.exchange, config.topic, Buffer.from(config.message), {}, async (err, ok) => {
                    if (err != null) {
                        console.log("PRODUCER: error publishing message ==> %s", err);                        
                    } else {
                        console.log("PRODUCER: Published message => %s", config.message);
                    }
                    connection.close();
                    console.log("PRODUCER: connection closed");
                });
            });
        });
    }
}

class MessageConsumer {
    constructor(config: MessageConsumerConfig) {
        this.connect(config);
        console.log("CONSUMER: creating MessageConsumer with: serverUrl=%s | exchange=%s | topic=%s", config.serverURL, config.exchange);
    }

    private connect(config: MessageConsumerConfig) {
        amqp.connect(config.serverURL, async (error0, connection) => {
            if (error0) {
                throw error0;
            }

            connection.createConfirmChannel(async (error1, channel) => {
                if (error1) {
                    throw error1;
                }
                console.log("CONSUMER: connected to Rabbit");
                
                channel.assertExchange(config.exchange, "topic", {
                    durable: false
                });

                console.log("CONSUMER: established Exchange of type: %s", config.exchange);

                channel.assertQueue('', {
                    exclusive: true
                }, async (error2, q) => {
                    if (error2) {
                        throw error2;
                    }                    

                    config.topicConsumers.topics.forEach(async(topic) => {
                        channel.bindQueue(q.queue, config.exchange, topic);
                        console.log("CONSUMER: binding %s topic to %s queue", topic, q.queue);
                    })

                    console.log("CONSUMER: waiting for messages...");
                    channel.consume(q.queue, async (msg) => {
                        config.topicConsumers.consumers.forEach(async(consumer) => {
                            consumer.consume(msg.content.toString());
                        });
                    }, {
                        noAck: true
                    });

                    console.log("end");
                });
            });
        });
    }
}

interface IMessageConsumerService {
    consume(message: string);
}

const historyTopicConsumer: MessageTopicConsumer = new MessageTopicConsumer();
historyTopicConsumer.addTopic("users.*").addTopic("dataproducts.*").addTopic("referencedata.*").addConsumer(historyService);
const historyConsumerConfig = new MessageConsumerConfig('jllis.topics', historyTopicConsumer);
const historyConsumer = new MessageConsumer(historyConsumerConfig);

const dataProductsTopicConsumer: MessageTopicConsumer = new MessageTopicConsumer();
dataProductsTopicConsumer.addTopic("users.*").addTopic("referencedata.*").addConsumer(dataProductService);
const dataProductsConsumerConfig = new MessageConsumerConfig('jllis.topics', dataProductsTopicConsumer);
const dataProductsConsumer = new MessageConsumer(dataProductsConsumerConfig);

export { MessageProducer, MessageProducerConfig, IMessageConsumerService }
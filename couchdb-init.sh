#! /bin/bash

CDB_USER=$1
CDB_PWD=$2
CDB_WAIT=$3

# see: https://docs.couchdb.org/en/stable/install/docker.html
echo "Starting container as detached.  First time may take some time!"
docker run -d  --name pubsub-db -e COUCHDB_USER=$CDB_USER -e COUCHDB_PASSWORD=$CDB_PWD -p 5984:5984 couchdb:3.0.0

# make sure container is ready
echo "Sleeping $CDB_WAIT to allow for container to boot..."
sleep $CDB_WAIT

# see: https://docs.couchdb.org/en/stable/setup/single-node.html
echo "Initializing _users..."
curl -u $CDB_USER:$CDB_PWD -X PUT http://127.0.0.1:5984/_users

echo "Initializing _replicator..."
curl -u $CDB_USER:$CDB_PWD -X PUT http://127.0.0.1:5984/_replicator

echo "Initializing _global_changes..."
curl -u $CDB_USER:$CDB_PWD -X PUT http://127.0.0.1:5984/_global_changes

# Create the Single Node Database
# see: https://docs.couchdb.org/en/stable/api/database/common.html
echo "Creating `jllis` partitioned database on a single node cluster..."
curl -u $CDB_USER:$CDB_PWD -X PUT http://127.0.0.1:5984/pubsub?partitioned=true

echo "Finished initializing your CouchDB database!"
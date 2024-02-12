<!-- [![NPM version][npm-version-image]][npm-url]
[![NPM downloads per month][npm-downloads-month-image]][npm-url]
[![NPM downloads total][npm-downloads-total-image]][npm-url]
[![MIT License][license-image]][license-url] -->

# Unofficial SAP Business One Service Layer Nodes for Node-RED.

[![Platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)

This module provides a set of nodes for Node-RED to quickly create integration flows with SAP Business One Service Layer.

# Installation

You can install the nodes using node-red's "Manage palette" in the side bar.

Or run the following command in the root directory of your Node-RED installation

    npm install @jpdlm/node-red-sap-service-layer --save

Changes can be followed [here](/CHANGELOG.md).

# Usage

## Basics

### Authenticate (node authenticateSap)

Use this node to authenticate with a valid SAP service layer API access\
The node requires the following:

- host
- company
- user
- password

Additionally the following can also be used if needed:

- port
- url prefix (used for reverse proxies)

### Retrieve a list of entities (node listSap)

Use this node to retrieve a list of entities

1. Select the type of entity you want to retrieve as a list
2. If you want to add filter/options use oData params _optional_\
   Query options on entities:

| option   | description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| $filter  | Restrict the set of business objects returned.                              |
| $orderby | Specify the order in which business objects are returned from the service.  |
| $select  | Restrict the service to return only the properties requested by the client. |
| $skip    | Specify that the result excludes the first n entities.                      |
| $top     | Specify that only the first n records should be returned.                   |

### Get single entity (node getSap)

Use this node to get a single entity by providing the primary key

1. Select the type of entity you want to retrieve
2. Use _objectId_ as primary key of entity
3. Use _oData_ to filter the response fields _optional_\

Query options on single entity:

| option  | description                                                                 |
| ------- | --------------------------------------------------------------------------- |
| $select | Restrict the service to return only the properties requested by the client. |

### Create a new entity (node createSap)

Use this node to create a new entity.

1. Select the type of entity you want to create
2. Use _msg.bodyPost_ to provide the entity's fields
3. Use _msg.createParams_ to provide object params

### Update an object

Use this node to update an object.

1. Select the type of object you want to update
2. Use _objectId_ as primary key of object
3. Use _msg.updateParams_ to provide object params

### Delete an Object

Use this node to delete an object.

1. Select the type of object you want to delete
2. Use _objectId_ as primary key of object

### Count the number of objects per type

Use this node to count the number of objects per type.

1. Select the type of object you want to count

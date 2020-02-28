#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CommonStack } from '../stacks/common-stack';
import { DatabaseStack } from '../stacks/database-stack';
import { UsersServiceStack } from '../stacks/users-service-stack';

const app = new cdk.App();
const common = new CommonStack(app, 'CommonStack');

const database = new DatabaseStack(app, 'DatabaseStack', {
    vpc: common.vpc
})

const usersService = new UsersServiceStack(app, 'UsersServiceStack', {
    api: common.api,
    dbClusterArn: database.dbClusterArn,
    dbName: database.dbName,
    secretArn: database.secretArn
})


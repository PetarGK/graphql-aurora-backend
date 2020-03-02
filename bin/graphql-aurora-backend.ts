#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CommonStack } from '../stacks/common-stack';
import { DatabaseStack } from '../stacks/database-stack';
import { ApiStack } from '../stacks/api-stack';
import { UsersServiceStack } from '../stacks/users-service-stack';
import { DbSettings } from '../lib/DbFunction';

const app = new cdk.App();
const common = new CommonStack(app, 'CommonStack');
const database = new DatabaseStack(app, 'DatabaseStack', {
    vpc: common.vpc
})
const api = new ApiStack(app, 'ApiStack')

const dbSettings = {
    dbClusterArn: database.dbClusterArn,
    dbName: database.dbName,
    secretArn: database.secretArn
} as DbSettings

const usersService = new UsersServiceStack(app, 'UsersServiceStack', {
    api: api.api,
    dbSettings: dbSettings
})


#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CommonStack } from '../stacks/common-stack';
import { DatabaseStack } from '../stacks/database-stack';
import { ApiStack } from '../stacks/api-stack';
import { DbSettings } from '../lib/DbFunction';

const app = new cdk.App();
const common = new CommonStack(app, 'CommonStack');
const database = new DatabaseStack(app, 'DatabaseStack', {
    vpc: common.vpc
})

const dbSettings = {
    dbClusterArn: database.dbClusterArn,
    dbName: database.dbName,
    secretArn: database.secretArn,
    stage: "dev"
} as DbSettings

const api = new ApiStack(app, 'ApiStack', {
    dbSettings: dbSettings
})


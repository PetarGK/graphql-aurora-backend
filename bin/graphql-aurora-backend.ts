#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { GraphqlAuroraBackendStack } from '../lib/graphql-aurora-backend-stack';

const app = new cdk.App();
new GraphqlAuroraBackendStack(app, 'GraphqlAuroraBackendStack');

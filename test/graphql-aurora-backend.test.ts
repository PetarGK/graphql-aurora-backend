import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import GraphqlAuroraBackend = require('../lib/graphql-aurora-backend-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new GraphqlAuroraBackend.GraphqlAuroraBackendStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});

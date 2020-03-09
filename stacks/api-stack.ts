import * as cdk from '@aws-cdk/core';
import { GraphQLApi, FieldLogLevel, CfnGraphQLApi } from '@aws-cdk/aws-appsync'

export class ApiStack extends cdk.Stack {  
  public readonly api: GraphQLApi

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.api = new GraphQLApi(this, 'ExampleApi', {
      name: `example-api`,
      schemaDefinitionFile: './schema.graphql',
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      }
    })

    const cfnGraphQLApi = this.api.node.defaultChild as CfnGraphQLApi;
    cfnGraphQLApi.xrayEnabled = true       

  }
}

import * as cdk from '@aws-cdk/core';
import { GraphQLApi, FieldLogLevel, CfnGraphQLApi } from '@aws-cdk/aws-appsync'
import { FunctionResolver } from '../lib/FunctionResolver';
import { DbSettings } from '../lib/DbFunction';

interface ApiStackProps extends cdk.StackProps {
  dbSettings: DbSettings
}

export class ApiStack extends cdk.Stack {
  public readonly api: GraphQLApi; 
  
  constructor(scope: cdk.Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new GraphQLApi(this, 'ExampleApi', {
      name: `example-api`,
      schemaDefinitionFile: './schema.graphql',
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      }
    })

    const cfnGraphQLApi = api.node.defaultChild as CfnGraphQLApi;
    cfnGraphQLApi.xrayEnabled = true    

    new FunctionResolver(this, 'createUser', {
      api: api,
      dbSettings: props.dbSettings,
      entry: './src/modules/users/useCases/createUser/lambda.ts',
      functionName: 'users-service-createUser',
      dataSourceName: 'users_service_createUser',
      dataSourceDesc: 'Create user',
      resolverTypeName: 'Mutation',
      resolverFieldName: 'createUser'
    })    

    new FunctionResolver(this, 'getUsers', {
      api: api,
      dbSettings: props.dbSettings,
      entry: './src/modules/users/useCases/getUsers/lambda.ts',
      functionName: 'users-service-getUsers',
      dataSourceName: 'users_service_getUsers',
      dataSourceDesc: 'Get users',
      resolverTypeName: 'Query',
      resolverFieldName: 'getUsers'
    })       


  }
}

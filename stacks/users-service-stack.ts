import * as cdk from '@aws-cdk/core';
import { DbFunction, DbSettings } from '../lib/DbFunction';
import { GraphQLApi } from '@aws-cdk/aws-appsync';
import { FunctionResolver } from '../lib/FunctionResolver';

export interface UsersServiceStackProps extends cdk.StackProps {
  dbSettings: DbSettings
  api: GraphQLApi
}

export class UsersServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: UsersServiceStackProps) {
    super(scope, id);

    const createUserFunction = new DbFunction(this, 'users-service-createUser', {
      entry: './src/modules/users/useCases/createUser/lambda.ts',
      settings: props.dbSettings,
      functionName: 'users-service-createUser'
    }) 
    new FunctionResolver(this, 'createUser', {
      function: createUserFunction,
      api: props.api,
      dataSourceName: 'users_service_createUser',
      dataSourceDesc: 'Create user',
      resolverTypeName: 'Mutation',
      resolverFieldName: 'createUser'
    })    

    const getUsersFunction = new DbFunction(this, 'users-service-getUsers', {
      entry: './src/modules/users/useCases/getUsers/lambda.ts',
      settings: props.dbSettings,
      functionName: 'users-service-getUsers'
    })    
    new FunctionResolver(this, 'getUsers', {
      function: getUsersFunction,
      api: props.api,
      dataSourceName: 'users_service_getUsers',
      dataSourceDesc: 'Get users',
      resolverTypeName: 'Query',
      resolverFieldName: 'getUsers'
    })

  }
}

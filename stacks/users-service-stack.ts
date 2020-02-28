import * as cdk from '@aws-cdk/core'
import { GraphQLApi, MappingTemplate, FieldLogLevel, CfnGraphQLApi } from '@aws-cdk/aws-appsync'
import { Runtime } from '@aws-cdk/aws-lambda'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import iam = require("@aws-cdk/aws-iam");
import { DbFunction } from '../lib/DbFunction';


interface UsersServiceStackProps extends cdk.StackProps {
    dbClusterArn: string,
    secretArn: string,
    dbName: string,
    api: GraphQLApi
}

export class UsersServiceStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: UsersServiceStackProps) {
      super(scope, id, props);


      const createUserLambda = new DbFunction(this, 'users-service-create-user', {
          entry: '/src/users-service/create-user/lambda',
          secretArn: props.secretArn,
          dbClusterArn: props.dbClusterArn,
          dbName: props.dbName
      })
      const createUserDataSource = props.api.addLambdaDataSource("createUser", "Create user", createUserLambda)
      createUserDataSource.createResolver({
        typeName: "Mutation",
        fieldName: "createUser",
        requestMappingTemplate: MappingTemplate.lambdaRequest("$util.toJson($context.args)"),
        responseMappingTemplate: MappingTemplate.lambdaResult()
      })


      const getUsersLambda = new DbFunction(this, 'users-service-get-users', {
        entry: '/src/users-service/get-users/lambda',
        secretArn: props.secretArn,
        dbClusterArn: props.dbClusterArn,
        dbName: props.dbName
      })
      const getUsersDataSource = props.api.addLambdaDataSource("getUsers", "Get users", getUsersLambda)
      getUsersDataSource.createResolver({
        typeName: "Query",
        fieldName: "getUsers",
        requestMappingTemplate: MappingTemplate.lambdaRequest("$util.toJson($context.args)"),
        responseMappingTemplate: MappingTemplate.lambdaResult()
      })

    }
}
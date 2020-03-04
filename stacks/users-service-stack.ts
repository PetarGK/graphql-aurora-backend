import * as cdk from '@aws-cdk/core'
import { GraphQLApi, MappingTemplate } from '@aws-cdk/aws-appsync'
import { DbFunction, DbSettings } from '../lib/DbFunction';


interface UsersServiceStackProps extends cdk.StackProps {
    dbSettings: DbSettings
    api: GraphQLApi
}

export class UsersServiceStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: UsersServiceStackProps) {
      super(scope, id, props);


      const createUserLambda = new DbFunction(this, 'users-service-create-user', {
        entry: './src/modules/users/useCases/createUser/lambda.ts',
        settings: props.dbSettings,
        functionName: 'users-service-createUser'
      })
      const createUserDataSource = props.api.addLambdaDataSource("users_service_createUser", "Create user", createUserLambda)
      createUserDataSource.createResolver({
        typeName: "Mutation",
        fieldName: "createUser",
        requestMappingTemplate: MappingTemplate.fromString(`{"version": "2018-05-29", "operation": "Invoke", "payload": $util.toJson($context.args)}`),
        responseMappingTemplate: MappingTemplate.fromString(`
        #if( $context.result && $context.result.errors )
          #foreach($error in $context.result.errors)
              $utils.appendError( $error.errorMessage, $error.errorType )
          #end
        #end
        
        $utils.toJson( $context.result.data )
        `)
      })

      const getUsersLambda = new DbFunction(this, 'users-service-get-users', {
        entry: './src/modules/users/useCases/getUsers/lambda.ts',
        settings: props.dbSettings,
        functionName: 'users-service-getUsers'
      })
      const getUsersDataSource = props.api.addLambdaDataSource("users_service_getUsers", "Get users", getUsersLambda)
      getUsersDataSource.createResolver({
        typeName: "Query",
        fieldName: "getUsers",
        requestMappingTemplate: MappingTemplate.lambdaRequest("$util.toJson($context.args)"),
        responseMappingTemplate: MappingTemplate.lambdaResult()
      })

    }
}
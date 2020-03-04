import * as cdk from '@aws-cdk/core'
import { DbFunction, DbSettings } from './DbFunction'
import { MappingTemplate, GraphQLApi } from '@aws-cdk/aws-appsync'


interface FunctionResolverProps {
    entry: string,
    functionName: string,
    dataSourceName: string,
    dataSourceDesc: string,
    resolverTypeName: string,
    resolverFieldName: string,
    dbSettings: DbSettings,
    api: GraphQLApi
}

export class FunctionResolver extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: FunctionResolverProps) {
        super(scope, id)
      
        const lambda = new DbFunction(this, props.functionName, {
            entry: props.entry,
            settings: props.dbSettings,
            functionName: props.functionName
          })
        const dataSource = props.api.addLambdaDataSource(props.dataSourceName, props.dataSourceDesc, lambda)
        dataSource.createResolver({
        typeName: props.resolverTypeName,
        fieldName: props.resolverFieldName,
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
    }
}
import * as cdk from '@aws-cdk/core'
import { MappingTemplate, GraphQLApi, LambdaDataSource } from '@aws-cdk/aws-appsync'
import { IFunction } from '@aws-cdk/aws-lambda'


interface FunctionResolverProps {
    function: IFunction,
    dataSourceName: string,
    dataSourceDesc: string,
    resolverTypeName: string,
    resolverFieldName: string,
    api: GraphQLApi
}

export class FunctionResolver extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props: FunctionResolverProps) {
        super(scope, id)
      
        const dataSource = new LambdaDataSource(this, props.dataSourceName, {
            lambdaFunction: props.function,
            api: props.api,
            name: props.dataSourceName,
            description: props.dataSourceDesc
        })
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
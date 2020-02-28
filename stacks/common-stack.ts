import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import { SubnetType } from '@aws-cdk/aws-ec2';
import { GraphQLApi, FieldLogLevel, CfnGraphQLApi } from '@aws-cdk/aws-appsync'

export class CommonStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly api: GraphQLApi; 
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/21',
      maxAzs: 3,
      subnetConfiguration: [{
          cidrMask: 28,
          name: 'Database',
          subnetType: SubnetType.ISOLATED,
      }],
      natGateways: 0      
    })

    const api = new GraphQLApi(this, 'ExampleApi', {
      name: `example-api`,
      schemaDefinitionFile: './schema.graphql',
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      }
    })

    const cfnGraphQLApi = api.node.defaultChild as CfnGraphQLApi;
    cfnGraphQLApi.xrayEnabled = true    
  }
}

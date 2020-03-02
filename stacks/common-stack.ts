import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import { SubnetType } from '@aws-cdk/aws-ec2';

export class CommonStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  
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
  }
}

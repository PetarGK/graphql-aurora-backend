import cdk = require('@aws-cdk/core');
import { IVpc, SecurityGroup, SubnetType, Peer, Port } from '@aws-cdk/aws-ec2';
import { CfnDBCluster, CfnDBSubnetGroup, DatabaseSecret } from "@aws-cdk/aws-rds";
import cr = require('@aws-cdk/custom-resources');
import cfn = require('@aws-cdk/aws-cloudformation');
import { DbFunction } from '../lib/DbFunction';

interface DatabaseStackProps extends cdk.StackProps {
    vpc: IVpc
}

export class DatabaseStack extends cdk.Stack {
    public readonly clusterName: string;
    public readonly dbName: string;
    public readonly dbClusterArn: string;
    public readonly secretArn: string;
  
    constructor(scope: cdk.Construct, id: string, props: DatabaseStackProps) {
      super(scope, id, props);
  
      this.clusterName = "example";
      this.dbName = "ExampleApp";
  
      const secret = new DatabaseSecret(this, "MasterUserSecret", {
        username: "root",
      })
  
      const securityGroup = new SecurityGroup(this, "DatabaseSecurityGroup", {
        allowAllOutbound: true,
        description: `DB Cluster (${this.clusterName}) security group`,
        vpc: props.vpc
      })
  
      securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(3306));
  
      const cluster = new CfnDBCluster(this, "DatabaseCluster", {
        engine: "aurora",
        engineMode: "serverless",
        engineVersion: "5.6",
  
        dbClusterIdentifier: this.clusterName,
        databaseName: this.dbName,
  
        masterUsername: secret.secretValueFromJson("username").toString(),
        masterUserPassword: secret.secretValueFromJson("password").toString(),
  
        dbSubnetGroupName: new CfnDBSubnetGroup(this, "db-subnet-group", {
            dbSubnetGroupDescription: `${this.clusterName} database cluster subnet group`,
            subnetIds: props.vpc.selectSubnets({ subnetType: SubnetType.ISOLATED }).subnetIds
        }).ref,
  
        vpcSecurityGroupIds: [securityGroup.securityGroupId],
  
        storageEncrypted: true,
        deletionProtection: false,
  
        backupRetentionPeriod: 14,
  
        scalingConfiguration: {
            autoPause: true,
            secondsUntilAutoPause: 900,
            minCapacity: 1,
            maxCapacity: 1
        }
      })
      
      this.secretArn = secret.secretArn;
      this.dbClusterArn = `arn:aws:rds:${this.region}:${this.account}:cluster:${cluster.ref}`


      const dbMigrationsLambda = new DbFunction(this, 'resources-service-execute-migrations', {
        entry: '/src/resources-service/execute-migrations/lambda',
        secretArn: this.secretArn,
        dbClusterArn: this.dbClusterArn,
        dbName: this.dbName
      })

      const dbMigrationsProvider = new cr.Provider(this, 'DbMigrationsProvider', {
        onEventHandler: dbMigrationsLambda
      })

      new cfn.CustomResource(this, 'DbMigrationsResource', { provider: dbMigrationsProvider })
    }
}
  
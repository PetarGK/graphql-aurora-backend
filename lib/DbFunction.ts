import * as cdk from '@aws-cdk/core'
import iam = require("@aws-cdk/aws-iam");
import { NodejsFunction, NodejsFunctionProps } from "@aws-cdk/aws-lambda-nodejs";
import { Runtime } from '@aws-cdk/aws-lambda';
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs';

export interface DbSettings {
    dbClusterArn: string,
    secretArn: string,
    dbName: string,
    stage: string
} 

interface DbFunctionProps extends NodejsFunctionProps {
    settings: DbSettings
}

export class DbFunction extends NodejsFunction {
    constructor(scope: cdk.Construct, id: string, props: DbFunctionProps) {
        super(scope, id, {
            ...props,
            runtime: Runtime.NODEJS_12_X,
            environment: {
              SECRET_ARN: props.settings.secretArn,
              DB_CLUSTER_ARN: props.settings.dbClusterArn,
              DB_NAME: props.settings.dbName,
              STAGE: props.settings.stage
            },
            memorySize: 512,
            minify: false
        })
      
        this.addToRolePolicy(new iam.PolicyStatement(
        { 
            actions: [
                    "rds-data:ExecuteSql", 
                    "rds-data:ExecuteStatement", 
                    "rds-data:BatchExecuteStatement", 
                    "rds-data:BeginTransaction", 
                    "rds-data:RollbackTransaction", 
                    "rds-data:CommitTransaction"
                    ],
            resources: [`${props.settings.dbClusterArn}`] 
        }   
        ))
        this.addToRolePolicy(new iam.PolicyStatement({ 
            actions: ["secretsmanager:GetSecretValue"],
            resources: [`${props.settings.secretArn}`] 
        }))  

        new LogGroup(this, `${id}LogGroup`, {
            logGroupName: `/aws/lambda/${this.functionName}`,
            retention: RetentionDays.TWO_WEEKS 
        })         
    }
}
const database = require('data-api-client')({
    secretArn: process.env.SECRET_ARN,
    resourceArn: process.env.DB_CLUSTER_ARN,
    database: process.env.DB_NAME 
})

export async function handler(): Promise<any> {



}
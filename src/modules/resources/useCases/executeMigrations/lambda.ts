const data = require('data-api-client')({
    secretArn: process.env.SECRET_ARN,
    resourceArn: process.env.DB_CLUSTER_ARN,
    database: process.env.DB_NAME 
})

export async function handler(event: any): Promise<any> {
    const requestType = event.RequestType

    if (requestType === 'Create') {
        return await onCreate(event)
    } else if (requestType === 'Update') {
        return await onUpdate(event)
    } else if (requestType === 'Delete') {
        return await onDelete(event)
    } else {
        throw Error(`Invalid request type: ${requestType}`)
    }
}

async function onCreate(event: any) {
    await executeDbMigrations()

    return { 'PhysicalResourceId': "db-migrations" }
}

async function onUpdate(event: any) {
    await executeDbMigrations()
    
}

async function onDelete(event: any) {


}

function sleep(ms: number)  {
    return new Promise(resolve => setTimeout(resolve, ms));
}   
async function executeDbMigrations() {
      // if the cluster is in sleep mode we need to wake it up before to process futher
      // All of that should happen for DEV env. because on PROD we do not pause the db server
      if (process.env.STAGE !== "prod") {
        let canContinue = false;

        while(!canContinue) {
          try {
            await data.query('show tables');
            canContinue = true;
          }
          catch {
            await sleep(30000);
          }
        }    
      }

      await data.query({
        sql: `CREATE TABLE IF NOT EXISTS users (
          Id                            BIGINT                 NOT NULL AUTO_INCREMENT,
          FirstName                     VARCHAR(100)           NOT NULL,
          LastName                      VARCHAR(100)           NOT NULL,
          Email                         VARCHAR(150)           NOT NULL,
  
          PRIMARY KEY (Id)
        ) ENGINE=INNODB DEFAULT CHARSET=latin1`
      }) 
}
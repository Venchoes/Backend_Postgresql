const { MongoClient } = require('mongodb');

const atlasUri = 'mongodb+srv://fcla1801_db_user:ofiatuno@cluster0.i14czmv.mongodb.net/my-database?retryWrites=true&w=majority';
const localUri = 'mongodb://root:example@localhost:27017/my-database?authSource=admin';

async function checkUsers() {
    console.log('\n🔍 Verificando usuários nos dois bancos...\n');
    
    // Conectar ao Atlas
    const atlasClient = new MongoClient(atlasUri);
    await atlasClient.connect();
    const atlasDb = atlasClient.db('my-database');
    const atlasUsers = await atlasDb.collection('users').find({}).toArray();
    console.log('📊 MongoDB Atlas:');
    console.log(`   Total de usuários: ${atlasUsers.length}`);
    atlasUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
    });
    await atlasClient.close();
    
    // Conectar ao Local
    const localClient = new MongoClient(localUri);
    await localClient.connect();
    const localDb = localClient.db('my-database');
    const localUsers = await localDb.collection('users').find({}).toArray();
    console.log('\n💻 MongoDB Local (Express):');
    console.log(`   Total de usuários: ${localUsers.length}`);
    localUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
    });
    await localClient.close();
    
    console.log('\n✅ Verificação concluída!\n');
}

checkUsers().catch(console.error);

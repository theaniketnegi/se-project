const mongoose = require('mongoose');
const { Admin } = require('./admin');
const minimist = require('minimist');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        n: 'name',
        o: 'org',
        p: 'pwd',
        i: 'id',
    },
});

if (!args.id || !args.name || !args.org || !args.pwd || args.help) {
    console.log(`Usage: node createAdmin.js [options]
  
  Options:
	-h, --help       Show help
	-i, --id        Admin ID
	-n, --name       Admin name
	-o, --org        Organization
	-p, --pwd        Password
  `);
    process.exit(0);
}

mongoose.set('strictQuery', true);

function connectWithRetry() {
    console.log('Connecting to MongoDB...');
    mongoose
        .connect(MONGODB_URI, {})
        .then(() => console.log('connected to MongoDB'))
        .catch((err) => {
            console.error('Failed to connect:', err);
            console.log('Retrying connection');
            setTimeout(connectWithRetry, 5000);
        });
}
connectWithRetry();

(async () => {
    try {
        const { id, name, org, pwd } = args;
        const passwordHash = await bcrypt.hash(pwd, 10);
        const admin = new Admin({
            adminId: id,
            name,
            organization: org,
            passwordHash,
        });
        await admin.save();
        console.log('Admin created');
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
})();

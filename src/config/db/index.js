const mongoose = require('mongoose');
//Không dùng localhost thay cho 127.0.0.1 được, phải là 127.0.0.1 thì mới connect được => like
//huytraceraner là username, nên cần thay đổi lại thành username của mình, Huy123 là password để kết nối, 
//password sẽ được cung cấp với username luôn 
async function connect() {
    try {
        await mongoose.connect('mongodb+srv://huytraceraner:Huy123@cluster0.gmnwdhc.mongodb.net/nodeJSFinalProject')
        console.log("Connect successfully !")
    } catch (error) {
        console.log("Connect fail !")
        
    }
}

module.exports = {connect}
const options = {method: 'GET', headers: {accept: 'application/json'}};
//latLong is the latitude and the longitude, sample some latLong
const HCMD1   = `10.7760%2C106.7009`;
const daNang  = `16.0544%2C108.2022`;
const daLat   = `11.9404%2C108.4583`;
const nhaTrang= `12.2388%2C109.1967`;
const vungTau = `10.4114%2C107.1362`;
const haNoi   = `21.0278%2C105.8342`;
const latLongList = [HCMD1,daNang,daLat,nhaTrang,vungTau,haNoi]
console.log(process.env.tripadvisorAPIKey)
// should finish the checking phase later
const { checkApiConnection } = require('./checkingAPIService.js');  // Import the checkApiConnection function
const {settingUpTheConnection} = require('./ingestToMongoDB/mongodbUtils.js');
console.log(checkApiConnection)
async function fetchData() { // Appending
    const connect = await settingUpTheConnection() //create the connection to MongoDB
    const hotel_info_db = connect.db("hotel_info"); // connect to a speccific mongoDB
    const promises = latLongList.map(latLong => { // map function for each item in latLonglist
        const url = `https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=${latLong}&key=${process.env.tripadvisorAPIKey}&category=hotels&language=en`
        return fetch(url, options)
            .then(async res => { // async and await to make sure every GET receive fully
                const data = await res.json(); // transform JSON format
                await hotel_info_db.collection("nearbySearch").insertMany(data.data); // write to db.collection(nearbySearch)
            });
    });
    await Promise.all(promises); // promise to keep task end up
    await connect.close(); // close connection, prevent the leak
}
fetchData() // after finish all will delete this line
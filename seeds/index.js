const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
 
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// call unsplash and return small image
async function seedImg() {
try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
    params: {
        client_id: '1Q2KAt9FPBqVDc9VZ6qqMpXAMfNQtABjDipLF4dVImg',
        collections: 9046579,
    },
    })
    return resp.data.urls.small
} catch (err) {
    console.error(err)
}
}

const seedDB = async () => {
    // await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const randomPrice = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '62e1983d11f4aa0a45df9e48',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },
            // images: [
            //     {
            //         url: 'https://res.cloudinary.com/dzxxzyd5a/image/upload/v1658695103/YelpCamp/mukstpo7qnxhj2ththii.jpg',
            //         // filename: 'YelpCamp/mukstpo7qnxhj2ththii'
            //     },
            //     {
            //         url: 'https://res.cloudinary.com/dzxxzyd5a/image/upload/v1658709924/YelpCamp/om0ejp4ci4xxn28n7qnx.jpg',
            //         // filename: 'YelpCamp/om0ejp4ci4xxn28n7qnx'
            //     }
            // ],
            images: [
                {
                    url: await seedImg()
                },
                // {
                //     url: await seedImg()
                // }
            ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae voluptatibus quidem ipsam omnis quis eius provident, cupiditate, quia iusto ullam totam maxime placeat sapiente ipsa minus fuga, corporis est reprehenderit.',
            price: randomPrice
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
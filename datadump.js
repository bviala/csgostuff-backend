var Stuff = require('./models/stuff');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/csgostuff');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    Stuff.remove({}, function(err) { 
        if(err) return console.error(err)
        console.log('Stuff collection removed') 
        
        // data creation
        var stuff1 = new Stuff({
            name: 'mid to b smoke',
            map: 'DUST2',
            stuffType: 'SMOKE',
            author: 'Baptiste',
            upvotes: 187,
            downvotes: 12,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        })
        var stuff2 = new Stuff({
            name: 'garage flash',
            map: 'CACHE',
            stuffType: 'FLASH',
            author: 'Arnaud',
            upvotes: 132,
            downvotes: 90,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        })
        var stuff3 = new Stuff({
            name: 'BP A default plant molo',
            map: 'MIRAGE',
            stuffType: 'INCENDIARY',
            author: 'Jean-Jacques',
            upvotes: 112,
            downvotes: 9,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        })
        var stuff4 = new Stuff({
            name: 'Olof boost',
            map: 'OVERPASS',
            stuffType: 'BOOST',
            author: 'Georges',
            upvotes: 2,
            downvotes: 0,
            gifURL: 'https://media.giphy.com/media/zOvBKUUEERdNm/giphy.gif'
        })

        // data injection
        stuff1.save(function(err){
            if (err) return console.error(err);
        });
        stuff2.save(function(err){
            if (err) return console.error(err);
        });
        stuff3.save(function(err){
            if (err) return console.error(err);
        });
        stuff4.save(function(err){
            if (err) return console.error(err);
        });
    
        console.log('Stuff collection recreated');
    });
});

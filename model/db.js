var uuid = require('uuid').v5;
var fs = require('fs');
var NAMESPACE = '99ded2a5-1c51-488e-9654-1339fc3d4a82';
var URI = 'mongodb+srv://sasanqua:sasanqua@cluster0.aczsb.azure.mongodb.net/asm';
var connect = require('mongoose').connect;
connect(URI, {useNewUrlParser: true});

const Product = require('./db-models').Product;

fs.readdir(__dirname + '/np', update_products);
function update_products(err, dirs) {
    dirs.forEach(dir => {
        if(dir.length == 0) return;
        var dir_path = __dirname + '/np/' + dir;
        fs.readdir(dir_path, (err, items) => {
            var p = new Product();
            items.forEach(item => {
                var item_path = dir_path + '/' + item;
                if(item == 'images') {
                    fs.readdirSync(item_path).forEach(img => {
                        p.images.push(
                            fs.readFileSync(item_path + '/' + img, 'binary')
                        );
                    });
                }else if(item == 'information.json') {
                    var i = JSON.parse(fs.readFileSync(item_path));
                    p.name = i.name;
                    p.brand = i.brand;
                    p.avail = i.avail;
                    p.price = i.price;
                    p.type = i.type;
                    p.size = i.size;
                    p.release = i.release;
                    p['_id'] = uuid(p.name.toLowerCase().replace(/ /g, '-'), NAMESPACE);
                }else p.description = fs.readFileSync(item_path, 'utf-8');
           });
           p.save();
       }); 
       fs.rmdir(dir_path, {recursive: true}, err => {});
    });
}

module.exports.NAMESPACE = NAMESPACE;
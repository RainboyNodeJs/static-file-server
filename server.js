var static = require('node-static');
var fs = require('fs')
var join = require('path').join;

var basedir = __dirname +'/public';

//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');

var layout = fs.readFileSync('./index.html',{encoding:'utf8'});

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        console.log(request.url)
        if( request.url === '/'){
            var files__ = listDir(basedir,'');

            var li__ =''

            for( var i = 0;i<files__.length;i++)
                li__ += '<li><a href="' +files__[i]+ '">' + files__[i]+'</a></li>'

            var index = layout.replace("{{content}}",li__);
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(index, "utf8");
            response.end();
        }
        else
            file.serve(request, response);
    }).resume();
}).listen(4567,function(){
    console.log('listening at 4567')
});


//列出所有的文件
function listDir(path,father){
    var list = [];
    var  files = fs.readdirSync(path);
    for(var i = 0;i<files.length;i++)
    {
        var state = fs.statSync( join( path,files[i]))
        if( state.isFile())
            list.push( join(father,files[i]) );
        else if( state.isDirectory()){
            var t_list =  listDir( join(path,files[i]),files[i])
            for( var j = 0;j<t_list.length;j++)
                list.push( t_list[j]);
        }
    }
    return list;
}

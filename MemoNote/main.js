const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');


function getList(filelist) {
    var list = '<ul>'

    var i = 0;
    while(i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + '</ul>';
    return list;
}

var server = http.createServer(function (req, res) {
    var _url = req.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData = url.parse(_url, true).query;
    var title = "MemoNote";
    if(pathname == '/') {
        if(queryData.id == undefined) {
            fs.readdir("./data", function(err, filelist){
                var list = getList(filelist);
                var html =  `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>${title}</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/" style="color:black" "text-decoration:none;">MemoNote</h1></a>
                    <a href="/create">create</a>
                    ${list}
                    </body>
                </html>
                `;
                res.writeHead(200);
                res.end(html);
            });
                
        } else {
            fs.readdir("./data", function(err, filelist){
                var filteredId = path.parse(queryData.id).base;
                var list = getList(filelist);
                fs.readFile(`./data/${filteredId}`, 'utf-8', 
                function(err, description) {
                    var title = queryData.id;
                    var html = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>${title}</title>
                            <meta charset="utf-8">
                        </head>
                        <body>
                            <h1><a href="/" style="color:black, underline-text">MemoNote</h1></a>
                            <a href="/create">create</a>
                            ${list}
                            ${description}
                        </body>
                        </html>
                    `;
                res.writeHead(200);
                res.end(html);
                });
            });
        }
    } else if(pathname == '/create') {
        fs.readdir('./data', function(err, filelist) {
            var title = "MemoNote - create";
            var list = getList(filelist);
            var html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${title}</title>
                    <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/" style="color:black, underline-text">MemoNote</h1></a>
                    ${list}
                    <form action="/create_process" method="POST">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                    <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                    </form>
                </body>
                </html>
            `;
        res.writeHead(200);
        res.end(html);
        });
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
    
});

server.listen(5000);
console.log('Node.js web server at port 5000 is running...');
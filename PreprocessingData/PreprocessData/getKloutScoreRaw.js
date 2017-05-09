var fs = require('fs');
var http = require('http');
var targetFile = "FranceAttack";
var keys = [
    "f3xsmbynf9jrzfb25t26ebda",
    "jkccx3cds3n8yubnwm6gznjz",
    "uegkv9hqsnq89v2z26ngbtwf",
    "5bvy4hyffkssq3grfr6qk5qe",
    "93d6xnhgkt6wwz664y98jtaw",
    "2wu8x3zarcjyxfzvewv8p2bb",
    "u2krpr5v3gg267n9658gk89n",
    "ngzq3xuweps7pjnytc72sxsd",
    "cxdu2xv7s9pmez8h54vfpqs3",
    "a7qxqwv5fp5svnfrnbtv2xw3",
    "gc9dwe4b5zut5fh7acbvz3p5",
    "pf66jcumvcn5q2prcw675nuq",
    "5qn6crf5uxmjrzc69qv782pu",
    "amprwwwtnsryncb6b2b8ygkc",
    "27j4se5waexrsg7q3jzmh9an",
    "8zgrf4c547d5at8mwr3sm5yy",
    "kvknt8mfhn5vff6myq25f6bk",
    "ajwayr9tqfyzc438vcyqw2n7",
    "69wuadvfg3mmmdk7cb45u2p4",
    "cqt584fpmtrpsm4yzdahgutm",
    "3s7qb88wf223bbqx3teetjph",
    "jqw3yqhq468q6a4mnnks3rws",
    "ysn2ec7byu772e7rpmecpzpd",
    "rejp7u5za5pr3ugagtyyrxmu"
];

var keysLen = keys.length;
var userIds =  JSON.parse(fs.readFileSync("userKlout.json")) || {};

fs.readFile(targetFile, 'utf8', function (err, data) {
    if (err) throw err;
    const lines = data.split("\n");
    const tempUserIds = new Set();
    console.log(lines.length);
    for (const line of lines) {
        const attrs = line.split("\t");
        if(attrs[2]){
            tempUserIds.add(attrs[2]);
        }
    }

    var userIds = Array.from(tempUserIds);
    console.log(userIds.length);
    var start = Date.now();
    var baseUrl = "http://api.klout.com/v2/";
    var index = -1;
    var tick = 0;
    var httpTimer = setInterval(function () {
        var localIndex = ++index;
        if (localIndex >= userIds.length) {
            clearInterval(httpTimer);
            return;
        }

        var key = keys[localIndex % keysLen];
        var userId = userIds[localIndex];
        if (!userIds[userId] || userIds[userId] == -1) {
            http.get(baseUrl + "identity.json/tw/" + userId + "?key=" + key, function (res) {
                if (res.statusCode === 200) {
                    res.setEncoding('utf8');
                    res.on("data", function (data1) {
                        var kloudId = JSON.parse(data1);
                        http.get(baseUrl + "user.json/" + kloudId['id'] + "/score?key=" + key, function (ress) {
                            if (ress.statusCode === 200) {
                                ress.setEncoding('utf8');
                                ress.on("data", function (score) {
                                    userIds[userId] = JSON.parse(score).score;
                                    fs.appendFile(targetFile + "MapLineByLine", userId + "," + userIds[userId] + ";");
                                });
                            } else {
                                console.error(`Got error: ${ress.statusCode} ,userId is: ${userId} ,index is: ${localIndex}`);
                            }
                            ++tick;
                        }).on('error', (e) => {
                            console.error(`Got error: ${e.message} userId is: ${userId} ,index is: ${localIndex}`);
                            ++tick;
                        });
                    });
                } else {
                    console.error(`Got error: ${res.statusCode} userId is: ${userId} ,index is: ${localIndex}`);
                    ++tick;
                }
            }).on('error', (e) => {
                console.error(`Got error: ${e.message} userId is: ${userId} ,index is: ${localIndex}`);
                ++tick;
            });
        } else {
            ++tick;
        }
    }, 50);

    var writeFileTimer = setInterval(function () {
        if (tick >= userIds.length) {
            fs.writeFile("userKlouttemp.json", JSON.stringify(userIds, null, 4), function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("JSON saved to " + targetFile + "Map");
                }
                console.error("spend:" + (Date.now() - start) + "ms to process 100 userIds.");
                clearInterval(writeFileTimer);
            });
        } else {
            console.log(tick);
        }
    }, 60000);
});
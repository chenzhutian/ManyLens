数据处理由两部构成：

1. Klout爬虫
运行`npm install async && node getkloutScoreRaw.js`来爬取每个tweet用户的Klout分数。
其中需要调整的参数为第4行的`var targetFile = "FranceAttack"`, 需要把这个参数设为待处理的Tweet文件的路径。

2. 把tweetfile按照各种time granularity 切分 -> 探测peak -> 计算peak内tweet的sentiment -> cache Users
这个要运行PreprocessingData里的main文件内的main函数，需要安装整个工程的依赖的package(vs好像可以自动帮你安装)。
需要调整的参数就main里面的sourceTweetFile，需要把这个参数设为待处理的Tweet文件的路径（跟1里面的是同一个文件)。

3. 最后再把1和2的合并，这个合并的代码我还没写。
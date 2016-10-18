using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Tweetinvi;
using Stream = Tweetinvi.Stream;

namespace Examplinvi
{
 
    class Program
    {

        static string[] LoadTweetKey(string filePath)
        {
            List<string> keys = new List<string>();
            StreamReader sr = new StreamReader(filePath);
            while (!sr.EndOfStream)
            {
                keys.Add(sr.ReadLine());
            }

            return keys.ToArray();
        }

        static void TweetAPI() 
        {
            string[] keys = LoadTweetKey("D:\\Visual Studio 2013\\Projects\\ManyLens\\ManyLens\\Backend\\DataBase\\TWITTERKEY");
            Auth.SetUserCredentials(keys[0], keys[1], keys[2], keys[3]);
            List<string> tweets = new List<string>();
            var stream = Stream.CreateFilteredStream();
            stream.AddTweetLanguageFilter("en");
            //stream.AddTrack("china");
            stream.MatchingTweetReceived += (sender, args) =>
            {
                // Do what you want with the Tweet.
                tweets.Add(args.Tweet.ToString());
                if (tweets.Count > 2000)
                {
                    tweets.ForEach((tweet) =>
                    {
                        Console.WriteLine(tweet);
                    });
                }
            };
            stream.StartStreamMatchingAllConditions();
            
        }

        static  void subMain()
        {

            string tweetFile = "D:\\Visual Studio 2013\\Projects\\ManyLens\\ManyLens\\Backend\\DataBase\\FIFACASESampleEventUserIds";
            string ebolaFile = "D:\\Visual Studio 2013\\Projects\\ManyLens\\ManyLens\\Backend\\DataBase\\EbolaFullYearCaseSampleEventUserIds";
            string ebolaWithKloutSocre = ebolaFile + "Klout";
            StreamWriter sw = new StreamWriter(ebolaWithKloutSocre);
            StreamWriter swLinebyLine = new StreamWriter(ebolaWithKloutSocre + "linebyLine");
            StreamReader sr = new StreamReader(ebolaFile);
            Dictionary<string, double> userKloutScore = new Dictionary<string, double>();
            int t = 0;
          
            string[] keys =  new string[] {  "kvknt8mfhn5vff6myq25f6bk",
                                                        "ajwayr9tqfyzc438vcyqw2n7",
                                                        "69wuadvfg3mmmdk7cb45u2p4",
                                                        "cqt584fpmtrpsm4yzdahgutm",
                                                        "3s7qb88wf223bbqx3teetjph",
                                                        "jqw3yqhq468q6a4mnnks3rws",
                                                        "ysn2ec7byu772e7rpmecpzpd",
                                                        "rejp7u5za5pr3ugagtyyrxmu"};
            int keysCount = keys.Length;
            List<string> obj = JsonConvert.DeserializeObject<List<string>>(File.ReadAllText(ebolaFile));
            for (int i = 0, len = obj.Count; i < len;++i )
            {
                string userId = obj[i];
                if (!userKloutScore.ContainsKey(userId))
                {
                    double score = GetKloutScoreAsync(userId, keys[i%keysCount]).Result;
                    userKloutScore.Add(userId, score);
                    swLinebyLine.WriteLine(userId + "," + score);
                }
                Console.WriteLine(i);
            }
            swLinebyLine.Flush();
            swLinebyLine.Close();
            sw.WriteLine(JsonConvert.SerializeObject(userKloutScore));
            sw.Flush();
            sw.Close();
            Console.ReadLine();
        }

        class KloutID
        {
            public string id { get; set; }
        }

        class KloutScore
        {
            public double score { get; set; }
        }

        static async Task<double> GetKloutScoreAsync(string twUserId,string key)
        {
                using(var client = new HttpClient())
                {
                    client.BaseAddress = new Uri("http://api.klout.com/v2/");
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                    //GET clout ID
                    HttpResponseMessage response = await client.GetAsync("identity.json/tw/" + twUserId + "?key="+key);
                    if(response.IsSuccessStatusCode)
                    {
                        KloutID kloudID = await response.Content.ReadAsAsync<KloutID>();
                        response = await client.GetAsync("user.json/" + kloudID.id + "/score?key="+key);
                        if(response.IsSuccessStatusCode)
                        {
                            KloutScore kloudScore = await response.Content.ReadAsAsync<KloutScore>();
                            return kloudScore.score;
                        }
                    }
                    return -1;
                }
        }

    }
}
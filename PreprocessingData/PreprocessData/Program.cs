using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
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

        static void Main()
        {

            string tweetFile =  "D:\\Visual Studio 2013\\Projects\\ManyLens\\ManyLens\\Backend\\DataBase\\FIFACASESample";
            StreamReader sr;
            sr = new StreamReader(tweetFile);

            while (!sr.EndOfStream)
            {

                string line = sr.ReadLine();
                string[] tweetAttributes = line.Split('\t');

                //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
                //\t 8follower \9 13V \t 10gpsA \t 11gpsB   \t 12countryName
                Console.WriteLine(tweetAttributes[3]);

            }
            sr.Close();

        }
    }
}
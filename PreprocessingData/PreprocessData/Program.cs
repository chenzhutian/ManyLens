using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using Tweetinvi;
using Stream = Tweetinvi.Stream;

namespace Examplinvi
{
    // IMPORTANT 
    // This cheat sheet provide examples for all the features provided by Tweetinvi.

    // WINDOWS PHONE 8 developers
    // If you are a windows phone developer, please use the Async classes
    // User.GetLoggedUser(); -> await UserAsync.GetLoggedUser();

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

        static void Main()
        {
            string[] keys = LoadTweetKey("D:\\Visual Studio 2013\\Projects\\ManyLens\\ManyLens\\Backend\\DataBase\\TWITTERKEY");
            Auth.SetUserCredentials(keys[0], keys[1], keys[2], keys[3]);
            Tweet.PublishTweet("Lindandan Wo ai you yo!!!");
            var loggedUser = User.GetLoggedUser();
            Console.WriteLine(loggedUser.ScreenName);
            var tweets = Timeline.GetHomeTimeline();
            foreach (var tweet in tweets)
            {
                Console.WriteLine(tweet);
            }
            
            var stream = Stream.CreateFilteredStream();
            stream.AddTweetLanguageFilter("en");
            stream.AddTrack("windows10");
            stream.MatchingTweetReceived += (sender, args) =>
            {
                // Do what you want with the Tweet.
                Console.WriteLine(args.Tweet);
            };
            stream.StartStreamMatchingAllConditions();

            //TweetinviEvents.QueryBeforeExecute += (sender, args) =>
            //{
            //    // Console.WriteLine(args.QueryURL);
            //};
            //Examples.ExecuteExamples = true;
         
            //UserLiveFeedExamples();
            //TweetExamples();
            //UserExamples();
            //LoggedUserExamples();
            //TimelineExamples();
            //MessageExamples();
            //TwitterListExamples();
            //GeoExamples();
            //SearchExamples();
            //SavedSearchesExamples();
            //RateLimitExamples();
            //HelpExamples();
            //JsonExamples();
            //StreamExamples();
            //AdditionalFeaturesExamples();
            //Examples.ConfigureTweetinvi();
            //Examples.GlobalEvents();
            //UploadExamples();

            Console.WriteLine(@"END");
            Console.ReadLine();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using ManyLens;
using Tweetinvi;
using Stream = Tweetinvi.Stream;

namespace ManyLens.Twitter
{
    public class TwitterAPI
    {

        public async static Task GetStreamingTweetsByTracking(string keyWord)
        {
            await Task.Run(() => 
            {
                string[] keys = ManyLens.IO.TweetsIO.LoadTwitterKeys(config.Parameter.twitterKeysFile);
                Auth.SetUserCredentials(keys[0], keys[1], keys[2], keys[3]);

                var stream = Stream.CreateFilteredStream();
                stream.AddTweetLanguageFilter("en");
                stream.AddTrack("windows10");
                stream.MatchingTweetReceived += (sender, args) =>
                {
                    // Do what you want with the Tweet.
                    Debug.WriteLine(args.Tweet);
                };
                stream.StartStreamMatchingAllConditions();
            });
         
        }

    }
}
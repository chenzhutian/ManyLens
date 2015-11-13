using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ManyLens;
using Tweetinvi;
using Stream = Tweetinvi.Stream;

namespace ManyLens.Backend.TwitterAPI
{
    public class TwitterAPI
    {

        public void GetStreamingTweetsByTracking(string keyWord)
        {
            string[] keys = ManyLens.IO.TweetsIO.LoadTwitterKeys(config.Parameter.twitterKeysFile);
            Auth.SetUserCredentials(keys[0], keys[1], keys[2], keys[3]);
                
        }

    }
}
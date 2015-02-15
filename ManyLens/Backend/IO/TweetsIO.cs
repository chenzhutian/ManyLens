using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using ManyLens.Models;
using System.Diagnostics;

namespace ManyLens.IO
{
    public class TweetsIO
    {

        public static SortedDictionary<DateTime, Term> LoadTweetsAsTermsSortedByDate(string tweetFile)
        {
            SortedDictionary<DateTime, Term> sortedTerm = new SortedDictionary<DateTime, Term>();
            StreamReader sr;
            bool isCache = false;
            if (File.Exists(tweetFile + "CACHE"))
            {
                sr = new StreamReader(tweetFile + "CACHE");
                isCache = true;
            }
            else
            {
                sr = new StreamReader(tweetFile);
            }

            int[] mode = new int[4];
            for (int i = 0; i < Parameter.timeSpan; i++)
            {
                mode[i] = 1;
            }

            while (!sr.EndOfStream)
            {
                                
                string line = sr.ReadLine();
                string[] tweetAttributes = line.Split('\t');
                Tweet tweet = null;
                
                //Filter old date tweet
                if (DateTime.Parse(tweetAttributes[4]).Month < 6 || DateTime.Parse(tweetAttributes[4]).Year < 2014)
                    continue;

                if (isCache)
                {
                    User user = new User(tweetAttributes[4], tweetAttributes[5], tweetAttributes[6], tweetAttributes[7], tweetAttributes[8], tweetAttributes[9], tweetAttributes[10], tweetAttributes[11]);
                    tweet = new Tweet(tweetAttributes[1], tweetAttributes[2], tweetAttributes[3], user);
                }
                else
                {
                    //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
                    //\t 8follower \9 13V \t 10gpsA \t 11gpsB
                    User user = new User(tweetAttributes[2], tweetAttributes[1], tweetAttributes[6], tweetAttributes[7], tweetAttributes[8], tweetAttributes[9], tweetAttributes[10], tweetAttributes[11]);
                    tweet = new Tweet(tweetAttributes[0], tweetAttributes[3], tweetAttributes[4], user);
                }

                if (tweet == null)
                    continue;

                DateTime postDate = tweet.PostDate;
                DateTime date = new DateTime(postDate.Year, mode[0] == 1 ? postDate.Month : 1, mode[1] == 1 ? postDate.Day : 1, (postDate.Hour > 12 ? 12 : 0) * mode[2], postDate.Minute * mode[3], 0);


                if (sortedTerm.ContainsKey(date))
                {
                    sortedTerm[date].AddTweet(tweet.TweetID, tweet.OriginalContent, tweet.PostDate, tweet.User);
                }
                else
                {
                    Term t = new Term(date);
                    t.AddTweet(tweet.TweetID, tweet.OriginalContent, tweet.PostDate, tweet.User);
                    sortedTerm.Add(date, t);
                }
            }
            sr.Close();

            if (!isCache)
            {
                StreamWriter sw = new StreamWriter(tweetFile + "CACHE");
                foreach (KeyValuePair<DateTime, Term> p in sortedTerm)
                {
                    Term term = p.Value;
                    DateTime dateTime = p.Key;
                    for (int i = 0, len = term.TweetsCount; i < len; ++i)
                    {

                        Tweet tweet = term.Tweets[i];
                        User user = tweet.User;
                        sw.WriteLine(dateTime + "\t" + tweet.TweetID + "\t" + tweet.OriginalContent + "\t" + tweet.PostDate + '\t'
                            + user.UserID + '\t' + user.UserName + '\t' + user.TweetsCount + '\t' + user.Following + '\t' + user.Follower + user.IsV + '\t' + user.Location[0] + '\t' + user.Location[1]);
                    }

                }
                sw.Close();
            }

            return sortedTerm;
        }

        //public static bool SaveTweetsDistributionByDate(SortedDictionary<DateTime, Term> dateTweetsFreq)
        //{
        //    StreamWriter sw = new StreamWriter("..//..//tweetsdistributionbydate");
        //    sw.WriteLine("date" + "\t" + "Freq" + "\t" + "segmentPoint");
        //    foreach (KeyValuePair<DateTime, Term> item in dateTweetsFreq)
        //    {
        //        Term term = item.Value;
        //        sw.WriteLine(string.Format(string.Format("{0:yyyy/MM/dd/HH/mm/ss}", item.Key)) + "\t" + term.tweetF + "\t" + term.segmentPoint);
        //    }
        //    sw.Close();
        //    return true;
        //}
    }
}
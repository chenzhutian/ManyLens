using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using ManyLens.Models;

namespace ManyLens.IO
{
    public class TweetsIO
    {
        /// <summary>
        /// load tweets to list
        /// </summary>
        /// <param name="tweetFile">format: authoid \t tweetid \t tweet_content \t publish_time</param>
        /// <returns></returns>
        public static List<Tweet> LoadTweetsAsList(String tweetFile)
        {
            List<Tweet> tweets = new List<Tweet>();
            StreamReader sr = new StreamReader(tweetFile);
            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();
                string[] tweetAttributes = line.Split('\t');
                if (tweetAttributes.Length == 4)
                {
                    tweets.Add(new Tweet(tweetAttributes[1], tweetAttributes[2], tweetAttributes[3]));
                }
                else if (tweetAttributes.Length == 11)
                {
                    tweets.Add(new Tweet(tweetAttributes[0], tweetAttributes[1], tweetAttributes[4]));
                }
            }
            sr.Close();

            return tweets;
        }

        public static SortedDictionary<DateTime, Term> LoadTweetsAsTermsSortedByDate(string tweetFile)
        {
            SortedDictionary<DateTime, Term> sortedTerm = new SortedDictionary<DateTime, Term>();
            StreamReader sr;
            bool isCache = false;
            if(File.Exists(tweetFile+"CACHE"))
            {
                sr = new StreamReader(tweetFile+"CACHE");
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

                if (isCache || tweetAttributes.Length == 4)
                {
                    tweet = new Tweet(tweetAttributes[1], tweetAttributes[2], tweetAttributes[3]);
                }
                else if (tweetAttributes.Length == 11)
                {
                    tweet = new Tweet(tweetAttributes[0], tweetAttributes[1], tweetAttributes[4]);
                }

                if (tweet == null)
                    continue;

                DateTime date = tweet.PostDate;
                date = new DateTime(date.Year, mode[0] == 1 ? date.Month : 1, mode[1] == 1 ? date.Day : 1, date.Hour * mode[2], date.Minute * mode[3], 0);

                if (sortedTerm.ContainsKey(date))
                {
                    sortedTerm[date].AddTweet(tweet.TweetID, tweet.OriginalContent);
                }
                else
                {
                    Term t = new Term(date);
                    t.AddTweet(tweet.TweetID, tweet.OriginalContent);
                    sortedTerm.Add(date, t);
                }
            }
            sr.Close();

            if(!isCache)
            {
                StreamWriter sw = new StreamWriter(tweetFile + "CACHE");
                foreach(KeyValuePair<DateTime,Term> p in sortedTerm)
                {
                    Term term = p.Value;
                    DateTime dateTime = p.Key;
                    for (int i = 0, len = term.TweetsCount; i < len; ++i)
                    {
                        sw.WriteLine(dateTime+"\t"+term.TweetIDs[i]+"\t"+term.TweetContents[i]+"\t"+term.Tweets[i].PostDate);
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
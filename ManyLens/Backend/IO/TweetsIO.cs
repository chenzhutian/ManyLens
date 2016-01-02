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

        public static string[] LoadTwitterKeys(string filePath)
        {
            List<string> keys = new List<string>();
            StreamReader sr = new StreamReader(filePath);
            while (!sr.EndOfStream)
            {
                keys.Add(sr.ReadLine());
            }

            return keys.ToArray();
        }

        public static Interval Load20NGData(string filePath)
        {
            List<Tweet> tweets = new List<Tweet>();
            StreamReader sr = new StreamReader(filePath);
            while (!sr.EndOfStream)
            {
                string[] s = sr.ReadLine().Split('\t');
                Tweet tweet = new Tweet(s[1], s[2]);
                tweets.Add(tweet);
            }
            Interval interval = new Interval(tweets);
            return interval;
        }
        public static void Dump20NGData(string filePath, Interval interval)
        {
            List<float[]> vectors = interval.HashVecotrs;
            StreamWriter sw = new StreamWriter(filePath);
            for(int i = 0, len = vectors.Count; i < len; ++i)
            {
                string s  = "";
                float[] vector = vectors[i];
                for (int j = 0, lenj = vector.Length; j < lenj; ++j)
                {
                    if (j != lenj - 1)
                        s += vector[j] + ",";
                    else
                        s += vector[j];
                }
                sw.WriteLine(s);
            }
            sw.Close();

            sw = new StreamWriter(filePath + "groups");
            for (int i = 0, len = vectors.Count; i < len; ++i)
            {
                sw.WriteLine(interval.Tweets[i].TweetID);
            }
            sw.Close();
        }

        public static SortedDictionary<string, Term>[] LoadTweetsAsTermsSortedByDate(string tweetFile)
        {
            //SortedDictionary<DateTime, Term> sortedTerm = new SortedDictionary<DateTime, Term>();
            SortedDictionary<string, Term>[] sortedTerms = new SortedDictionary<string, Term>[4];
            for (int i = 0; i < 4; ++i)
            {
                sortedTerms[i] = new SortedDictionary<string, Term>();
            }

            Dictionary<string, User> users = new Dictionary<string, User>();
            StreamReader sr;
            sr = new StreamReader(tweetFile);

            //int[] mode = new int[5];
            //for (int i = 0; i < config.Parameter.TimeSpan; i++)
            //{
            //    mode[i] = 1;
            //}

            while (!sr.EndOfStream)
            {
                                
                string line = sr.ReadLine();
                string[] tweetAttributes = line.Split('\t');
                Tweet tweet = null;
               
                #region cache
                //if (isCache)
                //{
                //    User user;
                //    if (users.ContainsKey(tweetAttributes[4]))
                //    {
                //        user = users[tweetAttributes[4]];
                //    }
                //    else
                //    {
                //        user = new User(tweetAttributes[4], tweetAttributes[5], tweetAttributes[6], tweetAttributes[7], tweetAttributes[8], tweetAttributes[9], tweetAttributes[10], tweetAttributes[11]);
                //        users.Add(tweetAttributes[4], user);
                //    }
                //    tweet = new Tweet(tweetAttributes[1], tweetAttributes[2], tweetAttributes[3], tweetAttributes[10], tweetAttributes[11], user);
                //}
                //else
                //{
                #endregion

                //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
                //\t 8follower \9 13V \t 10gpsA \t 11gpsB   \t 12countryName
                User user;
                if (users.ContainsKey(tweetAttributes[2]))
                {
                    user = users[tweetAttributes[2]];
                }
                else
                {
                    user = new User(tweetAttributes[2], tweetAttributes[1], tweetAttributes[6], tweetAttributes[7], tweetAttributes[8], tweetAttributes[9], tweetAttributes[10], tweetAttributes[11]);
                    users.Add(tweetAttributes[2], user);
                }
                tweet = new Tweet(tweetAttributes[0], tweetAttributes[3], tweetAttributes[4], tweetAttributes[10], tweetAttributes[11], user);
                if (tweetAttributes.Length == 13)
                {
                    tweet.CountryName = tweetAttributes[12];
                    if (tweet.CountryName == null)
                        Debug.WriteLine("country name is null at" + tweet.DerivedContent);
                }

                //}

                if (tweet == null) continue;

                DateTime postDate = tweet.PostDate;
                int sec = 0;
                if (postDate.Second > 44)
                {
                    sec = 45;
                }
                else if (postDate.Second > 29)
                {
                    sec = 30;
                }
                else if (postDate.Second > 14)
                {
                    sec = 15;
                } 
                else if (postDate.Second > 0)
                {
                    sec = 0;
                }
                //DateTime date = new DateTime(postDate.Year, mode[0] == 1 ? postDate.Month : 1, mode[1] == 1 ? postDate.Day : 1, postDate.Hour * mode[2], postDate.Minute * mode[3], sec*mode[4]);
                for (int i = 0; i < 4; ++i)
                {
                    string date = "";
                    switch (i)
                    {
                        case 3: date = sec.ToString("D2"); goto case 2;
                        case 2: date = postDate.Minute.ToString("D2") + date; goto case 1;
                        case 1: date = postDate.Hour.ToString("D2") + date; goto case 0;
                        case 0: date = postDate.Day.ToString("D2") + date; break;

                    }
                
                    date = postDate.Year.ToString("D4") + postDate.Month.ToString("D2") + date;

                    for (int t = 0, len = (14 - date.Length)/2; t < len; ++t) 
                    {
                        date += "00";
                    }
                    SortedDictionary<string,Term> sortedTerm = sortedTerms[i];
                    if (sortedTerm.ContainsKey(date))
                    {
                        //sortedTerm[date].AddTweet(tweet.TweetID, tweet.OriginalContent, tweet.PostDate,tweet.Lon,tweet.Lat, tweet.User);
                        sortedTerm[date].AddTweet(tweet);
                    }
                    else
                    {
                        Term t = new Term(date);
                        //t.AddTweet(tweet.TweetID, tweet.OriginalContent, tweet.PostDate, tweet.Lon,tweet.Lat,tweet.User);
                        t.AddTweet(tweet);
                        sortedTerm.Add(date, t);
                    }
                }


            }
            sr.Close();

            #region
            //if (!isCache)
            //{
            //    StreamWriter sw = new StreamWriter(tweetFile + "CACHE");
            //    foreach (KeyValuePair<DateTime, Term> p in sortedTerm)
            //    {
            //        Term term = p.Value;
            //        DateTime dateTime = p.Key;
            //        for (int i = 0, len = term.TweetsCount; i < len; ++i)
            //        {

            //            Tweet tweet = term.Tweets[i];
            //            User user = tweet.User;
            //            sw.WriteLine(dateTime + "\t" + tweet.TweetID + "\t" + tweet.OriginalContent + "\t" + tweet.PostDate + '\t'
            //                + user.UserID + '\t' + user.UserName + '\t' + user.TweetsCount + '\t' + user.Following + '\t' + user.Follower + '\t'+ user.IsV + '\t' + tweet.Lon + '\t' + tweet.Lat);
            //        }

            //    }
            //    sw.Close();
            //}
            #endregion

            return sortedTerms;
        }

        public struct CityStruct 
        {
            public double lon;
            public double lat;
            public string country;
            public CityStruct(double lon, double lat, string country)
            {
                this.lon = lon;
                this.lat = lat;
                this.country = country;
            }
        }

        public static List<CityStruct> LoadCities1000(string cities1000File)
        {
            StreamReader sr = new StreamReader(cities1000File);
            List<CityStruct> cities1000 = new List<CityStruct>();
            while (!sr.EndOfStream)
            { 
                string[] s = sr.ReadLine().Split('\t');
                CityStruct city = new CityStruct(double.Parse(s[0]),double.Parse(s[1]),s[2]);
                cities1000.Add(city);
            }
            return cities1000;
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

        public static HashSet<string> LoadStopWord(string StopWordDictFile)
        {
            if (StopWordDictFile == null)
                return null;

            HashSet<string> _stop_word_dict = new HashSet<string>(StringComparer.OrdinalIgnoreCase);//ignore lowercae or uppercase
            using (StreamReader reader = new StreamReader(StopWordDictFile))
            {
                while (!reader.EndOfStream)
                    _stop_word_dict.Add(reader.ReadLine());
            }

            return _stop_word_dict;
        }

    }
}
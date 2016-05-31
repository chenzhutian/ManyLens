using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using ManyLens.Models;
using System.Diagnostics;
using Newtonsoft.Json;

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
            for (int i = 0, len = vectors.Count; i < len; ++i)
            {
                string s = "";
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

        public static SortedDictionary<string, Term> LoadTweetsAsTermsSortedByDate(string tweetFile, string cacheUserFile)
        {
            if (tweetFile.Equals(config.Parameter.ebolaFile))
            {
                config.Parameter.TimeSpan = 0;
            }
            else
            {
                config.Parameter.TimeSpan = 2;
            }
            SortedDictionary<string, Term> sortedTerm = new SortedDictionary<string, Term>();
            //SortedDictionary<string, Term>[] sortedTerms = new SortedDictionary<string, Term>[4];
            //for (int i = 0; i < 4; ++i)
            //{
            //    sortedTerms[i] = new SortedDictionary<string, Term>();
            //}

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
                Dictionary<string, double> kloutScore = ManyLens.SignalR.ManyLensHub.userKloutScore;
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
                    double score = -1;
                    string userId = tweetAttributes[2];
                    if (kloutScore.ContainsKey(userId))
                    {
                        score = kloutScore[userId];
                    }
                    user = new User(userId, tweetAttributes[1], tweetAttributes[6], tweetAttributes[7], tweetAttributes[8], tweetAttributes[9], tweetAttributes[10], tweetAttributes[11], score);
                    users.Add(userId, user);
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

                string date = "";
                switch (config.Parameter.TimeSpan)
                {
                    case 3: date = sec.ToString("D2"); goto case 2;
                    case 2: date = postDate.Minute.ToString("D2") + date; goto case 1;
                    case 1: date = postDate.Hour.ToString("D2") + date; goto case 0;
                    case 0: date = postDate.Day.ToString("D2") + date; break;
                }

                date = postDate.Year.ToString("D4") + postDate.Month.ToString("D2") + date;
                for (int t = 0, len = (14 - date.Length) / 2; t < len; ++t)
                {
                    date += "00";
                }
                //SortedDictionary<string,Term> sortedTerm = sortedTerms[];
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
            sr.Close();

            //Cache the user file
            //StreamWriter sw = new StreamWriter(cacheUserFile);
            //foreach(KeyValuePair<string, User> item in users)
            //{
            //    //0userId \t  1userName \t 2tweetsCount \t 3following \t 4follower \t 5V \t 6gpsA \t 7gpsB
            //    User user = item.Value;
            //    sw.WriteLine(user.UserID + '\t' + user.UserName + '\t' + user.TweetsCount + '\t' + 
            //        user.Following + '\t' + user.Follower + '\t' + user.IsV + '\t' + user.Lon + '\t' + user.Lat);
            //}
            //sw.Close();

            return sortedTerm;
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
                CityStruct city = new CityStruct(double.Parse(s[0]), double.Parse(s[1]), s[2]);
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

        public static Dictionary<string, double> LoadUserKloutSocre(string scoreFile)
        {
            if (scoreFile == null)
                return null;

            Dictionary<string, double> dict = new Dictionary<string, double>();
            using (StreamReader reader = new StreamReader(scoreFile))
            {
                dict = JsonConvert.DeserializeObject<Dictionary<string, double>>(reader.ReadToEnd());
            }
            return dict;
        }

        public static void DumpTermData(string tweetsFilePath, Term[] tp)
        {
            StreamWriter sw = new StreamWriter(tweetsFilePath);
            foreach (Term term in tp)
            {
                //0date \t 1HasPreprocessed \t 2tweetId \t userId \t 3gpsA \t 4gpsB \t countryName \t 6hashTags \t 7derivedContent \t 8tweetContent
                String s = term.TermDate.ToString("yyyy/MM/dd/HH/mm/ss") + "CZT" +
                           term.TweetsCount + (term.WithinInterval ? "CZT" : "");
                if (term.WithinInterval)
                {
                    List<String> tweetsData = new List<String>();
                    foreach (Tweet tweet in term.Tweets)
                    {
                        string tempTweetData = tweet.TweetID + '\t' + 
                            tweet.User.UserID + '\t' + 
                            tweet.Lon + '\t' + tweet.Lat + '\t' + 
                            tweet.CountryName + '\t' +
                            String.Join("_", tweet.HashTag) + '\t' +
                            tweet.DerivedContent + '\t' +
                            tweet.OriginalContent;
                        tweetsData.Add(tempTweetData);
                    }
                    s += String.Join("CTZ", tweetsData);
                }
                sw.WriteLine(s);
            }
            sw.Close();
        }

        public static SortedDictionary<string, Term> LoadCacheData(string cacheTermsFile, string cacheUsersFile)
        {
            StreamReader sr = new StreamReader(cacheUsersFile);
            Dictionary<string, User> users = new Dictionary<string, User>();
            Dictionary<string, double> kloutScore = ManyLens.SignalR.ManyLensHub.userKloutScore;
            while(!sr.EndOfStream)
            {
                string line = sr.ReadLine();
                string[] attributes = line.Split('\t');
                double score = -1;
                if (kloutScore.ContainsKey(attributes[0]))
                {
                    score = kloutScore[attributes[0]];
                }
                //0userId \t  1userName \t 2tweetsCount \t 3following \t 4follower \t 5V \t 6gpsA \t 7gpsB
                User user = new User(attributes[0], attributes[1], attributes[2], attributes[3], attributes[4], attributes[5], attributes[6], attributes[7],score);
                users.Add(attributes[0], user);
            }
            sr.Close();

            sr = new StreamReader(cacheTermsFile);
            SortedDictionary<string, Term> terms = new SortedDictionary<string, Term>();
            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();

                string[] attributes = line.Split(new string[] { "CZT" }, StringSplitOptions.None);
                attributes[0] = attributes[0].Replace(@"/", "");
                if(attributes.Length < 3)
                {
                    terms.Add(attributes[0], new Term(attributes[0], true, int.Parse(attributes[1])));
                }
                else
                {
                    Term term = new Term(attributes[0]);
                    string[] rawTweetsData = attributes[2].Split(new string[] { "CTZ" }, StringSplitOptions.None);
                    for (int i = 0, len = rawTweetsData.Length; i < len; ++i)
                    {
                        string tempData = rawTweetsData[i];
                        string[] tweetsAttribute = tempData.Split('\t');
                        if (tweetsAttribute.Length < 8) continue;
                        //0tweetId \t 1userId \t 2gpsA \t 3gpsB \t 4countryName \t 5hashTags \t 6derivedContent \t 7tweetContent

                        Tweet tweet = new Tweet(tweetsAttribute[0], tweetsAttribute[7], attributes[0], tweetsAttribute[2], tweetsAttribute[3], users[tweetsAttribute[1]]);
                        tweet.DerivedContent = tweetsAttribute[6];
                        string[] hashTags = tweetsAttribute[5].Split('_');
                        foreach(string hashTag in hashTags)
                        {
                            tweet.AddHashTag(hashTag);
                        }
                        term.AddTweet(tweet);
                    }
                    term.HasPreprocessed = true;
                    terms.Add(attributes[0], term);
                }
            }
            sr.Close();
            return terms;
        }
    }
}
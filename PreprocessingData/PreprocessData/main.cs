using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using edu.stanford.nlp.sentiment;
using edu.stanford.nlp.pipeline;
using edu.stanford.nlp.ling;
using edu.stanford.nlp.util;
using edu.stanford.nlp.trees;
using edu.stanford.nlp.neural.rnn;
using java.util;
using System.IO;

namespace PreprocessingData
{
    class main
    {
        static void Main()
        {
            //StreamReader sr = new StreamReader(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDatafifa2WithSentiment");

            //while (!sr.EndOfStream)
            //{
            //    string line = sr.ReadLine();

            //    string[] attributes = line.Split(new string[] { "CzTCZT" }, StringSplitOptions.None);
            //    // attributes[0] = attributes[0].Replace(@"/", "");

            //    if (attributes.Length >= 3)
            //    {
            //        string[] rawTweetsData = attributes[2].Split(new string[] { "CtZCTZ" }, StringSplitOptions.None);
            //        List<string> tweetsDataWithSentiment = new List<string>();
            //        for (int i = 0, len = rawTweetsData.Length; i < len; ++i)
            //        {
            //            string tempData = rawTweetsData[i];
            //            string[] tweetsAttribute = tempData.Split('\t');
            //            if (tweetsAttribute.Length < 8) continue;
            //            //0tweetId \t 1userId \t 2gpsA \t 3gpsB \t 4countryName \t 5hashTags \t 6derivedContent \t 7tweetContent \t 8sentiment
            //            Console.WriteLine(tweetsAttribute[8]);
            //        }
            //    }
            //}
            //sr.Close();

            //Console.WriteLine("finish all");
            //Console.ReadLine();
            // combineFile();
            calSentiment();
        }

        public static void combineFile()
        {
            StreamReader sr = new StreamReader(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDataebola0");
            StreamReader sr1 = new StreamReader(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDataebola0WithSentiment");
            StreamWriter sw = new StreamWriter(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDataebola0WithSentiment_");
           
            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();

                string[] attributes = line.Split(new string[] { "CzTCZT" }, StringSplitOptions.None);
                // attributes[0] = attributes[0].Replace(@"/", "");

                if (attributes.Length >= 3)
                {
                    sw.WriteLine(sr1.ReadLine());
                }
                else
                {
                    sw.WriteLine(line);
                }
            }
            sr.Close();
            sr1.Close();
            sw.Close();

            Console.WriteLine("finish all");
            Console.ReadLine();
        }

        public static SortedDictionary<string, Term> SplitTweetsToTerm(string tweetFile, string cacheUserFile)
        {
            SortedDictionary<string, Term> sortedTerm = new SortedDictionary<string, Term>();
            Dictionary<string, User> users = new Dictionary<string, User>();
            StreamReader sr = new StreamReader(tweetFile);

            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();
                string[] tweetAttributes = line.Split('\t');
                Dictionary<string, double> kloutScore = ManyLens.SignalR.ManyLensHub.userKloutScore;

                //0tweetId \t 1userName \t 2userId \t 3tweetContent \t 4tweetDate \t 5userHomepage \t 6tweetsCount \t 7following 
                //\t 8follower \9 13V \t 10gpsA \t 11gpsB   \t 12countryName
                Tweet tweet = null;
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
                if (sortedTerm.ContainsKey(date))
                {
                    sortedTerm[date].AddTweet(tweet);
                }
                else
                {
                    Term t = new Term(date);
                    t.AddTweet(tweet);
                    sortedTerm.Add(date, t);
                }
            }

            sr.Close();

            // Cache the user file
            StreamWriter sw = new StreamWriter(cacheUserFile);
            foreach(KeyValuePair<string, User> item in users)
            {
                //0userId \t  1userName \t 2tweetsCount \t 3following \t 4follower \t 5V \t 6gpsA \t 7gpsB
                User user = item.Value;
                sw.WriteLine(user.UserID + '\t' + user.UserName + '\t' + user.TweetsCount + '\t' + 
                    user.Following + '\t' + user.Follower + '\t' + user.IsV + '\t' + user.Lon + '\t' + user.Lat);
            }
            sw.Close();

            return sortedTerm;
        }

        private async Task PushPoint(SortedDictionary<string, Term>dateTweetsFreq)
        {
            //set the parameter
            double alpha = 0.125;
            double beta = 1.5;
            List<string> UserIds = new List<string>();
            //StreamWriter sw = new StreamWriter(config.Parameter.fifaFile+"EventUserIds");
            await Task.Run(() =>
            {
                Debug.WriteLine("Thread id of pull point " + Thread.CurrentThread.ManagedThreadId);
                //Peak Detection
                //下面这个实现有往回的动作，并不是真正的streaming，要重新设计一下
                int p = 5;

                double cutoff = 0, mean = 0, diff = 0, variance = 0;
                Term[] tp = dateTweetsFreq.Values.ToArray();

                #region init some variables
                //init reset the type of each point
                for (int i = 0, len = tp.Length; i < len; ++i)
                {
                    tp[i].PointType = 0;
                }

                //init mean and variance
                for (int i = 0; i < p; i++)
                {
                    mean += tp[i].DTweetsCount;
                }
                mean = mean / p;

                for (int i = 0; i < p; i++)
                {
                    variance = variance + Math.Pow(tp[i].DTweetsCount - mean, 2);
                }
                variance = Math.Sqrt(variance / p);
                #endregion

                for (int i = p, t = 0; t < tp.Length; i++, t++)
                {
                    #region Window open here
                    if (i < tp.Length)
                    {
                        cutoff = variance * beta;
                        if (Math.Abs(tp[i].DTweetsCount - mean) > cutoff && tp[i].DTweetsCount > tp[i - 1].DTweetsCount)
                        {
                            int begin = i - 1;
                            while (i < tp.Length && tp[i].DTweetsCount > tp[i - 1].DTweetsCount)
                            {
                                diff = Math.Abs(tp[i].DTweetsCount - mean);
                                variance = alpha * diff + (1 - alpha) * variance;
                                mean = alpha * mean + (1 - alpha) * tp[i].DTweetsCount;
                                i++;
                            }

                            int end = i;
                            int peak = i - 1;
                            tp[i - 1].IsPeak = true;
                            while (i < tp.Length && tp[i].DTweetsCount > tp[begin].DTweetsCount)
                            {
                                cutoff = variance * beta;
                                if (Math.Abs(tp[i].DTweetsCount - mean) > cutoff && tp[i].DTweetsCount > tp[i - 1].DTweetsCount)
                                {
                                    end = --i;
                                    break;
                                }
                                else
                                {
                                    diff = Math.Abs(tp[i].DTweetsCount - mean);
                                    variance = alpha * diff + (1 - alpha) * variance;
                                    mean = alpha * mean + (1 - alpha) * tp[i].DTweetsCount;
                                    end = i++;
                                }
                            }

                            begin = peak - 1;
                            end = peak + 1;
                            tp[begin].BeginPoint = tp[begin].ID;
                            tp[begin].EndPoint = tp[end].ID;
                            tp[begin].WithinInterval = true;
                            tp[begin].PointType += 1;

                            tp[end].BeginPoint = tp[begin].ID;
                            tp[end].EndPoint = tp[end].ID;
                            tp[end].WithinInterval = true;
                            tp[end].PointType += 2;

                            for (int k = begin + 1; k < end; ++k)
                            {
                                tp[k].BeginPoint = tp[begin].ID;
                                tp[k].EndPoint = tp[end].ID;
                                tp[k].WithinInterval = true;
                                tp[k].PointType = 4;
                            }
                        }
                        else
                        {
                            diff = Math.Abs(tp[i].DTweetsCount - mean);
                            variance = alpha * diff + (1 - alpha) * variance;
                            mean = alpha * mean + (1 - alpha) * tp[i].DTweetsCount;
                        }
                    }
                    #endregion
                }
            });
            return dateTweetsFreq;
        }

        public static void calSentiment()
        {
            StreamReader sr = new StreamReader(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDatafifa3");
            StreamWriter sw = new StreamWriter(@"..\..\..\..\ManyLens\Backend\DataBase\ProcessedTermsDatafifa3WithSentiment");
            Properties props = new Properties();
            props.setProperty("annotators", "tokenize, ssplit, parse, sentiment");

            var curDir = Environment.CurrentDirectory;
            var jarRoot = @"..\..\..\..\ManyLens\Backend\DataBase\models";
            Directory.SetCurrentDirectory(jarRoot);
            StanfordCoreNLP pipeline = new StanfordCoreNLP(props);
            Directory.SetCurrentDirectory(curDir);

            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();

                string[] attributes = line.Split(new string[] { "CzTCZT" }, StringSplitOptions.None);
                // attributes[0] = attributes[0].Replace(@"/", "");
                if (double.Parse(attributes[0]) > 20140709043000) break;
                if (attributes.Length >= 3)
                {
                    string[] rawTweetsData = attributes[2].Split(new string[] { "CtZCTZ" }, StringSplitOptions.None);
                    List<string> tweetsDataWithSentiment = new List<string>();
                    for (int i = 0, len = rawTweetsData.Length; i < len; ++i)
                    {
                        string tempData = rawTweetsData[i];
                        string[] tweetsAttribute = tempData.Split('\t');
                        if (tweetsAttribute.Length < 8) continue;
                        //0tweetId \t 1userId \t 2gpsA \t 3gpsB \t 4countryName \t 5hashTags \t 6derivedContent \t 7tweetContent
                        string tweetContent = tweetsAttribute[6];
                        int longest = 0;
                        int mainSentiment = 0;

                        Annotation annotation = new Annotation(tweetContent);
                        pipeline.annotate(annotation);
                        var sentences = annotation.get(typeof(CoreAnnotations.SentencesAnnotation)) as ArrayList;

                        foreach (CoreMap sentence in sentences)
                        {
                            Tree tree = (Tree)sentence.get(typeof(SentimentCoreAnnotations.SentimentAnnotatedTree));
                            int sentiment = RNNCoreAnnotations.getPredictedClass(tree);
                            String partText = sentence.ToString();
                            if (partText.Length > longest)
                            {
                                mainSentiment = sentiment;
                                longest = partText.Length;
                            }
                        }
                        tempData += '\t' + mainSentiment.ToString();
                        tweetsDataWithSentiment.Add(tempData);
                    }

                    sw.WriteLine(attributes[0] + "CzTCZT" + attributes[1] + "CzTCZT" + String.Join("CtZCTZ", tweetsDataWithSentiment));
                }
                else
                {
                    sw.WriteLine(line);
                }
            }
            sr.Close();
            sw.Close();

            Console.WriteLine("finish all");
            Console.ReadLine();
        }
    }
}

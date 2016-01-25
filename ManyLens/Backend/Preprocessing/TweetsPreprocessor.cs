using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Iveonik.Stemmers;
using ManyLens.IO;
using ManyLens.Models;

namespace ManyLens.Preprocessing
{
    public class TweetsPreprocessor
    {

        public static void ProcessTweetParallel(DerivedTweetSet tweetSet)
        {
            if (tweetSet.HasPreprocessed)
            {
                return;
            }

            //deleting stop_words, stop_abbreviation_words, stop_hashtags .
            Regex wordreg = new Regex(@"#\w+|\w+");//hashtag(#\w+)or(|) word(\w+) 
            IStemmer stemmer = new EnglishStemmer();
            //load stopwords
            HashSet<string> stopWords = ManyLens.SignalR.ManyLensHub.stopWords;

            int tweetsCount = tweetSet.TweetsCount - 1;
            //clear the tweets content
            Parallel.ForEach(tweetSet.Tweets, tweet =>
            {
                if (tweet.DerivedContent != null) return;
                string derivedContent = FilterSpecialToken(tweet.OriginalContent);
                string newContent = "";
                //match words in tweet content
                MatchCollection words = wordreg.Matches(derivedContent);

                for (int j = 0, lenj = words.Count; j < lenj; ++j)
                {
                    string originalWord = words[j].Value;

                    if (originalWord[0] == '#')
                    {
                        tweet.AddHashTag(originalWord);
                        originalWord = originalWord.Substring(1, originalWord.Length - 1);
                    }
                    string deriveWord = WordFilterWithStemmer(originalWord, stopWords, stemmer);
                    newContent = newContent + " " + deriveWord;
                }
                tweet.DerivedContent = newContent != null && newContent.Length > 2 ? newContent.Trim() : null;
            });

            tweetsCount = tweetSet.TweetsCount - 1;
            for (int i = tweetsCount; i >= 0; --i)
            {
                if (tweetSet.GetTweetDerivedContentAt(i) == null)
                    tweetSet.RemoveTweetAt(i);
            }

            tweetSet.HasPreprocessed = true;
        }

        public static void ProcessTweetParallel(DerivedTweetSet tweetSet, IProgress<double> progress)
        {
            if (tweetSet.HasPreprocessed)
            {
                progress.Report(0.5);
                return;
            }

            //deleting stop_words, stop_abbreviation_words, stop_hashtags .
            Regex wordreg = new Regex(@"#\w+|\w+");//hashtag(#\w+)or(|) word(\w+) 
            IStemmer stemmer = new EnglishStemmer();
            //load stopwords
            HashSet<string> stopWords = ManyLens.SignalR.ManyLensHub.stopWords;

            int percent = 0;
            int tweetsCount = tweetSet.TweetsCount - 1;
            //clear the tweets content
            Parallel.ForEach(tweetSet.Tweets, tweet =>
            {
                if (tweet.DerivedContent != null) return;
                string derivedContent = FilterSpecialToken(tweet.OriginalContent);
                string newContent = "";
                //match words in tweet content
                MatchCollection words = wordreg.Matches(derivedContent);

                for (int j = 0, lenj = words.Count; j < lenj; ++j)
                {
                    string originalWord = words[j].Value;

                    if (originalWord[0] == '#')
                    {
                        tweet.AddHashTag(originalWord);
                        originalWord = originalWord.Substring(1, originalWord.Length - 1);
                    }
                    string deriveWord = WordFilterWithStemmer(originalWord, stopWords, stemmer);
                    newContent = newContent + " " + deriveWord;
                }

                tweet.DerivedContent = newContent != null && newContent.Length > 2 ? newContent.Trim() : null;

                System.Threading.Interlocked.Increment(ref percent);
                if (percent % 10 == 0)
                {
                    double report = ((double)percent / tweetsCount) * 0.7 + 0.1;
                    progress.Report(report);
                }
            });

            percent = 0;
            tweetsCount = tweetSet.TweetsCount - 1;
            for (int i = tweetsCount; i >= 0; --i)
            {
                if (tweetSet.GetTweetDerivedContentAt(i) == null)
                    tweetSet.RemoveTweetAt(i);

                if ((double)(tweetsCount - i) / tweetsCount > (double)percent / 10.0)
                {
                    progress.Report((double)(percent + 90) / 100.0);
                    ++percent;
                }
            }
            tweetSet.HasPreprocessed = true;
        }

        public static void ProcessTweet(DerivedTweetSet interval)
        {
            if (interval.HasPreprocessed) return;

            //deleting stop_words, stop_abbreviation_words, stop_hashtags .
            Regex wordreg = new Regex(@"#\w+|\w+");//hashtag(#\w+)or(|) word(\w+) 
            IStemmer stemmer = new EnglishStemmer();
            //load stopwords
            HashSet<string> stopWords = ManyLens.SignalR.ManyLensHub.stopWords;

            int tweetsCount = interval.TweetsCount - 1;
            //clear the tweets content
            for (int i = tweetsCount; i >= 0; --i)
            {

                Tweet tweet = interval.Tweets[i];
                if (tweet.DerivedContent != null) return;
                string derivedContent = FilterSpecialToken(tweet.OriginalContent);
                string newContent = "";
                //match words in tweet content
                MatchCollection words = wordreg.Matches(derivedContent);

                for (int j = 0, lenj = words.Count; j < lenj; ++j)
                {
                    string originalWord = words[j].Value;
                    if (originalWord[0] == '#')
                    {
                        tweet.AddHashTag(originalWord);
                        originalWord = originalWord.Substring(1, originalWord.Length - 1);
                    }
                    string deriveWord = WordFilterWithStemmer(originalWord, stopWords, stemmer);
                    newContent = newContent + " " + deriveWord;
                }

                if (newContent != null && newContent.Length > 2)
                {
                    tweet.DerivedContent = newContent.Trim();
                }

            };

            tweetsCount = interval.TweetsCount - 1;
            for (int i = tweetsCount; i >= 0; --i)
            {
                if (interval.GetTweetDerivedContentAt(i) == null)
                    interval.RemoveTweetAt(i);
            }
            interval.HasPreprocessed = true;
        }

        public static void ProcessTweet(DerivedTweetSet interval, IProgress<double> progress)
        {
            if (interval.HasPreprocessed) return;

            //deleting stop_words, stop_abbreviation_words, stop_hashtags .
            Regex wordreg = new Regex(@"#\w+|\w+");//hashtag(#\w+)or(|) word(\w+) 
            IStemmer stemmer = new EnglishStemmer();
            //load stopwords
            HashSet<string> stopWords = ManyLens.SignalR.ManyLensHub.stopWords;

            int percent = 0;
            int tweetsCount = interval.TweetsCount - 1;
            //clear the tweets content
            for (int i = tweetsCount; i >= 0; --i)
            {

                Tweet tweet = interval.Tweets[i];
                if (tweet.DerivedContent != null) return;
                string derivedContent = FilterSpecialToken(tweet.OriginalContent);
                string newContent = "";
                //match words in tweet content
                MatchCollection words = wordreg.Matches(derivedContent);

                for (int j = 0, lenj = words.Count; j < lenj; ++j)
                {
                    string originalWord = words[j].Value;
                    if (originalWord[0] == '#')
                    {
                        tweet.AddHashTag(originalWord);
                        originalWord = originalWord.Substring(1, originalWord.Length - 1);
                    }
                    string deriveWord = WordFilterWithStemmer(originalWord, stopWords, stemmer);
                    newContent = newContent + " " + deriveWord;
                }

                if (newContent != null && newContent.Length > 2)
                {
                    tweet.DerivedContent = newContent.Trim();
                }

                percent++;
                if (percent % 10 == 0)
                {
                    double report = ((double)percent / tweetsCount) * 0.7 + 0.1;
                    progress.Report(report);
                }
            };

            percent = 0;
            tweetsCount = interval.TweetsCount - 1;
            for (int i = tweetsCount; i >= 0; --i)
            {
                if (interval.GetTweetDerivedContentAt(i) == null)
                    interval.RemoveTweetAt(i);

                if ((double)(tweetsCount - i) / tweetsCount > (double)percent / 10.0)
                {
                    progress.Report((double)(percent + 90) / 100.0);
                    ++percent;
                }
            }
            interval.HasPreprocessed = true;
        }

        private static string WordFilterWithStemmer(string word, HashSet<string> stopWords, IStemmer stemmer)
        {

            string tmpword = word.ToLower().Trim();

            if (tmpword.Length <= 2 || tmpword.Length > 20)
                return "";

            if (stopWords != null && stopWords.Contains(tmpword))//ignore stopwords
                return "";

            //tmpword = stemmer.Stem(tmpword.Trim());

            return tmpword;
        }

        /// <summary>
        /// replace url with space
        /// </summary>
        /// <param name="tweetContent"></param>
        /// <returns></returns>
        private static string FilterURL(string tweetContent)
        {
            string newContent = tweetContent;

            //replace all urls in tweet with " " 
            newContent += " ";
            Regex urlreg = new Regex(@"https?://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?");
            Regex httpreg = new Regex(@"(http:\\+/\\+/?|www[.]).*?[#\s]");
            newContent = urlreg.Replace(newContent, " ");
            newContent = httpreg.Replace(newContent, " ");
            //MatchCollection urls = urlreg.Matches(newContent);
            //for (int i = 0; i < urls.Count; i++)
            //    newContent = newContent.Replace(urls[i].Value, " ");
            //newContent = httpreg.Replace(newContent, " ");
            return newContent;
        }

        /// <summary>
        /// replace some special tokens in tweet
        /// </summary>
        /// <param name="tweetContent">tweet content</param>
        /// <returns></returns>
        private static string FilterSpecialToken(string tweetContent)
        {
            //All in one
            Regex Allreg = new Regex(@"([Rr][Tt] ?@\w+\b )|(@\w+\b)|(\w+...\b) | (https?://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?) | (http:\\+/\\+/?|www[.]).*?[#\s] | \b\w*(\w)\1{2}\w*\b | [\u4e00-\u9fa5]");
            tweetContent =  Allreg.Replace(tweetContent, "");

            return tweetContent.Trim();
        }

    }
}
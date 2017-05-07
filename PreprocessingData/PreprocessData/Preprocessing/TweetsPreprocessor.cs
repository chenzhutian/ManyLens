using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Iveonik.Stemmers;
using Models;

namespace Preprocessing
{
    public class TweetsPreprocessor
    {
        public static HashSet<string> stopWords = null;

        public static HashSet<string> StopWords
        {
            get
            {
                if(stopWords == null)
                {
                    stopWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                    using (StreamReader sr = new StreamReader(@"../stopwords"))
                    {
                        while (!sr.EndOfStream)
                            stopWords.Add(sr.ReadLine());
                    }
                }
                return stopWords;
            }
        }

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
            HashSet<string> stopWords = StopWords;

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

        public static void ProcessTweet(DerivedTweetSet interval)
        {
            if (interval.HasPreprocessed) return;

            //deleting stop_words, stop_abbreviation_words, stop_hashtags .
            Regex wordreg = new Regex(@"#\w+|\w+");//hashtag(#\w+)or(|) word(\w+) 
            IStemmer stemmer = new EnglishStemmer();
            //load stopwords
            HashSet<string> stopWords = StopWords;

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

        private static string WordFilterWithStemmer(string word, HashSet<string> stopWords, IStemmer stemmer)
        {

            string tmpword = word.ToLower().Trim();

            if (tmpword.Length <= 2 || tmpword.Length > 20)
                return "";

            if (stopWords != null && stopWords.Contains(tmpword))//ignore stopwords
                return "";

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
            MatchCollection urls = urlreg.Matches(newContent);
            for (int i = 0; i < urls.Count; i++)
                newContent = newContent.Replace(urls[i].Value, " ");
            newContent = httpreg.Replace(newContent, " ");
            return newContent;
        }

        /// <summary>
        /// replace some special tokens in tweet
        /// </summary>
        /// <param name="tweetContent">tweet content</param>
        /// <returns></returns>
        private static string FilterSpecialToken(string tweetContent)
        {
            tweetContent += " ";
            Regex urlreg = new Regex(@"https?://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?");
            Regex httpreg = new Regex(@"(http:\\+/\\+/?|www[.]).*?[""#\s]");
            tweetContent = urlreg.Replace(tweetContent, " ");
            tweetContent = httpreg.Replace(tweetContent, " ");

            //replace rt@account 
            //such as: RT @seymoredollas: 
            //RT@seymoredollas: niggas 
            Regex RTreg = new Regex(@"[Rr][Tt] ?@\w+\b");
            tweetContent = RTreg.Replace(tweetContent, " ");

            //replace @...
            Regex mentionreg = new Regex(@"@\w+\b");
            tweetContent = mentionreg.Replace(tweetContent, " ");

            //replace words endswith "...", such as: "peo..."
            Regex mentionreg1 = new Regex(@"\w+...\b");
            MatchCollection mentions1 = mentionreg.Matches(tweetContent);
            for (int i = 0; i < mentions1.Count; i++)
                tweetContent = tweetContent.Replace(mentions1[i].Value, " ");

            Regex repeatreg = new Regex(@"\b\w*(\w)\1{2}\w*\b");
            MatchCollection repeats = repeatreg.Matches(tweetContent);
            for (int i = 0; i < repeats.Count; i++)
                tweetContent = tweetContent.Replace(repeats[i].Value, " ");

            //replace chinese words 
            Regex chReg = new Regex(@"[\u4e00-\u9fa5]");
            MatchCollection chmc = chReg.Matches(tweetContent);
            for (int i = 0; i < chmc.Count; i++)
                tweetContent = tweetContent.Replace(chmc[i].Value, " ");

            return tweetContent.Trim();
        }

    }
}
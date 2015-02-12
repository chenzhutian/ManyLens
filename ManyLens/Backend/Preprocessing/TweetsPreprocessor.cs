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
        /// <summary>
        /// only for summarization
        /// </summary>
        /// <param name="tweetsFile"></param>
        /// <param name="stopwordFile"></param>
        /// <param name="stopAbbreviationWordFile"></param>
        /// <param name="stopHashtagFile"></param>
        /// <param name="pluralDictFile"></param>
        /// <param name="predefinedTopicWords"></param>
        public static List<Tweet> ProcessTweet(String tweetsFile, String stopwordFile)
        {
            List<Tweet> tweets = TweetsIO.LoadTweetsAsList(tweetsFile);

            System.Console.WriteLine("deleting repeated tweet ...");
            DelRepeats(ref tweets);

            //del stop words, stop abbreviation words, stop hashtags
            System.Console.WriteLine("deleting stop_words, stop_abbreviation_words, stop_hashtags ...");
            CleanTweet(ref tweets, stopwordFile);
            
            return tweets;
        }

        public static List<Tweet> ProcessTweet(List<Tweet> tweets, String stopwordFile)
        {
            System.Console.WriteLine("deleting repeated tweet...");
            DelRepeats(ref tweets);

            System.Console.WriteLine("deleting stop_words, stop_abbreviation_words, stop_hashtags ...");
            CleanTweet(ref tweets, stopwordFile);

            return tweets;
        }

        public async static Task ProcessTweetAsync(TweetSet tweetSet, String stopwordFile,IProgress<double> progress)
        {
            if (tweetSet.HasPreprocessed)
                return;

            //deleting repeated tweet.
            Dictionary<string, bool> tweetsDict = new Dictionary<string, bool>();
            //deleting stop_words, stop_abbreviation_words, stop_hashtags .
            Regex wordreg = new Regex(@"#\w+|\w+");//hashtag(#\w+)or(|) word(\w+) 
            IStemmer stemmer = new EnglishStemmer();
            //load stopwords
            HashSet<string> stopWords = LoadStopWord(stopwordFile);

            await Task.Run(() => 
            {
                int percent = 0;
                int tweetsCount = tweetSet.TweetsCount - 1;
                
                for (int i = tweetsCount; i >= 0; --i)
                {
                    if (tweetsDict.ContainsKey(tweetSet.GetTweetIDAt(i)))
                        tweetSet.RemoveTweetAt(i);
                    else
                        tweetsDict.Add(tweetSet.GetTweetIDAt(i), true);

                    if ((double)(tweetsCount - i) / tweetsCount > (double)percent / 10.0)
                    {
                        progress.Report((double)percent / 100.0);
                        ++percent;
                    }
                }

                percent = 0;
                Parallel.ForEach(tweetSet.Tweets, tweet => {
                    string derivedContent = FilterSpecialToken(tweet.OriginalContent);
                    string newContent = "";
                    //match words in tweet content
                    MatchCollection words = wordreg.Matches(derivedContent);

                    for (int j = 0; j < words.Count; ++j)
                    {
                        string originalWord = words[j].Value.Trim();
                        string deriveWord = WordFilterWithStemmer(originalWord, stopWords, stemmer);
                        newContent = newContent + " " + deriveWord;
                    }

                    if (newContent != null && newContent.Length > 2)
                    {
                        tweet.DerivedContent = newContent.Trim();
                    }
                    System.Threading.Interlocked.Increment(ref percent);
                    if (percent % 10 == 0)
                    { 
                        double report = ((double)percent/tweetsCount) * 0.7+0.1;
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
                        progress.Report((double)(percent+90) / 100.0);
                        ++percent;
                    }
                }

                #region sequential execution
                /*
                for (int i = tweetsCount, percent = 0; i >= 0; --i)
                {
                    if (tweetsDict.ContainsKey(tweets.ElementAt(i).TweetID))
                    {
                        tweets.RemoveAt(i);
                    }
                    else
                    {
                        tweetsDict.Add(tweets.ElementAt(i).TweetID, true);
                        Tweet tweet = tweets[i];
                        string derivedContent = FilterSpecialToken(tweet.OriginalContent);
                        string newContent = null;
                        //match words in tweet content
                        MatchCollection words = wordreg.Matches(derivedContent);

                        for (int j = 0; j < words.Count; ++j)
                        {
                            string originalWord = words[j].Value.Trim();
                            string deriveWord = WordFilterWithStemmer(originalWord, stopWords, stemmer);
                            if (deriveWord != null)
                            {
                                newContent = newContent + " " + deriveWord;
                            }
                        }

                        if (newContent != null && newContent.Length > 2)
                        {
                            tweet.DerivedContent = newContent.Substring(1);
                            //tweets[i] = tweet;
                        }
                        else
                        {
                            tweets.RemoveAt(i);
                        }
                    }

                    if ((double)(tweetsCount - i) / tweetsCount > (double)percent / 100.0)
                    {
                        progress.Report((double)percent / 100.0);
                        ++percent;
                    }

                }*/
#endregion
            });
            tweetSet.HasPreprocessed = true; 
        }

        /// <summary>
        /// del repreated tweets
        /// </summary>
        /// <param name="tweetFile">input original tweet file</param>
        private static void DelRepeats(ref List<Tweet> tweets)
        {
            Dictionary<string,bool> tweetcDict = new Dictionary<string,bool>();
            List<string> tweetsDict = new List<string>();
            int count = tweets.Count -1 ;
            for(int i = count; i >=0; --i)
            {
                if(tweetsDict.Contains(tweets.ElementAt(i).TweetID))
                    tweets.RemoveAt(i);
                else
                    tweetsDict.Add(tweets.ElementAt(i).TweetID);
            }

        }

        ///del stopwords and abbreviation terms, reserve predifined topic words(such as microsoft, troy davis)
        /// <summary>
        /// del stopwords, abbreviation and predefined topic terms, only #hashtag and effective words
        /// </summary>
        /// <param name="sortedTweetFile"></param>
        /// <param name="stopwordFile">common stopword</param>
        /// <param name="stopAbbreviationWordFile">abbreviation word used often in tweets</param>
        /// <param name="predefinedTopicTerms">special words related with the topic (such as troy davis, microsoft)</param>
        /// <param name="preprocessedTweetFile"></param>
        private static void CleanTweet(ref List<Tweet> tweets, String stopwordFile)
        {
            int tweetsCount = tweets.Count-1;
            Regex wordreg = new Regex(@"#\w+|\w+");//hashtag(#\w+)or(|) word(\w+) 
            //load stopwords
            HashSet<string> stopWords = LoadStopWord(stopwordFile);
            for (int i = tweetsCount; i >= 0; --i)
            { 
                Tweet tweet = tweets[i];
                string derivedContent = FilterSpecialToken(tweet.OriginalContent);
                string newContent = null;
                //match words in tweet content
                MatchCollection words = wordreg.Matches(derivedContent);
                IStemmer stemmer = new EnglishStemmer();
                for (int j = 0; j < words.Count; ++j)
                {
                    string originalWord = words[j].Value.Trim();
                    string deriveWord = WordFilterWithStemmer(originalWord, stopWords, stemmer);
                    if (deriveWord != null)
                    {
                        newContent = newContent + " " + deriveWord;
                    }
                }

                if (newContent != null && newContent.Length > 2)
                {
                    tweet.DerivedContent = newContent.Substring(1);
                    tweets[i] = tweet;
                }
                else
                {
                    tweets.RemoveAt(i);
                }
            }

        }

        /// <summary>
        /// filter to filter out some words
        /// </summary>
        /// <param name="word">word to fiter</param>
        /// <param name="stopWords">common stop words</param>
        /// <param name="stopAbbreviationWords">abbreviation words in tweets, cloud be null</param>
        /// <param name="predefinedTopicTerms">words related with the topic,clould be null</param>
        /// <returns>the word or null</returns>
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

            tweetContent = FilterURL(tweetContent);

            //replace rt@account 
            //such as: RT @seymoredollas: 
            //RT@seymoredollas: niggas 
            Regex RTreg = new Regex(@"[Rr][Tt] ?@\w+\b");
            MatchCollection rts = RTreg.Matches(tweetContent);
            for (int i = 0; i < rts.Count; i++)
                tweetContent = tweetContent.Replace(rts[i].Value, " ");

            //replace @...
            Regex mentionreg = new Regex(@"@\w+\b");
            MatchCollection mentions = mentionreg.Matches(tweetContent);
            for (int i = 0; i < mentions.Count; i++)
                tweetContent = tweetContent.Replace(mentions[i].Value, " ");

            //replace words endswith "...", such as: "peo..."
            Regex mentionreg1 = new Regex(@"\w+...\b");
            MatchCollection mentions1 = mentionreg.Matches(tweetContent);
            for (int i = 0; i < mentions1.Count; i++)
                tweetContent = tweetContent.Replace(mentions1[i].Value, " ");

            tweetContent = tweetContent.Replace("_", " ");
            tweetContent = tweetContent.Replace("-", " ");
            tweetContent = tweetContent.Replace("!", " ");
            tweetContent = tweetContent.Replace("\"", " ");
            tweetContent = tweetContent.Replace("?", " ");
            tweetContent = tweetContent.Replace(".", " ");
            tweetContent = tweetContent.Replace("=", " ");
            tweetContent = tweetContent.Replace(":(", " ");
            tweetContent = tweetContent.Replace("&gt", " ");
            tweetContent = tweetContent.Replace("&lt;", " ");
            tweetContent = tweetContent.Replace("&amp", " ");
            tweetContent = tweetContent.Replace("&", " ");
            tweetContent = tweetContent.Replace("..", " ");
            tweetContent = tweetContent.Replace(":)", " ");
            tweetContent = tweetContent.Replace("/", " ");
            tweetContent = tweetContent.Replace(":", " ");
            tweetContent = tweetContent.Replace(",", " ");
            tweetContent = tweetContent.Replace(";", " ");
            tweetContent = tweetContent.Replace("‘", " ");
            tweetContent = tweetContent.Replace("\"", " ");
            tweetContent = tweetContent.Replace("[", " ");
            tweetContent = tweetContent.Replace("]", " ");
            tweetContent = tweetContent.Replace("”", " ");
            tweetContent = tweetContent.Replace("�", " ");
            tweetContent = tweetContent.Replace("#", " ");

            //replace pure number, such as 100
            Regex numreg = new Regex(@"\b\d+\b");
            MatchCollection nums = numreg.Matches(tweetContent);
            for (int i = 0; i < nums.Count; i++)
                tweetContent = tweetContent.Replace(nums[i].Value, " ");

            //replace number or words start with number
            //such as 2010, 20g
            Regex numreg1 = new Regex(@"\b\d+\w*\b");
            MatchCollection nums1 = numreg1.Matches(tweetContent);
            for (int i = 0; i < nums1.Count; i++)
                tweetContent = tweetContent.Replace(nums1[i].Value, " ");

            //repleace words with a same character repeated more than 3 times,such as "boook"
            //\b: start form a word
            //\w*: 0 or several times of a character
            //\w: a character
            //\1: previous matched text by (\w)
            //{2}: represent repeated >= 2
            //for example: boook, (\w) match o, 2 present that o repeates 2 times (that is ooo)
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


        private static HashSet<string> LoadStopWord(string StopWordDictFile)
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
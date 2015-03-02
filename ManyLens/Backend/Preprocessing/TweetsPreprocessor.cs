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

        public static void ProcessTweetAsync(Interval interval, IProgress<double> progress)
        {
            if (interval.HasPreprocessed)
                return;

            //deleting repeated tweet.
            Dictionary<string, bool> tweetsDict = new Dictionary<string, bool>();
            //deleting stop_words, stop_abbreviation_words, stop_hashtags .
            Regex wordreg = new Regex(@"#\w+|\w+");//hashtag(#\w+)or(|) word(\w+) 
            IStemmer stemmer = new EnglishStemmer();
            //load stopwords
            HashSet<string> stopWords = ManyLens.SignalR.ManyLensHub.stopWords;

            //int percent = 0;
            //int tweetsCount = interval.TweetsCount - 1;
            ////Remove the repeat tweets
            //for (int i = tweetsCount; i >= 0; --i)
            //{
            //    if (tweetsDict.ContainsKey(interval.GetTweetIDAt(i)))
            //        interval.RemoveTweetAt(i);
            //    else
            //        tweetsDict.Add(interval.GetTweetIDAt(i), true);

            //    if ((double)(tweetsCount - i) / tweetsCount > (double)percent / 10.0)
            //    {
            //        progress.Report((double)percent / 100.0);
            //        ++percent;
            //    }
            //}

            int percent = 0;
            int tweetsCount = interval.TweetsCount - 1;
            //clear the tweets content
            Parallel.ForEach(interval.Tweets, tweet =>
            {
                string derivedContent = FilterSpecialToken(tweet.OriginalContent);
                string newContent = "";
                //match words in tweet content
                MatchCollection words = wordreg.Matches(derivedContent);

                for (int j = 0,lenj = words.Count; j < lenj; ++j)
                {
                    string originalWord = words[j].Value.Trim();
                    if (originalWord.IndexOf("#") == 0)
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
                System.Threading.Interlocked.Increment(ref percent);
                if (percent % 10 == 0)
                {
                    double report = ((double)percent / tweetsCount) * 0.7 + 0.1;
                    progress.Report(report);
                }
            });

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
            //tweetContent = tweetContent.Replace("#", " ");

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


    }
}
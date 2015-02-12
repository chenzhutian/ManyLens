using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;
using ManyLens.Models;

namespace ManyLens.Segmentor
{
    /// <summary>
    /// this class is used to segment the time series by tweet frequency
    /// and segment the time series by the windows it detects
    /// finaaly it aggregate the segments if user want to do that.
    /// </summary>
    class SegmentByFreq
    {
   
        #region tweet frequency
        /// <summary>
        /// burst point(date): if a point's tweet frequency > cutoff, then it is a burst point
        /// </summary>
        /// <param name="dateTweetsFreq">frequency file</param>
        /// <param name="halfWindow">smoothing window</param>
        /// <param name="alpha">parameter for cutoff</param>
        /// <param name="beta">parameter for cutoff</param>
        public static double GetTweetBurstPointWithSmooth(SortedDictionary<DateTime, Term> dateTweetsFreq, int halfWindow, double alpha, double beta)
        {
            //smooth
            //SmoothTweetSumFreq(dateTweetsFreq, halfWindow);
            if (dateTweetsFreq.Count < 10) { return 0; }

            //get cutoff
            //double cutoff = GetTweetCutoff(dateTweetsFreq, alpha, beta);
            double cutoff = 0, mean = 0, diff = 0, variance = 0;
            
            Term[] tp = dateTweetsFreq.Values.ToArray();
            for (int i = 0; i < 10; i++)
            {
                mean += tp[i].TweetsCount;
            }
            mean = mean / 10;

            for (int i = 0; i < 10; i++)
            {
                variance = variance + Math.Pow(tp[i].TweetsCount - mean, 2);
            }
            variance = Math.Sqrt(variance / 10);
            cutoff = mean + variance * beta;

            for (int i = 10; i < tp.Length; i++)
            {
                if (tp[i].TweetsCount > cutoff)
                {
                    tp[i].TweetBurstCutoff = (int)cutoff;//
                    tp[i].IsTweetBurstPoint = true;
                }
                diff = Math.Abs(tp[i].TweetsCount - mean);
                variance = alpha * diff + (1 - alpha) * variance;
                mean = alpha * mean + (1 - alpha) * tp[i].TweetsCount;
                cutoff = mean + variance * beta;
            }

            return cutoff;
        }

        public static int PeakDetect(SortedDictionary<DateTime, Term> dateTweetsFreq, int halfWindow,int p ,double alpha, double beta)
        {
            //smooth
            //SmoothTweetSumFreq(dateTweetsFreq, halfWindow);
            if (dateTweetsFreq.Count < p) { return 0; }

            //get cutoff
            //double cutoff = GetTweetCutoff(dateTweetsFreq, alpha, beta);
            double cutoff = 0, mean = 0, diff = 0, variance = 0;
            Term[] tp = dateTweetsFreq.Values.ToArray();
            for (int i = 0; i < p; i++)
            {
                mean += tp[i].TweetsCount;
            }
            mean = mean / p;

            for (int i = 0; i < p; i++)
            {
                variance = variance + Math.Pow(tp[i].TweetsCount - mean, 2);
            }
            variance = Math.Sqrt(variance / p);
            

            for (int i = p; i < tp.Length; i++)
            {
                cutoff = variance * beta;
                if (Math.Abs(tp[i].TweetsCount - mean) > cutoff && tp[i].TweetsCount > tp[i - 1].TweetsCount)
                {
                    int start = i - 1;
                    while (i < tp.Length && tp[i].TweetsCount > tp[i - 1].TweetsCount)
                    {
                        diff = Math.Abs(tp[i].TweetsCount - mean);
                        variance = alpha * diff + (1 - alpha) * variance;
                        mean = alpha * mean + (1 - alpha) * tp[i].TweetsCount;
                        i++;
                    }

                    int end = i;
                    while (i < tp.Length && tp[i].TweetsCount > tp[start].TweetsCount)
                    {
                        cutoff = variance * beta;
                        if (Math.Abs(tp[i].TweetsCount - mean) > cutoff && tp[i].TweetsCount > tp[i - 1].TweetsCount)
                        {
                            end = --i;
                            break;
                        }
                        else
                        {
                            diff = Math.Abs(tp[i].TweetsCount - mean);
                            variance = alpha * diff + (1 - alpha) * variance;
                            mean = alpha * mean + (1 - alpha) * tp[i].TweetsCount;
                            end = i++;
                        }
                    }

                    tp[start].PointType += 1;
                    tp[end].PointType += 2;
                }
                else
                {
                    diff = Math.Abs(tp[i].TweetsCount - mean);
                    variance = alpha * diff + (1 - alpha) * variance;
                    mean = alpha * mean + (1 - alpha) * tp[i].TweetsCount;
                }
            }
            return 1;
        }

        ///// <summary>
        ///// smooth each day's tweet_frequency with its neighbors tweet_frequency
        ///// </summary>
        ///// <param name="dateTweetsFreq"></param>
        ///// <param name="halfWindow">smooth window: i-halfwindow,i-halfwindw+1,...,i-1, i, i+1, ..., i+halfwindow</param>
        //private static void SmoothTweetSumFreq(SortedDictionary<DateTime, Term> dateTweetsFreq, int halfWindow)
        //{
        //    if (dateTweetsFreq.Count < 2 * halfWindow)//ignore err: the dateTweetsFreq.Count is too small
        //        return;

        //    Term[] tps = dateTweetsFreq.Values.ToArray();
        //    for (int i = 0; i < halfWindow; i++)//the first halfwindow elements
        //    {//do not smooth
        //        Term tp = tps[i];
        //        tp.TweetF = tp.tweetF;
        //    }

        //    for (int i = dateTweetsFreq.Count - halfWindow; i < dateTweetsFreq.Count; i++)//the last halfwindow elements
        //    {//do not smooth
        //        Term tp = tps[i];
        //        tp.TweetF = tp.tweetF;
        //    }

        //    for (int i = halfWindow; i < dateTweetsFreq.Count - halfWindow; i++)//smooth
        //    {
        //        Term tp = tps[i];
        //        //smooth
        //        double sumFreq = 0;
        //        for (int j = i - halfWindow; j <= i + halfWindow; j++)
        //        {
        //            sumFreq = sumFreq + tps[j].tweetF;
        //        }

        //        tp.TweetF = (uint)(sumFreq / (2 * halfWindow + 1));
        //    }

        //}
        #endregion

        #region segment by tweet frequency
        public static void GetSgementPoint4Peak(int halfWindow, 
                                                double alpha, double beta, 
                                                SortedDictionary<DateTime, Term> dateTweetsFreq, 
                                                List<DateTime> startSegmentPoints, 
                                                List<DateTime> endSegmentPoints)
        {
            //smooth
            //SmoothTweetSumFreq(dateTweetsFreq, halfWindow);
            if (dateTweetsFreq.Count < 10) { return; }

            //get cutoff
            double cutoff = 0, mean = 0, variance = 0, intervalMax = 0;
            DateTime[] dp = dateTweetsFreq.Keys.ToArray();
            Term[] tp = dateTweetsFreq.Values.ToArray();
            for (int i = 0; i < 10; i++)
            {
                mean += tp[i].TweetsCount;
            }
            mean = mean / 10;

            for (int i = 0; i < 10; i++)
            {
                variance = variance + Math.Pow(tp[i].TweetsCount - mean, 2);
            }
            variance = Math.Sqrt(variance / 10);
            cutoff = mean + variance * beta;

            int start = 0, middle = 0, end = 0, lastStart = 0, lastMiddle = 0;
            double emean = 0, evariance = 0, estart = 0;
            for (int i = 10; i < tp.Length; i++)
            {
                if (i - middle > halfWindow && tp[i].TweetsCount > cutoff || 
                    ( (estart - tp[i].TweetsCount) < emean - beta * evariance && estart > tp[i].TweetsCount))
                {
                    double minStart = tp[i - 1].TweetsCount;
                    int minIndex = i - 1;
                    for (int j = i - 1; j > middle + halfWindow; j--)
                    {
                        if (tp[j].TweetsCount < minStart)
                        {
                            minStart = tp[j].TweetsCount;
                            minIndex = j;
                        }
                    }

                    end = minIndex;
                    startSegmentPoints.Add(dp[start]);
                    tp[start].PointType += 1;
                    endSegmentPoints.Add(dp[end]);
                    tp[end].PointType += 2;

                    lastStart = start;
                    start = end;
                    tp[start].IsTweetBurstPoint = true;
                    tp[start].TweetBurstCutoff = cutoff;

                    double smean = tp[i - 1].TweetsCount;
                    double svariance = 0;
                    double tlast = tp[i].TweetsCount;
                    double tmax = tp[i - 1].TweetsCount;
                    int tmaxIndex = i - 1;
                    while (i < tp.Length && 
                           tp[i].TweetsCount >= smean - svariance * beta && 
                           tp[i].TweetsCount > tp[start].TweetsCount)//while (i < tp.Length && tp[i].TweetF >= tp[i - 1].TweetF)
                    {
                        tp[i].TweetBurstCutoff = cutoff;//smean - svariance * beta;
                        if ((tp[i].TweetsCount - smean) * (tlast - smean) < 0)
                        {
                            svariance = (1 - alpha) * svariance;
                        }
                        svariance = (1 - alpha) * svariance + alpha * Math.Abs(tp[i].TweetsCount - smean);
                        smean = (1 - alpha) * smean + alpha * tp[i].TweetsCount;
                        if (tp[i].TweetsCount > tmax)
                        {
                            tmax = tp[i].TweetsCount;
                            tmaxIndex = i;
                        }
                        intervalMax = tp[i].TweetsCount > intervalMax ? tp[i].TweetsCount : intervalMax;

                        cutoff = updateValue(ref mean, ref variance, tp[i].TweetsCount, alpha, beta);
                        i++;
                    }
                    lastMiddle = middle;
                    middle = tmaxIndex;
                    if (i == tp.Length) { break; }
                    estart = mean;//tp[middle].TweetF;
                    emean = estart - tp[i].TweetsCount;
                    evariance = 0;
                }

                if (tp[i].TweetsCount <= tp[start].TweetsCount && 
                    (i - start < halfWindow || tp[start].TweetsCount == intervalMax))
                {
                    tp[start].IsTweetBurstPoint = false;
                    tp[start].PointType = 0;
                    start = lastStart;
                    middle = lastMiddle;
                    if (startSegmentPoints.Count > 0)
                    {
                        startSegmentPoints.RemoveAt(startSegmentPoints.Count - 1);
                        endSegmentPoints.RemoveAt(endSegmentPoints.Count - 1);
                    }
                }
                evariance = (1 - alpha) * evariance + alpha * Math.Abs(estart - tp[i].TweetsCount - emean);
                emean = (1 - alpha) * emean + alpha * Math.Abs(estart - tp[i].TweetsCount);
                tp[i].TweetBurstCutoff = cutoff;
                cutoff = updateValue(ref mean, ref variance, tp[i].TweetsCount, alpha, beta);
            }

            if (start != tp.Length - 1)
            {
                end = tp.Length - 1;
                startSegmentPoints.Add(dp[start]);
                tp[start].PointType += 1;
                endSegmentPoints.Add(dp[end]);
                tp[end].PointType += 2;
            }
        }


        private static double updateValue(ref double mean, ref double dev, double updateValue, double alpha, double beta)
        {
            double diff = updateValue - mean;

            if (diff < 0)
            {
                dev = (1 - alpha) * dev - alpha * diff * Parameter.declineBeta;
            }
            else
            {
                dev = (1 - alpha) * dev + alpha * diff;
            }
            mean = (1 - alpha) * mean + alpha * updateValue;
            return mean + dev * beta;
        }

        /// <summary>
        /// get segment_point
        /// (1)detect burst area (BA)
        /// (2)select the segment_point (lowest point between the end point of previous BA and the start point of current BA)
        /// (3)set segment_point: TermPair.SegmentPoint = Max(tweet frequency)
        /// </summary>
        /// <param name="dateTweetsFreq">input: a hashtag file, hashtag and tweet frequency file analyzed by date</param>
        public static void GetSgementPoint4All(SortedDictionary<DateTime, Term> dateTweetsFreq, 
            List<DateTime> startSegmentPoints, 
            List<DateTime> endSegmentPoints)
        {


            int endofPrevious = -1;
            int startofNext = -1;
            startSegmentPoints.Add(dateTweetsFreq.ElementAt(0).Key);//the first start

            Term[] tp = dateTweetsFreq.Values.ToArray();
            for (int i = 1; i < dateTweetsFreq.Count; i++)
            {
                Term previousTerm = tp[i - 1];
                Term currentTerm = tp[i];


                if (previousTerm.IsTweetBurstPoint&& !currentTerm.IsTweetBurstPoint)//the last 1 point of previous area
                { 
                    endofPrevious = i - 1; 
                }
                if (!previousTerm.IsTweetBurstPoint && currentTerm.IsTweetBurstPoint)//the first 1 point of next burst area
                { 
                    startofNext = i; 
                }


                //find the lowest point as segment point between endofPrevious and startofNext
                if (startofNext > endofPrevious & endofPrevious != -1)
                {
                    int minPoint = endofPrevious;
                    double min = tp[endofPrevious].TweetsCount;

                    for (int j = endofPrevious + 1; j < startofNext; j++)
                    {
                        if (tp[j].TweetsCount < min)
                        {
                            minPoint = j;
                            min = tp[j].TweetsCount;
                        }
                    }


                    tp[minPoint].PointType = 1;//set it as the segment point
                    endSegmentPoints.Add(dateTweetsFreq.ElementAt(minPoint).Key);
                    startSegmentPoints.Add(dateTweetsFreq.ElementAt(minPoint).Key);

                    endofPrevious = startofNext;//update
                }
            }

            endSegmentPoints.Add(dateTweetsFreq.Last().Key);//the last end
        }

        /// <summary>
        /// segment segment only considering tweets in burst_area
        /// </summary>
        /// <param name="dateTweetsFreq">input: a hashtag file, hashtag and tweet frequency file analyzed by date</param>
        /// <param name="startSegmentPoints">start point of a burst_area</param>
        /// <param name="endSegmentPoints">end point of a burst_area</param>
        public static void GetSegmentPoint4Burst(SortedDictionary<DateTime, Term> dateTweetsFreq, 
            List<DateTime> startSegmentPoints, 
            List<DateTime> endSegmentPoints)
        {
            //List<DateTime> startSegmentPoints = new List<DateTime>();//burst point
            //List<DateTime> endSegmentPoints = new List<DateTime>();//one-to-one correspond to star
            //get all segment points (day) from "dateTweetsFreq"
            if (dateTweetsFreq.First().Value.IsTweetBurstPoint)//the first point is burst_point
                startSegmentPoints.Add(dateTweetsFreq.First().Key);
            for (int i = 1; i < dateTweetsFreq.Count; i++)
            {
                Term previousTerm = dateTweetsFreq.ElementAt(i - 1).Value;
                Term currentTerm = dateTweetsFreq.ElementAt(i).Value;

                if (!previousTerm.IsTweetBurstPoint  && currentTerm.IsTweetBurstPoint)
                {
                    //the first 1 point of burst_area
                    startSegmentPoints.Add(dateTweetsFreq.ElementAt(i).Key);
                    dateTweetsFreq.ElementAt(i).Value.PointType += 1;
                }
                if (previousTerm.IsTweetBurstPoint && !currentTerm.IsTweetBurstPoint)
                {//the next 0 point of burst_area
                    endSegmentPoints.Add(dateTweetsFreq.ElementAt(i).Key);
                    dateTweetsFreq.ElementAt(i).Value.PointType += 2;
                }
            }
            if (dateTweetsFreq.Last().Value.IsTweetBurstPoint )//the last point is burst_point
                endSegmentPoints.Add(dateTweetsFreq.Last().Key);

            if (startSegmentPoints.Count == 0 & endSegmentPoints.Count == 0)//without any burst_point
            {
                startSegmentPoints.Add(dateTweetsFreq.First().Key);
                endSegmentPoints.Add(dateTweetsFreq.Last().Key);
            }
        }

        #endregion

        #region segment tweets of a subtopic into events
        public static void EventSegmenter(string tweetFile, 
            List<string> tweets, 
            List<DateTime> startSegmentPoints, 
            List<DateTime> endSegmentPoints, 
            String segmentMethod, int timeSpan = 4)
        {
            Dictionary<string, string> originalTweets = LoadTweets2Dict(Parameter.originalTweet);
            DateTime start = startSegmentPoints[0];//one segment point
            DateTime end = endSegmentPoints[0];
            string folder = tweetFile.Substring(0, tweetFile.LastIndexOf(@"\") + 1) + Parameter.intervals[Parameter.timeSpan - 1] + "\\";
            string originalFolder = folder + "Original\\";
            Directory.CreateDirectory(folder);
            Directory.CreateDirectory(originalFolder);
            string fileName = folder + segmentMethod + "." + start.Ticks;//segmented file
            string originalFileName = originalFolder + "Original" + segmentMethod + "." + start.Ticks;//segmented file
            StreamWriter sw = new StreamWriter(fileName);
            StreamWriter osw = new StreamWriter(originalFileName);

            string segmentLength = folder + segmentMethod + "." + "length";
            StreamWriter sw2 = new StreamWriter(segmentLength);

            int[] mode = new int[4];
            for (int i = 0; i < timeSpan; i++)
            {
                mode[i] = 1;
            }

            int count = 0;
            int lineCount = 0;
            List<string> mytweets = new List<string>();
            List<string> myid = new List<string>();
            foreach (string tweet in tweets)
            {
                string[] tweetAttribute = tweet.Split('\t');
                string id = tweetAttribute[1];
                DateTime date = DateTime.Parse(tweetAttribute[3]);//tweet time
                date = new DateTime(date.Year, mode[0] == 1 ? date.Month : 1, mode[1] == 1 ? date.Day : 1, date.Hour * mode[2], date.Minute * mode[3], 0);

                if (date > endSegmentPoints[count])
                {
                    double ri = 0;
                    for (int i = 0; i < mytweets.Count; i = (int)ri)
                    {
                        sw.WriteLine(mytweets[i]);
                        osw.WriteLine(originalTweets[myid[i]]);
                        if (mytweets.Count > Parameter.maxPerSegment)
                        {
                            ri += (double)mytweets.Count / (double)Parameter.maxPerSegment;
                        }
                        else
                        {
                            ri++;
                        }
                    }
                    mytweets.Clear();
                    myid.Clear();

                    sw.Close();
                    osw.Close();

                    sw2.WriteLine(lineCount);
                    lineCount = 0;
                    count++;
                    fileName = folder + segmentMethod + "." + startSegmentPoints[count].Ticks;//segmented file
                    originalFileName = originalFolder + "Original" + segmentMethod + "." + startSegmentPoints[count].Ticks;//segmented file
                    sw = new StreamWriter(fileName);
                    osw = new StreamWriter(originalFileName);
                }

                mytweets.Add(tweet);
                myid.Add(id);
                lineCount++;
            }

            double r = 0;
            for (int i = 0; i < mytweets.Count; i = (int)r)
            {
                sw.WriteLine(mytweets[i]);
                osw.WriteLine(originalTweets[myid[i]]);
                if (mytweets.Count > Parameter.maxPerSegment)
                {
                    r += (double)mytweets.Count / (double)Parameter.maxPerSegment;
                }
                else
                {
                    r++;
                }
            }
            sw2.WriteLine(lineCount);
            sw.Close();
            osw.Close();
            sw2.Close();
        }

        public static void EventSegmenter2(string tweetFile, 
            SortedDictionary<DateTime, List<string>> tweets, 
            List<DateTime> startSegmentPoints, 
            List<DateTime> endSegmentPoints, String segmentMethod)
        {
            for (int j = 0; j < startSegmentPoints.Count; j++)//to segment
            {
                DateTime start = startSegmentPoints[j];//one segment point
                DateTime end = endSegmentPoints[j];

                string fileName = tweetFile + "." + segmentMethod + "." + start.ToString("yyyyMMdd");//segmented file

                List<List<string>> tmpDates = new List<List<string>>();
                foreach (KeyValuePair<DateTime, List<string>> oneDay in tweets)
                {
                    if (oneDay.Key >= start && oneDay.Key < end)//to determine whether the tweet belong to current area
                    {
                        tmpDates.Add(oneDay.Value);
                    }
                }

                StreamWriter sw = new StreamWriter(fileName);
                foreach (List<string> sdd in tmpDates)
                {
                    foreach (string tweet in sdd)
                    {
                        sw.WriteLine(tweet);
                    }
                }
                sw.Close();
                //sw3.Stop();
                //time3 += sw3.Elapsed;
            }

            //System.Console.WriteLine(time);
            //System.Console.WriteLine(time2);
            //System.Console.WriteLine(time3);
        }

        public static void HihgerEventSegmenter(string tweetFile, List<DateTime> startSegmentPoints, List<DateTime> endSegmentPoints, String segmentMethod, int timeSpan)
        {
            Dictionary<string, string> originalTweets = LoadTweets2Dict(Parameter.originalTweet);
            DateTime start = startSegmentPoints[0];//one segment point
            DateTime end = endSegmentPoints[0];

            string folder = tweetFile.Substring(0, tweetFile.LastIndexOf(@"\") + 1) + Parameter.intervals[Parameter.timeSpan - 1] + "\\";
            string originalFolder = folder + "Original\\";
            Directory.CreateDirectory(folder);
            Directory.CreateDirectory(originalFolder);

            string fileName = folder + segmentMethod + "." + start.Ticks;//segmented file

            List<int> length = new List<int>();
            StreamReader sr = new StreamReader(tweetFile.Substring(0, tweetFile.LastIndexOf(@"\") + 1) + Parameter.intervals[3] + "\\" + segmentMethod + "." + "length");
            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();
                length.Add(int.Parse(line));
            }
            sr.Close();

            string[] files = Directory.GetFiles(tweetFile.Substring(0, tweetFile.LastIndexOf(@"\") + 1) + Parameter.intervals[3] + "\\base\\");

            int[] mode = new int[4];
            for (int i = 0; i < timeSpan; i++)
            {
                mode[i] = 1;
            }

            int count = 0;
            List<string> leftTweets = new List<string>();
            string lastLine = "";

            for (int i = 0; i < startSegmentPoints.Count; i++)
            {
                fileName = folder + segmentMethod + "." + startSegmentPoints[i].Ticks;//segmented file
                StreamWriter sw = new StreamWriter(fileName);
                List<string> nextLeft = new List<string>();
                List<string> target = new List<string>();

                foreach (string left in leftTweets)
                {
                    string[] tweetAttribute = left.Split('\t');
                    if (tweetAttribute.Length < 5) { continue; }
                    string id = tweetAttribute[1];
                    DateTime date = DateTime.Parse(tweetAttribute[3]);//tweet time

                    if (date > endSegmentPoints[i])
                    {
                        nextLeft.Add(left);
                        continue;
                    }

                    target.Add(left);
                    lastLine = left;

                }
                leftTweets.Clear();
                leftTweets = nextLeft.ToList();

                while (count < length.Count)
                {
                    if (long.Parse(files[count].Substring(files[count].LastIndexOf(".") + 1)) > endSegmentPoints[i].Ticks)
                    {
                        break;
                    }

                    StreamReader fr = new StreamReader(files[count]);
                    while (!fr.EndOfStream)
                    {
                        string line = fr.ReadLine();
                        string[] tweetAttribute = line.Split('\t');
                        if (tweetAttribute.Length < 5) { continue; }
                        DateTime date = DateTime.Parse(tweetAttribute[3]);//tweet time
                        string id = tweetAttribute[1];

                        if (date > endSegmentPoints[i])
                        {
                            leftTweets.Add(line);
                            continue;
                        }
                        else
                        {
                            target.Add(line);
                            lastLine = line;
                        }
                    }
                    count++;
                }

                double ri = 0;
                for (int l = 0; l < target.Count; l = (int)ri)
                {
                    string[] tweetAttribute = target[l].Split('\t');
                    int retweetedTimes = int.Parse(tweetAttribute[4]);
                    retweetedTimes = retweetedTimes == 0 ? 1 : retweetedTimes;

                    for (int x = 0; x < retweetedTimes; x++)
                    {
                        sw.WriteLine(target[l]);
                    }
                    lastLine = target[l];

                    if (target.Count > Parameter.maxPerSegment)
                    {
                        ri += (double)target.Count / (double)Parameter.maxPerSegment;
                    }
                    else
                    {
                        ri++;
                    }
                }

                if (target.Count == 0) { sw.WriteLine(lastLine); }
                sw.Close();
            }
        }


        public static Dictionary<string, string> LoadTweets2Dict(String tweetFile)
        {
            Dictionary<string, string> tweets = new Dictionary<string, string>();
            StreamReader sr = new StreamReader(tweetFile);
            while (!sr.EndOfStream)
            {
                string line = sr.ReadLine();
                string[] strs = line.Split('\t');
                if (!tweets.ContainsKey(strs[1]))
                {
                    tweets.Add(strs[1], line);//tweetid, tweet_content
                }
            }
            sr.Close();

            return tweets;
        }
        #endregion

        #region segmentation evaluation
        public void RandomSegSimilarity()
        {
            string path = @"D:\users\v-yaduan\projects\TweetSummary\data\summarization\";
            string[] files = Directory.GetFiles(path + "Earthquake\\");
            Dictionary<string, int> full = new Dictionary<string, int>();
            List<string> names = new List<string>();
            for (int i = 0; i < files.Length; i++)
            {
                if (!files[i].Contains("#"))
                    continue;
                if (files[i].Split('.').Length != 3)
                    continue;

                int index = files[i].LastIndexOf("\\");
                string name = files[i].Substring(index + 1).Split('.')[0];
                if (!full.ContainsKey(name))
                {
                    full.Add(name, 0);
                    names.Add(name);
                }

                if (files[i].Contains("FULL.20"))
                    full[name]++;
            }

            for (int i = 0; i < names.Count; i++)
            {
                if (full[names[i]] < 2)
                    full.Remove(names[i]);
            }

            HashSet<string> stopWords = ReadStopWord();
            stopWords.Add("earthquake");
            stopWords.Add("quake");

            using (StreamWriter wt = new StreamWriter(path + "segmentation\\RandomSegSimilarity.txt"))
            {
                double totalavgsim = 0;
                int totalcount = 0;
                wt.WriteLine("Random segmentation:");
                foreach (KeyValuePair<string, int> item in full)
                {
                    wt.WriteLine(item.Key);
                    int index = item.Key.IndexOf("#");
                    string tag = item.Key;
                    if (index > -1)
                        tag = item.Key.Substring(index + 1).ToLower();
                    stopWords.Add(tag);

                    double avgsim = RandomSegTopic(path, item.Key, item.Value, stopWords);
                    //double avgsim = TweetFreqSegTopic(path, item.Key, item.Value, stopWords);
                    totalavgsim += avgsim;
                    if (avgsim > 0)
                        totalcount++;

                    wt.WriteLine("avg similarity: " + avgsim);
                    wt.WriteLine();
                    stopWords.Remove(tag);
                }
                totalavgsim /= totalcount;
                wt.WriteLine("avg similarity for random segmentation:" + totalavgsim);
            }
        }

        private double TweetFreqSegTopic(string path, string topic, int segCount, HashSet<string> stopWords)
        {
            List<int> TweetCountPerday = new List<int>();
            double mean = 0;
            List<string> twts = ReadTweetsPerday(path + "Earthquake\\" + topic, TweetCountPerday, ref mean);
            double avgsim = 0;
            List<List<string>> tweets = new List<List<string>>();
            List<string> t = new List<string>();
            for (int i = 0; i < twts.Count; i++)
            {
                if (TweetCountPerday[i] > 4.9 * mean)
                    t.Add(twts[i]);
                else if (t.Count > 0)
                {
                    List<string> tj = new List<string>(t);
                    tweets.Add(tj);
                    t.Clear();
                }
            }
            Console.WriteLine(topic + "\t" + tweets.Count + " sub-topics");

            int count = 0;
            for (int i = 0; i < tweets.Count - 1; i++)
                for (int j = i + 1; j < tweets.Count; j++)
                {
                    double similarity = CosineSimilarity(tweets[i], tweets[j], stopWords);
                    avgsim += similarity;
                    count++;
                }

            if (count != 0)
                avgsim /= count;
            return avgsim;
        }

        private double RandomSegTopic(string path, string topic, int segCount, HashSet<string> stopWords)
        {
            List<string> twts = ReadTweets(path + "Earthquake\\" + topic);
            double avgsim = 0, count = 0;
            Random rand = new Random();
            //for (int k = 0; k < 100; k++)
            {
                List<int> split = new List<int>();
                //for (int l = 0; l < segCount - 1; l++)
                //{
                //    int next = rand.Next(0, twts.Count - 2);
                //    split.Add(next);
                //}
                //split.Sort();
                int breakp = twts.Count / segCount;
                for (int l = 1; l < segCount; l++)
                    split.Add(l * breakp);

                List<List<string>> tweets = new List<List<string>>();
                int start = 0;
                split.Add(twts.Count);
                for (int l = 0; l < split.Count; l++)
                {
                    List<string> t = new List<string>();
                    for (int m = start; m < split[l]; m++)
                        t.Add(twts[m]);
                    start = split[l];
                    tweets.Add(t);
                }

                for (int i = 0; i < tweets.Count - 1; i++)
                    for (int j = i + 1; j < tweets.Count; j++)
                    {
                        double similarity = CosineSimilarity(tweets[i], tweets[j], stopWords);
                        avgsim += similarity;
                        count++;
                        //wt.WriteLine(similarity);
                    }
            }
            avgsim /= count;
            return avgsim;
        }

        public void SegmentSimilarity()
        {
            string path = @"D:\users\v-yaduan\projects\TweetSummary\data\summarization\";
            string[] files = Directory.GetFiles(path + "Earthquake\\");
            Dictionary<string, List<string>> full = new Dictionary<string, List<string>>();
            Dictionary<string, List<string>> burst = new Dictionary<string, List<string>>();
            List<string> names = new List<string>();
            for (int i = 0; i < files.Length; i++)
            {
                if (!files[i].Contains("#"))
                    continue;
                if (files[i].Split('.').Length != 3)
                    continue;

                int index = files[i].LastIndexOf("\\");
                string name = files[i].Substring(index + 1).Split('.')[0];
                if (!full.ContainsKey(name))
                {
                    full.Add(name, new List<string>());
                    burst.Add(name, new List<string>());
                    names.Add(name);
                }

                if (files[i].Contains("FULL.20"))
                    full[name].Add(files[i]);
                if (files[i].Contains("BURST.20"))
                    burst[name].Add(files[i]);
            }

            for (int i = 0; i < names.Count; i++)
            {
                if (full[names[i]].Count < 2)
                    full.Remove(names[i]);
                if (burst[names[i]].Count < 2)
                    burst.Remove(names[i]);
            }

            HashSet<string> stopWords = ReadStopWord();
            stopWords.Add("earthquake");
            stopWords.Add("quake");

            using (StreamWriter wt = new StreamWriter(path + "segmentation\\FreqSegSimilarity.txt"))
            {
                double totalavgsim = 0;
                wt.WriteLine("Full segmentation:");
                foreach (KeyValuePair<string, List<string>> item in full)
                {
                    wt.WriteLine(item.Key);
                    int index = item.Key.IndexOf("#");
                    string tag = item.Key;
                    if (index > -1)
                        tag = item.Key.Substring(index + 1).ToLower();
                    stopWords.Add(tag);
                    List<List<string>> tweets = new List<List<string>>();
                    for (int i = 0; i < item.Value.Count; i++)
                        tweets.Add(ReadTweets(item.Value[i]));

                    double avgsim = 0, count = 0;
                    for (int i = 0; i < tweets.Count - 1; i++)
                        for (int j = i + 1; j < tweets.Count; j++)
                        {
                            double similarity = CosineSimilarity(tweets[i], tweets[j], stopWords);
                            avgsim += similarity;
                            count++;
                            wt.WriteLine(similarity);
                        }
                    avgsim /= count;
                    totalavgsim += avgsim;
                    wt.WriteLine("avg similarity: " + avgsim);
                    wt.WriteLine();
                    stopWords.Remove(tag);
                }
                totalavgsim /= full.Count;
                wt.WriteLine("avg similarity for FULL:" + totalavgsim);

                totalavgsim = 0;
                wt.WriteLine("Burst segmentation:");
                foreach (KeyValuePair<string, List<string>> item in burst)
                {
                    wt.WriteLine(item.Key);
                    int index = item.Key.IndexOf("#");
                    string tag = item.Key;
                    if (index > -1)
                        tag = item.Key.Substring(index + 1).ToLower();
                    stopWords.Add(tag);
                    List<List<string>> tweets = new List<List<string>>();
                    for (int i = 0; i < item.Value.Count; i++)
                        tweets.Add(ReadTweets(item.Value[i]));

                    double avgsim = 0, count = 0;
                    for (int i = 0; i < tweets.Count - 1; i++)
                        for (int j = i + 1; j < tweets.Count; j++)
                        {
                            double similarity = CosineSimilarity(tweets[i], tweets[j], stopWords);
                            avgsim += similarity;
                            count++;
                            wt.WriteLine(similarity);
                        }
                    avgsim /= count;
                    totalavgsim += avgsim;
                    wt.WriteLine("avg similarity: " + avgsim);
                    wt.WriteLine();
                    stopWords.Remove(tag);
                }
                totalavgsim /= burst.Count;
                wt.WriteLine("avg similarity for Burst:" + totalavgsim);
            }
        }

        private static List<string> ReadTweets(string TweetFile)
        {
            List<string> tweets = new List<string>();
            using (StreamReader rd = new StreamReader(TweetFile))
            {
                while (!rd.EndOfStream)
                {
                    string line = rd.ReadLine();
                    string[] s = line.Split('\t');
                    tweets.Add(s[2]);
                }
            }
            return tweets;
        }

        private static List<string> ReadTweetsPerday(string TweetFile, List<int> TweetCountPerday, ref double mean)
        {
            List<string> tweets = new List<string>();
            mean = 0;
            using (StreamReader rd = new StreamReader(TweetFile))
            {
                string t = string.Empty;
                string curdate = string.Empty;
                int count = 0;
                while (!rd.EndOfStream)
                {
                    string line = rd.ReadLine();
                    string[] s = line.Split('\t');
                    string[] datestr = s[3].Split(' ');
                    string date = datestr[0] + " " + datestr[1] + " " + datestr[2];
                    if (curdate == string.Empty || date == curdate)
                    {
                        t += " " + s[2];
                        curdate = date;
                        count++;
                    }
                    else
                    {
                        tweets.Add(t.Trim());
                        TweetCountPerday.Add(count);
                        mean += count;
                        t = s[2];
                        curdate = date;
                        count = 1;
                    }
                }
                if (t != string.Empty)
                {
                    tweets.Add(t.Trim());
                    TweetCountPerday.Add(count);
                    mean += count;
                }
            }

            mean = mean / tweets.Count;
            return tweets;
        }

        private static HashSet<string> ReadStopWord()
        {
            HashSet<string> stopwords = new HashSet<string>();
            using (StreamReader rd = new StreamReader(@"D:\users\v-yaduan\projects\TweetSummary\dict\stop-words"))
            {
                while (!rd.EndOfStream)
                {
                    string line = rd.ReadLine().Trim().ToLower();
                    stopwords.Add(line);
                }
            }

            return stopwords;
        }

        private double CosineSimilarity(List<string> sentence1, List<string> sentence2, HashSet<string> StopWordDict)
        {
            if (sentence1 == null || sentence2 == null || sentence1.Count == 0 || sentence2.Count == 0)
                return 0;

            Regex wordReg = new Regex(@"\w+\b");

            Dictionary<string, int> WordFreqQuestion = new Dictionary<string, int>();
            for (int i = 0; i < sentence1.Count; i++)
            {
                MatchCollection words = wordReg.Matches(sentence1[i].ToLower());
                for (int j = 0; j < words.Count; j++)
                    if (WordFreqQuestion.ContainsKey(words[j].Value))
                        WordFreqQuestion[words[j].Value]++;
                    else WordFreqQuestion.Add(words[j].Value, 1);
            }

            Dictionary<string, int> WordFreqResult = new Dictionary<string, int>();
            for (int i = 0; i < sentence2.Count; i++)
            {
                MatchCollection words = wordReg.Matches(sentence2[i].ToLower());
                for (int j = 0; j < words.Count; j++)
                    if (WordFreqResult.ContainsKey(words[j].Value))
                        WordFreqResult[words[j].Value]++;
                    else WordFreqResult.Add(words[j].Value, 1);
            }

            float product = 0, modulus1 = 0, modulus2 = 0;
            foreach (KeyValuePair<string, int> kv in WordFreqQuestion)
                if (!StopWordDict.Contains(kv.Key))
                {
                    if (WordFreqResult.ContainsKey(kv.Key))
                        product += (float)(WordFreqQuestion[kv.Key] * WordFreqResult[kv.Key]);
                    modulus1 += (float)Math.Pow(WordFreqQuestion[kv.Key], 2);
                }
            foreach (KeyValuePair<string, int> kv in WordFreqResult)
                if (!StopWordDict.Contains(kv.Key))
                    modulus2 += (float)Math.Pow(WordFreqResult[kv.Key], 2);

            if (modulus1 != 0 && modulus2 != 0)
                product /= (float)(Math.Sqrt(modulus1) * Math.Sqrt(modulus2));

            return product;

        }
        #endregion
    }
}

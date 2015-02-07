using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using ManyLens.Models;
using ManyLens.Segmentor;
using ManyLens.IO;
using ManyLens.Preprocessing;
using ManyLens.SOM;
using System.Diagnostics;


namespace ManyLens.SignalR
{
    public class MyHub : Hub
    {
        private static string rootFolder = AppDomain.CurrentDomain.SetupInformation.ApplicationBase;

        // private readonly TimeSpan MyInterval = TimeSpan.FromMilliseconds(40);
        private static SortedDictionary<string, Interval> interals = new SortedDictionary<string, Interval>();
        private static Dictionary<string, VisMap> visMaps = new Dictionary<string, VisMap>();

        private Random rnd = new Random();
        private int lastPointIndex = -1;
        private Point lastPoint = null;
        
        //用来实现真正的streaming的peak detection用的，基本思想是用一个栈来保存状态，当确保状态安全时就推送给客户端
        private void AddPoint(int i, Term[] tp)
        {
            Point newPoint = new Point()
            {
                value = tp[i].TweetsCount,
                mark = new Mark()
                {
                    id = tp[i].ID,
                    type = tp[i].SegmentPoint,
                    beg = "",
                    end = ""
                }
            };
            if (lastPoint == null && lastPointIndex != i)
            {
                lastPoint = newPoint;
                lastPointIndex = i;
            }
            else if (i != lastPointIndex && lastPoint != null)
            {
                Clients.Caller.addPoint(lastPoint);
                lastPoint = newPoint;
                lastPointIndex = i;
            }
            else
            {
                Clients.Caller.addPoint(newPoint);
                lastPoint = null;
            }

            Thread.Sleep(200);
        }

        //damn it, I almost forget how this function works.
        public async Task PullPoint(string start)
        {
            Debug.WriteLine("I'm in again");
            //clear the static data
            interals.Clear();
            //set the parameter
            int lastMarkType = 2;
            double alpha = 0.125;
            double beta = 2.0;
            Parameter.timeSpan = 2;

            #region Load the tweets then sort them by date
            string tweetFile = rootFolder + "Backend\\DataBase\\onedrivetweets";
            Debug.WriteLine(tweetFile);
            SortedDictionary<DateTime, Term> dateTweetsFreq = TweetsIO.LoadTweetsAsTermsSortedByDate(tweetFile);
            #endregion
        
            await Task.Run(() =>
            {
                //Peak Detection
                //This version of Peak Detection is not the real streaming one.
                //下面这个实现有往回的动作，并不是真正的streaming，要重新设计一下
                int p = 5;
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

                for (int i = p, t = 0; t < tp.Length; i++, t++)
                {
                    if (i < tp.Length)
                    {
                        cutoff = variance * beta;
                        if (Math.Abs(tp[i].TweetsCount - mean) > cutoff && tp[i].TweetsCount > tp[i - 1].TweetsCount)
                        {
                            int begin = i - 1;
                            while (i < tp.Length && tp[i].TweetsCount > tp[i - 1].TweetsCount)
                            {
                                diff = Math.Abs(tp[i].TweetsCount - mean);
                                variance = alpha * diff + (1 - alpha) * variance;
                                mean = alpha * mean + (1 - alpha) * tp[i].TweetsCount;
                                i++;
                            }

                            int end = i;
                            while (i < tp.Length && tp[i].TweetsCount > tp[begin].TweetsCount)
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

                            tp[begin].SegmentPoint += 1;
                            tp[end].SegmentPoint += 2;
                        }
                        else
                        {
                            diff = Math.Abs(tp[i].TweetsCount - mean);
                            variance = alpha * diff + (1 - alpha) * variance;
                            mean = alpha * mean + (1 - alpha) * tp[i].TweetsCount;
                        }
                    }

                    //Determine the type of this point
                    tp[t].SegmentPoint = tp[t].SegmentPoint != 0 ? tp[t].SegmentPoint : lastMarkType == 2 ? (uint)0 : (uint)4;
                    Point point = new Point()
                    {
                        value = tp[t].TweetsCount,
                        mark = new Mark()
                        {
                            id = tp[t].ID,
                            type = tp[t].SegmentPoint,
                            beg = "",
                            end = ""
                        }
                    };

                    if (tp[t].SegmentPoint == 1)
                    {
                        Interval interal = new Interval(tp[t].TermDate, tp[t].Tweets);
                        interals.Add(interal.ID, interal);
                        lastMarkType = 1;
                        point.mark.beg = point.mark.id;
                    }
                    else if (tp[t].SegmentPoint == 2)
                    {
                        string id = interals.Last().Key;
                        Interval interal = interals.Last().Value;
                        interal.EndDate = tp[t].TermDate;
                        interals[id] = interal;
                        lastMarkType = 2;

                    }
                    else if (tp[t].SegmentPoint == 3)
                    {
                        string id   = interals.Last().Key;
                        Interval interal = interals.Last().Value;
                        interal.EndDate = tp[t].TermDate;
                        interals[id] = interal;

                        Interval newInteral = new Interval(tp[t].TermDate, tp[t].Tweets);
                        interals.Add(newInteral.ID, newInteral);
                        lastMarkType = 1;
                        point.mark.beg = point.mark.id;
                    }
                    else if (tp[t].SegmentPoint == 4)
                    {
                        string id = interals.Last().Key;
                        Interval interal = interals.Last().Value;
                        interal.AddTweets(tp[t].Tweets);
                        interals[id] = interal;
                    }

                    Clients.Caller.addPoint(point);
                    Thread.Sleep(10);

                }
            });
        }

        public async Task PullInteral(string interalID,IProgress<double> progress)
        {
            string stopwordFile = rootFolder + "Backend\\DataBase\\PREPROCESSINGDICT\\stopwords";
            Interval interal = interals[interalID];

            await TweetsPreprocessor.ProcessTweetAsync(interal, stopwordFile, progress);
            await TweetsVectorizer.VectorizeEachTweet(interal,progress);

            VisMap visMap;
            string mapID = interal.ID+"_0";
            if(visMaps.ContainsKey(mapID))
                visMap = visMaps[mapID];
            else
            {
                visMap = GPUSOM.TweetSOM(interal, rootFolder);
                visMaps.Add(visMap.VisMapID, visMap);
            }
            Clients.Caller.showVIS(visMap.GetVisData());

        }

        public void ReOrganize(string visMapID,int[] selectedUnits)
        {
            VisMap newVisMap = GPUSOM.TweetReOrganizeSOM(visMaps[visMapID], selectedUnits);
            visMaps.Add(newVisMap.VisMapID, newVisMap);
            Clients.Caller.showVIS(newVisMap.GetVisData());
        }

        public void MoveTweets(string visMapID, int[] fromUnitsID, int[] toUnitsID)
        {
            if (visMapID == null || fromUnitsID == null || toUnitsID == null)
                return;

            if (fromUnitsID.Length < 1 || toUnitsID.Length < 1)
                return;

            VisMap visMap = visMaps[visMapID];
            List<float[]> rawTrainset = new List<float[]>();
            List<Tweet> rawTweets = new List<Tweet>();
            List<Unit> fromUnits = new List<Unit>();
            List<Unit> toUnits = new List<Unit>();

            for (int i = fromUnitsID.Length - 1; i >= 0; --i)
            {
                Unit unit = visMap.GetUnitAt(fromUnitsID[i]);

                fromUnits.Add(unit);

                rawTrainset.AddRange(unit.TFIDFVectors);
                rawTweets.AddRange(unit.Tweets);
                visMap.RemoveUnitAt(fromUnitsID[i]);

            }
            
            for (int i = toUnitsID.Length - 1; i >= 0; --i)
            {
                Unit unit = visMap.GetUnitAt(toUnitsID[i]);
                toUnits.Add(unit);
            }

            for (int i = rawTrainset.Count - 1; i >= 0; --i)
            {
                float[] rawTrainVector = rawTrainset[i];
                Unit closetUnit = null;
                float dist = float.MaxValue;
                for (int j = toUnits.Count - 1; j >= 0; --j)
                {
                    float[] unitVector = toUnits[j].UnitVector;
                    float tempDist = 0;
                    for (int k = unitVector.Length - 1; k >= 0; --k)
                    {
                        tempDist += (unitVector[k] - rawTrainVector[k]) * (unitVector[k] - rawTrainVector[k]);
                    }
                    if (tempDist < dist)
                    {
                        dist = tempDist;
                        closetUnit = toUnits[j];
                    }
                }
                closetUnit.AddTweet(rawTweets[i], rawTrainVector);
            }

            Clients.Caller.reDrawSOMMap(visMap.GetVisData());
        }

        public void DoLongRunningThing()
        {
            Clients.Caller.showMSG(rootFolder);
        }
    }
}
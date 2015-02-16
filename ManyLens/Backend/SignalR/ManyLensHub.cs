using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using ManyLens.Models;
using ManyLens.IO;
using ManyLens.Preprocessing;
using ManyLens.SOM;
using System.Diagnostics;


namespace ManyLens.SignalR
{
    public class ManyLensHub : Hub
    {
        private static bool TestMode = true;
        private static string rootFolder = AppDomain.CurrentDomain.SetupInformation.ApplicationBase;

        // private readonly TimeSpan MyInterval = TimeSpan.FromMilliseconds(40);
        private static SortedDictionary<DateTime, Term> dateTweetsFreq;
        private static SortedDictionary<string, Interval> interals = new SortedDictionary<string, Interval>();
        private static Dictionary<string, VisMap> visMaps = new Dictionary<string, VisMap>();

        private Random rnd = new Random();
        //private int lastPointIndex = -1;
        //private Point lastPoint = null;
        
        //用来实现真正的streaming的peak detection用的，基本思想是用一个栈来保存状态，当确保状态安全时就推送给客户端
        private void AddPoint(int i, Term[] tp)
        {
            //Point newPoint = new Point()
            //{
            //    value = tp[i].TweetsCount,
            //    mark = new Mark()
            //    {
            //        id = tp[i].ID,
            //        type = tp[i].PointType,
            //        beg = "",
            //        end = ""
            //    }
            //};
            //if (lastPoint == null && lastPointIndex != i)
            //{
            //    lastPoint = newPoint;
            //    lastPointIndex = i;
            //}
            //else if (i != lastPointIndex && lastPoint != null)
            //{
            //    Clients.Caller.addPoint(lastPoint);
            //    lastPoint = newPoint;
            //    lastPointIndex = i;
            //}
            //else
            //{
            //    Clients.Caller.addPoint(newPoint);
            //    lastPoint = null;
            //}

            //Thread.Sleep(200);
        }

        public async Task LoadData() 
        {
            //clear the static data
            interals.Clear();

            //string tweetFile = rootFolder + "Backend\\DataBase\\onedrivetweets";
            string tweetFile = rootFolder + "Backend\\DataBase\\FIFAShortAttributesSample";
            Debug.WriteLine(tweetFile);
            await Task.Run(() =>
            {
                if (dateTweetsFreq == null)
                    dateTweetsFreq = TweetsIO.LoadTweetsAsTermsSortedByDate(tweetFile);
            });

        }

        //damn it, I almost forget how this function works.
        public async Task PullPoint(string start)
        {
            //clear the static data
            interals.Clear();
            //set the parameter
            //int lastMarkType = 2;
            double alpha = 0.125;
            double beta = 2.0;
            Parameter.timeSpan = 2;

            await Task.Run(() =>
            {
                //Peak Detection
                //This version of Peak Detection is not the real streaming one.
                //下面这个实现有往回的动作，并不是真正的streaming，要重新设计一下
                int p = 5;
                double cutoff = 0, mean = 0, diff = 0, variance = 0;
                Term[] tp = dateTweetsFreq.Values.ToArray();
                for (int i = 0, len = tp.Length; i < len; ++i)
                {
                    tp[i].PointType = 0;
                }

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

                //output the point json data
                System.IO.StreamWriter sw = new System.IO.StreamWriter(rootFolder + "Backend\\DataBase\\pointData_test.json");
                var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(List<Point>));
                List<Point> points = new List<Point>();

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
                            tp[i-1].IsPeak = true;
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


                            //Detect segmentation
                            tp[begin].BeginPoint = tp[begin].ID;
                            tp[begin].EndPoint = tp[end].ID;
                            tp[begin].PointType += 1;
                            Interval interal = new Interval(tp[begin].TermDate, tp[begin]);
                            interals.Add(interal.ID, interal);

                            tp[end].BeginPoint = tp[begin].ID;
                            tp[end].EndPoint = tp[end].ID;
                            tp[end].PointType += 2;       
                            interal.EndDate = tp[end].TermDate;
                            
                            for (int k = begin+1; k < end; ++k)
                            {
                                tp[k].BeginPoint = tp[begin].ID;
                                tp[k].EndPoint = tp[end].ID;
                                tp[k].PointType = 4;
                                interal.AddTerm(tp[k]);
                            }

                        }
                        else
                        {
                            diff = Math.Abs(tp[i].TweetsCount - mean);
                            variance = alpha * diff + (1 - alpha) * variance;
                            mean = alpha * mean + (1 - alpha) * tp[i].TweetsCount;
                        }
                    }

                    //Determine the type of this point
                    //tp[t].PointType = tp[t].PointType != 0 ? tp[t].PointType : lastMarkType == 2 ? (uint)0 : (uint)4;
                    Point point = new Point()
                    {
                        id = tp[t].ID,
                        value = tp[t].TweetsCount,
                        isPeak = tp[t].IsPeak,
                        type = tp[t].PointType,
                        beg = tp[t].BeginPoint,
                        end = tp[t].EndPoint
                    };

                    //if (tp[t].PointType == 1)
                    //{
                    //    Interval interal = new Interval(tp[t].TermDate, tp[t]);
                    //    interals.Add(interal.ID, interal);
                    //    //lastMarkType = 1;
                    //    //point.mark.beg = point.mark.id;
                    //}
                    //else if (tp[t].PointType == 2)
                    //{
                    //    string id = interals.Last().Key;
                    //    Interval interal = interals.Last().Value;
                    //    interal.EndDate = tp[t].TermDate;
                    //    interals[id] = interal;
                    //    //lastMarkType = 2;
                    //    //point.mark.end = point.mark.id;
                    //}
                    //else if (tp[t].PointType == 3)
                    //{
                    //    string id   = interals.Last().Key;
                    //    Interval interal = interals.Last().Value;
                    //    interal.EndDate = tp[t].TermDate;
                    //    interals[id] = interal;

                    //    Interval newInteral = new Interval(tp[t].TermDate, tp[t]);
                    //    interals.Add(newInteral.ID, newInteral);
                    //    //lastMarkType = 1;
                    //    //point.mark.beg = point.mark.id;
                    //}
                    //else if (tp[t].PointType == 4)
                    //{
                    //    string id = interals.Last().Key;
                    //    Interval interal = interals.Last().Value;
                    //    interal.AddTerm(tp[t]);
                    //    interals[id] = interal;
                    //}

                    //Output the json data
                    points.Add(point);

                    Clients.Caller.addPoint(point);
                    Thread.Sleep(50);

                }

                //Output the json data
                Debug.Write("Let's cache the point data as json");
                jser.WriteObject(sw.BaseStream, points);
                sw.Close();
                Debug.Write("finish json");
            });
        }

        //Just for test
        public void testPullPoint()
        {
            //load the point json data
            System.IO.StreamReader sr = new System.IO.StreamReader(rootFolder + "Backend\\DataBase\\pointData_test.json");
            var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(List<Point>));
            List<Point> points = (List<Point>)jser.ReadObject(sr.BaseStream);
            sr.Close();
            for (int i = 0, len = points.Count; i < len; ++i)
            {
                Clients.Caller.addPoint(points[i]);
                Thread.Sleep(100);
            }
        }

        public async Task PullInterval(string interalID,IProgress<double> progress)
        {
            VisMap visMap;
            string mapID = interalID+"_0";
            if(visMaps.ContainsKey(mapID))
                visMap = visMaps[mapID];
            else
            {
                string stopwordFile = rootFolder + "Backend\\DataBase\\PREPROCESSINGDICT\\stopwords";
                Interval interal = interals[interalID];

                await TweetsPreprocessor.ProcessTweetAsync(interal, stopwordFile, progress);
                await TweetsVectorizer.VectorizeEachTweet(interal, progress);

                //Test
                if (TestMode)
                {
                    visMap = GPUSOM.TestTweetSOM(interal, rootFolder);// TweetSOM(interal, rootFolder);
                }
                else
                {
                    visMap = GPUSOM.TweetSOM(interal, rootFolder);
                }
               
                visMaps.Add(visMap.VisMapID, visMap);
            }

            try
            {
                Debug.Write("Let's cache the visData as  json");

                VISData visData = visMap.GetVisData();
                System.IO.StreamWriter sw = new System.IO.StreamWriter(rootFolder + "Backend\\DataBase\\visData_test.json");
                var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(VISData));
                jser.WriteObject(sw.BaseStream, visData);
                sw.Close();
                Debug.Write("finish json");
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.InnerException.Message);
                Debug.WriteLine(e.Message);
            }

  
            Clients.Caller.showVIS(visMap.GetVisData());
        }

        public void testPullInterval(string interalID)
        {
            //load the point json data
            System.IO.StreamReader sr = new System.IO.StreamReader(rootFolder + "Backend\\DataBase\\visData_test.json");
            var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(VISData));
            VISData visData = (VISData)jser.ReadObject(sr.BaseStream);
            sr.Close();
            Clients.Caller.showVIS(visData);
        }

        public async Task GetDataForLens(string visMapID, int[] unitsID, string whichData)
        {
            Task.Run(() => { 
            
            });
        
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
                closetUnit.AddTweet(rawTweets[i]);
            }
    
            Clients.Caller.reDrawSOMMap(visMap.GetVisData());
        }

        public void DoLongRunningThing()
        {
            Clients.Caller.showMSG(rootFolder);
        }
    }
}
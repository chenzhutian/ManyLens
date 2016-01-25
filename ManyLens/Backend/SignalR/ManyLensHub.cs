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

    class MapPack
    {
        public VisMap clusteringMap { get; set; }
        public VisMap classificationMap { get; set; }
    }

    public class ManyLensHub : Hub
    {
        private static bool GeoMapMode = false;
        private static CancellationTokenSource cts = new CancellationTokenSource();
        private static SortedDictionary<string, Term>[] dateTweetsFreq;
        private static SortedDictionary<string, Interval> interals = new SortedDictionary<string, Interval>();
        private static Dictionary<string, VisMap> visMaps = new Dictionary<string, VisMap>();
        private static SortedDictionary<DateTime, MapPack> visMapsSortedByTime = new SortedDictionary<DateTime, MapPack>();
        private static Dictionary<string, Lens> lensDatas = new Dictionary<string, Lens>();

        public static List<TweetsIO.CityStruct> cities1000;
        public static HashSet<string> stopWords;

        private Random rnd = new Random();

        public async Task LoadData(IProgress<double> progress)
        {
            //clear the static data
            interals.Clear();
            lensDatas.Clear();
            await Task.Run(() =>
             {
                 if (dateTweetsFreq == null) dateTweetsFreq = TweetsIO.LoadTweetsAsTermsSortedByDate(config.Parameter.fifaFile);
                 if (cities1000 == null) cities1000 = TweetsIO.LoadCities1000(config.Parameter.cities1000File);
                 if (stopWords == null) stopWords = TweetsIO.LoadStopWord(config.Parameter.stopwordFile);
             });
        }

        private List<Interval> taskList = new List<Interval>();
        private void PreprocesInterval()
        {
            while (taskList.Count > 0)
            {

                Interval interval = taskList[0];
                Debug.WriteLine("TID　of this DOLONGRUN is " + Thread.CurrentThread.ManagedThreadId);
                Debug.WriteLine("ON interval " + interval.ID);
                IProgress<double> p = new Progress<double>();
                interval.Preproccessing(p);
                Debug.WriteLine(interval.ID + " , " + interval.Entropy + "," + interval.TweetsCount);
                taskList.RemoveAt(0);
            }
            Clients.Caller.enableReorganizeIntervalBtn();
        }
        private Task task = null;
        private void LazyThreadForConditionalEntropy(Interval interval)
        {

            taskList.Add(interval);
            if (task == null)
            {
                task = new Task(PreprocesInterval);
                task.Start();
            }
            else if (task.IsCompleted)
            {
                task = new Task(PreprocesInterval);
                Clients.Caller.disableReorganizeIntervalBtn();
                task.Start();

            }
        }

        private async Task PushPoint(string mode, CancellationToken ctoken)
        {

            //set the parameter
            double alpha = 0.125;
            double beta = 1.5;

            await Task.Run(() =>
            {
                Debug.WriteLine("Thread id of pull point " + Thread.CurrentThread.ManagedThreadId);
                //Peak Detection
                //下面这个实现有往回的动作，并不是真正的streaming，要重新设计一下
                int p = 5;

                double cutoff = 0, mean = 0, diff = 0, variance = 0;
                Term[] tp = dateTweetsFreq[config.Parameter.TimeSpan].Values.ToArray();

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
                            tp[begin].PointType += 1;

                            tp[end].BeginPoint = tp[begin].ID;
                            tp[end].EndPoint = tp[end].ID;
                            tp[end].PointType += 2;

                            Interval interal = new Interval(tp[begin].TermDate, tp[begin]);
                            if (!interals.ContainsKey(interal.ID))
                            {
                                interals.Add(interal.ID, interal);

                                for (int k = begin + 1; k < end; ++k)
                                {
                                    tp[k].BeginPoint = tp[begin].ID;
                                    tp[k].EndPoint = tp[end].ID;
                                    tp[k].PointType = 4;
                                    interal.AddTerm(tp[k]);
                                }
                                interal.SetEndDate(tp[end].TermDate);
                                //LazyThreadForConditionalEntropy(interal);
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

                    List<VoronoiTweetsFeature> features = null;
                    if(tp[t].PointType != 0)
                    {
                        features = tp[t].GetVoronoiTweetsFeatures();
                    }

                    Point point = new Point()
                    {
                        id = tp[t].ID,
                        value = tp[t].DTweetsCount,
                        isPeak = tp[t].IsPeak,
                        type = tp[t].PointType,
                        features = features,
                        beg = tp[t].BeginPoint,
                        end = tp[t].EndPoint
                    };

                    Clients.Caller.addPoint(point);
                    //if (ctoken.IsCancellationRequested)
                    //{
                    //    Debug.WriteLine(seperatePoint.ID);
                    //    return tp[t];
                    //}

                    Thread.Sleep(1000);
                }

            }, ctoken);

        }

        public async Task PullPoint(string mode)
        {
            //clear the static data
            interals.Clear();

            //init the cancellation token;
            CancellationToken ctoken = cts.Token;
            await this.PushPoint(mode, ctoken);

        }

        public async Task ChangeTimeSpan(int index)
        {
            await Task.Run(() =>
            {
                cts.Cancel();
            });

        }

        public void SwitchMap(bool mapMode)
        {
            GeoMapMode = mapMode;
        }

        public async Task PullInterval(string interalID, string classifierID, IProgress<double> progress)
        {
            if (GeoMapMode)
            {
                Interval interal = interals[interalID];
                Dictionary<string, List<Tweet>> tweetsGroupByLocation = new Dictionary<string, List<Tweet>>();

                await Task.Run(() =>
                {
                    for (int i = 0, len = interal.TweetsCount; i < len; ++i)
                    {
                        Tweet tweet = interal.Tweets[i];
                        if (tweet.CountryName == null)
                        {
                            Object obj = new Object();
                            double minDist = double.MaxValue;
                            string countryName = "";
                            Parallel.ForEach(ManyLens.SignalR.ManyLensHub.cities1000, (city) =>
                            {
                                double dx = tweet.Lon - city.lon;
                                double dy = tweet.Lat - city.lat;
                                dx = dx * dx;
                                dy = dy * dy;
                                double dist = dx + dy;
                                lock (obj)
                                {
                                    if (dist < minDist)
                                    {
                                        minDist = dist;
                                        countryName = city.country;
                                    }
                                }
                            });
                            tweet.CountryName = countryName;

                        }

                        if (!tweetsGroupByLocation.ContainsKey(tweet.CountryName))
                        {
                            tweetsGroupByLocation.Add(tweet.CountryName, new List<Tweet>());
                        }
                        tweetsGroupByLocation[tweet.CountryName].Add(tweet);
                        progress.Report((double)i / len);
                    }
                    List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();
                    foreach (KeyValuePair<string, List<Tweet>> item in tweetsGroupByLocation)
                    {
                        Dictionary<string, object> d = new Dictionary<string, object>();
                        d.Add("countryName", item.Key);
                        d.Add("tweets", item.Value);
                        result.Add(d);
                    }
                    Clients.Caller.upDateGeoMap(result);

                });

            }
            else
            {
                VisMap visMap;
                string mapID = interalID;
                if (classifierID != null) mapID = mapID + "_" + classifierID;

                await Task.Run(() =>
                {
                    if (visMaps.ContainsKey(mapID))
                        visMap = visMaps[mapID];
                    else
                    {
                        Interval interal = interals[interalID];
                        Debug.WriteLine("Tweets count before preprocessing is : " + interal.TweetsCount);
                        Stopwatch sw = new Stopwatch();
                        sw.Start();
                        interal.PreproccessingParallel(progress);
                        sw.Stop();
                        Debug.WriteLine("Preprocessing TIME Consuming : " + sw.ElapsedTicks / (decimal)Stopwatch.Frequency);

                        if (classifierID != null)
                        {
                            VisMap classifierMap = visMaps[classifierID];
                            visMap = GPUSOM.TweetSOMClassification(mapID, interal, classifierMap);
                            if (!visMapsSortedByTime.ContainsKey(visMap.MapDate))
                            {
                                visMapsSortedByTime.Add(visMap.MapDate, new MapPack());
                            }
                            visMapsSortedByTime[visMap.MapDate].classificationMap = visMap;
                        }
                        else
                        {
                            VisMap lastMap = null;
                            if (visMapsSortedByTime.Count > 0)
                            {
                                lastMap = visMapsSortedByTime.Last().Value.clusteringMap;
                            }
                            visMap = GPUSOM.TweetSOMClustering(mapID, interal, lastMap);

                            if (!visMapsSortedByTime.ContainsKey(visMap.MapDate))
                            {
                                visMapsSortedByTime.Add(visMap.MapDate, new MapPack());
                            }
                            visMapsSortedByTime[visMap.MapDate].clusteringMap = visMap;
                        }

                        Debug.WriteLine("Entropy : " + interal.Entropy);
                        Debug.WriteLine("Tweets count after preprocessing : " + interal.TweetsCount);
                        visMaps.Add(visMap.VisMapID, visMap);

                    }
                    Clients.Caller.showVisMap(visMap.GetVisData(), classifierID);

                });
            }


            //try
            //{
            //    Debug.Write("Let's cache the visData as  json");

            //    VISData visData = visMap.GetVisData();
            //    System.IO.StreamWriter sw = new System.IO.StreamWriter(rootFolder + "Backend\\DataBase\\visData_test.json");
            //    var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(VISData));
            //    jser.WriteObject(sw.BaseStream, visData);
            //    sw.Close();
            //    Debug.Write("finish json");
            //
            //catch (Exception e)
            //{
            //    Debug.WriteLine(e.InnerException.Message);
            //    Debug.WriteLine(e.Message);
            //}
        }

        public async Task RefineTheMap(string visMapID, int index, int[] fromUnitsID, int[] toUnitsID)
        {
            VisMap refineMap;
            await Task.Run(() =>
            {
                if (visMaps.ContainsKey(visMapID))
                {
                    refineMap = visMaps[visMapID];
                    refineMap.RefineTheMap(fromUnitsID, toUnitsID);
                    Clients.Caller.updateVisMap(index, refineMap.GetVisData());
                }
                else
                {
                    throw new Exception("This map is miss");
                }
            });

        }

        public async Task<Dictionary<string, object>> GetLensData(string visMapID, string lensID, int[] unitsID, string baseData, string subData = null)
        {
            Dictionary<string, object> data = null;
            Debug.WriteLine("baseData here is " + baseData);
            Debug.WriteLine("subData here is " + subData);
            await Task.Run(() =>
            {
                VisMap visMap = visMaps[visMapID];
                Lens lens;
                List<Unit> units = new List<Unit>();
                for (int i = 0, len = unitsID.Length; i < len; ++i)
                {
                    units.Add(visMap.GetUnitAt(unitsID[i]));
                }

                if (lensDatas.ContainsKey(lensID))
                {
                    lens = lensDatas[lensID];
                }
                else
                {
                    lens = new Lens();
                    lensDatas.Add(lensID, lens);
                }

                lens.BindUnits(units);
                lens.MapID = visMapID;
                data = lens.GetDataForVis(baseData, subData);
            });

            return data;
        }

        public async Task RemoveLensData(string visMapID, string lensID)
        {
            await Task.Run(() =>
            {
                lensDatas.Remove(lensID);
            });

        }

        //Interactive for lens
        public async Task cWordCloudPieLens(string lensID, string pieKey, string baseData, string subData)
        {
            HashSet<string> words = new HashSet<string>();
            Lens lens = lensDatas[lensID];
            await Task.Run(() =>
            {
                string t = baseData + "_" + subData;
                switch (t)
                {
                    case "keywordsDistribute_tweetLengthDistribute":
                        {
                            words = lens.GetWordsOfTweetsAtLengthOf(int.Parse(pieKey));
                            break;
                        }
                    case "hashTagsDistribute_tweetLengthDistribute":
                        {

                            break;
                        }
                }

            });

            Clients.Caller.interactiveOnLens(lensID, words.ToList());

        }

        public async Task cMapPieLens(string lensID, string pieKey, string baseData, string subData)
        {
            Lens lens = lensDatas[lensID];
            string countryName = null;
            await Task.Run(() =>
            {
                string t = baseData + "_" + subData;
                switch (t)
                {
                    case "tweetsLocationDistribute_tweetLengthDistribute":
                        {
                            countryName = lens.GetCountryWithMostTweetsAtLengthOf(int.Parse(pieKey));
                            break;
                        }
                    //case "hashTagsDistribute_tweetLengthDistribute":
                    //    {

                    //        break;
                    //    }
                }

            });

            Clients.Caller.interactiveOnLens(lensID, countryName);
        }

        public void DoLongRunningThing()
        {
            Clients.Caller.showMSG(config.Parameter.RootFolder);
        }
    }
}
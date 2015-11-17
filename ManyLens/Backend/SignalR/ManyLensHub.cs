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
using ManyLens.Twitter;
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

        private static SortedDictionary<DateTime, Term> dateTweetsFreq;
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
                if (dateTweetsFreq == null)
                    dateTweetsFreq = TweetsIO.LoadTweetsAsTermsSortedByDate(config.Parameter.fifaFile);
                if (cities1000 == null)
                    cities1000 = TweetsIO.LoadCities1000(config.Parameter.cities1000File);
                if (stopWords == null)
                    stopWords = TweetsIO.LoadStopWord(config.Parameter.stopwordFile);
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

        //damn it, I almost forget how this function works.
        public async Task PullPoint(string start)
        {
            //clear the static data
            interals.Clear();
            //set the parameter
            double alpha = 0.125;
            double beta = 1.5;
            ///config.Parameter.TimeSpan = 3;

            //await TwitterAPI.GetStreamingTweetsByTracking("test");
            await Task.Run(() =>
            {
                Debug.WriteLine("Thread id of pull point " + Thread.CurrentThread.ManagedThreadId);

                
                //Peak Detection
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
                            int peak = i - 1;
                            tp[i - 1].IsPeak = true;
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
                            diff = Math.Abs(tp[i].TweetsCount - mean);
                            variance = alpha * diff + (1 - alpha) * variance;
                            mean = alpha * mean + (1 - alpha) * tp[i].TweetsCount;
                        }
                    }

                    Point point = new Point()
                    {
                        id = tp[t].ID,
                        value = tp[t].TweetsCount,
                        isPeak = tp[t].IsPeak,
                        type = tp[t].PointType,
                        beg = tp[t].BeginPoint,
                        end = tp[t].EndPoint
                    };

                    Clients.Caller.addPoint(point);
                    Thread.Sleep(100);
                }
            });
        }

        public async Task ReOrganizePeak(bool state)
        {
            List<List<float[]>> intervalsInGroups = null;
            await Task.Run(() =>
            {
                if (state)
                {
                    Clients.Caller.timeInterval();
                }
                else
                {
                    //Generate the new big vector
                    Interval[] ia = interals.Values.ToArray();
                    Dictionary<string, int> bigIdofWords = new Dictionary<string, int>();
                    int dimension = 0;
                    for (int i = 0, len = ia.Length; i < len; ++i)
                    {
                        Interval interval = ia[i];
                        foreach (KeyValuePair<string, int> item in interval.Vocabulary.IdOfWords)
                        {
                            if (!bigIdofWords.ContainsKey(item.Key))
                            {
                                bigIdofWords.Add(item.Key, dimension++);
                            }
                        }
                    }
                    List<float[]> bigIntervalVectors = new List<float[]>();
                    List<int> intervalsGroup = new List<int>();
                    for (int i = 0, len = ia.Length; i < len; ++i)
                    {
                        Interval interval = ia[i];
                        float[] tempVector = new float[dimension];
                        for (int j = 0; j < dimension; ++j)
                        {
                            tempVector[j] = 0;
                        }
                        foreach (KeyValuePair<string, int> item in interval.Vocabulary.IdOfWords)
                        {
                            string word = item.Key;
                            int index = item.Value;
                            int newIndex = bigIdofWords[word];
                            tempVector[newIndex] = interval.IntervalVector[index];
                        }
                        bigIntervalVectors.Add(tempVector);
                        intervalsGroup.Add(-1);
                    }

                    int seedsNum = 3;
                    List<float[]> seeds = new List<float[]>(seedsNum);

                    //Random select the seeds
                    List<int> seedsIndex = new List<int>(seedsNum);
                    intervalsInGroups = new List<List<float[]>>();
                    for (int i = 0; i < seedsNum; ++i)
                    {
                        int index = rnd.Next(interals.Count);
                        while (seedsIndex.Contains(index))
                        {
                            index = rnd.Next(interals.Count);
                        }
                        seedsIndex.Add(index);
                        seeds.Add(bigIntervalVectors[index]);
                        intervalsInGroups.Add(new List<float[]>());
                    }

                    int changeGroupNum = int.MaxValue;
                    while (changeGroupNum > 0)
                    {
                        changeGroupNum = 0;
                        for (int i = 0; i < seedsNum; ++i)
                        {
                            intervalsInGroups[i] = new List<float[]>();
                        }

                        //classify the intervals
                        for (int i = 0, len = ia.Length; i < len; ++i)
                        {
                            double minDist = double.MaxValue;
                            int minIndex = -1;
                            for (int j = 0; j < seedsNum; ++j)
                            {
                                double dist = Distance(seeds[j], bigIntervalVectors[i]);
                                if (dist < minDist)
                                {
                                    minDist = dist;
                                    minIndex = j;
                                }
                            }
                            intervalsInGroups[minIndex].Add(bigIntervalVectors[i]);
                            if (intervalsGroup[i] != minIndex)
                            {
                                intervalsGroup[i] = minIndex;
                                changeGroupNum++;
                            }
                        }

                        //update each seed and clear the store group;
                        for (int i = 0; i < seedsNum; ++i)
                        {
                            float[] seedVector = new float[dimension];
                            for (int j = 0, lenj = dimension; j < lenj; ++j)
                            {
                                seedVector[j] = 0;
                            }

                            List<float[]> groupIntervals = intervalsInGroups[i];
                            for (int j = 0, lenj = groupIntervals.Count; j < lenj; ++j)
                            {
                                for (int k = 0, lenk = dimension; k < lenk; ++k)
                                {
                                    seedVector[k] += groupIntervals[j][k];
                                }
                            }

                            for (int j = 0, lenj = dimension; j < lenj; ++j)
                            {
                                seedVector[j] /= groupIntervals.Count;
                            }
                            seeds[i] = seedVector;
                        }
                    }


                    Clients.Caller.clusterInterval(intervalsGroup);
                }

            });


        }

        public static double Distance(float[] a, float[] b)
        {
            if (a.Length != b.Length)
                return -1;
            double dist = 0;
            for (int i = 0, len = a.Length; i < len; ++i)
            {
                double dx = a[i] - b[i];
                dist += dx * dx;
            }
            return Math.Sqrt(dist);
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

                await Task.Run(() => {
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
                        Debug.WriteLine("Tweets count before preprocessing is : "+interal.TweetsCount);
                        Stopwatch sw = new Stopwatch();
                        sw.Start();
                        interal.PreproccessingParallel(progress);
                        sw.Stop();
                        Debug.WriteLine("Preprocessing TIME Consuming : "+ sw.ElapsedTicks / (decimal)Stopwatch.Frequency);

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

                        Debug.WriteLine("Entropy : "+interal.Entropy);
                        Debug.WriteLine("Tweets count after preprocessing : "+interal.TweetsCount);
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

        #region some code for test
        //Just for test
        public void testPullPoint()
        {
            //load the point json data
            System.IO.StreamReader sr = new System.IO.StreamReader(config.Parameter.RootFolder + "Backend\\DataBase\\pointData_test.json");
            var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(List<Point>));
            List<Point> points = (List<Point>)jser.ReadObject(sr.BaseStream);
            sr.Close();
            for (int i = 0, len = points.Count; i < len; ++i)
            {
                Clients.Caller.addPoint(points[i]);
                Thread.Sleep(50);
            }
        }

        public void testPullInterval(string interalID)
        {
            //load the point json data
            System.IO.StreamReader sr = new System.IO.StreamReader(config.Parameter.RootFolder + "Backend\\DataBase\\visData_test.json");
            var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(VISData));
            VISData visData = (VISData)jser.ReadObject(sr.BaseStream);
            sr.Close();
            Clients.Caller.showVIS(visData);
        }
        #endregion

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

        #region some code for test
        //Just for test
        //public void testPullPoint()
        //{
        //    //load the point json data
        //    System.IO.StreamReader sr = new System.IO.StreamReader(rootFolder + "Backend\\DataBase\\pointData_test.json");
        //    var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(List<Point>));
        //    List<Point> points = (List<Point>)jser.ReadObject(sr.BaseStream);
        //    sr.Close();
        //    for (int i = 0, len = points.Count; i < len; ++i)
        //    {
        //        Clients.Caller.addPoint(points[i]);
        //        Thread.Sleep(800);
        //    }
        //}

        //public void testPullInterval(string interalID)
        //{
        //    //load the point json data
        //    System.IO.StreamReader sr = new System.IO.StreamReader(rootFolder + "Backend\\DataBase\\visData_test.json");
        //    var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(VISData));
        //    VISData visData = (VISData)jser.ReadObject(sr.BaseStream);
        //    sr.Close();
        //    Clients.Caller.showVIS(visData);
        //}
        #endregion

        //public void ReOrganize(string visMapID, int[] selectedUnits)
        //{
        //    VisMap newVisMap = GPUSOM.TweetReOrganizeSOM(visMaps[visMapID], selectedUnits);
        //    visMaps.Add(newVisMap.VisMapID, newVisMap);
        //    Clients.Caller.showVIS(newVisMap.GetVisData());
        //}
        //public void MoveTweets(string visMapID, int[] fromUnitsID, int[] toUnitsID)
        //{
        //    if (visMapID == null || fromUnitsID == null || toUnitsID == null)
        //        return;

        //    if (fromUnitsID.Length < 1 || toUnitsID.Length < 1)
        //        return;

        //    VisMap visMap = visMaps[visMapID];
        //    List<float[]> rawTrainset = new List<float[]>();
        //    List<Tweet> rawTweets = new List<Tweet>();
        //    List<Unit> fromUnits = new List<Unit>();
        //    List<Unit> toUnits = new List<Unit>();

        //    for (int i = fromUnitsID.Length - 1; i >= 0; --i)
        //    {
        //        Unit unit = visMap.GetUnitAt(fromUnitsID[i]);

        //        fromUnits.Add(unit);

        //        rawTrainset.AddRange(unit.TFIDFVectors);
        //        rawTweets.AddRange(unit.Tweets);
        //        visMap.RemoveUnitAt(fromUnitsID[i]);

        //    }

        //    for (int i = toUnitsID.Length - 1; i >= 0; --i)
        //    {
        //        Unit unit = visMap.GetUnitAt(toUnitsID[i]);
        //        toUnits.Add(unit);
        //    }

        //    for (int i = rawTrainset.Count - 1; i >= 0; --i)
        //    {
        //        float[] rawTrainVector = rawTrainset[i];
        //        Unit closetUnit = null;
        //        float dist = float.MaxValue;
        //        for (int j = toUnits.Count - 1; j >= 0; --j)
        //        {
        //            float[] unitVector = toUnits[j].UnitVector;
        //            float tempDist = 0;
        //            for (int k = unitVector.Length - 1; k >= 0; --k)
        //            {
        //                tempDist += (unitVector[k] - rawTrainVector[k]) * (unitVector[k] - rawTrainVector[k]);
        //            }
        //            if (tempDist < dist)
        //            {
        //                dist = tempDist;
        //                closetUnit = toUnits[j];
        //            }
        //        }
        //        closetUnit.AddTweet(rawTweets[i]);
        //    }

        //    Clients.Caller.reDrawSOMMap(visMap.GetVisData());
        //}
        public void DoLongRunningThing()
        {
            Clients.Caller.showMSG(config.Parameter.RootFolder);
        }
    }
}
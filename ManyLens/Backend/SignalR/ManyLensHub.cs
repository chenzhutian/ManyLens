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
        private static bool TestMode = false;
        private static string rootFolder = AppDomain.CurrentDomain.SetupInformation.ApplicationBase;

        private static SortedDictionary<DateTime, Term> dateTweetsFreq;
        private static SortedDictionary<string, Interval> interals = new SortedDictionary<string, Interval>();
        private static Dictionary<string, VisMap> visMaps = new Dictionary<string, VisMap>();
        private static Dictionary<string, Lens> lensdatas = new Dictionary<string, Lens>();
        
        public static List<TweetsIO.CityStruct> cities1000;
        public static HashSet<string> stopWords;

        private Random rnd = new Random();

        public async Task LoadData()
        {
            //clear the static data
            interals.Clear();
            lensdatas.Clear();
            //string tweetFile = rootFolder + "Backend\\DataBase\\onedrivetweets";
            string tweetFile = rootFolder + "Backend\\DataBase\\FIFAShortAttributesSample";
            string cities1000File = rootFolder + "Backend\\DataBase\\GEODATA\\cities1000short";
            string stopwordFile = rootFolder + "Backend\\DataBase\\PREPROCESSINGDICT\\stopwords";
            Debug.WriteLine(tweetFile);
            await Task.Run(() =>
            {
                if (dateTweetsFreq == null)
                    dateTweetsFreq = TweetsIO.LoadTweetsAsTermsSortedByDate(tweetFile);
                if (cities1000 == null)
                    cities1000 = TweetsIO.LoadCities1000(cities1000File);
                if(stopWords == null)
                    stopWords = TweetsIO.LoadStopWord(stopwordFile);
            });

        }


        private static List<Interval> taskList = new List<Interval>();
        private static void PreprocesInterval()
        {
            while (taskList.Count > 0)
            {
                Interval interval = taskList[0];
                Debug.WriteLine("TID　of this DOLONGRUN is " + Thread.CurrentThread.ManagedThreadId);
                Debug.WriteLine("ON interval " + interval.ID);
                IProgress<double> p = new Progress<double>();
                interval.Preproccessing(p);
                Debug.WriteLine("Conditional Entropy of " + interval.ID + " is " + interval.ConditionalEntropy);
                Debug.WriteLine("Entropy of " + interval.ID + " is " + interval.Entropy);
                taskList.RemoveAt(0);
            }
        }
        private static Task task = new Task(PreprocesInterval);
        private static void LazyThreadForConditionalEntropy(Interval interval)
        {

            taskList.Add(interval);
            if (task.Status == TaskStatus.Created)
                task.Start();
            if (task.IsCompleted)
            {
                task = new Task(PreprocesInterval);
                task.Start();
            }
        }

        private static double GetGaussin(double x,double sigma = 1)
        {
            return Math.Exp((-x * x *0.5)/(sigma * sigma)) / (Math.Sqrt(2 * Math.PI) * sigma);
        }

        private static void GaussinFilterTerm(int beg, int end, Term[] tp)
        {
            if (end > tp.Length)
                end = tp.Length;
            if (beg < 0)
                beg = 0;

            for (int i = beg; i < end; ++i)
            {
                for (int j = beg; j < end; ++j)
                {
                    double g = GetGaussin(j - i,0.9);
                    tp[i].TempVirtualCount += tp[j].VirtualCount * g;
                }
            }
            for (int i = beg; i < end; ++i)
            {
                tp[i].GaussinBlurDone();
            }
        }

        //damn it, I almost forget how this function works.
        public async Task PullPoint(string start)
        {
            //clear the static data
            interals.Clear();
            //set the parameter
            double alpha = 0.125;
            double beta = 2.0;
            Parameter.timeSpan = 2;

            await Task.Run(() =>
            {
                Debug.WriteLine("Thread id of pull point " + Thread.CurrentThread.ManagedThreadId);
                //Peak Detection
                //下面这个实现有往回的动作，并不是真正的streaming，要重新设计一下
                int p = 5;
                int timeWindow = 0;
                int stepSize = timeWindow;
                int stepCount = p;
                double cutoff = 0, mean = 0, diff = 0, variance = 0;
                Term[] tp = dateTweetsFreq.Values.ToArray();
                for (int i = 0, len = tp.Length; i < len; ++i)
                {
                    tp[i].PointType = 0;
                    tp[i].TempVirtualCount = -1;
                    tp[i].GaussinBlurDone();
                }

                GaussinFilterTerm(0, 0 + timeWindow, tp);
                for (int i = 0; i < p; i++)
                {
                    mean += tp[i].VirtualCount;
                }
                mean = mean / p;

                for (int i = 0; i < p; i++)
                {
                    variance = variance + Math.Pow(tp[i].VirtualCount - mean, 2);
                }
                variance = Math.Sqrt(variance / p);

                //output the point json data
                System.IO.StreamWriter sw = new System.IO.StreamWriter(rootFolder + "Backend\\DataBase\\pointData_test.json");
                var jser = new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(List<Point>));
                List<Point> points = new List<Point>();
                for (int i = p, t = 0; t < tp.Length; i++,stepCount--, t++)
                {
                    //Gaussin smoothing
                    if (stepCount == 0)
                    {
                        GaussinFilterTerm(i, i + timeWindow, tp);
                        stepCount = stepSize;
                    }

                    if (i < tp.Length)
                    {
                        cutoff = variance * beta;
                        if (Math.Abs(tp[i].VirtualCount - mean) > cutoff && tp[i].VirtualCount > tp[i - 1].VirtualCount)
                        {
                            int begin = i - 1;
                            while (i < tp.Length && tp[i].VirtualCount > tp[i - 1].VirtualCount)
                            {
                                //Gaussin smoothing
                                if (stepCount == 0)
                                {
                                    GaussinFilterTerm(i, i + timeWindow, tp);
                                    stepCount = stepSize;
                                }
                                diff = Math.Abs(tp[i].VirtualCount - mean);
                                variance = alpha * diff + (1 - alpha) * variance;
                                mean = alpha * mean + (1 - alpha) * tp[i].VirtualCount;
                                i++;
                                stepCount--;
                            }

                            int end = i;
                            tp[i - 1].IsPeak = true;
                            while (i < tp.Length && tp[i].VirtualCount > tp[begin].VirtualCount)
                            {
                                //Gaussin smoothing
                                if (stepCount == 0)
                                {
                                    GaussinFilterTerm(i, i + timeWindow, tp);
                                    stepCount = stepSize;
                                }

                                cutoff = variance * beta;
                                if (Math.Abs(tp[i].VirtualCount - mean) > cutoff && tp[i].VirtualCount > tp[i - 1].VirtualCount)
                                {
                                    end = --i;
                                    stepCount++;
                                    break;
                                }
                                else
                                {
                                    diff = Math.Abs(tp[i].VirtualCount - mean);
                                    variance = alpha * diff + (1 - alpha) * variance;
                                    mean = alpha * mean + (1 - alpha) * tp[i].VirtualCount;
                                    end = i++;
                                    stepCount--;
                                }
                            }

                            
                            tp[begin].BeginPoint = tp[begin].ID;
                            tp[begin].EndPoint = tp[end].ID;
                            tp[begin].PointType += 1;

                            tp[end].BeginPoint = tp[begin].ID;
                            tp[end].EndPoint = tp[end].ID;
                            tp[end].PointType += 2;

                            ArraySegment<Term> oldTerm = new ArraySegment<Term>(tp, 0, begin);
                            Interval interal = new Interval(tp[begin].TermDate, tp[begin], oldTerm.ToArray());
                            //Set the last interval
                            if(interals.Count > 0)
                                interal.LastInterval = interals.Last().Value;
                            interals.Add(interal.ID, interal);
                            
                            for (int k = begin + 1; k < end; ++k)
                            {
                                tp[k].BeginPoint = tp[begin].ID;
                                tp[k].EndPoint = tp[end].ID;
                                tp[k].PointType = 4;
                                interal.AddTerm(tp[k]);
                            }
                            interal.SetEndDate(tp[end].TermDate);
                            
                            LazyThreadForConditionalEntropy(interal);
                        }
                        else
                        {
                            diff = Math.Abs(tp[i].VirtualCount - mean);
                            variance = alpha * diff + (1 - alpha) * variance;
                            mean = alpha * mean + (1 - alpha) * tp[i].VirtualCount;
                        }
                    }

                    //Determine the type of this point
                    //tp[t].PointType = tp[t].PointType != 0 ? tp[t].PointType : lastMarkType == 2 ? (uint)0 : (uint)4;
                    Point point = new Point()
                    {
                        id = tp[t].ID,
                        value = tp[t].VirtualCount,
                        trueValue = tp[t].TweetsCount,
                        isPeak = tp[t].IsPeak,
                        type = tp[t].PointType,
                        beg = tp[t].BeginPoint,
                        end = tp[t].EndPoint
                    };

                    #region mark version
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
                    #endregion

                    //Output the json data
                    points.Add(point);

                    Clients.Caller.addPoint(point);
                    Thread.Sleep(50);

                    //Gaussin smoothing
                    if (stepCount == 0)
                    {
                        GaussinFilterTerm(i, i + timeWindow, tp);
                        stepCount = stepSize;
                    }
                }

                //Output the json data
                Debug.Write("Let's cache the point data as json");
                jser.WriteObject(sw.BaseStream, points);
                sw.Close();
                Debug.Write("finish json");
            });
        }

        public async Task ReOrganizePeak(bool state) 
        {
            await Task.Run(() => {
                if (state)
                {

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
                    }


                    int seedsNum = 3;
                    List<float[]> seeds = new List<float[]>(seedsNum);
                    
                    //Random select the seeds
                    List<int> seedsIndex = new List<int>(seedsNum);
                    List<List<Interval>> intervalsInGroups = new List<List<Interval>>();
                    for (int i = 0; i < seedsNum; ++i)
                    {
                        int index = rnd.Next(interals.Count);
                        while (seedsIndex.Contains(index))
                        {
                            index = rnd.Next(interals.Count);
                        }
                        seedsIndex.Add(index);
                        seeds.Add(ia[index].IntervalVector);
                        intervalsInGroups.Add(new List<Interval>());
                    }

                    while(true)
                    {
                        //classify the intervals
                        for (int i = 0, len = ia.Length; i < len; ++i)
                        {
                            double minDist = double.MaxValue;
                            int minIndex = -1;
                            for (int j = 0; j < seedsNum; ++j)
                            {
                                double dist = Distance(seeds[j], ia[i].IntervalVector);
                                if (dist < minDist)
                                {
                                    minDist = dist;
                                    minIndex = j;
                                }
                            }
                            intervalsInGroups[minIndex].Add(ia[i]);
                        }

                        //update each seed and clear the store group;
                        for (int i = 0; i < seedsNum; ++i)
                        {
                            float[] seedVector = new float[dimenstion];
                            for (int j = 0, lenj = dimenstion; j < lenj; ++j)
                            {
                                seedVector[j] = 0;
                            }

                            List<Interval> groupIntervals = intervalsInGroups[i];
                            for (int j = 0, lenj = groupIntervals.Count; j < lenj; ++j)
                            {
                                for (int k = 0, lenk = dimenstion; k < lenk; ++k)
                                {
                                    seedVector[k] += groupIntervals[j].IntervalVector[k];
                                }
                            }

                            for (int j = 0, lenj = dimenstion; j < lenj; ++j)
                            {
                                seedVector[j] /= groupIntervals.Count;
                            }

                            seeds[i] = seedVector;
                            intervalsInGroups[i] = new List<Interval>();
                        }
                    }
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

        public async Task PullInterval(string interalID, IProgress<double> progress)
        {
            VisMap visMap;
            string mapID = interalID + "_0";

            await Task.Run(() =>
            {
                if (visMaps.ContainsKey(mapID))
                    visMap = visMaps[mapID];
                else
                {
                   
                    Interval interal = interals[interalID];

                    interal.PreproccessingParallel(progress);

                    //Test
                    if (TestMode)
                    {
                        visMap = GPUSOM.TestTweetSOM(interal, rootFolder);// TweetSOM(interal, rootFolder);
                    }
                    else
                    {
                        visMap = GPUSOM.TweetSOM(interal, rootFolder);
                    }

                    Debug.WriteLine(interal.Entropy);
                    visMaps.Add(visMap.VisMapID, visMap);
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
                
                Clients.Caller.showVIS(visMap.GetVisData());

            });

        }

        public async Task<Dictionary<string,object>> GetLensData(string visMapID,string lensID, int[] unitsID, string baseData,string subData = null)
        {
            Dictionary<string,object> data = null;
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

                if (lensdatas.ContainsKey(lensID))
                {
                    lens = lensdatas[lensID];
                }
                else
                {
                    lens = new Lens();
                    lensdatas.Add(lensID, lens);
                }

                lens.BindUnits(units);
                lens.MapID = visMapID;
                data = lens.GetDataForVis(baseData,subData);
            });

            return data;
        }

        public async Task RemoveLensData(string visMapID, string lensID)
        {
            await Task.Run(() => {
                lensdatas.Remove(lensID);
            });
            
        }

        #region some code for test
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
                Thread.Sleep(50);
            }
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
        #endregion

        //Interactive for lens
        public async Task cWordCloudPieLens(string lensID, string pieKey,string baseData,string subData)
        {
            HashSet<string> words = new HashSet<string>();
            Lens lens = lensdatas[lensID];
            await Task.Run(() => {
                string t = baseData + "_" + subData;
                switch(t)
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

            Clients.Caller.interactiveOnLens(lensID,words.ToList());
            
        }

        public async Task cMapPieLens(string lensID, string pieKey, string baseData, string subData)
        {
            Lens lens = lensdatas[lensID];
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

        public void ReOrganize(string visMapID, int[] selectedUnits)
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
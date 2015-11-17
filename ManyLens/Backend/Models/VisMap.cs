using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class VisMap
    {
        private string visMapId;
        private Dictionary<int, Unit> units = null;
        private Unit[][] unitsInMap = null;
        private int maxTweetCount = -1;
        private int width;
        private int height;

        private float averrageError;
        private float[] mapWeightInColumnMajor = null;
        private int[] bID;
        private float[] errors;

        private Interval interval;

        private VisMap parentNote = null;
        private int childNum = 0;

        #region Getter &Setter
        public string VisMapID
        {
            get
            {
                return this.visMapId;
            }
            private set
            {
                this.visMapId = value;
            }
        }
        public DateTime MapDate
        {
            get
            {
                return this.Interval.BeginDate;
            }
        }
        public Interval Interval
        {
            get
            {
                return this.interval;
            }
        }
        public int MaxTweetCount
        {
            get
            {
                return this.maxTweetCount;
            }
            private set
            {
                this.maxTweetCount = value;
            }
        }
        public int Width
        {
            get
            {
                return this.width;
            }
            private set
            {
                this.width = value;
            }
        }
        public int Height
        {
            get
            {
                return this.height;
            }
            private set
            {
                this.height = value;
            }
        }
        public float AverrageError
        {
            get { return averrageError; }
            private set { averrageError = value; }
        }
        public VisMap ParentNote
        {
            get
            {
                return this.parentNote;
            }
            set
            {
                if (value != null)  //add one to the children number
                    value.ChildrenNum++;
                this.parentNote = value;
            }
        }
        public int ChildrenNum
        {
            get
            {
                return this.childNum;
            }
            set
            {
                this.childNum = value;
            }
        }
        public float[] MapWeightInColumnMajor
        {
            get
            {
                return this.mapWeightInColumnMajor;
            }
            set
            {
                if (value.Length != this.Width * this.Height * config.Parameter.DimensionAfterRandomMapping)
                    throw new Exception("the size of map weight matrix is wrong!");
                else 
                {
                    this.mapWeightInColumnMajor = value;
                }
            }
        }
        public int[] BID
        {
            get { return bID; }
            private set { bID = value; }
        }
        public float[] Errors
        {
            get { return errors; }
            private set { errors = value; }
        }
        #endregion

        private static float Sum(float[] a)
        {
            float sum = 0;
            for (int i = 0, len = a.Length; i < len; ++i)
            {
                sum += a[i];
            }
            return sum;
        }
        private static float Averrage(float[] a)
        {
            float sum = Sum(a);
            return sum / a.Length;
        }

        public VisMap(string visMapID, int width, int height, float[] mapWeight, int[] bID,float[] errors,Interval interval, VisMap parentNote = null)
        {
            this.ParentNote = parentNote;
            this.VisMapID = visMapID;
            this.interval = interval;
            this.Width = width;
            this.Height = height;
            this.AverrageError = Averrage(errors);
            this.MapWeightInColumnMajor = mapWeight;
            this.BID = bID;
            this.Errors = errors;
            this.units = new Dictionary<int, Unit>();
            this.unitsInMap = new Unit[this.Height][];
            for (int i = 0; i < this.Height; ++i)
            {
                this.unitsInMap[i] = new Unit[this.Width];
            }
            this.interval.VisMap = this;
        }

        public void AddUnit(int unitID, Unit unit)
        {
            this.units.Add(unitID, unit);
            this.unitsInMap[unit.Y][unit.X] = unit;
        }

        public bool TryAddTweetToUnit(int unitID,float error, Tweet tweet)
        {
            if (units.ContainsKey(unitID))
            {
                units[unitID].AddTweet(error,tweet);
                return true;
            }
            return false;
        }

        public void RefineTheMap(int[] fromUnitsID, int[] toUnitsID)
        {
            List<Tweet> fromTweets = new List<Tweet>();
            for (int i = 0, len = fromUnitsID.Length; i < len; ++i)
            {
                Unit unit = this.units[fromUnitsID[i]];
                fromTweets.AddRange(unit.GetTweetsBelowAverrageError(this.AverrageError));
            }

            float[] inputVectors = new float[config.Parameter.HashDimension * fromTweets.Count];
            int dimension = config.Parameter.HashDimension;
            for (int i = 0, len = fromTweets.Count; i < len; ++i)
            {
                int index = this.Interval.Tweets.IndexOf(fromTweets[i]);
                this.Interval.HashVecotrs[index].CopyTo(inputVectors, i * dimension);
            }

            dimension = config.Parameter.DimensionAfterRandomMapping;
            float[] inputWeights = new float[dimension * toUnitsID.Length];
            for (int i = 0, len = toUnitsID.Length; i < len; ++i)
            {
                Unit unit = this.GetUnitAt(toUnitsID[i]);
                float[] unitWeightVector = unit.UnitWeightVector;
                for (int j = 0; j < dimension; ++j)
                {
                    inputWeights[i + j * len] = unitWeightVector[j];
                }
            }

            var pack = SOM.GPUSOM.GPUFindBID(inputVectors,fromTweets.Count, 
                                                                    inputWeights,toUnitsID.Length);
            for (int i = 0, len = fromTweets.Count; i < len; ++i)
            {
                int index = this.Interval.Tweets.IndexOf(fromTweets[i]);
                this.Errors[index] = pack.error[i];
                this.BID[index] = toUnitsID[pack.BID[i]];
                this.TryAddTweetToUnit(this.BID[index], this.Errors[index], fromTweets[i]);
            }
            // ready to Update map
            SOM.GPUSOM.TweetSOMUpdateMap(this);
        }

        public Unit GetUnitAt(int index)
        {
            return this.units[index];
        }

        public void RemoveUnitAt(int index)
        {
            this.units.Remove(index);
        }

        public VISData GetVisData()
        {

            List<int> unitIDs = this.units.Keys.ToList();
            List<UnitsData> unitData = new List<UnitsData>();
            try
            {
                for (int i = unitIDs.Count - 1; i >= 0; --i)
                {
                    Unit unit = units[unitIDs[i]];
                    if (unit.TweetsCount > this.MaxTweetCount)
                    {
                        this.MaxTweetCount = unit.TweetsCount;
                    }

                    unitData.Add(new UnitsData()
                    {
                        unitID = unit.UnitID,
                        value = unit.TweetsCount,
                        x = unit.X,
                        y = unit.Y,
                        isSpam = false,//unit.IsSpamUnit(),
                        mapID = this.VisMapID
                    });
                }

                List<List<Unit>> clusters = this.GrowCluster();
                List<Label> labels = new List<Label>();
                //Iterate each cluster
                foreach (List<Unit> units in clusters)
                {
                    Dictionary<string,int> wordLabels = new Dictionary<string, int>();
                    int x = -1;
                    int y = -1;
                    int maxCount = -1;
                    //For each unit in this cluster, find the unit with most tweets, and count the word's nums
                    for (int i = 0, len = units.Count; i < len; ++i)    
                    {
                        Unit unit = units[i];
                        foreach (KeyValuePair<string, int> item in unit.WordLabels)
                        {
                            if (!wordLabels.ContainsKey(item.Key))
                            {
                                wordLabels.Add(item.Key, item.Value);
                            }
                            else 
                            {
                                wordLabels[item.Key] += item.Value;
                            }
                        }
                        if (unit.TweetsCount > maxCount)
                        {
                            maxCount = unit.TweetsCount;
                            x = unit.X;
                            y = unit.Y;
                        }
                    }

                    double maxValue = -1.0;
                    string targetLabel = "";
                    //calculate the tf-idf of each word
                    foreach(KeyValuePair<string, int>item in wordLabels)
                    {
                        try
                        {
                            double temp = 1;
                            double value = 0;
                            if(this.Interval.Vocabulary.DfOfWords.ContainsKey(item.Key)&& this.Interval.Vocabulary.Most50.Contains(item.Key))
                            {
                                temp = (double)this.Interval.Vocabulary.DfOfWords[item.Key];
                                value = item.Value * Math.Log((double)this.Interval.TweetsCount/( 1.0 + temp));

                                if (item.Value > maxValue)
                                {
                                    maxValue = value;
                                    targetLabel = item.Key;
                                }
                            }
                        }
                        catch (KeyNotFoundException e)
                        {
                            Debug.WriteLine(e.Message);
                            Debug.WriteLine(item.Key);
                        }
                    }

                    labels.Add(new Label() { x = x, y = y, label = targetLabel,value= maxValue});
                }

                VISData visdata = new VISData()
                {
                    mapID = this.VisMapID,
                    width = this.Width,
                    height = this.Height,
                    max = this.maxTweetCount,
                    min = 0,
                    labels = labels,
                    unitsData = unitData
                };

                return visdata;
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.InnerException);
                return null;
            }
        }

        private double[] stops = new double[]{0.000, 0.067, 0.117, 0.24, 0.44, 0.51, 0.6};
        private List<List<Unit>> GrowCluster()
        {
            bool[][] unitsFlat = new bool[this.Height][];
            for (int i = 0; i < this.Height; ++i)
            {
                unitsFlat[i] = new bool[this.Width];
                for (int j = 0; j < this.Width; ++j)
                {
                    unitsFlat[i][j] = false;
                }
            }

            List<List<Unit>> clusters = new List<List<Unit>>();
            for (int i = 0; i < this.Height; ++i)
            {
                for (int j = 0; j < this.Width; ++j)
                {
                    Unit unit = this.unitsInMap[i][j];
                    if (unit != null && !unitsFlat[i][j] &&unit.TweetsCount >= stops[3] * this.MaxTweetCount)
                    {
                        clusters.Add(Grow(i, j, unitsFlat));
                    }
                }
            }
            return clusters;
        }

        private List<Unit> Grow(int y, int x, bool[][] unitsFlat)
        {
            if (y < 0 || y >= this.Height 
                || x < 0 || x >= this.Width )
            {
                return null;
            }
            if( unitsFlat[y][x]
                || this.unitsInMap[y][x] == null
                ||this.unitsInMap[y][x].TweetsCount < stops[2] * this.MaxTweetCount)
            {
                unitsFlat[y][x] = true;
                return null;
            }
                
            List<Unit> units = new List<Unit>();
            units.Add(this.unitsInMap[y][x]);
            unitsFlat[y][x] = true;

            var result = Grow(y + 1, x + 1, unitsFlat);
            if(result != null) units.AddRange(result);

            result = Grow(y + 1, x - 1, unitsFlat);
            if (result != null) units.AddRange(result);

            result = Grow(y + 1, x , unitsFlat);
            if (result != null) units.AddRange(result);

            result = Grow(y - 1, x + 1, unitsFlat);
            if (result != null) units.AddRange(result);

            result = Grow(y - 1, x - 1, unitsFlat);
            if (result != null) units.AddRange(result);

            result = Grow(y - 1, x, unitsFlat);
            if (result != null) units.AddRange(result);

            result = Grow(y, x - 1, unitsFlat);
            if (result != null) units.AddRange(result);

            result = Grow(y, x + 1, unitsFlat);
            if (result != null) units.AddRange(result);

            return units;
        }

    }
}
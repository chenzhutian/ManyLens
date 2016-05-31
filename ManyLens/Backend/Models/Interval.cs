using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace ManyLens.Models
{
    public class Interval : DerivedTweetSet
    {
        private string id;
        private DateTime beginDate;
        private DateTime endDate;
        private float[] intervalVector;
        private List<string> userIds;
        private int hashDimension = config.Parameter.HashDimension;

        private bool hasVectorized = false;

        private bool hasSOMed = false;

        private VisMap visMap = null;
        private double entropy = -1;

        //Just for hack
        public Dictionary<string, string> oW2dW = new Dictionary<string, string>();

        private int termsCount = 0;

        #region Getter & Setter
        public string ID
        {
            get
            {
                return this.id;
            }
        }
        public DateTime BeginDate
        {
            get
            {
                return this.beginDate;
            }
            private set
            {
                this.beginDate = value;
            }
        }
        public DateTime EndDate
        {
            get
            {
                return this.endDate;
            }
        }
        public int TermsCount
        {
            get
            {
                return this.termsCount;
            }
        }
        //public float[] RMMatrix
        //{
        //    get
        //    {
        //        return this.rmMatrix;
        //    }
        //    set
        //    {
        //        this.rmMatrix = value;
        //    }
        //}
        public bool HasVectorized
        {
            get
            {
                return this.hasVectorized;
            }
            set
            {
                if (value == true)
                    this.hasVectorized = value;
            }
        }

        public bool HasSOMed
        {
            get
            {
                return this.hasSOMed;
            }
        }
        public List<float[]> TFIDFVectors
        {
            get
            {
                if (this.SparseVector == null)
                    return null;
                if (this.tfidfVectors == null)
                {
                    this.tfidfVectors = new List<float[]>();

                    int vectorCount = this.SparseVector.Count;
                    if (vectorCount != this.TweetsCount)
                        throw new Exception("the count of vector and tweets is different！");

                    double D = vectorCount;
                    for (int i = 0; i < vectorCount; ++i)
                    {
                        float[] vector = new float[this.Dimension];
                        double sum = 0.0;
                        List<string> keys = this.SparseVector[i].Keys.ToList();
                        for (int j = keys.Count - 1; j >= 0; --j)
                        {
                            string key = keys[j];
                            double value = (double)this.SparseVector[i][key];
                            int id = this.Vocabulary.IdOfWords[key];
                            double idf = Math.Log(D / ((double)this.Vocabulary.DfOfWords[key] + 1.0));
                            vector[id] = (float)(value * idf);
                            sum += vector[id] * vector[id];
                        }
                        sum = Math.Sqrt(sum);
                        for (int j = keys.Count - 1; j >= 0; --j)
                        {
                            string key = keys[j];
                            int id = this.Vocabulary.IdOfWords[key];
                            vector[id] = (float)(vector[id] / sum);
                        }
                        this.tfidfVectors.Add(vector);
                    }
                }


                return this.tfidfVectors;
            }
        }
        public List<float[]> HashVecotrs
        {
            get
            {
                if (this.SparseVector == null)
                    return null;
                if (this.hashVectors == null)
                {
                    this.hashVectors = new List<float[]>();
                    int vectorCount = this.SparseVector.Count;
                    if (vectorCount != this.TweetsCount)
                        throw new Exception("the count of vector and tweets is different！");

                    for (int i = 0; i < vectorCount; ++i)
                    {
                        float[] vector = new float[this.hashDimension];
                        double sum = 0.0;
                        foreach (KeyValuePair<string, int> item in this.SparseVector[i])
                        {
                            int h = myMath.MurmurHash3.GetHashCode(item.Key);
                            int index = Math.Abs(h) % this.hashDimension;
                            int value = item.Value * (h > 0 ? 1 : -1);
                            vector[index] += value;
                            sum += value * value;
                        }
                        sum = Math.Sqrt(sum);
                        foreach (KeyValuePair<string, int> item in this.SparseVector[i])
                        {
                            int h = myMath.MurmurHash3.GetHashCode(item.Key);
                            int index = Math.Abs(h) % this.hashDimension;
                            vector[index] = (float)(vector[index] / sum);
                        }
                        this.hashVectors.Add(vector);
                    }
                }

                return this.hashVectors;
            }
        
        }
        public float[] IntervalVector
        {
            get
            {
                int t = 5;
                while (--t >= 0 && !this.HasVectorized) 
                {
                    Thread.Sleep(500);
                }

                if (!this.HasVectorized)
                {
                    return null;
                }

                if (this.intervalVector == null)
                {
                    this.intervalVector = new float[this.TFIDFVectors[0].Length];
                    for (int i = 0, len = this.intervalVector.Length; i < len; ++i)
                    {
                        this.intervalVector[i] = 0;
                    }
                    for (int i = 0, len = this.TFIDFVectors.Count; i < len; ++i)
                    {
                        float[] tempVector = this.TFIDFVectors[i];
                        for (int j = 0, lenj = tempVector.Length; j < lenj; ++j)
                        {
                            this.intervalVector[j] += tempVector[j];
                        }
                    }
                    for (int i = 0, len = this.intervalVector.Length; i < len; ++i)
                    {
                        this.intervalVector[i] /= this.TFIDFVectors.Count;
                    }

                }
                return this.intervalVector;
            }
        }
        public double Entropy
        {
            get
            {
                if (!this.HasVectorized)
                {
                    ManyLens.Preprocessing.TweetsVectorizer.VectorizeEachTweet(this);
                }
                if (this.entropy == -1)
                {
                    double entropy = 0;
                    List<string> keys = this.Vocabulary.PofWords.Keys.ToList();
                    //int t = 0;
                    //for (int i = 0; t< 50; ++i)
                    //{
                    //    if (keys[i] == "bra" || keys[i] == "ger")
                    //        continue;
                    //    double value = this.Vocabulary.PofWords[keys[i]];
                    //    entropy +=  value* Math.Log(value);
                    //    ++t;
                    //}
                    foreach (KeyValuePair<string, double> item in this.Vocabulary.PofWords)
                    {
                        entropy += item.Value * Math.Log(item.Value);
                    }
                    this.entropy = -entropy;
                }
                return this.entropy;
            }
        }
        //public Interval LastInterval
        //{
        //    get { return this.lastInterval; }
        //    set { this.lastInterval = value; }
        //}
        //public double ConditionalEntropy
        //{
        //    get
        //    {
        //        if (this.LastInterval == null)
        //            return -1;
        //        if (!this.HasVectorized)
        //            return -1;
        //        if (this.conditionalEntropy == -1)
        //        {
        //            if (this.HXY == -1)
        //            {
        //                double hxy = 0;
        //                foreach (KeyValuePair<string, double> item1 in this.Vocabulary.PofWords)
        //                {
        //                    double p1 = item1.Value;
        //                    foreach (KeyValuePair<string, double> item2 in this.LastInterval.Vocabulary.PofWords)
        //                    {
        //                        double p2 = item2.Value;
        //                        double p = p1 * p2;
        //                        hxy += p * Math.Log(p);
        //                    }
        //                }
        //                this.HXY = -hxy;
        //            }
        //            this.conditionalEntropy = this.HXY - this.LastInterval.Entropy;
        //        }
        //        return this.conditionalEntropy;
        //    }
        //}
        public override Vocabulary Vocabulary
        {
            get
            {
                int t = 5;
                while (--t >= 0 && !this.HasVectorized)
                {
                    Thread.Sleep(500);
                }

                if (!this.HasVectorized)
                {
                    return null;
                }
	
                return base.Vocabulary;
            }
            set
            {
                base.Vocabulary = value;
            }
        }
        public VisMap VisMap
        {
            get { return visMap; }
            set 
            { 
                visMap = value;
                this.hasSOMed = true;
            }
        }
        public List<string> UserIds
        {
            get
            {
                if (this.userIds == null)
                {
                    HashSet<string> tempUserIds = new HashSet<string>();
                    this.Tweets.ForEach(t =>
                    {
                        if(!tempUserIds.Contains(t.User.UserID))
                        {
                            tempUserIds.Add(t.User.UserID);
                        }
                    });
                    this.userIds = tempUserIds.ToList();
                }
                return this.userIds;
            }
        }
        #endregion

        public Interval(List<Tweet> tweets)
            : base()
        {
            this.id = "test";
            this.Tweets = tweets;
        }

        public Interval(DateTime beginDate, Term term)
            : base()
        {
            this.id = beginDate.ToString("yyyyMMddHHmmss");
            this.BeginDate = beginDate;
            this.HasPreprocessed = term.HasPreprocessed;
            this.Tweets.AddRange(term.Tweets);
        }

        public void AddTerm(Term term)
        {
            this.HasPreprocessed = term.HasPreprocessed ? this.HasPreprocessed : false;
            this.termsCount++;
            this.Tweets.AddRange(term.Tweets);
        }

        public float[] GetHashVector(int num = 0)
        {
            int dimension = this.hashDimension;
            num = num == 0 ? this.SparseVector.Count : num;
            Debug.WriteLine("Total is "+((double)dimension * num * 4.0 / (1024.0 * 1024 * 1024)) + "GB");
            float[] hashVector = new float[dimension * num];
            for (int i = 0; i < num; ++i)
            {
                for (int j = 0; j < dimension; ++j)
                {
                    hashVector[j + i * dimension] = this.HashVecotrs[i][j];
                }
            }

            return hashVector;
        }

        public float[] GetTFIDFVector(int num = 0)
        {

            int dimension = this.Dimension;
            num = num == 0 ? this.SparseVector.Count : num;
            float[] tfidfVector = new float[dimension * num];
            for (int i = 0; i < num; ++i)
            {
                for (int j = 0; j < dimension; ++j)
                {
                    tfidfVector[j + i * dimension] = this.TFIDFVectors[i][j];
                }
            }
            return tfidfVector;
        }

        public void SetEndDate(DateTime endDate)
        {
            this.endDate = endDate;
        }

        public void Preproccessing(IProgress<double> progress)
        {

            ManyLens.Preprocessing.TweetsPreprocessor.ProcessTweet(this, progress);
            ManyLens.Preprocessing.TweetsVectorizer.VectorizeEachTweet(this, progress);

        }

        public void PreproccessingParallel(IProgress<double> progress)
        {
            
            ManyLens.Preprocessing.TweetsPreprocessor.ProcessTweetParallel(this, progress);
            ManyLens.Preprocessing.TweetsVectorizer.VectorizeEachTweet(this, progress);
        }


    }
}
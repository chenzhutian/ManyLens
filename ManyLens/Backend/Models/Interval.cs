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
        private float[] rmMatrix;

        private bool isPackage = false;
        private bool hasVectorized = false;
        private bool hasPreprocessed = false;
        private double entropy = -1;
        private double conditionalEntropy = -1;
        private int termsCount = 0;

        private Term[] oldTerm;
        private Interval package;
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
        public float[] RMMatrix
        {
            get
            {
                return this.rmMatrix;
            }
            set
            {
                this.rmMatrix = value;
            }
        }
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
        public bool HasPreprocessed
        {
            get
            {
                return this.hasPreprocessed;
            }
            set
            {
                if (value == true)
                    this.hasPreprocessed = value;
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
        public double Entropy
        {
            get
            {
                if (!this.HasVectorized)
                    return -1;
                if (this.entropy == -1)
                {
                    double sum = 0;
                    double entropy = 0;
                    List<int> values = this.Vocabulary.FrequenceOfWords.Values.ToList();
                    for (int i = 0, len = values.Count; i < len; ++i)
                    {
                        sum += values[i];
                    }
                    for (int i = 0, len = values.Count; i < len; ++i)
                    {
                        double pi = (double)values[i] / sum;
                        entropy += pi * Math.Log(pi);
                    }
                    this.entropy = -entropy;
                }
                return this.entropy;
            }
        }
        public double ConditionalEntropy
        {
            get
            {
                if (!this.HasVectorized)
                    return -1;
                if (this.conditionalEntropy == -1)
                {

                }
                return this.conditionalEntropy;
            }
        }
        #endregion

        public Interval(List<Tweet> tweets, int termsCount)
            : base()
        {
            this.Tweets = tweets;
            this.termsCount = termsCount;
            this.isPackage = true;
        }

        public Interval(DateTime beginDate, Term term, Term[] oldTerm)
            : base()
        {
            this.id = beginDate.ToString("yyyyMMddHHmmss");
            this.BeginDate = beginDate;
            this.Tweets.AddRange(term.Tweets);
            this.oldTerm = oldTerm;
        }

        public void AddTerm(Term term)
        {
            this.termsCount++;
            this.Tweets.AddRange(term.Tweets);
        }

        public float[] GetTFIDFVector(int num = 0)
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

                        int id = this.GetIDofWord(key);
                        double idf = Math.Log(D / ((double)this.GetDFofWord(key) + 1.0));
                        vector[id] = (float)(value * idf);
                        sum += vector[id] * vector[id];
                    }
                    sum = Math.Sqrt(sum);
                    for (int j = keys.Count - 1; j >= 0; --j)
                    {
                        string key = keys[j];
                        int id = this.GetIDofWord(key);
                        vector[id] = (float)(vector[id] / sum);
                    }
                    this.tfidfVectors.Add(vector);
                }
            }
            int dimension = this.Dimension;
            if (num == 0)
                num = this.SparseVector.Count;
            float[] tfidfVector = new float[dimension * num];
            for (int i = 0; i < num; ++i)
            {
                for (int j = 0; j < dimension; ++j)
                {
                    tfidfVector[j + i * dimension] = this.tfidfVectors[i][j];
                }
            }
            return tfidfVector;
        }

        public void SetEndDate(DateTime endDate)
        {
            this.endDate = endDate;
        }

        public void Preproccessing()
        {
            List<Tweet> tweets = new List<Tweet>();
            int begin = this.oldTerm.Length - this.TermsCount;
            begin = begin > 0 ? begin : 0;
            int end = this.oldTerm.Length;
            for (int i = begin; i < end; ++i)
            {
                tweets.AddRange(oldTerm[i].Tweets);
            }
            this.package = new Interval(tweets, this.TermsCount);
            IProgress<double> progress = new Progress<double>();
            ManyLens.Preprocessing.TweetsPreprocessor.ProcessTweet(this.package, progress);
            ManyLens.Preprocessing.TweetsVectorizer.VectorizeEachTweet(this.package, progress);

        }
    }
}
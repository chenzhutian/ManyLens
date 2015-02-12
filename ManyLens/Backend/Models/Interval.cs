using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Interval : DerivedTweetSet
    {
        private string id;
        private DateTime beginDate;
        private DateTime endDate;
        private float[] rmMatrix;

        private bool hasVectorized = false;
        private bool hasPreprocessed = false;

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
            set
            {
                this.endDate = value;
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

        #endregion

        public Interval(DateTime beginDate, Term term)
            :base()
        {
            this.id = beginDate.ToString("yyyyMMddHHmmss");
            this.BeginDate = beginDate;
            this.Tweets.AddRange(term.Tweets);
        }

        public void AddTerm(Term term)
        {

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

    }
}
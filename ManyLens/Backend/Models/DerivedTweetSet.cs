using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Diagnostics;

namespace ManyLens.Models
{
    public abstract class DerivedTweetSet : TweetSet
    {
        private List<Dictionary<string, int>> sparseVector = null;
        private Vocabulary vocabulary = null;
        protected List<float[]> tfidfVectors = null;

        #region Getter&Setter
        public List<Dictionary<string, int>> SparseVector
        {
            get
            {
                return this.sparseVector;
            }
            set
            {
                this.sparseVector = value;
            }
        }
        public Vocabulary Vocabulary
        {
            get
            {
                return this.vocabulary;
            }
            set
            {
                this.vocabulary = value;
            }
        }
        public int Dimension
        {
            get
            {
                return this.Vocabulary.Dimension;
            }
        }

        public List<float[]> TFIDFVectors
        {
            get
            {
                if (this.tfidfVectors == null)
                {
                    this.tfidfVectors = new List<float[]>();

                    int vectorCount = this.sparseVector.Count;
                    if (vectorCount != this.TweetsCount)
                        throw new Exception("the count of vector and tweets is different！");

                    double D = vectorCount;
                    for (int i = 0; i < vectorCount; ++i)
                    {
                        float[] vector = new float[this.Dimension];
                        double sum = 0.0;
                        List<string> keys = this.sparseVector[i].Keys.ToList();
                        for (int j = keys.Count - 1; j >= 0; --j)
                        {
                            string key = keys[j];
                            double value = (double)this.sparseVector[i][key];
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
            set
            {
                this.tfidfVectors = value;
            }
        }

        #endregion

        protected DerivedTweetSet()
            :base()
        { 
        
        }

        public int GetIDofWord(string word)
        {
            if (this.Vocabulary == null)
                return -1;
            return this.Vocabulary.GetIDofWord(word);
        }

        protected int GetDFofWord(string word)
        {
            if (this.Vocabulary == null)
                return -1;
            return this.Vocabulary.GetDFofWord(word);
        }

        public string GetTweetDerivedContentAt(int index)
        {
            return this.Tweets[index].DerivedContent;
        }

        public float[] GetTFIDFVector(int num = 0)
        {
            if (this.tfidfVectors == null)
            {
                this.tfidfVectors = new List<float[]>();
                int vectorCount = this.sparseVector.Count;
                if (vectorCount != this.TweetsCount)
                    throw new Exception("the count of vector and tweets is different！");

                double D = vectorCount;
                for (int i = 0; i < vectorCount; ++i)
                {
                    float[] vector = new float[this.vocabulary.Dimension];
                    double sum = 0.0;
                    List<string> keys = this.sparseVector[i].Keys.ToList();
                    for (int j = keys.Count - 1; j >= 0; --j)
                    {
                        string key = keys[j];
                        double value = (double)this.sparseVector[i][key];
                        int id = this.vocabulary.IdOfWords[key];
                        double idf = Math.Log(D / ((double)this.vocabulary.DfOfWords[key] + 1.0));
                        vector[id] = (float)(value * idf);
                        sum += vector[id] * vector[id];
                    }
                    sum = Math.Sqrt(sum);
                    for (int j = keys.Count - 1; j >= 0; --j)
                    {
                        string key = keys[j];
                        int id = this.vocabulary.IdOfWords[key];
                        vector[id] = (float)(vector[id] / sum);
                    }
                    this.tfidfVectors.Add(vector);
                }
            }
            int dimension = this.Dimension;
            if (num == 0)
                num = this.sparseVector.Count;
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

        public async Task<float[]> GetTFIDFVectorAsync(IProgress<double> progress, int num = 0)
        {
            int percent = 0;
            return await Task.Run<float[]>(() =>
            {
                if (this.tfidfVectors == null)
                {
                    this.tfidfVectors = new List<float[]>();
                    int vectorCount = this.sparseVector.Count;
                    double D = this.sparseVector.Count;
                    for (int i = 0; i < vectorCount; ++i)
                    {
                        float[] vector = new float[this.vocabulary.Dimension];
                        double sum = 0.0;
                        List<string> keys = this.sparseVector[i].Keys.ToList();
                        for (int j = keys.Count - 1; j >= 0; --j)
                        {
                            string key = keys[j];
                            double value = (double)this.sparseVector[i][key];
                            int id = this.vocabulary.IdOfWords[key];
                            double idf = Math.Log(D / ((double)this.vocabulary.DfOfWords[key] + 1.0));
                            vector[id] = (float)(value * idf);
                            sum += vector[id] * vector[id];
                        }
                        sum = Math.Sqrt(sum);
                        for (int j = keys.Count - 1; j >= 0; --j)
                        {
                            string key = keys[j];
                            int id = this.vocabulary.IdOfWords[key];
                            vector[id] = (float)(vector[id] / sum);
                        }
                        this.tfidfVectors.Add(vector);

                        if ((double)i / vectorCount > (double)percent / 50.0)
                        {
                            progress.Report((double)percent / 100.0);
                            ++percent;
                        }
                    }
                }
                int dimension = this.vocabulary.Dimension;
                if (num == 0)
                    num = this.sparseVector.Count;
                float[] tfidfVector = new float[dimension * num];
                for (int i = 0; i < num; ++i)
                {
                    for (int j = 0; j < dimension; ++j)
                    {
                        tfidfVector[j + i * dimension] = this.tfidfVectors[i][j];
                    }

                    if ((double)i / num > (double)percent / 100.0)
                    {
                        progress.Report((double)percent / 100.0);
                        ++percent;
                    }
                }
                return tfidfVector;
            });
        }
    }
}
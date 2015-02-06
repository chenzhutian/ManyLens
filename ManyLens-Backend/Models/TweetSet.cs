using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Diagnostics;

namespace ManyLens.Models
{
    public abstract class  TweetSet
    {
        private string id = null;

        private List<Tweet> tweets = null;
        private List<string> tweetIDs = null;
        private List<string> tweetContents = null;

        private List<Dictionary<string, int>> sparseVector = null;
        private Vocabulary vocabulary = null;
        protected List<float[]> tfidfVectors = null;

        private bool hasVectorized = false;
        private bool hasPreprocessed = false;

        #region Getter & Setter
        public string ID
        {
            get
            {
                return this.id;
            }
            private set
            {
                    this.id = value;
            }
        }
        public virtual List<Tweet> Tweets
        {
            get
            {
                return this.tweets;
            }
            protected set
            {
                this.tweets = value;
            }
        }
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
        public int TweetsCount
        {
            get
            {
                return this.tweets.Count;
            }
            private set { }
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
        public List<string> TweetIDs
        {
            get
            {
                return this.tweetIDs;
            }
            private set
            {
                this.tweetIDs = value;
            }
        }
        public List<string> TweetContents
        {
            get
            {
                return this.tweetContents;
            }
            private set
            {
                this.tweetContents = value;
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
                    double D = this.sparseVector.Count;
                    for (int i = 0; i < vectorCount; ++i)
                    {
                        float[] vector = new float[this.Vocabulary.Dimension];
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
        public bool HasVectorized
        {
            get
            {
                return this.hasVectorized;
            }
            set
            {
                if(value == true)
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
        #endregion

        public TweetSet()
        {
            this.Tweets = new List<Tweet>();
            this.TweetIDs = new List<string>();
            this.TweetContents = new List<string>();
        }

        protected void SetDateTimeToID(DateTime date)
        {
            this.ID = date.ToString("yyyyMMddHHmmss");
            //Debug.WriteLine(this.ID);
        }
        protected void AddTweet(string id, string content, string postDate)
        {
            this.TweetIDs.Add(id);
            this.TweetContents.Add(content);
            this.Tweets.Add(new Tweet(id, content, postDate));
        }

        protected void AddTweet(string id, string content, DateTime postDate)
        {
            this.TweetIDs.Add(id);
            this.TweetContents.Add(content);
            this.Tweets.Add(new Tweet(id, content, postDate));
        }

        protected void AddTweet(Tweet tweet)
        {
            this.TweetIDs.Add(tweet.TweetID);
            this.TweetContents.Add(tweet.OriginalContent.Replace("\"", "\\\""));
            this.Tweets.Add(tweet);
        }


        public void AddTweets(TweetSet tweetSet)
        {
            this.TweetContents.AddRange(tweetSet.TweetContents);
            this.TweetIDs.AddRange(tweetSet.TweetIDs);
            this.Tweets.AddRange(tweetSet.Tweets);
        }

        public void AddTweets(List<Tweet> tweets)
        {
            for (int i = tweets.Count - 1; i >= 0; --i)
            {
                this.TweetIDs.Add(tweets[i].TweetID);
                this.TweetContents.Add(tweets[i].OriginalContent);
            }
            this.Tweets.AddRange(tweets);
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

        public virtual Tweet RemoveTweetAt(int index)
        {
            if (index < 0 || (index - 1) > this.TweetsCount)
                return null;
            Tweet t = this.Tweets[index];
            this.Tweets.RemoveAt(index);
            this.TweetIDs.RemoveAt(index);
            this.TweetContents.RemoveAt(index);

            return t;
        }

        public string GetTweetContentAt(int index)
        {
            if (index < 0 || (index - 1) > this.TweetsCount)
                return null;

            return this.TweetContents[index];
        }

        public string GetTweetIDAt(int index) 
        {
            return this.TweetIDs[index];
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
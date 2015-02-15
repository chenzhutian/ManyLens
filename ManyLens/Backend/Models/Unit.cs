using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{

    public class Unit : DerivedTweetSet
    {
        private Dictionary<string,int> wordLabels = null;

        private float[] unitSumVector = null; //store as accumulate value
        private int x;
        private int y;
        private int unitID;

        private Interval interval;

        #region Getter & Setter
        public float[] UnitVector
        {
            get
            { 
                float[] averageVector = new float[this.unitSumVector.Length];
                for (int i = this.unitSumVector.Length - 1; i >= 0; --i)
                {
                    averageVector[i] = this.unitSumVector[i] / (float)this.TweetsCount;
                }
                return averageVector;
            }
        }
        public int X
        {
            get
            {
                return this.x;
            }
            set
            {
                this.x = value;
            }
        }
        public int Y
        {
            get
            {
                return this.y;
            }
            set
            {
                this.y = value;
            }
        }
        public int UnitID
        {
            get
            {
                return this.unitID;
            }
            set
            {
                this.unitID = value;
            }
        }
        public List<float[]> TFIDFVectors
        {
            get
            {
                return this.tfidfVectors;
            }
            set
            {
                this.tfidfVectors = value;
            }
        }
        public List<KeyValuePair<string,int>> WordLabels
        {
            get
            {
                return wordLabels.ToList();
            }
        }
        public List<KeyValuePair<int, int>> TweetLengthDistribute
        {
            get
            { 
                Dictionary<int,int> lenDistribute = new Dictionary<int,int>();
                int len = this.TweetsCount;
                for(int i = 0; i < len; ++i)
                {
                    int index = this.Tweets[i].Length;
                    if(lenDistribute.ContainsKey(index))
                        lenDistribute[index]++;
                    else
                    {
                        lenDistribute.Add(index,1);
                    }
                }
               return lenDistribute.ToList();
            }
        }
        public List<KeyValuePair<string, int>> HashTagDistribute
        {
            get
            {
                Dictionary<string, int> hashtagDistribute = new Dictionary<string, int>();
                int len = this.TweetsCount;
                for (int i = 0; i < len; ++i)
                {
                    List<string> hts = this.Tweets[i].HashTag;
                    foreach(string ht in hts)
                    {
                        if (hashtagDistribute.ContainsKey(ht))
                            hashtagDistribute[ht]++;
                        else
                        {
                            hashtagDistribute.Add(ht, 1);
                        }
                    }
                }
                return hashtagDistribute.ToList();
            }
        }

        #endregion  

        public Unit(Unit unit)
            :base()
        {
            this.wordLabels = new Dictionary<string, int>();
            this.tfidfVectors = new List<float[]>();
            this.interval = unit.interval;
            this.Vocabulary = unit.Vocabulary;

            this.Tweets.AddRange(unit.Tweets);
            this.SparseVector.AddRange(unit.SparseVector);
            this.TFIDFVectors.AddRange(unit.TFIDFVectors);
            this.unitSumVector = unit.UnitVector;
        }

        public Unit(int x, int y, int id,Interval interval)
            :base()
        {
            this.wordLabels = new Dictionary<string, int>();
            this.tfidfVectors = new List<float[]>();

            this.X = x;
            this.Y = y;
            this.UnitID = id;

            this.interval = interval;
            this.Vocabulary = interval.Vocabulary;

        }


        public void AddTweet(Tweet tweet) 
        {
            base.AddTweet(tweet);
            int index = this.interval.Tweets.IndexOf(tweet);

            this.SparseVector.Add(interval.SparseVector[index]);
            float[] tfv = interval.TFIDFVectors[index];
            this.tfidfVectors.Add(tfv);
            if (this.unitSumVector == null)
            {
                this.unitSumVector =tfv;
            }
            else
            {
                for (int i = tfv.Length - 1; i >= 0; --i)
                {
                    this.unitSumVector[i] += tfv[i];
                }
            }

            string[] words = tweet.DerivedContent.Split(' ');
            for (int i = 0; i < words.Length; ++i)
            {
                if (words[i] == "")
                    continue;
                if (wordLabels.ContainsKey(words[i]))
                    wordLabels[words[i]]++;
                else
                    wordLabels.Add(words[i], 1);
            }

        }

        public Tweet RemoveTweet(Tweet tweet)
        {
            int index = this.Tweets.IndexOf(tweet);
            for (int i = this.unitSumVector.Length - 1; i >= 0; --i)
            {
                this.unitSumVector[i] -= this.tfidfVectors[index][i];
            }
            this.tfidfVectors.RemoveAt(index);
            Tweet t = base.RemoveTweetAt(index);
            return t;
        }
    }
}
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

        public List<Dictionary<string,Object>> WordLabels
        {
            get
            {
                List<Dictionary<string, Object>> tList = new List<Dictionary<string, Object>>();
                foreach (KeyValuePair<string, int> item in this.wordLabels)
                {
                    Dictionary<string, Object> tDictionary = new Dictionary<string, Object>();
                    tDictionary.Add("text", item.Key);
                    tDictionary.Add("value", item.Value);
                    tList.Add(tDictionary);
                }
                return tList;
            }
        }
        public List<KeyValuePair<int, int>> TweetLengthDistribute
        {
            get
            { 
                Dictionary<int,int> lensDistribute = new Dictionary<int,int>();
                int len = this.Tweets.Count;
                for(int i = 0; i < len; ++i)
                {
                    int index = this.Tweets[i].Length;
                    if(lensDistribute.ContainsKey(index))
                        lensDistribute[index]++;
                    else
                    {
                        lensDistribute.Add(index,1);
                    }
                }
               return lensDistribute.ToList();
            }
        }

        #endregion  

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

        public void AddTweet(int index) 
        {
            base.AddTweet(interval.Tweets[index]);

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
        }

        public void AddTweet(Tweet tweet,float[] tfidfVector)
        {
            base.AddTweet(tweet);
            this.tfidfVectors.Add(tfidfVector);
            if (this.unitSumVector == null)
            {
                this.unitSumVector = tfidfVector;
            }
            else
            {
                for (int i = tfidfVector.Length - 1; i >= 0; --i)
                {
                    this.unitSumVector[i] += tfidfVector[i];
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
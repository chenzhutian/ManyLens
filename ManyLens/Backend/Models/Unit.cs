﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Unit : TweetSet
    {
        private Dictionary<string,int> wordLabels = null;


        private float[] unitSumVector = null; //store as accumulate value
        private int x;
        private int y;
        private int unitID;

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
        public DateTime? VismapID { get; private set; }
        public virtual VisMap Vismap { get; private set; }
        #endregion  

        private Unit() { }
        public Unit(int x, int y, int id)
        {
            this.X = x;
            this.Y = y;
            this.UnitID = id;
            this.wordLabels = new Dictionary<string, int>();
            this.tfidfVectors = new List<float[]>();
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
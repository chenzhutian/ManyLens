using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ManyLens.Models
{
    public class Interval : TweetSet
    {
        
        private DateTime beginDate;
        private DateTime endDate;
        private float[] rmMatrix;

        #region Getter & Setter
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
        #endregion

        private Interval(){ }

        public Interval(DateTime beginDate,List<Tweet> tweets)
        {
            this.SetDateTimeToID(beginDate);
            this.BeginDate = beginDate;
            this.Tweets = new List<Tweet>();
            for (int i = tweets.Count - 1; i >= 0; --i)
            {
                this.TweetIDs.Add(tweets[i].TweetID);
                this.TweetContents.Add(tweets[i].OriginalContent);
            }
            this.Tweets.AddRange(tweets);
        }

        public Interval(DateTime beginData, TweetSet tweetSet)
        {
            this.SetDateTimeToID(beginDate);
            this.BeginDate = beginData;
            this.Tweets = new List<Tweet>();
            this.TweetContents.AddRange(tweetSet.TweetContents);
            this.TweetIDs.AddRange(tweetSet.TweetIDs);
            this.Tweets.AddRange(tweetSet.Tweets);
        }

        public float[] GetTFIDFVectorAt(int index)
        {
            return this.TFIDFVectors[index];
        }

    }
}